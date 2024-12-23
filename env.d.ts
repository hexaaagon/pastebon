export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | string;

      // Options
      MAX_SIZE_LIMIT?: string;
      PASTE_ID_LENGTH?: string;
      NEXT_PUBLIC_APP_URL?: string;

      // Supabase (Vercel)
      POSTGRES_URL: string;
      POSTGRES_PRISMA_URL: string;
      SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      POSTGRES_URL_NON_POOLING: string;
      SUPABASE_JWT_SECRET: string;
      POSTGRES_USER: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DATABASE: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      POSTGRES_HOST: string;

      // Vercel
      VERCEL_ENV: string;
      VERCEL_URL: string;
    }
  }
}
