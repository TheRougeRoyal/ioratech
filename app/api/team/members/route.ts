import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { getDocsByQuery, createDoc, deleteDocById, getDocById, updateDocById } from "@/lib/firestore";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { where } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const profile = await getDocById("users", auth.userId);
    if (!profile) {
      return createErrorResponseObj(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    const userRecord = profile as Record<string, unknown>;
    const orgId = userRecord.organization_id as string | undefined;

    const members = await getDocsByQuery(
      "organization_members",
      orgId ? [where("organization_id", "==", orgId)] : [where("user_id", "==", auth.userId)]
    );

    const enriched = await Promise.all(
      members.map(async (m) => {
        const mRecord = m as Record<string, unknown>;
        const user = await getDocById("users", mRecord.user_id as string);
        const userTyped = user as Record<string, unknown> | null;
        return {
          id: m.id,
          user_id: mRecord.user_id,
          role: mRecord.role,
          invited_at: mRecord.invited_at,
          accepted_at: mRecord.accepted_at,
          created_at: mRecord.created_at,
          name: userTyped?.name || null,
          email: userTyped?.email || null,
          avatar_url: userTyped?.avatar_url || null,
          status: userTyped?.status || "active",
        };
      })
    );

    return createResponse(enriched);
  } catch (error) {
    console.error("GET /api/team/members error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to fetch team members");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const profile = await getDocById("users", auth.userId);
    if (!profile) {
      return createErrorResponseObj(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    const userRecord = profile as Record<string, unknown>;
    const userRole = userRecord.role as string;
    if (userRole !== "owner" && userRole !== "admin") {
      return createErrorResponseObj(ErrorCode.FORBIDDEN, "Only owners and admins can invite members");
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { email, role } = body;
    if (!email || typeof email !== "string") {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "email is required");
    }

    const validRoles = ["admin", "member", "viewer"];
    const memberRole = validRoles.includes(role as string) ? role : "member";

    const existingUsers = await getDocsByQuery("users", [where("email", "==", email.toLowerCase().trim())]);
    if (existingUsers.length === 0) {
      return createErrorResponseObj(ErrorCode.NOT_FOUND, "No user found with that email address");
    }

    const targetUser = existingUsers[0] as Record<string, unknown>;
    const targetUserId = targetUser.id as string;

    if (targetUserId === auth.userId) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "You cannot invite yourself");
    }

    const orgId = userRecord.organization_id as string | undefined;
    const existingMembers = await getDocsByQuery(
      "organization_members",
      orgId
        ? [where("organization_id", "==", orgId), where("user_id", "==", targetUserId)]
        : [where("user_id", "==", targetUserId)]
    );

    if (existingMembers.length > 0) {
      return createErrorResponseObj(ErrorCode.CONFLICT, "User is already a team member");
    }

    const id = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memberData = {
      organization_id: orgId || null,
      user_id: targetUserId,
      role: memberRole,
      invited_by: auth.userId,
      invited_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
    };

    await createDoc("organization_members", id, memberData);

    return createResponse({ id, ...memberData }, "Member added", 201);
  } catch (error) {
    console.error("POST /api/team/members error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to add team member");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || "Unauthorized");
    }

    const profile = await getDocById("users", auth.userId);
    if (!profile) {
      return createErrorResponseObj(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    const userRecord = profile as Record<string, unknown>;
    const userRole = userRecord.role as string;
    if (userRole !== "owner" && userRole !== "admin") {
      return createErrorResponseObj(ErrorCode.FORBIDDEN, "Only owners and admins can remove members");
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");
    if (!memberId) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "id is required");
    }

    const member = await getDocById("organization_members", memberId);
    if (!member) {
      return createErrorResponseObj(ErrorCode.NOT_FOUND, "Member not found");
    }

    const memberRecord = member as Record<string, unknown>;
    if (memberRecord.user_id === auth.userId) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "You cannot remove yourself");
    }

    if (memberRecord.role === "owner") {
      return createErrorResponseObj(ErrorCode.FORBIDDEN, "Cannot remove the owner");
    }

    await deleteDocById("organization_members", memberId);

    return createResponse(null, "Member removed");
  } catch (error) {
    console.error("DELETE /api/team/members error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to remove team member");
  }
}
