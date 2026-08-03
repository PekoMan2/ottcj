import { ConfigService } from '@nestjs/config';
import { LiveAlertCryptoService } from './live-alert-crypto.service';

describe('LiveAlertCryptoService', () => {
  const service = new LiveAlertCryptoService(
    new ConfigService({
      LIVE_ALERT_DATA_KEY: Buffer.alloc(32, 9).toString('base64'),
    }),
  );

  it('encrypts contacts with randomized authenticated encryption', () => {
    const first = service.encrypt('runner@example.sk');
    const second = service.encrypt('runner@example.sk');

    expect(first).not.toBe(second);
    expect(first).not.toContain('runner@example.sk');
    expect(service.decrypt(first)).toBe('runner@example.sk');
    expect(service.decrypt(second)).toBe('runner@example.sk');
  });

  it('uses deterministic channel-separated fingerprints', () => {
    const first = service.fingerprint('email', 'runner@example.sk');
    expect(service.fingerprint('email', 'runner@example.sk')).toBe(first);
    expect(service.fingerprint('sms', 'runner@example.sk')).not.toBe(first);
    expect(first).toMatch(/^[a-f0-9]{64}$/u);
  });
});
