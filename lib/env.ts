import { z } from 'zod';

const envSchema = z.object({
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

  // API
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),

  // JWT
  JWT_SECRET: z.string().min(32),

  // API Keys
  API_KEY_HASH_SECRET: z.string().min(1),
  API_KEY_PREFIX: z.string().default('sk_'),

  // Rate Limiting
  RATE_LIMIT_AUTH_PER_MINUTE: z.coerce.number().positive().default(5),
  RATE_LIMIT_API_PER_MINUTE: z.coerce.number().positive().default(60),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // CORS
  CORS_ORIGINS: z.string().optional(),
});

// ponytail: validate on import to catch config errors at startup
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
