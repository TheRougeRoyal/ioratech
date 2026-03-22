import { NextRequest } from 'next/server';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import { getClientIp } from '@/lib/rate-limit';
import { createAuditLog, revokeUserSession } from '@/lib/audit';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/api-key-utils';

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return request.cookies.get('auth_token')?.value?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(
        ErrorCode.UNAUTHORIZED,
        'Unauthorized'
      );
    }

    const token = extractToken(request);
    const tokenHash = token && !isValidApiKeyFormat(token) ? hashApiKey(token) : undefined;

    // Revoke current token session (or all current sessions when token is missing)
    revokeUserSession(auth.userId, tokenHash);

    // Audit log
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog({
      userId: auth.userId,
      action: 'logout',
      ipAddress: clientIp,
      userAgent,
    });

    const response = createResponse(
      { message: 'Logged out successfully' },
      'Logged out successfully'
    );

    response.headers.set(
      'Set-Cookie',
      'auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
    );

    return response;
  } catch (error) {
    console.error('Logout endpoint error:', error);
    return createErrorResponseObj(
      ErrorCode.INTERNAL_ERROR,
      'An unexpected error occurred'
    );
  }
}
