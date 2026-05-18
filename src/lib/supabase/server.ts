import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabaseServerEnv } from '@/lib/supabase/env';

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> | null {
  const env = getSupabaseServerEnv();

  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
