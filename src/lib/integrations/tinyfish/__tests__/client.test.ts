/**
 * Tests for TinyFish Client
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TinyFishClient, resetTinyFishClient } from '../client';
import { TinyFishDisabledError, type TinyFishFlowRequest } from '../types';

describe('TinyFish Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetTinyFishClient();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetTinyFishClient();
  });

  describe('initialization', () => {
    it('should initialize successfully when disabled', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'false';

      const client = new TinyFishClient();

      expect(client.isEnabled()).toBe(false);
    });

    it('should initialize successfully when enabled with API key', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const client = new TinyFishClient();

      expect(client.isEnabled()).toBe(true);
    });
  });

  describe('executeFlow', () => {
    it('should throw TinyFishDisabledError when disabled', async () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'false';

      const client = new TinyFishClient();

      const request: TinyFishFlowRequest = {
        name: 'test-flow',
        timeout: 30000,
        steps: [{ action: 'navigate', url: '/test' }],
      };

      await expect(client.executeFlow(request)).rejects.toThrow(TinyFishDisabledError);
    });

    it('should throw TinyFishDisabledError when API key is missing even if enabled', async () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      delete process.env.TINYFISH_API_KEY;

      const client = new TinyFishClient();

      const request: TinyFishFlowRequest = {
        name: 'test-flow',
        timeout: 30000,
        steps: [{ action: 'navigate', url: '/test' }],
      };

      // Without API key, even if ENABLE_TINYFISH_AUTOMATION=true, client.isEnabled() returns false
      // So it throws TinyFishDisabledError, not TinyFishConfigError
      await expect(client.executeFlow(request)).rejects.toThrow(TinyFishDisabledError);
    });

    it('should execute a simple flow successfully', async () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const client = new TinyFishClient();

      const request: TinyFishFlowRequest = {
        name: 'test-flow',
        timeout: 30000,
        steps: [
          { action: 'navigate', url: '/test' },
          { action: 'click', selector: '.button' },
        ],
      };

      const result = await client.executeFlow(request);

      expect(result.status).toBe('success');
      expect(result.flowName).toBe('test-flow');
      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].status).toBe('success');
      expect(result.steps[1].status).toBe('success');
    });

    it('should capture flow metadata', async () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const client = new TinyFishClient();

      const metadata = { fileId: 'test-123', userId: 'user-456' };

      const request: TinyFishFlowRequest = {
        name: 'test-flow',
        timeout: 30000,
        steps: [{ action: 'navigate', url: '/test' }],
        metadata,
      };

      const result = await client.executeFlow(request);

      expect(result.metadata).toEqual(metadata);
    });

    it('should record step durations', async () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const client = new TinyFishClient();

      const request: TinyFishFlowRequest = {
        name: 'test-flow',
        timeout: 30000,
        steps: [{ action: 'navigate', url: '/test' }],
      };

      const result = await client.executeFlow(request);

      expect(result.steps[0].durationMs).toBeGreaterThan(0);
      expect(result.durationMs).toBeGreaterThan(0);
    });
  });

  describe('isEnabled', () => {
    it('should return false when automation is disabled', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'false';

      const client = new TinyFishClient();

      expect(client.isEnabled()).toBe(false);
    });

    it('should return false when API key is missing', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      delete process.env.TINYFISH_API_KEY;

      const client = new TinyFishClient();

      expect(client.isEnabled()).toBe(false);
    });

    it('should return true when properly configured', () => {
      process.env.ENABLE_TINYFISH_AUTOMATION = 'true';
      process.env.TINYFISH_API_KEY = 'sk_test_12345';

      const client = new TinyFishClient();

      expect(client.isEnabled()).toBe(true);
    });
  });
});
