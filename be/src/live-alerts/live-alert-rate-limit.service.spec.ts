import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LiveAlertCryptoService } from './live-alert-crypto.service';
import { LiveAlertRateLimitService } from './live-alert-rate-limit.service';

function createService(maximum: number) {
  const crypto = {
    fingerprint: jest.fn((_channel: string, value: string) => `hash:${value}`),
  };
  const service = new LiveAlertRateLimitService(
    new ConfigService({ LIVE_ALERT_RATE_LIMIT_MAX: maximum }),
    crypto as unknown as LiveAlertCryptoService,
  );
  return { crypto, service };
}

describe('LiveAlertRateLimitService', () => {
  it('rejects attempts above the configured per-IP window', () => {
    const { crypto, service } = createService(2);

    service.assertAllowed('203.0.113.20');
    service.assertAllowed('203.0.113.20');
    expect(() => service.assertAllowed('203.0.113.20')).toThrow(HttpException);
    expect(() => service.assertAllowed('203.0.113.21')).not.toThrow();
    expect(crypto.fingerprint).toHaveBeenCalledWith('rate', '203.0.113.20');
  });

  it('limits IPv6 clients per /64 prefix', () => {
    const { crypto, service } = createService(2);

    service.assertAllowed('2001:db8:0:1::1');
    service.assertAllowed('2001:db8:0:1:0:0:0:2');
    expect(() => service.assertAllowed('2001:db8:0:1:ffff::3')).toThrow(
      HttpException,
    );
    expect(() => service.assertAllowed('2001:db8:0:2::1')).not.toThrow();
    expect(crypto.fingerprint).toHaveBeenCalledWith(
      'rate',
      '2001:0db8:0000:0001',
    );
  });

  it('keeps IPv4-mapped addresses separate instead of sharing a /64', () => {
    const { service } = createService(1);

    service.assertAllowed('::ffff:203.0.113.20');
    expect(() => service.assertAllowed('::ffff:203.0.113.20')).toThrow(
      HttpException,
    );
    expect(() => service.assertAllowed('::ffff:203.0.113.21')).not.toThrow();
  });

  it('evicts the oldest entries once the tracked client cap is exceeded', () => {
    const { service } = createService(1);

    service.assertAllowed('203.0.113.20');
    expect(() => service.assertAllowed('203.0.113.20')).toThrow(HttpException);

    for (let index = 0; index < 10_000; index += 1) {
      service.assertAllowed(`client-${index}`);
    }

    expect(() => service.assertAllowed('203.0.113.20')).not.toThrow();
  });
});
