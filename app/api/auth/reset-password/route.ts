import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { email } = body;
    if (!email) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Email is required");
    }

    return createResponse(
      { message: "If an account exists with this email, a password reset link has been sent." },
      "Password reset email sent"
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred");
  }
}
