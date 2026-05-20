'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicEnv } from '@/lib/supabase/env';

let browserClient: SupabaseClient<Database> | null = null;
let isInitialized = false;
const generateUniqueTestStorageKey = () =>
  `amtme-studio-os-browser-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

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
      ...(process.env.NODE_ENV === 'test' ? { storageKey: generateUniqueTestStorageKey() } : {}),
    },
  });

  isInitialized = true;

  return browserClient;
}
