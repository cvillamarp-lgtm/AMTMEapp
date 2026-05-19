import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isSupabaseBrowserConfigured,
  isSupabaseServerConfigured,
  getSupabasePublicEnv,
  getSupabaseServerEnv,
  getStudioStateKey,
  isAuthRequired,
  getSiteUrl,
} from './env';

describe('Supabase Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isSupabaseBrowserConfigured', () => {
    it('returns false when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      expect(isSupabaseBrowserConfigured()).toBe(false);
    });

    it('returns false when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(isSupabaseBrowserConfigured()).toBe(false);
    });

    it('returns false when URL is invalid', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-url';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      expect(isSupabaseBrowserConfigured()).toBe(false);
    });

    it('returns false when anon key is too short', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'short';

      expect(isSupabaseBrowserConfigured()).toBe(false);
    });

    it('returns true with valid https URL and 32+ char key', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      expect(isSupabaseBrowserConfigured()).toBe(true);
    });

    it('returns true with localhost URL and 32+ char key', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      expect(isSupabaseBrowserConfigured()).toBe(true);
    });

    it('returns true with key longer than 32 chars', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(100);

      expect(isSupabaseBrowserConfigured()).toBe(true);
    });
  });

  describe('isSupabaseServerConfigured', () => {
    it('returns false when browser config is incomplete', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

      expect(isSupabaseServerConfigured()).toBe(false);
    });

    it('returns false when service role key is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(isSupabaseServerConfigured()).toBe(false);
    });

    it('returns false when service role key is too short', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'short';

      expect(isSupabaseServerConfigured()).toBe(false);
    });

    it('returns true when all configs are valid', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

      expect(isSupabaseServerConfigured()).toBe(true);
    });
  });

  describe('getSupabasePublicEnv', () => {
    it('returns null when browser config is incomplete', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      expect(getSupabasePublicEnv()).toBeNull();
    });

    it('returns env object with valid config', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);

      const env = getSupabasePublicEnv();
      expect(env).toEqual({
        url: 'https://example.supabase.co',
        anonKey: 'a'.repeat(32),
      });
    });
  });

  describe('getSupabaseServerEnv', () => {
    it('returns null when server config is incomplete', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(getSupabaseServerEnv()).toBeNull();
    });

    it('returns env object with all keys when fully configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'a'.repeat(32);
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'b'.repeat(32);

      const env = getSupabaseServerEnv();
      expect(env).toEqual({
        url: 'https://example.supabase.co',
        anonKey: 'a'.repeat(32),
        serviceRoleKey: 'b'.repeat(32),
      });
    });
  });

  describe('getStudioStateKey', () => {
    it('returns primary when SUPABASE_STUDIO_STATE_KEY is not set', () => {
      delete process.env.SUPABASE_STUDIO_STATE_KEY;
      expect(getStudioStateKey()).toBe('primary');
    });

    it('returns custom key when set', () => {
      process.env.SUPABASE_STUDIO_STATE_KEY = 'custom-key';
      expect(getStudioStateKey()).toBe('custom-key');
    });
  });

  describe('isAuthRequired', () => {
    it('returns false when NEXT_PUBLIC_REQUIRE_AUTH is not set', () => {
      delete process.env.NEXT_PUBLIC_REQUIRE_AUTH;
      expect(isAuthRequired()).toBe(false);
    });

    it('returns false when NEXT_PUBLIC_REQUIRE_AUTH is false', () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH = 'false';
      expect(isAuthRequired()).toBe(false);
    });

    it('returns true when NEXT_PUBLIC_REQUIRE_AUTH is true', () => {
      process.env.NEXT_PUBLIC_REQUIRE_AUTH = 'true';
      expect(isAuthRequired()).toBe(true);
    });
  });

  describe('getSiteUrl', () => {
    it('returns localhost:3000 when NEXT_PUBLIC_SITE_URL is not set', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      expect(getSiteUrl()).toBe('http://localhost:3000');
    });

    it('returns custom URL when valid', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
      expect(getSiteUrl()).toBe('https://example.com');
    });

    it('returns localhost:3000 when URL is invalid', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'not-a-url';
      expect(getSiteUrl()).toBe('http://localhost:3000');
    });

    it('accepts localhost URLs', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3001';
      expect(getSiteUrl()).toBe('http://localhost:3001');
    });
  });
});
