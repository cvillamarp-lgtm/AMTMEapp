'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicEnv } from '@/lib/supabase/env';

let browserClient: SupabaseClient<Database> | null = null;
let isInitialized = false;

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (isInitialized) {
    return browserClient;
  }

  const env = getSupabasePublicEnv();

  if (!env) {
    browserClient = null;
    isInitialized = true;
    return browserClient;
  }

  browserClient = createClient<Database>(env.url, env.anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  isInitialized = true;

  return browserClient;
}
