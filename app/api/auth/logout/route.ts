import { NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';
import { getClientIp } from '@/lib/rate-limit';
import { createAuditLog, revokeUserSession } from '@/lib/audit';
import { hashApiKey } from '@/lib/api-key-utils';

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

    // Sign out from Supabase
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return createErrorResponseObj(
        ErrorCode.INTERNAL_ERROR,
        'Failed to logout'
      );
    }

    // Revoke session record
    const adminClient = getSupabaseAdmin();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const tokenHash = token ? hashApiKey(token) : undefined;
    revokeUserSession(adminClient, auth.userId, tokenHash);

    // Audit log
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog(adminClient, {
      userId: auth.userId,
      action: 'logout',
      ipAddress: clientIp,
      userAgent,
    });

    // Create response
    const response = createResponse(
      { message: 'Logged out successfully' },
      'Logged out successfully'
    );

    // Clear auth cookie
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
