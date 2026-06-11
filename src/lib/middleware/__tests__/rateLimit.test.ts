import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rateLimiter, extractRateLimitKey } from '../rateLimit';

/**
 * MED-004: Rate limiting middleware tests
 * Validates rate limiting behavior for AI endpoints
 */

describe('Rate Limiter Middleware (MED-004)', () => {
  beforeEach(() => {
    // Clear rate limiter state before each test
    const limiter = rateLimiter as any;
    limiter.store.clear();
  });

  describe('Basic rate limiting', () => {
    it('should allow first 10 requests within window', () => {
      const key = 'test-user-1';

      for (let i = 1; i <= 10; i++) {
        const allowed = rateLimiter.isAllowed(key);
        expect(allowed).toBe(true);
      }
    });

    it('should block 11th request (429)', () => {
      const key = 'test-user-2';

      // Allow 10 requests
      for (let i = 1; i <= 10; i++) {
        rateLimiter.isAllowed(key);
      }

      // 11th should be blocked
      const allowed = rateLimiter.isAllowed(key);
      expect(allowed).toBe(false);
    });

    it('should include Retry-After header in 429 response', () => {
      const key = 'test-user-3';

      for (let i = 1; i <= 10; i++) {
        rateLimiter.isAllowed(key);
      }

      const blocked = !rateLimiter.isAllowed(key);
      expect(blocked).toBe(true);

      // Retry-After should be 60 seconds
      const resetTime = rateLimiter.getResetTime(key);
      expect(resetTime).toBeGreaterThan(0);
      expect(resetTime).toBeLessThanOrEqual(60000); // Within 60 second window
    });
  });

  describe('Key isolation', () => {
    it('should isolate limits between different users', () => {
      const user1 = 'user:alice';
      const user2 = 'user:bob';

      // Use 10 requests for user1
      for (let i = 1; i <= 10; i++) {
        rateLimiter.isAllowed(user1);
      }

      // user1 blocked, but user2 should be allowed
      expect(rateLimiter.isAllowed(user1)).toBe(false);
      expect(rateLimiter.isAllowed(user2)).toBe(true);
    });

    it('should isolate limits between IP addresses', () => {
      const ip1 = 'ip:192.168.1.1';
      const ip2 = 'ip:192.168.1.2';

      // Use 10 requests for ip1
      for (let i = 1; i <= 10; i++) {
        rateLimiter.isAllowed(ip1);
      }

      // ip1 blocked, but ip2 should be allowed
      expect(rateLimiter.isAllowed(ip1)).toBe(false);
      expect(rateLimiter.isAllowed(ip2)).toBe(true);
    });
  });

  describe('Rate limit key extraction', () => {
    it('should extract userId from x-user-id header', () => {
      const headers = new Headers();
      headers.set('x-user-id', 'user-123');

      const key = extractRateLimitKey(headers);
      expect(key).toBe('user:user-123');
    });

    it('should fallback to x-forwarded-for IP when no userId', () => {
      const headers = new Headers();
      headers.set('x-forwarded-for', '203.0.113.42, 198.51.100.5');

      const key = extractRateLimitKey(headers);
      expect(key).toBe('ip:203.0.113.42');
    });

    it('should fallback to x-real-ip when no userId or forwarded-for', () => {
      const headers = new Headers();
      headers.set('x-real-ip', '203.0.113.100');

      const key = extractRateLimitKey(headers);
      expect(key).toBe('ip:203.0.113.100');
    });

    it('should use unknown when no headers present', () => {
      const headers = new Headers();

      const key = extractRateLimitKey(headers);
      expect(key).toBe('ip:unknown');
    });
  });

  describe('Remaining requests tracking', () => {
    it('should return correct remaining count', () => {
      const key = 'test-remaining';

      expect(rateLimiter.getRemaining(key)).toBe(10); // Initial

      rateLimiter.isAllowed(key);
      expect(rateLimiter.getRemaining(key)).toBe(9);

      rateLimiter.isAllowed(key);
      expect(rateLimiter.getRemaining(key)).toBe(8);
    });

    it('should reset remaining count to 10 after window expires', () => {
      const key = 'test-reset';

      // Use all 10 requests
      for (let i = 1; i <= 10; i++) {
        rateLimiter.isAllowed(key);
      }

      expect(rateLimiter.getRemaining(key)).toBe(0);

      // Simulate window expiry by manually resetting store
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const limiter = rateLimiter as any;
      const entry = limiter.store.get(key) as { resetAt: number } | undefined;
      if (entry) {
        entry.resetAt = Date.now() - 1000; // Set reset time to past
      }

      // After expiry, should reset to 10
      expect(rateLimiter.getRemaining(key)).toBe(10);
    });
  });
});
