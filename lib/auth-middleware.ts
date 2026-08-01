import { NextRequest } from "next/server";
import { verifyFirebaseToken, type FirebaseJwtPayload } from "@/lib/verify-token";
import { getDocById } from "@/lib/firestore";
import { checkRateLimit, API_RATE_LIMIT, getClientIp } from "@/lib/rate-limit";

export interface AuthResult {
  authenticated: boolean;
  userId: string | null;
  tokenPayload: FirebaseJwtPayload | null;
  error?: string;
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { authenticated: false, userId: null, tokenPayload: null, error: "Missing authorization header" };
  }

  const token = authHeader.substring(7).trim();
  const payload = await verifyFirebaseToken(token);

  if (!payload) {
    return { authenticated: false, userId: null, tokenPayload: null, error: "Invalid or expired token" };
  }

  const { allowed } = checkRateLimit(payload.user_id, {
    ...API_RATE_LIMIT,
    keyPrefix: "user_api",
  });

  if (!allowed) {
    return { authenticated: false, userId: null, tokenPayload: null, error: "Rate limit exceeded" };
  }

  return { authenticated: true, userId: payload.user_id, tokenPayload: payload };
}

export async function getAuthToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  return null;
}
