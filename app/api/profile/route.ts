import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { getDocById, updateDocById } from "@/lib/firestore";
import { requireAuth } from "@/lib/auth-middleware";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const profile = await getDocById("users", auth.userId);
    if (!profile) {
      return createErrorResponseObj(ErrorCode.USER_NOT_FOUND, "User profile not found");
    }

    return createResponse(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch profile");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const allowedFields = [
      "name", "avatar_url", "phone", "company", "industry",
      "job_title", "bio", "timezone", "locale",
      "notification_preferences", "onboarding_completed",
    ];

    const sanitized: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        sanitized[field] = body[field];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "No valid fields to update");
    }

    await updateDocById("users", auth.userId, sanitized);
    const updated = await getDocById("users", auth.userId);

    return createResponse(updated);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to update profile");
  }
}
