import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery } from "@/lib/firestore";
import { where } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    const apiKeys = await getDocsByQuery("api_keys", [where("user_id", "==", auth.userId)]);

    const responseKeys = apiKeys.map((key: any) => ({
      id: key.id,
      name: key.name,
      description: key.description,
      key_preview: key.key_preview,
      scopes: key.scopes || ["read"],
      created_at: key.created_at,
      last_used_at: key.last_used_at,
      is_active: key.is_active,
      usage_count: key.usage_count,
      expires_at: key.expires_at,
    }));

    return createResponse({ api_keys: responseKeys }, "API keys retrieved successfully");
  } catch (error) {
    console.error("API key list error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to retrieve API keys");
  }
}
