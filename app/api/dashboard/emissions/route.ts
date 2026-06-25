import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery, createDoc, updateDocById, deleteDocById } from "@/lib/firestore";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { where } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const emissions = await getDocsByQuery(
      "user_emissions",
      [where("user_id", "==", auth.userId)],
      "created_at"
    );

    return createResponse(emissions);
  } catch (error) {
    console.error("GET /api/dashboard/emissions error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch emissions");
  }
}

export async function POST(request: NextRequest) {
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

    const { scope, category, value, unit, period } = body;
    if (!scope || !category || value === undefined) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "scope, category, and value are required");
    }

    const id = `emission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const emissionData = {
      user_id: auth.userId,
      scope,
      category,
      value,
      unit: unit || "tCO2e",
      period: period || new Date().toISOString().slice(0, 7),
    };

    await createDoc("user_emissions", id, emissionData);

    return createResponse({ id, ...emissionData }, "Emission created");
  } catch (error) {
    console.error("POST /api/dashboard/emissions error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create emission");
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

    const { id, ...updates } = body as { id?: string; [key: string]: unknown };
    if (!id) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "id is required");
    }

    await updateDocById("user_emissions", id, updates as Record<string, unknown>);

    return createResponse({ id, ...updates }, "Emission updated");
  } catch (error) {
    console.error("PUT /api/dashboard/emissions error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to update emission");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "id is required");
    }

    await deleteDocById("user_emissions", id);

    return createResponse(null, "Emission deleted");
  } catch (error) {
    console.error("DELETE /api/dashboard/emissions error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to delete emission");
  }
}