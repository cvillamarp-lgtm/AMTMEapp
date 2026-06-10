/**
 * Tests for TinyFish Configuration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getTinyFishConfig, validateConfig } from '../config';

describe('TinyFish Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getTinyFishConfig', () => {
    it('should return default config when disabled', () => {
      delete process.env.ENABLE_TINYFISH_AUTOMATION;

      const config = getTinyFishConfig();

      expect(config.enabled).toBe(false);
      expect(config.timeoutMs).toBe(30000);
      expect(config.baseUrl).toBe('https://api.tinyfish.io');
    });

    it('should read ENABLE_TINYFISH_AUTOMATION from env', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';

      const config = getTinyFishConfig();

      expect(config.enabled).toBe(true);
    });

    it('should read TINYFISH_API_KEY from env', () => {
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const config = getTinyFishConfig();

      expect(config.apiKey).toBe('sk_test_12345');
    });

    it('should read TINYFISH_TIMEOUT_MS from env', () => {
      process.env.TINYFISH_TIMEOUT_MS = '45000';

      const config = getTinyFishConfig();

      expect(config.timeoutMs).toBe(45000);
    });

    it('should use default timeout if invalid', () => {
      process.env.TINYFISH_TIMEOUT_MS = 'not-a-number';

      const config = getTinyFishConfig();

      expect(config.timeoutMs).toBe(30000);
    });
  });

  describe('validateConfig', () => {
    it('should be valid when disabled', () => {
      delete process.env.ENABLE_TINYFISH_AUTOMATION;

      const result = validateConfig();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require API_KEY when enabled', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      delete process.env.TINYFISH_API_KEY;

      const result = validateConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'TINYFISH_API_KEY is required when ENABLE_TINYFISH_AUTOMATION=true'
      );
    });

    it('should be valid when enabled with API_KEY', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const result = validateConfig();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
