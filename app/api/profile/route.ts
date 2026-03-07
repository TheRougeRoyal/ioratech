import { NextRequest } from 'next/server';
import { getSupabaseClient, getUserProfile, updateUserProfile } from '@/lib/supabase';
import { createErrorResponseObj, createResponse, ErrorCode } from '@/lib/api-response';
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
        notification_preferences: {
          email_reports: true,
          risk_alerts: true,
          compliance_updates: true,
          product_updates: true,
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
      'notification_preferences',
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
      const validKeys = ['email_reports', 'risk_alerts', 'compliance_updates', 'product_updates'];
      for (const key of Object.keys(prefs)) {
        if (!validKeys.includes(key) || typeof prefs[key] !== 'boolean') {
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

    return createResponse(updatedProfile);
  } catch (error) {
    console.error('PUT /api/profile error:', error);
    return createErrorResponseObj(ErrorCode.INTERNAL_ERROR, 'Failed to update profile');
  }
}
