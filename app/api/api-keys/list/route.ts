import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { getUserApiKeys } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import type { ApiKeyListResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);

    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(
        ErrorCode.UNAUTHORIZED,
        'Unauthorized'
      );
    }

    // Initialize Supabase client
    const client = getSupabaseClient();

    // Fetch user's API keys
    const apiKeys = await getUserApiKeys(client, auth.userId);

    // Map to response format (don't expose full hash)
    const responseKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      key_preview: key.key_preview,
      created_at: key.created_at,
      last_used_at: key.last_used_at,
      is_active: key.is_active,
      usage_count: key.usage_count,
      expires_at: key.expires_at,
    }));

    const responseData: ApiKeyListResponse = {
      success: true,
      api_keys: responseKeys,
    };

    return createResponse(responseData, 'API keys retrieved successfully');
  } catch (error) {
    console.error('API key list endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'Failed to retrieve API keys'
    );
  }
}
