import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Supabase Server Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it('returns null when env is not configured', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { getSupabaseServiceRoleClient } = await import('./server');
    const client = getSupabaseServiceRoleClient();
    expect(client).toBeNull();
  });

  it('returns null when public env is incomplete', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'a'.repeat(32);

    const { getSupabaseServiceRoleClient } = await import('./server');
    const client = getSupabaseServiceRoleClient();
    expect(client).toBeNull();
  });

  it('returns null when service role key is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { getSupabaseServiceRoleClient } = await import('./server');
    const client = getSupabaseServiceRoleClient();
    expect(client).toBeNull();
  });

  it('returns client when all env vars are configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

    const { getSupabaseServiceRoleClient } = await import('./server');
    const client = getSupabaseServiceRoleClient();
    expect(client).not.toBeNull();
  });

  it('returns correctly typed client', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

    const { getSupabaseServiceRoleClient } = await import('./server');
    const client = getSupabaseServiceRoleClient();
    if (client) {
      expect(client).toHaveProperty('auth');
    }
  });

  it('does not emit GoTrue multiple client warning when creating clients repeatedly', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.resetModules();

    const { getSupabaseServiceRoleClient } = await import('./server');
    getSupabaseServiceRoleClient();
    getSupabaseServiceRoleClient();

    const gotrueWarnings = warnSpy.mock.calls
      .flat()
      .map((entry) => String(entry))
      .filter((message) => message.includes('Multiple GoTrueClient instances detected'));

    expect(gotrueWarnings).toHaveLength(0);
  });
});
