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
