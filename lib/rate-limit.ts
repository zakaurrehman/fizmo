/**
 * Simple in-memory rate limiter
 * Tracks attempts per IP and enforces limits
 */

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Check if an IP has exceeded rate limit
 * @param ip - Client IP address
 * @param limit - Max attempts per window
 * @param windowMs - Time window in milliseconds
 * @returns Object with {allowed: boolean, remaining: number, resetTime: number}
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute default
) {
  const now = Date.now();
  const entry = store.get(ip);

  // Create new entry or check if window expired
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      attempts: 1,
      resetTime: now + windowMs,
    };
    store.set(ip, newEntry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment attempts
  entry.attempts += 1;

  if (entry.attempts > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: limit - entry.attempts,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 * Checks x-forwarded-for (reverse proxy), x-real-ip, or socket address
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Clear all stored rate limit entries (useful for testing)
 */
export function clearRateLimitStore() {
  store.clear();
}

/**
 * Clean up expired entries periodically (runs every 5 minutes)
 */
if (typeof global !== "undefined") {
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  // Prevent interval from keeping process alive in serverless
  if (cleanup.unref) {
    cleanup.unref();
  }
}
