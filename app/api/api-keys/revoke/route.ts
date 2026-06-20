import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";
import { updateDocById, getDocById } from "@/lib/firestore";

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    let body: { api_key_id?: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { api_key_id } = body;
    if (!api_key_id) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "API key ID is required");
    }

    const keyData = await getDocById("api_keys", api_key_id);
    if (!keyData || keyData.user_id !== auth.userId) {
      return createErrorResponseObj(ErrorCode.API_KEY_NOT_FOUND, "API key not found");
    }

    if (!keyData.is_active) {
      return createErrorResponseObj(ErrorCode.API_KEY_REVOKED, "API key is already revoked");
    }

    await updateDocById("api_keys", api_key_id, {
      is_active: false,
      revoked_at: new Date().toISOString(),
    });

    return createResponse({ message: "API key revoked successfully" }, "API key revoked successfully");
  } catch (error) {
    console.error("API key revoke error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to revoke API key");
  }
}

export async function POST(request: NextRequest) {
  return DELETE(request);
}
