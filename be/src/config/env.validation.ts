import { z } from 'zod';

const portSchema = z.coerce.number().int().min(1).max(65535);
const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);
const optionalConsentVersion = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z
    .string()
    .regex(/^[A-Za-z0-9._-]{1,64}$/u)
    .optional(),
);
const optionalInteger = (minimum: number, maximum: number) =>
  z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : value),
    z.coerce.number().int().min(minimum).max(maximum).optional(),
  );
const urlWithDefault = (defaultValue: string) =>
  z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : value),
    z.url().default(defaultValue),
  );

function isBase64Key(value: string): boolean {
  try {
    const decoded = Buffer.from(value, 'base64');
    return decoded.length === 32 && decoded.toString('base64') === value;
  } catch {
    return false;
  }
}

export const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: portSchema,
    DB_HOST: z.string().min(1),
    DB_PORT: portSchema,
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_SYNCHRONIZE: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true'),
    TRACKING_SECRET: z.string().min(16),
    EVENT_START_AT: z
      .string()
      .datetime({ offset: true })
      .default('2026-08-13T06:00:00+02:00'),
    DONIO_CHALLENGE_URL: urlWithDefault(
      'https://donio.sk/zachranme-vilyho/majo-od-tatier-k-dunaju',
    ),
    DONIO_CAMPAIGN_URL: urlWithDefault('https://donio.sk/zachranme-vilyho'),
    LIVE_ALERTS_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    LIVE_ALERT_EMAIL_CAPACITY: optionalInteger(0, 50).default(0),
    LIVE_ALERT_SMS_CAPACITY: optionalInteger(0, 5).default(0),
    LIVE_ALERT_CONSENT_VERSION: optionalConsentVersion,
    LIVE_ALERT_RETENTION_DAYS: optionalInteger(1, 365),
    LIVE_ALERT_DATA_KEY: optionalString,
    LIVE_ALERT_RATE_LIMIT_MAX: optionalInteger(1, 100).default(5),
  })
  .superRefine((configuration, context) => {
    if (!configuration.LIVE_ALERTS_ENABLED) return;

    if (
      configuration.LIVE_ALERT_EMAIL_CAPACITY === 0 &&
      configuration.LIVE_ALERT_SMS_CAPACITY === 0
    ) {
      context.addIssue({
        code: 'custom',
        message: 'at least one live alert channel must have capacity',
        path: ['LIVE_ALERTS_ENABLED'],
      });
    }

    for (const key of [
      'LIVE_ALERT_CONSENT_VERSION',
      'LIVE_ALERT_RETENTION_DAYS',
      'LIVE_ALERT_DATA_KEY',
    ] as const) {
      if (configuration[key] === undefined) {
        context.addIssue({
          code: 'custom',
          message: 'is required when LIVE_ALERTS_ENABLED=true',
          path: [key],
        });
      }
    }

    if (
      configuration.LIVE_ALERT_DATA_KEY !== undefined &&
      !isBase64Key(configuration.LIVE_ALERT_DATA_KEY)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'must be a base64-encoded 32-byte key',
        path: ['LIVE_ALERT_DATA_KEY'],
      });
    }
  });

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  configuration: Record<string, unknown>,
): Environment {
  const result = environmentSchema.safeParse(configuration);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Environment validation failed: ${issues}`);
  }

  return result.data;
}
