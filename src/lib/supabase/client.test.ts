import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Supabase Browser Client', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('returns null when env is not configured', async () => {
    const { getSupabaseBrowserClient } = await import('./client');

    const client = getSupabaseBrowserClient();
    expect(client).toBeNull();
  });

  it('returns null on second call when initially not configured', async () => {
    const { getSupabaseBrowserClient } = await import('./client');

    const client1 = getSupabaseBrowserClient();
    const client2 = getSupabaseBrowserClient();

    expect(client1).toBeNull();
    expect(client2).toBeNull();
  });

  it('creates client when env is configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

    const { getSupabaseBrowserClient } = await import('./client');

    const client = getSupabaseBrowserClient();
    expect(client).not.toBeNull();
  });

  it('returns same instance on subsequent calls', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

    const { getSupabaseBrowserClient } = await import('./client');

    const client1 = getSupabaseBrowserClient();
    const client2 = getSupabaseBrowserClient();

    expect(client1).toBe(client2);
  });

  it('initializes with correct auth settings', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

    const { getSupabaseBrowserClient } = await import('./client');

    const client = getSupabaseBrowserClient();
    expect(client).not.toBeNull();
    if (client) {
      expect(client).toHaveProperty('auth');
    }
  });

  it('does not emit GoTrue multiple client warning across module reloads', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getSupabaseBrowserClient } = await import('./client');
    getSupabaseBrowserClient();

    vi.resetModules();

    const { getSupabaseBrowserClient: getSupabaseBrowserClientReloaded } = await import('./client');
    getSupabaseBrowserClientReloaded();

    const gotrueWarnings = warnSpy.mock.calls
      .flat()
      .map((entry) => String(entry))
      .filter((message) => message.includes('Multiple GoTrueClient instances detected'));

    expect(gotrueWarnings).toHaveLength(0);
  });
});
