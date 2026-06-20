import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";
import { updateDocById } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    await updateDocById("users", auth.userId, {
      last_sign_in_at: new Date().toISOString(),
    });

    return createResponse({ message: "Login successful" }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred");
  }
}
