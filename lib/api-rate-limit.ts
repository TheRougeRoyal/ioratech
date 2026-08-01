import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
  applyRateLimitHeaders,
  getClientIp,
  API_RATE_LIMIT,
  type RateLimitConfig,
} from "@/lib/rate-limit";

export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  config: RateLimitConfig = API_RATE_LIMIT,
  identifier?: string
): Promise<NextResponse> {
  const id = identifier || getClientIp(request);
  const { allowed, remaining, resetTime } = checkRateLimit(id, config);

  if (!allowed) {
    return rateLimitResponse(resetTime);
  }

  const response = await handler();
  return applyRateLimitHeaders(response, remaining, resetTime, config.maxRequests);
}
