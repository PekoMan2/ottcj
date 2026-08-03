import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LiveAlertCryptoService } from './live-alert-crypto.service';
import { LiveAlertRateLimitService } from './live-alert-rate-limit.service';

describe('LiveAlertRateLimitService', () => {
  it('rejects attempts above the configured per-IP window', () => {
    const crypto = {
      fingerprint: jest.fn(
        (_channel: string, value: string) => `hash:${value}`,
      ),
    };
    const service = new LiveAlertRateLimitService(
      new ConfigService({ LIVE_ALERT_RATE_LIMIT_MAX: 2 }),
      crypto as unknown as LiveAlertCryptoService,
    );

    service.assertAllowed('203.0.113.20');
    service.assertAllowed('203.0.113.20');
    expect(() => service.assertAllowed('203.0.113.20')).toThrow(HttpException);
    expect(() => service.assertAllowed('203.0.113.21')).not.toThrow();
    expect(crypto.fingerprint).toHaveBeenCalledWith('rate', '203.0.113.20');
  });
});
