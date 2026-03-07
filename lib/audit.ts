import { SupabaseClient } from '@supabase/supabase-js';
import type { AuditAction, AuditLog, LoginAttempt, UserSession } from '@/types/database';
import { hashApiKey } from '@/lib/api-key-utils';

// ──────────────────────────────────────────────
// Audit Logging
// ──────────────────────────────────────────────

/**
 * Write an audit log entry. Fire-and-forget — never fails the parent request.
 */
export async function createAuditLog(
  client: SupabaseClient,
  params: {
    userId: string;
    action: AuditAction;
    ipAddress: string;
    userAgent?: string;
    organizationId?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    const { error } = await client.from('audit_logs').insert({
      user_id: params.userId,
      action: params.action,
      ip_address: params.ipAddress,
      user_agent: params.userAgent || null,
      organization_id: params.organizationId || null,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      metadata: params.metadata || {},
    });

    if (error) {
      console.error('Failed to write audit log:', error);
    }
  } catch (err) {
    // Audit logging must never break the caller
    console.error('Audit log error:', err);
  }
}

// ──────────────────────────────────────────────
// Login Attempt tracking (brute-force protection)
// ──────────────────────────────────────────────

/**
 * Record a login attempt (success or failure).
 */
export async function recordLoginAttempt(
  client: SupabaseClient,
  params: {
    email: string;
    userId?: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: LoginAttempt['failure_reason'];
  }
): Promise<void> {
  try {
    await client.from('login_attempts').insert({
      email: params.email,
      user_id: params.userId || null,
      ip_address: params.ipAddress,
      user_agent: params.userAgent || null,
      success: params.success,
      failure_reason: params.failureReason || null,
    });
  } catch (err) {
    console.error('Failed to record login attempt:', err);
  }
}

/**
 * Check if an IP or email has too many recent failed attempts.
 * Returns true if the account/IP should be temporarily locked.
 */
export async function isLoginThrottled(
  client: SupabaseClient,
  email: string,
  ipAddress: string,
  windowMinutes: number = 15,
  maxAttempts: number = 10
): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { count, error } = await client
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .or(`email.eq.${email},ip_address.eq.${ipAddress}`)
      .eq('success', false)
      .gte('timestamp', windowStart);

    if (error) {
      console.error('Login throttle check error:', error);
      return false; // Fail open — don't lock users out because of a query error
    }

    return (count ?? 0) >= maxAttempts;
  } catch (err) {
    console.error('Login throttle error:', err);
    return false;
  }
}

// ──────────────────────────────────────────────
// User Session management
// ──────────────────────────────────────────────

/**
 * Create a user session record when a user logs in.
 */
export async function createUserSession(
  client: SupabaseClient,
  params: {
    userId: string;
    tokenHash: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: string;
  }
): Promise<void> {
  try {
    // Mark all other sessions as not current
    await client
      .from('user_sessions')
      .update({ is_current: false })
      .eq('user_id', params.userId)
      .eq('is_current', true);

    // Insert new session
    await client.from('user_sessions').insert({
      user_id: params.userId,
      token_hash: params.tokenHash,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      device_label: parseDeviceLabel(params.userAgent),
      is_current: true,
      expires_at: params.expiresAt,
      last_active_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to create user session:', err);
  }
}

/**
 * Revoke a user session (e.g. on logout).
 */
export async function revokeUserSession(
  client: SupabaseClient,
  userId: string,
  tokenHash?: string
): Promise<void> {
  try {
    const query = client
      .from('user_sessions')
      .update({
        is_current: false,
        revoked_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (tokenHash) {
      query.eq('token_hash', tokenHash);
    } else {
      // Revoke all sessions for this user
      query.eq('is_current', true);
    }

    await query;
  } catch (err) {
    console.error('Failed to revoke user session:', err);
  }
}

/**
 * Get all active sessions for a user (for "active sessions" management page).
 */
export async function getUserSessions(
  client: SupabaseClient,
  userId: string
): Promise<UserSession[]> {
  try {
    const { data, error } = await client
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('revoked_at', null)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as UserSession[];
  } catch (err) {
    console.error('Failed to fetch user sessions:', err);
    return [];
  }
}

/**
 * Update last_active_at on the user table (call on meaningful actions).
 */
export async function touchUserActivity(
  client: SupabaseClient,
  userId: string
): Promise<void> {
  try {
    await client
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (err) {
    console.error('Failed to touch user activity:', err);
  }
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/**
 * Derive a human-readable device label from User-Agent.
 */
function parseDeviceLabel(ua: string): string {
  if (!ua) return 'Unknown device';

  // Simple heuristic — production apps should use a proper UA parser
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Postman')) return 'Postman';
  if (ua.includes('curl')) return 'cURL';

  return 'Unknown device';
}
