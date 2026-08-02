import { z } from 'zod';

const portSchema = z.coerce.number().int().min(1).max(65535);

export const environmentSchema = z.object({
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
