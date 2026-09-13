import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery, createDoc } from "@/lib/firestore";
import { generateApiKey, hashApiKey, createApiKeyPreview, sanitizeInput } from "@/lib/api-key-utils";
import { where } from "firebase/firestore";
import crypto from "crypto";
import { ApiKeyCreateSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const validation = ApiKeyCreateSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, validation.error.issues[0]?.message || "Invalid request");
    }

    const { name, description, expires_in_days, scopes } = validation.data;

    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const keyPreview = createApiKeyPreview(apiKey);
    const id = crypto.randomUUID();

    let expiresAt: string | undefined;
    if (expires_in_days) {
      const d = new Date();
      d.setDate(d.getDate() + expires_in_days);
      expiresAt = d.toISOString();
    }

    await createDoc("api_keys", id, {
      user_id: auth.userId,
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : null,
      key_hash: keyHash,
      key_preview: keyPreview,
      scopes: scopes,
      is_active: true,
      expires_at: expiresAt || null,
      last_used_at: null,
      last_used_ip: null,
      usage_count: 0,
      revoked_at: null,
    });

    return createResponse(
      {
        id,
        name: sanitizeInput(name),
        key: apiKey,
        key_preview: keyPreview,
        scopes: scopes,
        expires_at: expiresAt || null,
      },
      "API key created successfully",
      201
    );
  } catch (error) {
    console.error("API key create error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create API key");
  }
}
