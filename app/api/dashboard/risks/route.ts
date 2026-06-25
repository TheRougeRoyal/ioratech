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

    const risks = await getDocsByQuery(
      "user_risks",
      [where("user_id", "==", auth.userId)],
      "created_at"
    );

    return createResponse(risks);
  } catch (error) {
    console.error("GET /api/dashboard/risks error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch risks");
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

    const { category, risk_type, score, trend, description } = body;
    if (!category || !risk_type || score === undefined) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "category, risk_type, and score are required");
    }

    const id = `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const riskData = {
      user_id: auth.userId,
      category,
      risk_type,
      score,
      trend: trend || "stable",
      description: description || "",
    };

    await createDoc("user_risks", id, riskData);

    return createResponse({ id, ...riskData }, "Risk created", 201);
  } catch (error) {
    console.error("POST /api/dashboard/risks error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create risk");
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

    await updateDocById("user_risks", id, updates as Record<string, unknown>);

    return createResponse({ id, ...updates }, "Risk updated");
  } catch (error) {
    console.error("PUT /api/dashboard/risks error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to update risk");
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

    await deleteDocById("user_risks", id);

    return createResponse(null, "Risk deleted");
  } catch (error) {
    console.error("DELETE /api/dashboard/risks error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to delete risk");
  }
}