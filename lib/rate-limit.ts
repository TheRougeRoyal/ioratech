// In-memory rate limiter for development (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit (in-memory implementation for development)
 * For production, use Redis or similar
 */
export function checkRateLimit(key: string, limit: number, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get remaining requests in current window
 */
export function getRemainingRequests(key: string, limit: number): number {
  const entry = rateLimitStore.get(key);

  if (!entry || Date.now() > entry.resetTime) {
    return limit;
  }

  return Math.max(0, limit - entry.count);
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Rate limit middleware for API routes
 */
export function createRateLimitMiddleware(
  defaultLimit: number = 60,
  defaultWindowMs: number = 60000
) {
  return (identifier: string, limit: number = defaultLimit, windowMs: number = defaultWindowMs) => {
    const key = `rate_limit:${identifier}`;
    return checkRateLimit(key, limit, windowMs);
  };
}

/**
 * Get IP from request
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}

/**
 * Cleanup old rate limit entries (call periodically)
 */
export function cleanupOldEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);
