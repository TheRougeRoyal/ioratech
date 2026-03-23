import { NextRequest } from 'next/server';
import { getApiKeyForUser, revokeApiKey } from '@/lib/auth-db';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit';
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
    if (!(await checkRateLimit(rateLimitKey, 50, 3600000))) { // 50 per hour
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

    // Check if the API key belongs to the user
    const keyData = await getApiKeyForUser(api_key_id, auth.userId);
    if (!keyData) {
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
    await revokeApiKey(api_key_id, auth.userId);

    // Audit log
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog({
      userId: auth.userId,
      action: 'api_key_revoked',
      ipAddress: clientIp,
      userAgent,
      resourceType: 'api_key',
      resourceId: api_key_id,
      metadata: { key_name: keyData.name },
    });

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
