import { NextRequest } from 'next/server';
import { createUserAccount, getUserByEmail } from '@/lib/auth-db';
import { hashPassword } from '@/lib/auth-security';
import { validatePassword, isValidEmail, sanitizeInput } from '@/lib/api-key-utils';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit';
import type { SignUpRequest, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitKey = `signup:${clientIp}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_AUTH_PER_MINUTE || '5', 10);

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

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return createErrorResponseObj(
        ErrorCode.INVALID_EMAIL,
        'Invalid email address'
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

    // Check if user already exists
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return createErrorResponseObj(
        ErrorCode.USER_EXISTS,
        'A user with this email already exists'
      );
    }

    // Create account in SQL database
    const createdUser = await createUserAccount({
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      name: name ? sanitizeInput(name) : undefined,
      company: company ? sanitizeInput(company) : undefined,
      job_title: job_title ? sanitizeInput(job_title) : undefined,
    });

    // Audit log for signup
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog({
      userId: createdUser.id,
      action: 'login',
      ipAddress: clientIp,
      userAgent,
      metadata: { event: 'signup' },
    });

    const responseData: AuthResponse = {
      success: true,
      message: 'Signup successful. You can now log in.',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name || undefined,
      },
    };

    return createResponse(responseData, 'Signup successful', 201);
  } catch (error: any) {
    console.error('Signup endpoint error:', error);

    if (typeof error?.message === 'string' && error.message.toLowerCase().includes('unique')) {
      return createErrorResponseObj(
        ErrorCode.USER_EXISTS,
        'A user with this email already exists'
      );
    }

    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}
