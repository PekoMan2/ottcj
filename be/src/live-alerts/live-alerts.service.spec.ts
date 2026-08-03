import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { DataSource, Repository } from 'typeorm';
import { LiveAlertCryptoService } from './live-alert-crypto.service';
import type { LiveAlertRateLimitService } from './live-alert-rate-limit.service';
import { LiveAlertSubscriptionEntity } from './live-alert-subscription.entity';
import { LiveAlertsService } from './live-alerts.service';

function createHarness(
  options: { emailCount?: number; smsCount?: number } = {},
) {
  const rows: LiveAlertSubscriptionEntity[] = [];
  const repository = {
    count: jest.fn(({ where }: { where: { channel: string } }) =>
      Promise.resolve(
        where.channel === 'email'
          ? (options.emailCount ?? 0)
          : (options.smsCount ?? 0),
      ),
    ),
    create: jest.fn((value: Partial<LiveAlertSubscriptionEntity>) =>
      Object.assign(new LiveAlertSubscriptionEntity(), value),
    ),
    find: jest.fn(() => Promise.resolve(rows)),
    findOneBy: jest.fn(
      ({ contactFingerprint }: { contactFingerprint?: string }) =>
        Promise.resolve(
          rows.find((row) => row.contactFingerprint === contactFingerprint) ??
            null,
        ),
    ),
    save: jest.fn((value: LiveAlertSubscriptionEntity) => {
      if (!value.id) value.id = `subscription-${rows.length + 1}`;
      if (!value.createdAt) value.createdAt = new Date('2026-08-04T10:00:00Z');
      value.updatedAt = new Date('2026-08-04T10:00:00Z');
      const index = rows.findIndex((row) => row.id === value.id);
      if (index === -1) rows.push(value);
      else rows[index] = value;
      return Promise.resolve(value);
    }),
    createQueryBuilder: jest.fn(),
  };
  const dataSource = {
    transaction: jest.fn((work: (manager: unknown) => Promise<void>) =>
      work({
        getRepository: () => repository,
        query: jest.fn(),
      }),
    ),
  };
  const config = new ConfigService({
    LIVE_ALERTS_ENABLED: true,
    LIVE_ALERT_CONSENT_VERSION: '2026-08-04',
    LIVE_ALERT_DATA_KEY: Buffer.alloc(32, 4).toString('base64'),
    LIVE_ALERT_EMAIL_CAPACITY: 50,
    LIVE_ALERT_SMS_CAPACITY: 5,
    LIVE_ALERT_RETENTION_DAYS: 30,
  });
  const crypto = new LiveAlertCryptoService(config);
  const rateLimit = { assertAllowed: jest.fn() };
  const service = new LiveAlertsService(
    repository as unknown as Repository<LiveAlertSubscriptionEntity>,
    dataSource as unknown as DataSource,
    config,
    crypto,
    rateLimit as unknown as LiveAlertRateLimitService,
  );
  return { crypto, rateLimit, repository, rows, service };
}

describe('LiveAlertsService', () => {
  it('normalizes, encrypts and stores each selected contact channel', async () => {
    const { crypto, rateLimit, rows, service } = createHarness();
    await service.subscribe(
      {
        consent: true,
        email: ' Runner@Example.SK ',
        phone: '+421900000000',
      },
      '203.0.113.10',
    );

    expect(rateLimit.assertAllowed).toHaveBeenCalledWith('203.0.113.10');
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.channel)).toEqual(['email', 'sms']);
    expect(crypto.decrypt(rows[0].contactEncrypted)).toBe('runner@example.sk');
    expect(crypto.decrypt(rows[1].contactEncrypted)).toBe('+421900000000');
    expect(JSON.stringify(rows)).not.toContain('Runner@Example.SK');
  });

  it('accepts a repeated active contact without storing a duplicate', async () => {
    const { rows, service } = createHarness();
    await service.subscribe(
      { consent: true, email: 'runner@example.sk' },
      '203.0.113.11',
    );
    await service.subscribe(
      { consent: true, email: 'RUNNER@example.sk' },
      '203.0.113.11',
    );
    expect(rows).toHaveLength(1);
  });

  it('refuses a channel after its verified Garmin capacity is full', async () => {
    const { service } = createHarness({ emailCount: 50 });
    await expect(
      service.subscribe(
        { consent: true, email: 'runner@example.sk' },
        '203.0.113.12',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('exports only decrypted operator data and no encryption payload', async () => {
    const { rows, service } = createHarness();
    await service.subscribe(
      { consent: true, email: 'runner@example.sk' },
      '203.0.113.13',
    );
    const encrypted = rows[0].contactEncrypted;
    const csv = await service.exportCsv();
    expect(csv).toContain('runner@example.sk');
    expect(csv).toContain('2026-08-04');
    expect(csv).not.toContain(encrypted);
  });
});
