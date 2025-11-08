import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url('URL Supabase invalide'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Cle Supabase requise'),
  API_URL: z.string().url('URL API invalide'),
  SENTRY_DSN: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),
  PROJECT_ID: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const env = {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    MIXPANEL_TOKEN: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
    PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Variables environnement invalides:');
      error.errors.forEach((err) => {
        console.error('- ' + err.path.join('.') + ': ' + err.message);
      });
      throw new Error('Configuration environnement invalide');
    }
    throw error;
  }
}

export const env = getEnv();
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
