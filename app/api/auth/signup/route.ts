import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { createDoc, getDocsByQuery } from "@/lib/firestore";
import { where } from "firebase/firestore";
import { SignUpSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Invalid request body");
    }

    const { uid, ...input } = body;
    if (!uid) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "uid is required");
    }

    const validation = SignUpSchema.safeParse(input);
    if (!validation.success) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, validation.error.issues[0]?.message || "Invalid input");
    }

    const { email, name, company, job_title } = validation.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await getDocsByQuery("users", [where("email", "==", normalizedEmail)]);
    if (existing.length > 0) {
      return createResponse({ message: "User profile already exists" }, "User exists");
    }

    await createDoc("users", uid, {
      email: normalizedEmail,
      name: name || null,
      avatar_url: null,
      phone: null,
      company: company || null,
      industry: null,
      job_title: job_title || null,
      bio: null,
      timezone: "UTC",
      locale: "en-US",
      role: "member",
      status: "active",
      subscription_tier: "free",
      email_verified: false,
      onboarding_completed: false,
      notification_preferences: {
        email_reports: true,
        risk_alerts: true,
        compliance_updates: true,
        product_updates: true,
        weekly_digest: true,
        security_alerts: true,
        preferred_channel: "email",
      },
      last_sign_in_at: null,
      last_active_at: null,
      deleted_at: null,
    });

    return createResponse({ uid, email: normalizedEmail }, "User profile created", 201);
  } catch (error) {
    console.error("Signup error:", error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "Failed to create user profile");
  }
}
