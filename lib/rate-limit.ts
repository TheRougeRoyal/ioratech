import { getDb } from '@/lib/mongodb';

/**
 * Check rate limit using MongoDB.
 * Uses findOneAndUpdate with upsert for atomic increment + expire.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000
): Promise<boolean> {
  const db = getDb();
  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);

  try {
    const result = await db.collection('rate_limits').findOneAndUpdate(
      { _id: key },
      {
        $inc: { count: 1 },
        $setOnInsert: { resetTime: now + windowMs },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    const resetTime = (result as { resetTime: number; count: number }).resetTime;
    const count = (result as { resetTime: number; count: number }).count;

    if (now > resetTime) {
      // Window expired, reset
      await db.collection('rate_limits').updateOne(
        { _id: key },
        { $set: { resetTime: now + windowMs, count: 1 } }
      );
      return true;
    }

    return count <= limit;
  } catch (err) {
    console.error('Rate limit error:', err);
    return true; // Allow on error
  }
}

/**
 * Get remaining requests in current window.
 */
export async function getRemainingRequests(
  key: string,
  limit: number
): Promise<number> {
  const db = getDb();
  const now = Date.now();

  try {
    const entry = await db.collection('rate_limits').findOne({ _id: key });
    if (!entry || now > (entry.resetTime as number)) {
      return limit;
    }
    return Math.max(0, limit - ((entry.count as number) ?? 0));
  } catch {
    return limit;
  }
}

/**
 * Reset rate limit for a key.
 */
export async function resetRateLimit(key: string): Promise<void> {
  const db = getDb();
  await db.collection('rate_limits').deleteOne({ _id: key });
}

/**
 * Rate limit middleware for API routes.
 */
export function createRateLimitMiddleware(
  defaultLimit: number = 60,
  defaultWindowMs: number = 60000
) {
  return (identifier: string, limit: number = defaultLimit, windowMs: number = defaultWindowMs) => {
    return checkRateLimit(`rate_limit:${identifier}`, limit, windowMs);
  };
}

/**
 * Get IP from request.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}
