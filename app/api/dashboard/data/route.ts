import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocById, getDocsByQuery } from "@/lib/firestore";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { where } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const userId = auth.userId;

    const [profile, emissions, risks, compliance, reports] = await Promise.all([
      getDocById("users", userId),
      getDocsByQuery("user_emissions", [where("user_id", "==", userId)], "created_at", 12),
      getDocsByQuery("user_risks", [where("user_id", "==", userId)]),
      getDocsByQuery("user_compliance", [where("user_id", "==", userId)]),
      getDocsByQuery("user_reports", [where("user_id", "==", userId)], "created_at", 10),
    ]);

    return createResponse({
      profile,
      emissions,
      risks,
      compliance,
      reports,
    });
  } catch (error) {
    console.error("GET /api/dashboard/data error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch dashboard data");
  }
}
