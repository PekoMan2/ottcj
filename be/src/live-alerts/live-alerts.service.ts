import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, MoreThan, Repository } from 'typeorm';
import type { CreateLiveAlertSubscriptionDto } from './live-alert.dto';
import { LiveAlertCryptoService } from './live-alert-crypto.service';
import { LiveAlertRateLimitService } from './live-alert-rate-limit.service';
import {
  LiveAlertSubscriptionEntity,
  type LiveAlertChannel,
  type LiveAlertStatus,
} from './live-alert-subscription.entity';

interface ChannelConfiguration {
  available: boolean;
  capacity: number;
  remaining: number;
}

export interface PublicLiveAlertConfiguration {
  channels: {
    email: ChannelConfiguration;
    sms: ChannelConfiguration;
  };
  consentVersion: string | null;
  enabled: boolean;
}

interface NormalizedContact {
  channel: LiveAlertChannel;
  value: string;
}

const activeStatuses: LiveAlertStatus[] = ['pending', 'synced'];
const subscriptionLockId = 6_084_202_613;

function normalizeEmail(value: string): string {
  return value.trim().toLocaleLowerCase('en-US');
}

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/gu, '');
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

@Injectable()
export class LiveAlertsService {
  constructor(
    @InjectRepository(LiveAlertSubscriptionEntity)
    private readonly repository: Repository<LiveAlertSubscriptionEntity>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    private readonly crypto: LiveAlertCryptoService,
    private readonly rateLimit: LiveAlertRateLimitService,
  ) {}

  async getPublicConfiguration(): Promise<PublicLiveAlertConfiguration> {
    if (!this.isEnabled()) return this.disabledConfiguration();

    const [emailCount, smsCount] = await Promise.all([
      this.countActive(this.repository, 'email'),
      this.countActive(this.repository, 'sms'),
    ]);

    return {
      consentVersion: this.config.getOrThrow<string>(
        'LIVE_ALERT_CONSENT_VERSION',
      ),
      enabled: true,
      channels: {
        email: this.channelConfiguration('email', emailCount),
        sms: this.channelConfiguration('sms', smsCount),
      },
    };
  }

  async subscribe(
    dto: CreateLiveAlertSubscriptionDto,
    ipAddress: string,
  ): Promise<void> {
    this.assertEnabled();
    this.rateLimit.assertAllowed(ipAddress);
    const contacts = this.normalizeContacts(dto);

    await this.dataSource.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock($1)', [
        subscriptionLockId,
      ]);
      const repository = manager.getRepository(LiveAlertSubscriptionEntity);
      const now = new Date();
      const retentionDays = this.config.getOrThrow<number>(
        'LIVE_ALERT_RETENTION_DAYS',
      );
      const expiresAt = new Date(
        now.getTime() + retentionDays * 24 * 60 * 60 * 1000,
      );
      const consentVersion = this.config.getOrThrow<string>(
        'LIVE_ALERT_CONSENT_VERSION',
      );

      for (const contact of contacts) {
        const fingerprint = this.crypto.fingerprint(
          contact.channel,
          contact.value,
        );
        const existing = await repository.findOneBy({
          contactFingerprint: fingerprint,
        });

        if (
          existing &&
          existing.expiresAt > now &&
          existing.status !== 'rejected'
        ) {
          continue;
        }

        const activeCount = await this.countActive(repository, contact.channel);
        const capacity = this.capacity(contact.channel);
        if (activeCount >= capacity) {
          throw new ConflictException(
            `${contact.channel} live alert capacity is full`,
          );
        }

        const entity = repository.create({
          ...(existing ?? {}),
          channel: contact.channel,
          consentVersion,
          contactEncrypted: this.crypto.encrypt(contact.value),
          contactFingerprint: fingerprint,
          expiresAt,
          firstNameEncrypted: this.crypto.encrypt(dto.firstName),
          lastNameEncrypted: this.crypto.encrypt(dto.lastName),
          status: 'pending',
        });
        await repository.save(entity);
      }
    });
  }

  async exportCsv(status: LiveAlertStatus = 'pending'): Promise<string> {
    this.assertEnabled();
    const rows = await this.repository.find({
      order: { createdAt: 'ASC' },
      where: {
        expiresAt: MoreThan(new Date()),
        status,
      },
    });
    const header = [
      'id',
      'channel',
      'contact',
      'firstName',
      'lastName',
      'consentVersion',
      'status',
      'createdAt',
      'expiresAt',
    ];
    const records = rows.map((row) =>
      [
        row.id,
        row.channel,
        this.crypto.decrypt(row.contactEncrypted),
        this.crypto.decrypt(row.firstNameEncrypted),
        this.crypto.decrypt(row.lastNameEncrypted),
        row.consentVersion,
        row.status,
        row.createdAt.toISOString(),
        row.expiresAt.toISOString(),
      ]
        .map(csvCell)
        .join(','),
    );

    return [header.map(csvCell).join(','), ...records].join('\n');
  }

  async updateStatus(id: string, status: LiveAlertStatus): Promise<void> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity)
      throw new NotFoundException('Live alert subscription not found');
    entity.status = status;
    await this.repository.save(entity);
  }

  async purgeExpired(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at <= :now', { now: new Date() })
      .execute();
    return result.affected ?? 0;
  }

  private normalizeContacts(
    dto: CreateLiveAlertSubscriptionDto,
  ): NormalizedContact[] {
    const contacts: NormalizedContact[] = [];
    if (dto.email) {
      contacts.push({ channel: 'email', value: normalizeEmail(dto.email) });
    }
    if (dto.phone) {
      contacts.push({ channel: 'sms', value: normalizePhone(dto.phone) });
    }
    if (contacts.length === 0) {
      throw new BadRequestException('At least one contact channel is required');
    }
    for (const contact of contacts) {
      if (this.capacity(contact.channel) === 0) {
        throw new ConflictException(
          `${contact.channel} live alerts are unavailable`,
        );
      }
    }
    return contacts;
  }

  private async countActive(
    repository: Repository<LiveAlertSubscriptionEntity>,
    channel: LiveAlertChannel,
  ): Promise<number> {
    return repository.count({
      where: {
        channel,
        expiresAt: MoreThan(new Date()),
        status: In(activeStatuses),
      },
    });
  }

  private channelConfiguration(
    channel: LiveAlertChannel,
    activeCount: number,
  ): ChannelConfiguration {
    const capacity = this.capacity(channel);
    const remaining = Math.max(capacity - activeCount, 0);
    return {
      available: capacity > 0 && remaining > 0,
      capacity,
      remaining,
    };
  }

  private disabledConfiguration(): PublicLiveAlertConfiguration {
    return {
      consentVersion: null,
      enabled: false,
      channels: {
        email: { available: false, capacity: 0, remaining: 0 },
        sms: { available: false, capacity: 0, remaining: 0 },
      },
    };
  }

  private capacity(channel: LiveAlertChannel): number {
    return (
      this.config.get<number>(
        channel === 'email'
          ? 'LIVE_ALERT_EMAIL_CAPACITY'
          : 'LIVE_ALERT_SMS_CAPACITY',
      ) ?? 0
    );
  }

  private isEnabled(): boolean {
    return this.config.get<boolean>('LIVE_ALERTS_ENABLED') ?? false;
  }

  private assertEnabled(): void {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Live alerts are not available');
    }
  }
}
