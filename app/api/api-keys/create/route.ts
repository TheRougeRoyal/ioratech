import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { generateApiKey, hashApiKey, createApiKeyPreview, sanitizeInput } from '@/lib/api-key-utils';
import { createApiKey } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import type { ApiKeyCreateRequest, ApiKeyCreateResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);

    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(
        ErrorCode.UNAUTHORIZED,
        'Unauthorized'
      );
    }

    // Rate limiting
    const rateLimitKey = `api_key_create:${auth.userId}`;
    if (!checkRateLimit(rateLimitKey, 30, 3600000)) { // 30 per hour
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many API key creation requests. Please try again later.'
      );
    }

    // Parse request body
    let body: ApiKeyCreateRequest;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { name, expires_in_days } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'API key name is required'
      );
    }

    const sanitizedName = sanitizeInput(name);

    // Validate expiration if provided
    let expiresAt: string | undefined;
    if (expires_in_days) {
      if (expires_in_days < 1 || expires_in_days > 365) {
        return createErrorResponseObj(
          ErrorCode.INVALID_REQUEST,
          'Expiration must be between 1 and 365 days'
        );
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expires_in_days);
      expiresAt = expiryDate.toISOString();
    }

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Generate new API key
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const keyPreview = createApiKeyPreview(apiKey);

    // Store in database
    const createdKey = await createApiKey(
      client,
      auth.userId,
      sanitizedName,
      keyHash,
      keyPreview,
      expiresAt
    );

    // Return the full key only on creation (never again)
    const responseData: ApiKeyCreateResponse = {
      success: true,
      data: {
        api_key: {
          id: createdKey.id,
          name: createdKey.name,
          key: apiKey, // Full key - shown only once
          key_preview: createdKey.key_preview,
          created_at: createdKey.created_at,
          expires_at: createdKey.expires_at,
        },
      },
    };

    return createResponse(responseData, 'API key created successfully', 201);
  } catch (error) {
    console.error('API key create endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'Failed to create API key'
    );
  }
}
