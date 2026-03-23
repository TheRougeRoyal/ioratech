import { NextRequest } from 'next/server';
import { consumePasswordResetToken, createPasswordResetToken, getUserByEmail, updateUserPassword } from '@/lib/auth-db';
import { generateSecureToken, hashPassword } from '@/lib/auth-security';
import { hashApiKey, isValidEmail, validatePassword } from '@/lib/api-key-utils';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAuditLog, revokeUserSession } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'request' or 'reset'

    if (type === 'reset') {
      return handlePasswordReset(request);
    }

    return handlePasswordResetRequest(request);
  } catch (error) {
    console.error('Password reset endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}

async function handlePasswordResetRequest(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const rateLimitKey = `reset_request:${clientIp}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5', 10);

    if (!(await checkRateLimit(rateLimitKey, rateLimit, 60000))) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many password reset requests. Please try again later.'
      );
    }

    let body: { email: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Email is required'
      );
    }

    if (!isValidEmail(email)) {
      return createErrorResponseObj(
        ErrorCode.INVALID_EMAIL,
        'Invalid email address'
      );
    }

    const user = await getUserByEmail(email);
    let devResetToken: string | undefined;

    if (user) {
      const resetToken = generateSecureToken(32);
      const tokenHash = hashApiKey(resetToken);
      const ttlMinutes = parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || '30', 10);
      const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

      await createPasswordResetToken(user.id, tokenHash, expiresAt, clientIp);

      createAuditLog({
        userId: user.id,
        action: 'password_reset_request',
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent') || '',
      });

      // Local development convenience when no mailer is configured.
      if (process.env.NODE_ENV !== 'production') {
        devResetToken = resetToken;
      }
    }

    const responsePayload: Record<string, unknown> = {
      message: 'If an account exists with this email, you will receive a password reset link.',
    };

    if (devResetToken) {
      responsePayload.reset_token = devResetToken;
      responsePayload.note = 'Development mode only: use reset_token with ?type=reset.';
    }

    return createResponse(
      responsePayload,
      'Password reset email sent'
    );
  } catch (error) {
    console.error('Password reset request handler error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}

async function handlePasswordReset(request: NextRequest) {
  try {
    let body: { token: string; password: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { token, password } = body;

    if (!token || !password) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Token and new password are required'
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return createErrorResponseObj(
        ErrorCode.INVALID_PASSWORD,
        'Password does not meet requirements',
        { errors: passwordValidation.errors }
      );
    }

    const tokenHash = hashApiKey(token);
    const tokenRecord = await consumePasswordResetToken(tokenHash);
    if (!tokenRecord) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid or expired reset token'
      );
    }

    await updateUserPassword(tokenRecord.userId, hashPassword(password));
    await revokeUserSession(tokenRecord.userId);

    createAuditLog({
      userId: tokenRecord.userId,
      action: 'password_change',
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get('user-agent') || '',
      metadata: { event: 'password_reset' },
    });

    return createResponse(
      { message: 'Password reset successfully' },
      'Password reset successfully'
    );
  } catch (error) {
    console.error('Password reset handler error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}
