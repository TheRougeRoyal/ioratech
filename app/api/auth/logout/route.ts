import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { createResponse, ErrorCode, createErrorResponseObj } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);

    if (!auth.authenticated) {
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
