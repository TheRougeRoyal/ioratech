import { NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdmin, getUserProfile, updateUserProfile } from '@/lib/supabase';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';
import { getClientIp } from '@/lib/rate-limit';
import type { User } from '@/types/database';

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile — Fetch the authenticated user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();

    // Get session from cookie/header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, 'Missing authorization header');
    }

    const token = authHeader.substring(7);

    // Verify and get user via Supabase
    const { data: { user }, error: authError } = await client.auth.getUser(token);

    if (authError || !user) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, 'Invalid or expired session');
    }

    // Fetch profile from users table
    const profile = await getUserProfile(client, user.id);

    if (!profile) {
      // Profile doesn't exist yet — return basic info from auth
      return createResponse({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        avatar_url: null,
        phone: null,
        company: null,
        industry: null,
        job_title: null,
        bio: null,
        timezone: 'UTC',
        locale: 'en-US',
        role: 'member',
        status: 'active',
        subscription_tier: 'free',
        email_verified: false,
        two_factor_enabled: false,
        onboarding_completed: false,
        notification_preferences: {
          email_reports: true,
          risk_alerts: true,
          compliance_updates: true,
          product_updates: true,
          weekly_digest: true,
          security_alerts: true,
          preferred_channel: 'email',
        },
        created_at: user.created_at,
        updated_at: user.created_at,
      });
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
    const client = getSupabaseClient();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, 'Missing authorization header');
    }

    const token = authHeader.substring(7);

    const { data: { user }, error: authError } = await client.auth.getUser(token);

    if (authError || !user) {
      return createErrorResponseObj(ErrorCode.UNAUTHORIZED, 'Invalid or expired session');
    }

    // Parse update body
    let body: Partial<User>;
    try {
      body = await request.json();
    } catch {
      return createErrorResponseObj(ErrorCode.INVALID_REQUEST, 'Invalid request body');
    }

    // Whitelist allowed fields for update (prevent overwriting id, email, etc.)
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

    // Validate notification_preferences shape if provided
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

    // Check if profile row exists; if not, create it first
    const existing = await getUserProfile(client, user.id);
    let updatedProfile: User;

    if (!existing) {
      // Upsert — create profile with the provided fields
      const { data, error } = await client
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          ...sanitized,
        })
        .select()
        .single();

      if (error) throw error;
      updatedProfile = data as User;
    } else {
      updatedProfile = await updateUserProfile(client, user.id, sanitized as Partial<User>);
    }

    // Audit log for profile update (fire-and-forget)
    const adminClient = getSupabaseAdmin();
    const clientIp = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') || '';
    createAuditLog(adminClient, {
      userId: user.id,
      action: 'profile_updated',
      ipAddress: clientIp,
      userAgent,
      resourceType: 'user',
      resourceId: user.id,
      metadata: { updated_fields: Object.keys(sanitized) },
    });

    return createResponse(updatedProfile);
  } catch (error) {
    console.error('PUT /api/profile error:', error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, 'Failed to update profile');
  }
}
