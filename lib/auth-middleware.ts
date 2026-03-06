import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseAdmin, getCurrentUser } from '@/lib/supabase';
import { verifyToken, hashApiKey, isValidApiKeyFormat } from '@/lib/api-key-utils';
import { findApiKeyByHash } from '@/lib/supabase';
import { createErrorResponseObj, ErrorCode } from '@/lib/api-response';

export interface AuthenticatedRequest extends NextRequest {
  user_id?: string;
  api_key_id?: string;
  email?: string;
}

/**
 * Check if request has valid Supabase session
 */
export async function checkSupabaseAuth(request: NextRequest): Promise<{ userId: string | null; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, error: 'Missing authorization header' };
    }

    const token = authHeader.substring(7);
    const { valid, userId, error } = verifyToken(token);

    if (!valid) {
      return { userId: null, error: error || 'Invalid token' };
    }

    return { userId: userId || null };
  } catch (error) {
    console.error('Auth check error:', error);
    return { userId: null, error: 'Authentication failed' };
  }
}

/**
 * Check if request has valid API key
 */
export async function checkApiKeyAuth(request: NextRequest): Promise<{
  userId: string | null;
  apiKeyId: string | null;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, apiKeyId: null, error: 'Missing authorization header' };
    }

    const apiKey = authHeader.substring(7);

    if (!isValidApiKeyFormat(apiKey)) {
      return { userId: null, apiKeyId: null, error: 'Invalid API key format' };
    }

    // Hash the API key and look it up
    const keyHash = hashApiKey(apiKey);
    const adminClient = getSupabaseAdmin();
    const apiKeyRecord = await findApiKeyByHash(adminClient, keyHash);

    if (!apiKeyRecord) {
      return { userId: null, apiKeyId: null, error: 'Invalid API key' };
    }

    if (!apiKeyRecord.is_active) {
      return { userId: null, apiKeyId: null, error: 'API key revoked' };
    }

    if (apiKeyRecord.expires_at) {
      const expiryDate = new Date(apiKeyRecord.expires_at);
      if (expiryDate < new Date()) {
        return { userId: null, apiKeyId: null, error: 'API key expired' };
      }
    }

    return { userId: apiKeyRecord.user_id, apiKeyId: apiKeyRecord.id };
  } catch (error) {
    console.error('API key auth error:', error);
    return { userId: null, apiKeyId: null, error: 'API key authentication failed' };
  }
}

/**
 * Middleware to require authentication (token or API key)
 */
export async function requireAuth(request: NextRequest) {
  try {
    // Try API key first
    const apiKeyAuth = await checkApiKeyAuth(request);
    if (apiKeyAuth.userId) {
      return {
        authenticated: true,
        userId: apiKeyAuth.userId,
        apiKeyId: apiKeyAuth.apiKeyId,
        type: 'apiKey' as const,
      };
    }

    // Fall back to token
    const tokenAuth = await checkSupabaseAuth(request);
    if (tokenAuth.userId) {
      return {
        authenticated: true,
        userId: tokenAuth.userId,
        apiKeyId: null,
        type: 'token' as const,
      };
    }

    return {
      authenticated: false,
      userId: null,
      apiKeyId: null,
      error: apiKeyAuth.error || tokenAuth.error || 'Unauthorized',
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      authenticated: false,
      userId: null,
      apiKeyId: null,
      error: 'Authentication failed',
    };
  }
}

/**
 * Wrap an API route handler with authentication requirement
 */
export function withAuth(handler: (req: NextRequest, context: any) => Promise<Response>) {
  return async (req: NextRequest, context: any) => {
    const auth = await requireAuth(req);

    if (!auth.authenticated) {
      return createErrorResponseObj(
        ErrorCode.UNAUTHORIZED,
        auth.error || 'Unauthorized',
      );
    }

    // Add auth data to request for use in handler
    (req as any).userId = auth.userId;
    (req as any).apiKeyId = auth.apiKeyId;
    (req as any).authType = auth.type;

    return handler(req, context);
  };
}

/**
 * Middleware for optional authentication (continues if no auth, but sets user_id if verified)
 */
export async function optionalAuth(request: NextRequest) {
  try {
    // Try API key first
    const apiKeyAuth = await checkApiKeyAuth(request);
    if (apiKeyAuth.userId) {
      return {
        authenticated: true,
        userId: apiKeyAuth.userId,
        apiKeyId: apiKeyAuth.apiKeyId,
        type: 'apiKey' as const,
      };
    }

    // Fall back to token
    const tokenAuth = await checkSupabaseAuth(request);
    if (tokenAuth.userId) {
      return {
        authenticated: true,
        userId: tokenAuth.userId,
        apiKeyId: null,
        type: 'token' as const,
      };
    }

    return {
      authenticated: false,
      userId: null,
      apiKeyId: null,
    };
  } catch (error) {
    console.error('Optional auth error:', error);
    return {
      authenticated: false,
      userId: null,
      apiKeyId: null,
    };
  }
}
