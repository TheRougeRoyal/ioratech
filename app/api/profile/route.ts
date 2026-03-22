import { NextRequest } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/lib/auth-db';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';
import { getClientIp } from '@/lib/rate-limit';
import { requireAuth } from '@/lib/auth-middleware';
import type { User } from '@/types/database';

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile — Fetch the authenticated user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || 'Unauthorized');
    }

    const profile = await getUserProfile(auth.userId);
    if (!profile) {
      return createErrorResponseObj(ErrorCode.USER_NOT_FOUND, 'User profile not found');
    }

    return createResponse(profile);
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, 'Failed to fetch profile');
  }
}

/**
 * PUT /api/profile — Update the authenticated user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated || !auth.userId) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, auth.error || 'Unauthorized');
    }

    let body: Partial<User>;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, 'Invalid request body');
    }

    const allowedFields = [
      'name',
      'avatar_url',
      'phone',
      'company',
      'industry',
      'job_title',
      'bio',
      'timezone',
      'locale',
      'notification_preferences',
      'onboarding_completed',
    ] as const;

    const sanitized: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        sanitized[field] = body[field];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, 'No valid fields to update');
    }

    if (sanitized.notification_preferences) {
      const prefs = sanitized.notification_preferences as Record<string, unknown>;
      const validKeys = [
        'email_reports',
        'risk_alerts',
        'compliance_updates',
        'product_updates',
        'weekly_digest',
        'security_alerts',
        'preferred_channel',
      ];

      for (const key of Object.keys(prefs)) {
        if (!validKeys.includes(key)) {
          return createErrorResponseObj(
            ErrorCode.INVALID_REQUEST,
            `Invalid notification_preferences key: "${key}"`
          );
        }

        if (key === 'preferred_channel') {
          if (!['email', 'in_app', 'both'].includes(prefs[key] as string)) {
            return createErrorResponseObj(
              ErrorCode.INVALID_REQUEST,
              `preferred_channel must be 'email', 'in_app', or 'both'`
            );
          }
        } else if (typeof prefs[key] !== 'boolean') {
          return createErrorResponseObj(
            ErrorCode.INVALID_REQUEST,
            `Invalid notification_preferences: "${key}" must be a boolean`
          );
        }
      }
    }

    const updatedProfile = await updateUserProfile(auth.userId, sanitized as Partial<User>);

    // Audit log (fire-and-forget)
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog({
      userId: auth.userId,
      action: 'profile_updated',
      ipAddress: clientIp,
      userAgent,
      resourceType: 'user',
      resourceId: auth.userId,
      metadata: { updated_fields: Object.keys(sanitized) },
    });

    return createResponse(updatedProfile);
  } catch (error) {
    console.error('PUT /api/profile error:', error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, 'Failed to update profile');
  }
}
