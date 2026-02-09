/**
 * Rate Limiting Middleware
 *
 * Simple in-memory rate limiting to prevent spam and abuse
 * For production, consider using Redis or a similar solution
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limits
const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Default rate limit: 3 submissions per hour
 */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the user (e.g., email, IP)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimits.get(identifier);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimits.delete(identifier);
  }

  const currentEntry = rateLimits.get(identifier);

  if (!currentEntry) {
    // First request or expired entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimits.set(identifier, newEntry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if limit exceeded
  if (currentEntry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  // Increment counter
  currentEntry.count += 1;
  rateLimits.set(identifier, currentEntry);

  return {
    allowed: true,
    remaining: config.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or admin actions
 *
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimits.delete(identifier);
}

/**
 * Clean up all expired rate limit entries
 * Should be called periodically to prevent memory leaks
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetTime) {
      rateLimits.delete(key);
    }
  }
}

// Clean up expired entries every 10 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}

/**
 * Get time until rate limit resets in human-readable format
 *
 * @param resetTime - Timestamp when rate limit resets
 * @returns Human-readable time string
 */
export function getTimeUntilReset(resetTime: number): string {
  const now = Date.now();
  const diff = resetTime - now;

  if (diff <= 0) {
    return 'now';
  }

  const minutes = Math.ceil(diff / 60000);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}
