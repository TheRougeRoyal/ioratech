import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase';
import { validatePassword, isValidEmail, sanitizeInput } from '@/lib/api-key-utils';
import { createUserProfile } from '@/lib/supabase';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit';
import type { SignUpRequest, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitKey = `signup:${clientIp}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5');

    if (!checkRateLimit(rateLimitKey, rateLimit, 60000)) {
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many signup attempts. Please try again later.'
      );
    }

    // Parse request body
    let body: SignUpRequest;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    // Validate input
    const { email, password, name, company, job_title } = body;

    if (!email || !password) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Email and password are required'
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return createErrorResponseObj(
        ErrorCode.INVALID_EMAIL,
        'Invalid email address'
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

    // Check if user already exists
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return createErrorResponseObj(
        ErrorCode.USER_EXISTS,
        'A user with this email already exists'
      );
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: sanitizeInput(name || ''),
        },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return createErrorResponseObj(
        ErrorCode.INTERNAL_ERROR,
        authError.message || 'Failed to create user'
      );
    }

    if (!authData.user) {
      return createErrorResponseObj(
        ErrorCode.INTERNAL_ERROR,
        'User creation failed'
      );
    }

    // Create user profile in public.users table
    try {
      await createUserProfile(
        client,
        authData.user.id,
        email,
        sanitizeInput(name || ''),
        {
          company: company ? sanitizeInput(company) : undefined,
          job_title: job_title ? sanitizeInput(job_title) : undefined,
        }
      );
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the signup if profile creation fails, but log it
      // The profile can be created later
    }

    // Audit log for signup
    const adminClient = getSupabaseAdmin();
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog(adminClient, {
      userId: authData.user.id,
      action: 'login', // Treat initial signup as first "login" event
      ipAddress: clientIp,
      userAgent,
      metadata: { event: 'signup' },
    });

    // Return success response
    const responseData: AuthResponse = {
      success: true,
      message: 'Signup successful. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: name || undefined,
      },
    };

    return createResponse(responseData, 'Signup successful', 201);
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}
