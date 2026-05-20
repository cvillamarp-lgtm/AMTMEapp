import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabaseServerEnv } from '@/lib/supabase/env';

const generateUniqueTestStorageKey = () =>
  `amtme-studio-os-server-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> | null {
  const env = getSupabaseServerEnv();

  if (!env) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Supabase Server] Configuration incomplete: service role key or URL missing');
    }
    return null;
  }

  const client: SupabaseClient<Database> = createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      ...(process.env.NODE_ENV === 'test' ? { storageKey: generateUniqueTestStorageKey() } : {}),
    },
  });

  return client;
}
