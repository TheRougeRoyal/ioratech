import { NextRequest } from 'next/server';
import { getUserByEmail, updateUserLastSignIn } from '@/lib/auth-db';
import { verifyPassword, generateSecureToken } from '@/lib/auth-security';
import { isValidEmail, hashApiKey } from '@/lib/api-key-utils';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAuditLog, recordLoginAttempt, isLoginThrottled, createUserSession } from '@/lib/audit';
import type { LoginRequest, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';

    // Rate limiting
    const rateLimitKey = `login:${clientIp}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5', 10);

    if (!checkRateLimit(rateLimitKey, rateLimit, 60000)) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many login attempts. Please try again later.'
      );
    }

    // Parse request body
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Email and password are required'
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return createErrorResponseObj(
        ErrorCode.INVALID_EMAIL,
        'Invalid email address'
      );
    }

    // Check brute-force throttle (stored login attempts)
    const throttled = await isLoginThrottled(normalizedEmail, clientIp);
    if (throttled) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many failed login attempts. Please try again later.'
      );
    }

    // Fetch user account
    const user = await getUserByEmail(normalizedEmail);
    if (!user || !verifyPassword(password, user.password_hash)) {
      recordLoginAttempt({
        email: normalizedEmail,
        ipAddress: clientIp,
        userAgent,
        success: false,
        failureReason: 'invalid_password',
      });

      return createErrorResponseObj(
        ErrorCode.INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }

    if (user.status === 'suspended' || user.status === 'deactivated') {
      recordLoginAttempt({
        email: normalizedEmail,
        userId: user.id,
        ipAddress: clientIp,
        userAgent,
        success: false,
        failureReason: 'account_suspended',
      });

      return createErrorResponseObj(
        ErrorCode.FORBIDDEN,
        'Your account has been suspended. Please contact support.'
      );
    }

    // Record successful login attempt
    recordLoginAttempt({
      email: normalizedEmail,
      userId: user.id,
      ipAddress: clientIp,
      userAgent,
      success: true,
    });

    // Create SQL-backed session token
    const sessionTtlSeconds = parseInt(process.env.SESSION_TTL_SECONDS || '3600', 10);
    const token = generateSecureToken(48);
    const tokenHash = hashApiKey(token);
    const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000).toISOString();

    createUserSession({
      userId: user.id,
      tokenHash,
      ipAddress: clientIp,
      userAgent,
      expiresAt,
    });

    // Audit log + last sign-in update
    createAuditLog({
      userId: user.id,
      action: 'login',
      ipAddress: clientIp,
      userAgent,
    });
    updateUserLastSignIn(user.id);

    const responseData: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role || 'member',
        status: user.status || 'active',
        subscription_tier: user.subscription_tier || 'free',
      },
      token,
    };

    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const response = createResponse(responseData, 'Login successful');
    response.headers.set(
      'Set-Cookie',
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionTtlSeconds}${secureFlag}`
    );

    return response;
  } catch (error) {
    console.error('Login endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}
