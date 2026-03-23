import crypto from 'crypto';
import { getDb, nowIso } from '@/lib/mongodb';
import type { AuditAction, LoginAttempt, UserSession } from '@/types/database';

// ──────────────────────────────────────────────
// Audit Logging
// ──────────────────────────────────────────────

/**
 * Write an audit log entry. Fire-and-forget — never fails the parent request.
 */
export async function createAuditLog(
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
    const db = getDb();
    await db.collection('audit_logs').insertOne({
      _id: crypto.randomUUID(),
      user_id: params.userId,
      organization_id: params.organizationId || null,
      action: params.action,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      metadata: params.metadata || {},
      ip_address: params.ipAddress,
      user_agent: params.userAgent || null,
      timestamp: nowIso(),
    });
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
    const db = getDb();
    await db.collection('login_attempts').insertOne({
      _id: crypto.randomUUID(),
      email: params.email.toLowerCase(),
      user_id: params.userId || null,
      ip_address: params.ipAddress,
      user_agent: params.userAgent || null,
      success: params.success,
      failure_reason: params.failureReason || null,
      timestamp: nowIso(),
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
  email: string,
  ipAddress: string,
  windowMinutes: number = 15,
  maxAttempts: number = 10
): Promise<boolean> {
  try {
    const db = getDb();
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
    const count = await db.collection('login_attempts').countDocuments({
      success: false,
      timestamp: { $gte: windowStart },
      $or: [{ email: email.toLowerCase() }, { ip_address: ipAddress }],
    });

    return count >= maxAttempts;
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
  params: {
    userId: string;
    tokenHash: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: string;
  }
): Promise<void> {
  try {
    const db = getDb();
    const now = nowIso();

    await db.collection('user_sessions').updateMany(
      { user_id: params.userId, is_current: true, revoked_at: null },
      { $set: { is_current: false } }
    );

    await db.collection('user_sessions').insertOne({
      _id: crypto.randomUUID(),
      user_id: params.userId,
      token_hash: params.tokenHash,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      device_label: parseDeviceLabel(params.userAgent),
      is_current: true,
      created_at: now,
      expires_at: params.expiresAt,
      last_active_at: now,
      revoked_at: null,
    });
  } catch (err) {
    console.error('Failed to create user session:', err);
  }
}

/**
 * Revoke a user session (e.g. on logout).
 */
export async function revokeUserSession(
  userId: string,
  tokenHash?: string
): Promise<void> {
  try {
    const db = getDb();
    const now = nowIso();

    if (tokenHash) {
      await db.collection('user_sessions').updateOne(
        { user_id: userId, token_hash: tokenHash, revoked_at: null },
        { $set: { is_current: false, revoked_at: now } }
      );
      return;
    }

    await db.collection('user_sessions').updateMany(
      { user_id: userId, is_current: true, revoked_at: null },
      { $set: { is_current: false, revoked_at: now } }
    );
  } catch (err) {
    console.error('Failed to revoke user session:', err);
  }
}

/**
 * Get all active sessions for a user (for "active sessions" management page).
 */
export async function getUserSessions(
  userId: string
): Promise<UserSession[]> {
  try {
    const db = getDb();
    const now = nowIso();
    const rows = await db
      .collection('user_sessions')
      .find({
        user_id: userId,
        revoked_at: null,
        expires_at: { $gte: now },
      })
      .sort({ created_at: -1 })
      .toArray();

    return rows.map((row) => ({
      id: row._id as string,
      user_id: row.user_id as string,
      token_hash: row.token_hash as string,
      ip_address: row.ip_address as string,
      user_agent: row.user_agent as string,
      device_label: (row.device_label as string | null) ?? undefined,
      is_current: (row.is_current as boolean) ?? false,
      created_at: row.created_at as string,
      expires_at: row.expires_at as string,
      last_active_at: row.last_active_at as string,
      revoked_at: (row.revoked_at as string | null) ?? undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch user sessions:', err);
    return [];
  }
}

/**
 * Update last_active_at on the user table (call on meaningful actions).
 */
export async function touchUserActivity(
  userId: string
): Promise<void> {
  try {
    const db = getDb();
    const now = nowIso();
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { last_active_at: now, updated_at: now } }
    );
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

  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Postman')) return 'Postman';
  if (ua.includes('curl')) return 'cURL';

  return 'Unknown device';
}
