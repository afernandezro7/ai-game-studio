import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Server
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test', 'local']).default('development'),

  // WebSocket
  WS_CORS_ORIGIN: z.string().url().default('http://localhost:5173'),

  // Game Config
  PRODUCTION_TICK_INTERVAL_MS: z.coerce.number().default(60_000),
  MISSION_CHECK_INTERVAL_MS: z.coerce.number().default(5_000),
  BEGINNER_SHIELD_HOURS: z.coerce.number().default(72),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = validateEnv();
