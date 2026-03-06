import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { isValidEmail, validatePassword } from '@/lib/api-key-utils';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'request' or 'reset'

    if (type === 'reset') {
      // Reset password with new password
      return handlePasswordReset(request);
    } else {
      // Request password reset (send email)
      return handlePasswordResetRequest(request);
    }
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
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitKey = `reset_request:${clientIp}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5');

    if (!checkRateLimit(rateLimitKey, rateLimit, 60000)) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many password reset requests. Please try again later.'
      );
    }

    // Parse request body
    let body: { email: string };
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { email } = body;

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

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Request password reset - Supabase will send email
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/confirm`,
    });

    if (error) {
      console.error('Password reset request error:', error);
      // Don't reveal if email exists for security
      return createResponse(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        'Password reset email sent'
      );
    }

    return createResponse(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
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
    // Parse request body
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

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return createErrorResponseObj(
        ErrorCode.INVALID_PASSWORD,
        'Password does not meet requirements',
        { errors: passwordValidation.errors }
      );
    }

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Update password with token
    const { error } = await client.auth.updateUser({
      password
    });

    if (error) {
      console.error('Password reset error:', error);
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid or expired reset token'
      );
    }

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
