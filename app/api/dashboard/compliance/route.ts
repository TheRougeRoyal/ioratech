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

    const compliance = await getDocsByQuery(
      "user_compliance",
      [where("user_id", "==", auth.userId)],
      "created_at"
    );

    return createResponse(compliance);
  } catch (error) {
    console.error("GET /api/dashboard/compliance error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch compliance data");
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

    const { framework, status, score, categories } = body;
    if (!framework || !status || score === undefined) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "framework, status, and score are required");
    }

    const id = `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const complianceData = {
      user_id: auth.userId,
      framework,
      status,
      score,
      categories: categories || [],
    };

    await createDoc("user_compliance", id, complianceData);

    return createResponse({ id, ...complianceData }, "Compliance created", 201);
  } catch (error) {
    console.error("POST /api/dashboard/compliance error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create compliance record");
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

    await updateDocById("user_compliance", id, updates as Record<string, unknown>);

    return createResponse({ id, ...updates }, "Compliance updated");
  } catch (error) {
    console.error("PUT /api/dashboard/compliance error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to update compliance");
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

    await deleteDocById("user_compliance", id);

    return createResponse(null, "Compliance deleted");
  } catch (error) {
    console.error("DELETE /api/dashboard/compliance error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to delete compliance");
  }
}