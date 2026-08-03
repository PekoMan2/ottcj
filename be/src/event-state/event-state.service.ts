import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventStateEntity } from './event-state.entity';
import type { PublicEventState } from './event-state.types';
import { calculateEventMultiplier } from './event-state.types';
import type { UpdateEventStateDto } from './update-event-state.dto';

const eventStateId = 1;

function validateGarminLiveTrackUrl(value: string): string {
  try {
    const url = new URL(value);
    const isGarminHost =
      url.hostname === 'garmin.com' || url.hostname.endsWith('.garmin.com');

    if (
      url.protocol !== 'https:' ||
      url.username !== '' ||
      url.password !== '' ||
      !isGarminHost
    ) {
      throw new Error('unsupported LiveTrack URL');
    }

    return url.toString();
  } catch {
    throw new BadRequestException('liveTrackUrl must be a secure Garmin URL');
  }
}

@Injectable()
export class EventStateService {
  constructor(
    @InjectRepository(EventStateEntity)
    private readonly repository: Repository<EventStateEntity>,
    private readonly config: ConfigService,
  ) {}

  async getPublicState(): Promise<PublicEventState> {
    const entity = await this.repository.findOneBy({ id: eventStateId });
    return this.toPublicState(entity ?? this.createDefaultState());
  }

  async update(dto: UpdateEventStateDto): Promise<PublicEventState> {
    const existing =
      (await this.repository.findOneBy({ id: eventStateId })) ??
      this.createDefaultState();
    const entity = this.repository.create({
      ...existing,
      eventStartAt: dto.eventStartAt
        ? new Date(dto.eventStartAt)
        : existing.eventStartAt,
      phase: dto.phase,
    });

    if (dto.phase === 'pre') {
      this.clearLiveAndResult(entity);
    } else if (dto.phase === 'live') {
      entity.liveTrackUrl = dto.liveTrackUrl
        ? validateGarminLiveTrackUrl(dto.liveTrackUrl)
        : null;
      this.clearResult(entity);
    } else {
      entity.liveTrackUrl = null;
      entity.resultStatus = dto.resultStatus ?? existing.resultStatus;

      if (entity.resultStatus === null) {
        throw new BadRequestException('post phase requires resultStatus');
      }

      entity.elapsedSeconds =
        entity.resultStatus === 'dnf'
          ? null
          : (dto.elapsedSeconds ?? existing.elapsedSeconds);

      if (
        entity.resultStatus === 'finished' &&
        entity.elapsedSeconds === null
      ) {
        throw new BadRequestException(
          'finished result requires elapsedSeconds',
        );
      }

      entity.finalDonationTotalCents =
        dto.finalDonationTotalEur === null
          ? null
          : dto.finalDonationTotalEur === undefined
            ? existing.finalDonationTotalCents
            : Math.round(dto.finalDonationTotalEur * 100);
      entity.resultCopy =
        dto.resultCopy === undefined ? existing.resultCopy : dto.resultCopy;
    }

    const saved = await this.repository.save(entity);
    return this.toPublicState(saved);
  }

  private createDefaultState(): EventStateEntity {
    return this.repository.create({
      elapsedSeconds: null,
      eventStartAt: new Date(this.config.getOrThrow<string>('EVENT_START_AT')),
      finalDonationTotalCents: null,
      id: eventStateId,
      liveTrackUrl: null,
      phase: 'pre',
      resultCopy: null,
      resultStatus: null,
      updatedAt: new Date(0),
    });
  }

  private clearLiveAndResult(entity: EventStateEntity): void {
    entity.liveTrackUrl = null;
    this.clearResult(entity);
  }

  private clearResult(entity: EventStateEntity): void {
    entity.resultStatus = null;
    entity.elapsedSeconds = null;
    entity.finalDonationTotalCents = null;
    entity.resultCopy = null;
  }

  private toPublicState(entity: EventStateEntity): PublicEventState {
    const result =
      entity.phase === 'post' && entity.resultStatus
        ? {
            elapsedSeconds: entity.elapsedSeconds,
            finalDonationTotalEur:
              entity.finalDonationTotalCents === null
                ? null
                : entity.finalDonationTotalCents / 100,
            multiplier: calculateEventMultiplier(
              entity.resultStatus,
              entity.elapsedSeconds,
            ),
            resultCopy: entity.resultCopy,
            status: entity.resultStatus,
          }
        : null;

    return {
      eventStartAt: entity.eventStartAt.toISOString(),
      liveTrackUrl: entity.phase === 'live' ? entity.liveTrackUrl : null,
      phase: entity.phase,
      result,
      updatedAt:
        entity.updatedAt.getTime() === 0
          ? null
          : entity.updatedAt.toISOString(),
    };
  }
}
