import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/api-key-utils';
import { findApiKeyByHash, logApiKeyUsage } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';
import type { ApiKeyValidateRequest, ApiKeyValidateResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    let body: ApiKeyValidateRequest;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { api_key } = body;

    if (!api_key) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'API key is required'
      );
    }

    // Basic format validation
    if (!isValidApiKeyFormat(api_key)) {
      const responseData: ApiKeyValidateResponse = {
        success: true,
        valid: false,
        message: 'Invalid API key format',
      };
      return createResponse(responseData, 'API key validation result');
    }

    // Get admin client
    const adminClient = getSupabaseAdmin();

    // Hash and look up API key
    const keyHash = hashApiKey(api_key);
    const apiKeyRecord = await findApiKeyByHash(adminClient, keyHash);

    if (!apiKeyRecord) {
      // Log failed attempt
      const clientIp = getClientIp(request.headers);
      const rateLimitKey = `api_validate_fail:${clientIp}`;

      const responseData: ApiKeyValidateResponse = {
        success: true,
        valid: false,
        message: 'Invalid API key',
      };
      return createResponse(responseData, 'API key validation result');
    }

    // Rate limit by user
    const rateLimitKey = `api_usage:${apiKeyRecord.user_id}`;
    const rateLimit = parseInt(process.env.RATE_LIMIT_API_PER_MINUTE || '60');

    if (!checkRateLimit(rateLimitKey, rateLimit, 60000)) {
      // Log the attempt but return rate limited
      await logApiKeyUsage(
        adminClient,
        apiKeyRecord.id,
        apiKeyRecord.user_id,
        '/api/api-keys/validate',
        'POST',
        429,
        getClientIp(request.headers),
        {
          userAgent: request.headers.get('user-agent') || undefined,
          responseTimeMs: Date.now() - startTime,
        }
      );

      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'User rate limit exceeded'
      );
    }

    // Log successful validation
    await logApiKeyUsage(
      adminClient,
      apiKeyRecord.id,
      apiKeyRecord.user_id,
      '/api/api-keys/validate',
      'POST',
      200,
      getClientIp(request.headers),
      {
        userAgent: request.headers.get('user-agent') || undefined,
        responseTimeMs: Date.now() - startTime,
      }
    );

    const responseData: ApiKeyValidateResponse = {
      success: true,
      valid: true,
      user_id: apiKeyRecord.user_id,
      api_key_id: apiKeyRecord.id,
      message: 'API key is valid',
    };

    return createResponse(responseData, 'API key is valid');
  } catch (error) {
    console.error('API key validate endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'Validation failed'
    );
  }
}

/**
 * GET endpoint also supports validation (useful for simple checks)
 * Usage: GET /api/api-keys/validate?key=sk_xxxxx
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('key');

    if (!apiKey) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'API key is required'
      );
    }

    // Create a request body and use POST handler
    const body = JSON.stringify({ api_key: apiKey });
    const newRequest = new NextRequest(request, { body });
    return POST(newRequest);
  } catch (error) {
    console.error('API key validate GET endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'Validation failed'
    );
  }
}
