import { Redis } from '@upstash/redis';
import { env } from './env';
import { logger } from './logger';

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function detectAnomalousLogin(userId: string, ipAddress: string) {
  if (!redis) return { suspicious: false };

  try {
    const lastLogins = await redis.lrange(`login_history:${userId}`, 0, 10);
    if (!lastLogins || lastLogins.length === 0) return { suspicious: false };

    const logins = lastLogins.map(l => JSON.parse(l));

    // Check 1: New IP address
    const knownIPs = new Set(logins.map(l => l.ip));
    if (!knownIPs.has(ipAddress)) {
      return { suspicious: true, reason: 'new_ip_address' };
    }

    // Check 2: Brute force (multiple failed attempts)
    const failedAttempts = await redis.get(`failed_logins:${ipAddress}:${userId}`);
    if (failedAttempts && Number(failedAttempts) > 5) {
      return { suspicious: true, reason: 'too_many_failed_attempts' };
    }

    return { suspicious: false };
  } catch (error) {
    logger.error({ error }, 'Anomaly detection failed');
    return { suspicious: false }; // Fail open to avoid blocking users on Redis error
  }
}

export async function logLoginAttempt(
  userId: string,
  ipAddress: string,
  success: boolean,
  location?: string
) {
  if (!redis) return;

  try {
    if (!success) {
      await redis.incr(`failed_logins:${ipAddress}:${userId}`);
      await redis.expire(`failed_logins:${ipAddress}:${userId}`, 3600);
    } else {
      await redis.del(`failed_logins:${ipAddress}:${userId}`);

      const loginRecord = {
        timestamp: Date.now(),
        ip: ipAddress,
        location,
        userAgent: 'captured-at-middleware',
      };

      await redis.lpush(`login_history:${userId}`, JSON.stringify(loginRecord));
      await redis.ltrim(`login_history:${userId}`, 0, 50);
    }
  } catch (error) {
    logger.error({ error }, 'Failed to log login attempt');
  }
}
