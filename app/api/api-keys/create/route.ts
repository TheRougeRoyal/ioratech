import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery, createDoc } from "@/lib/firestore";
import { generateApiKey, hashApiKey, createApiKeyPreview, sanitizeInput } from "@/lib/api-key-utils";
import { where } from "firebase/firestore";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }

    let body: { name?: string; description?: string; expires_in_days?: number; scopes?: string[] };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { name, description, expires_in_days, scopes } = body;

    if (!name || name.trim().length === 0) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "API key name is required");
    }

    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const keyPreview = createApiKeyPreview(apiKey);
    const id = crypto.randomUUID();

    let expiresAt: string | undefined;
    if (expires_in_days && expires_in_days >= 1 && expires_in_days <= 365) {
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
      scopes: scopes || ["read"],
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
        scopes: scopes || ["read"],
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
