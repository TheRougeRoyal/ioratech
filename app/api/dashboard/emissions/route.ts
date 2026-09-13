import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery, createDoc, updateDocById, deleteDocById } from "@/lib/firestore";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { where } from "firebase/firestore";
import { EmissionSchema } from "@/lib/validators";

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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const validation = EmissionSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, validation.error.issues[0]?.message || "Invalid input");
    }

    const id = `emission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const emissionData = {
      user_id: auth.userId,
      ...validation.data,
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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { id, ...updates } = body;
    if (!id) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "id is required");
    }

    // Partial validation for updates
    const validation = EmissionSchema.partial().safeParse(updates);
    if (!validation.success) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, validation.error.issues[0]?.message || "Invalid input");
    }

    await updateDocById("user_emissions", id, validation.data as Record<string, unknown>);

    return createResponse({ id, ...validation.data }, "Emission updated");
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
