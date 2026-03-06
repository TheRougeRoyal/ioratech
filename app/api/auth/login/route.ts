import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getUserProfile } from '@/lib/supabase';
import { isValidEmail } from '@/lib/api-key-utils';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import type { LoginRequest, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
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

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Sign in user
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth login error:', authError);
      // Don't reveal if email exists or password is wrong for security
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

    // Return success response
    const responseData: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: userProfile?.name || undefined,
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
