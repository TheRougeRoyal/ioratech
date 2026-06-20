import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    return createResponse({ message: "Logged out successfully" }, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred");
  }
}
