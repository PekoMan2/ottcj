import { validateEnvironment } from './env.validation';

const validEnvironment = {
  NODE_ENV: 'production',
  PORT: '3000',
  DB_HOST: 'db',
  DB_PORT: '5432',
  DB_NAME: 'run_tracker',
  DB_USER: 'run_tracker',
  DB_PASSWORD: 'change-me',
  DB_SYNCHRONIZE: 'true',
  TRACKING_SECRET: 'change-me-to-a-long-random-secret',
};

describe('validateEnvironment', () => {
  it('coerces ports and the synchronize flag', () => {
    const environment = validateEnvironment(validEnvironment);

    expect(environment.PORT).toBe(3000);
    expect(environment.DB_PORT).toBe(5432);
    expect(environment.DB_SYNCHRONIZE).toBe(true);
    expect(environment.EVENT_START_AT).toBe('2026-08-13T06:00:00+02:00');
    expect(environment.LIVE_ALERTS_ENABLED).toBe(false);
  });

  it('requires privacy and capacity settings before live alerts can be enabled', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        LIVE_ALERTS_ENABLED: 'true',
      }),
    ).toThrow(/LIVE_ALERT_/);

    const environment = validateEnvironment({
      ...validEnvironment,
      LIVE_ALERTS_ENABLED: 'true',
      LIVE_ALERT_EMAIL_CAPACITY: '50',
      LIVE_ALERT_SMS_CAPACITY: '5',
      LIVE_ALERT_CONSENT_VERSION: '2026-08-04',
      LIVE_ALERT_RETENTION_DAYS: '30',
      LIVE_ALERT_DATA_KEY: Buffer.alloc(32, 7).toString('base64'),
    });

    expect(environment.LIVE_ALERTS_ENABLED).toBe(true);
    expect(environment.LIVE_ALERT_EMAIL_CAPACITY).toBe(50);
    expect(environment.LIVE_ALERT_SMS_CAPACITY).toBe(5);
  });

  it('rejects a live alert key that is not exactly 32 bytes', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        LIVE_ALERTS_ENABLED: 'true',
        LIVE_ALERT_EMAIL_CAPACITY: '1',
        LIVE_ALERT_CONSENT_VERSION: 'v1',
        LIVE_ALERT_RETENTION_DAYS: '30',
        LIVE_ALERT_DATA_KEY: Buffer.alloc(16).toString('base64'),
      }),
    ).toThrow(/LIVE_ALERT_DATA_KEY/);
  });

  it('rejects a consent version that is unsafe to compare and store', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        LIVE_ALERTS_ENABLED: 'true',
        LIVE_ALERT_EMAIL_CAPACITY: '1',
        LIVE_ALERT_CONSENT_VERSION: 'version with spaces',
        LIVE_ALERT_RETENTION_DAYS: '30',
        LIVE_ALERT_DATA_KEY: Buffer.alloc(32, 7).toString('base64'),
      }),
    ).toThrow(/LIVE_ALERT_CONSENT_VERSION/);
  });

  it('rejects invalid configuration', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        PORT: 'invalid',
      }),
    ).toThrow('Environment validation failed');
  });
});
