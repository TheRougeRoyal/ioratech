import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { hashApiKey, isValidApiKeyFormat } from "@/lib/api-key-utils";
import { getDocsByQuery, updateDocById } from "@/lib/firestore";
import { where } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    let body: { api_key?: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { api_key } = body;
    if (!api_key) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "API key is required");
    }

    if (!isValidApiKeyFormat(api_key)) {
      return createResponse({ valid: false, message: "Invalid API key format" }, "API key validation result");
    }

    const keyHash = hashApiKey(api_key);
    const results = await getDocsByQuery("api_keys", [
      where("key_hash", "==", keyHash),
      where("is_active", "==", true),
    ]);

    if (results.length === 0) {
      return createResponse({ valid: false, message: "Invalid API key" }, "API key validation result");
    }

    const record = results[0];
    await updateDocById("api_keys", record.id, {
      last_used_at: new Date().toISOString(),
      usage_count: (record.usage_count || 0) + 1,
    });

    return createResponse(
      { valid: true, user_id: record.user_id, api_key_id: record.id, message: "API key is valid" },
      "API key is valid"
    );
  } catch (error) {
    console.error("API key validate error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Validation failed");
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get("key");
    if (!apiKey) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "API key is required");
    }

    const body = JSON.stringify({ api_key: apiKey });
    const newRequest = new NextRequest(request, { body });
    return POST(newRequest);
  } catch (error) {
    console.error("API key validate GET error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Validation failed");
  }
}
