'use client';

import { createBrowserClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicEnv } from '@/lib/supabase/env';

type BrowserAuthClient = ReturnType<typeof createBrowserClient<Database>>;

let browserAuthClient: BrowserAuthClient | null | undefined;

export function getSupabaseAuthBrowserClient(): BrowserAuthClient | null {
  if (browserAuthClient !== undefined) {
    return browserAuthClient;
  }

  const env = getSupabasePublicEnv();

  if (!env) {
    browserAuthClient = null;
    return browserAuthClient;
  }

  browserAuthClient = createBrowserClient<Database>(env.url, env.anonKey, {
    cookieOptions: {
      sameSite: 'lax',
      secure: false,
    } as CookieOptions,
  });

  return browserAuthClient;
}