/**
 * In-memory rate limiter for API endpoints
 * Tracks requests per user_id or IP address
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private windowMs: number = 60 * 1000; // 1 minute
  private maxRequests: number = 10; // per window

  /**
   * Check if request should be allowed
   * @param key - Unique identifier (userId, IP, etc.)
   * @returns true if allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    // First request or window expired
    if (!entry || now > entry.resetAt) {
      this.store.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    // Check if under limit
    if (entry.count < this.maxRequests) {
      entry.count++;
      return true;
    }

    // Rate limited
    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time (ms until next window)
   */
  getResetTime(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetAt - Date.now());
  }

  /**
   * Cleanup old entries (call periodically to prevent memory leaks)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * Extract rate limit key from request
 * Priority: userId from auth > IP from headers
 */
export function extractRateLimitKey(headers: Headers): string {
  // Try to get userId from auth context (set by middleware)
  const userId = headers.get('x-user-id');
  if (userId) return `user:${userId}`;

  // Fallback to IP
  const ip = headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}
