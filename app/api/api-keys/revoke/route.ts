import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { revokeApiKey } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import { checkRateLimit } from '@/lib/rate-limit';
import type { ApiKeyRevokeRequest, ApiKeyRevokeResponse } from '@/types/api';

export async function DELETE(request: NextRequest) {
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
    const rateLimitKey = `api_key_revoke:${auth.userId}`;
    if (!checkRateLimit(rateLimitKey, 50, 3600000)) { // 50 per hour
      return createErrorResponseObj(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Too many API key revocation requests. Please try again later.'
      );
    }

    // Parse request body
    let body: ApiKeyRevokeRequest;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body'
      );
    }

    const { api_key_id } = body;

    if (!api_key_id) {
      return createErrorResponseObj(
        ErrorCode.INVALID_REQUEST,
        'API key ID is required'
      );
    }

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Check if the API key belongs to the user
    const { data: keyData, error: checkError } = await client
      .from('api_keys')
      .select('*')
      .eq('id', api_key_id)
      .eq('user_id', auth.userId)
      .single();

    if (checkError || !keyData) {
      return createErrorResponseObj(
        ErrorCode.API_KEY_NOT_FOUND,
        'API key not found'
      );
    }

    if (!keyData.is_active) {
      return createErrorResponseObj(
        ErrorCode.API_KEY_REVOKED,
        'API key is already revoked'
      );
    }

    // Revoke the API key
    const revokedKey = await revokeApiKey(client, api_key_id, auth.userId);

    const responseData: ApiKeyRevokeResponse = {
      success: true,
      message: 'API key revoked successfully',
    };

    return createResponse(responseData, 'API key revoked successfully');
  } catch (error) {
    console.error('API key revoke endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'Failed to revoke API key'
    );
  }
}

export async function POST(request: NextRequest) {
  // Also support POST for revoke (for clients that can't send DELETE)
  return DELETE(request);
}
