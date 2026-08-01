import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse, getClientIp, AUTH_RATE_LIMIT } from "@/lib/rate-limit";

const PUBLIC_PREFIXES = [
  "/api/auth/",
  "/_next/",
  "/favicon.ico",
];

const AUTH_PREFIXES = ["/api/auth/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
        const ip = getClientIp(request);
        const { allowed, resetTime } = checkRateLimit(ip, AUTH_RATE_LIMIT);
        if (!allowed) return rateLimitResponse(resetTime);
      }
      return NextResponse.next();
    }
  }

  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|ttf|eot|css|js|map)$/)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
