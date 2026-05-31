import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import { isAuthRequired } from '@/lib/supabase/env';

export const ANON_OWNER_HEADER = 'x-amtme-anon-owner';
const ANON_OWNER_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

export function resolveAnonymousOwnerId(request: Request): string | null {
  const ownerId = request.headers.get(ANON_OWNER_HEADER)?.trim() ?? '';

  if (!ANON_OWNER_PATTERN.test(ownerId)) {
    return null;
  }

  return ownerId;
}

export async function resolveRequestOwnerId(request: Request): Promise<string | null> {
  if (!isAuthRequired()) {
    return resolveAnonymousOwnerId(request);
  }

  const client = await getSupabaseAuthServerClient();

  if (!client) {
    return null;
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.id ?? null;
}
