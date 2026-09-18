import { NextRequest } from "next/server";
import { createResponse, ErrorCode, createErrorResponseObj } from "@/lib/api-response";
import { updateDocById } from "@/lib/firestore";
import { detectAnomalousLogin, logLoginAttempt } from "@/lib/anomaly-detection";
import { createAuditLog } from "@/lib/audit-logger";
import { logger } from "@/lib/logger";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  let email = "unknown";
  let ipAddress = getClientIp(request);

  try {
    const body = await request.json();
    email = body.email;
    const password = body.password;

    if (!email || !password) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, "Email and password are required");
    }

    // 1. Anomaly Detection
    const anomaly = await detectAnomalousLogin(email, ipAddress);
    if (anomaly.suspicious) {
      logger.warn({ email, ipAddress, reason: anomaly.reason }, 'Suspicious login attempt detected');
      // ponytail: alert email would go here. Just log for now.
    }

    // 2. Authentication
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 3. Audit Logging & Success Tracking
    await logLoginAttempt(uid, ipAddress, true);
    await updateDocById("users", uid, {
      last_sign_in_at: new Date().toISOString(),
    });

    await createAuditLog({
      action: 'USER_LOGIN',
      actor: uid,
      resource: 'auth',
      resourceId: uid,
      result: 'success',
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return createResponse({ message: "Login successful", uid }, "Login successful");

  } catch (error: any) {
    // 4. Log failure
    const uid = email !== "unknown" ? email : "unknown";
    await logLoginAttempt(uid, ipAddress, false);

    await createAuditLog({
      action: 'USER_LOGIN',
      actor: uid,
      resource: 'auth',
      resourceId: uid,
      result: 'failure',
      errorMessage: error.message,
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    logger.error({ error, ipAddress, email }, 'Login failed');

    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, "Invalid credentials");
    }

    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred");
  }
}
