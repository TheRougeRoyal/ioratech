import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseAdmin, getUserProfile } from '@/lib/supabase';
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
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5');

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

    // Validate input
    if (!email || !password) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Email and password are required'
      );
    }

    if (!isValidEmail(email)) {
      return createErrorResponseObj(
        ErrorCode.INVALID_EMAIL,
        'Invalid email address'
      );
    }

    // Initialize Supabase clients
    const client = getSupabaseClient();
    const adminClient = getSupabaseAdmin();

    // Check brute-force throttle (based on stored login attempts)
    const throttled = await isLoginThrottled(adminClient, email, clientIp);
    if (throttled) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many failed login attempts. Please try again later.'
      );
    }

    // Sign in user
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth login error:', authError);

      // Record failed login attempt (fire-and-forget)
      recordLoginAttempt(adminClient, {
        email,
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

    if (!authData.user || !authData.session) {
      return createErrorResponseObj(
        ErrorCode.INVALID_CREDENTIALS,
        'Login failed'
      );
    }

    // Get user profile
    const userProfile = await getUserProfile(client, authData.user.id);

    // Check if account is suspended or deactivated
    if (userProfile?.status === 'suspended' || userProfile?.status === 'deactivated') {
      recordLoginAttempt(adminClient, {
        email,
        userId: authData.user.id,
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
    recordLoginAttempt(adminClient, {
      email,
      userId: authData.user.id,
      ipAddress: clientIp,
      userAgent,
      success: true,
    });

    // Create user session record
    const tokenHash = hashApiKey(authData.session.access_token);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
    createUserSession(adminClient, {
      userId: authData.user.id,
      tokenHash,
      ipAddress: clientIp,
      userAgent,
      expiresAt,
    });

    // Audit log
    createAuditLog(adminClient, {
      userId: authData.user.id,
      action: 'login',
      ipAddress: clientIp,
      userAgent,
    });

    // Update last_sign_in_at
    adminClient
      .from('users')
      .update({ last_sign_in_at: new Date().toISOString() })
      .eq('id', authData.user.id)
      .then(() => {});

    // Return success response
    const responseData: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: userProfile?.name || undefined,
        role: userProfile?.role || 'member',
        status: userProfile?.status || 'active',
        subscription_tier: userProfile?.subscription_tier || 'free',
      },
      token: authData.session.access_token,
    };

    // Set secure session cookie
    const response = createResponse(responseData, 'Login successful');
    response.headers.set(
      'Set-Cookie',
      `auth_token=${authData.session.access_token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
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
