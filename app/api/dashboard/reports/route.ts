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

    const reports = await getDocsByQuery(
      "user_reports",
      [where("user_id", "==", auth.userId)],
      "created_at"
    );

    return createResponse(reports);
  } catch (error) {
    console.error("GET /api/dashboard/reports error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch reports");
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

    const { name, type, status, frameworks, date } = body;
    if (!name || !type) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "name and type are required");
    }

    const id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const reportData = {
      user_id: auth.userId,
      name,
      type,
      status: status || "draft",
      frameworks: frameworks || [],
      date: date || new Date().toISOString().slice(0, 10),
    };

    await createDoc("user_reports", id, reportData);

    return createResponse({ id, ...reportData }, "Report created", 201);
  } catch (error) {
    console.error("POST /api/dashboard/reports error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create report");
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

    await updateDocById("user_reports", id, updates as Record<string, unknown>);

    return createResponse({ id, ...updates }, "Report updated");
  } catch (error) {
    console.error("PUT /api/dashboard/reports error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to update report");
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

    await deleteDocById("user_reports", id);

    return createResponse(null, "Report deleted");
  } catch (error) {
    console.error("DELETE /api/dashboard/reports error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to delete report");
  }
}