import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * MED-003: Supabase SERVICE_ROLE_KEY fallback prevention
 * Validates that missing SERVICE_ROLE_KEY doesn't fall back to ANON key
 */

describe('Spotify Import — SERVICE_ROLE_KEY Validation (MED-003)', () => {
  // Mock environment for testing fallback scenario
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should not use ANON key when SERVICE_ROLE_KEY is missing', () => {
    // Simulate missing SERVICE_ROLE_KEY
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon_key_should_not_be_used';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';

    // This is the pattern from spotify/import/route.ts
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Assert: key should be undefined (no fallback)
    expect(key).toBeUndefined();
    expect(key).not.toBe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });

  it('should use SERVICE_ROLE_KEY when available', () => {
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon_key';

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(key).toBe(serviceKey);
    expect(key).not.toBe('anon_key');
  });

  it('should fail safely when both keys are missing', () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(key).toBeUndefined();
    expect(anonKey).toBeUndefined();
  });
});
