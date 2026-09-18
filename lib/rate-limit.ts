import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "./env";


let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  const redisUrl = env.UPSTASH_REDIS_REST_URL;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) return null;
  if (!redisClient) {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }
  return redisClient;
}

const limiters = new Map<string, Ratelimit>();

// ponytail: simple in-memory fallback for dev
const fallbackStore = new Map<string, { count: number; reset: number }>();

async function fallbackLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = fallbackStore.get(key);

  if (!entry || now > entry.reset) {
    const reset = now + windowMs;
    fallbackStore.set(key, { count: 1, reset });
    return { success: true, remaining: max - 1, reset: reset / 1000 };
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, reset: entry.reset / 1000 };
  }

  entry.count++;
  return { success: true, remaining: max - entry.count, reset: entry.reset / 1000 };
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export const AUTH_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  keyPrefix: "auth",
};

export const API_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyPrefix: "api",
};

async function getLimiter(config: RateLimitConfig) {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${config.windowMs}:${config.maxRequests}`;
  if (!limiters.has(key)) {
    limiters.set(key, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs / 1000} s` as any),
      analytics: true,
    }));
  }
  return limiters.get(key)!;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `${config.keyPrefix || "rl"}:${identifier}`;
  const limiter = await getLimiter(config);

  if (!limiter) {
    const { success, remaining, reset } = await fallbackLimit(key, config.maxRequests, config.windowMs);
    return {
      allowed: success,
      remaining,
      resetTime: reset * 1000,
    };
  }

  const { success, reset, remaining } = await limiter.limit(key);

  return {
    allowed: success,
    remaining,
    resetTime: reset * 1000,
  };
}

export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "0",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export function applyRateLimitHeaders(
  response: NextResponse,
  remaining: number,
  resetTime: number,
  limit: number
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetTime / 1000)));
  return response;
}

export const RATE_LIMITS = {
  auth: { points: 5, duration: 60 },
  login: { points: 10, duration: 300 },
  api: { points: 100, duration: 60 },
  upload: { points: 10, duration: 3600 },
  free_tier: { points: 100, duration: 86400 },
  pro_tier: { points: 10000, duration: 86400 },
};

export async function checkRateLimitByEndpoint(
  identifier: string,
  endpoint: string,
  tier: 'free' | 'pro' = 'free'
): Promise<{ success: boolean; remaining: number; total: number; resetAt: Date }> {
  const limit = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.api;
  const keyPrefix = tier === 'pro' ? 'pro_' : 'free_';

  const config: RateLimitConfig = {
    windowMs: limit.duration * 1000,
    maxRequests: limit.points,
    keyPrefix: `${keyPrefix}${endpoint}`,
  };

  const { allowed, remaining, resetTime } = await checkRateLimit(identifier, config);

  return {
    success: allowed,
    remaining,
    total: limit.points,
    resetAt: new Date(resetTime),
  };
}

export function rateLimitHeaders(result: Awaited<ReturnType<typeof checkRateLimitByEndpoint>>) {
  return {
    'X-RateLimit-Limit': String(result.total),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetAt.getTime()),
    'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)),
  };
}


export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
