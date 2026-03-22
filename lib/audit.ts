import crypto from 'crypto';
import { getDb, nowIso } from '@/lib/sqlite';
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
    db.prepare(`
      INSERT INTO audit_logs (
        id, user_id, organization_id, action, resource_type, resource_id, metadata, ip_address, user_agent, timestamp
      ) VALUES (
        @id, @user_id, @organization_id, @action, @resource_type, @resource_id, @metadata, @ip_address, @user_agent, @timestamp
      )
    `).run({
      id: crypto.randomUUID(),
      user_id: params.userId,
      organization_id: params.organizationId || null,
      action: params.action,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      metadata: JSON.stringify(params.metadata || {}),
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
    db.prepare(`
      INSERT INTO login_attempts (
        id, email, user_id, ip_address, user_agent, success, failure_reason, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      params.email.toLowerCase(),
      params.userId || null,
      params.ipAddress,
      params.userAgent || null,
      params.success ? 1 : 0,
      params.failureReason || null,
      nowIso()
    );
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
    const row = db.prepare(`
      SELECT COUNT(1) AS count
      FROM login_attempts
      WHERE success = 0
        AND timestamp >= ?
        AND (email = ? OR ip_address = ?)
    `).get(windowStart, email.toLowerCase(), ipAddress) as { count?: number } | undefined;

    return (row?.count ?? 0) >= maxAttempts;
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

    db.prepare(`
      UPDATE user_sessions
      SET is_current = 0
      WHERE user_id = ? AND is_current = 1 AND revoked_at IS NULL
    `).run(params.userId);

    db.prepare(`
      INSERT INTO user_sessions (
        id, user_id, token_hash, ip_address, user_agent, device_label,
        is_current, created_at, expires_at, last_active_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      params.userId,
      params.tokenHash,
      params.ipAddress,
      params.userAgent,
      parseDeviceLabel(params.userAgent),
      now,
      params.expiresAt,
      now
    );
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
      db.prepare(`
        UPDATE user_sessions
        SET is_current = 0, revoked_at = ?
        WHERE user_id = ? AND token_hash = ? AND revoked_at IS NULL
      `).run(now, userId, tokenHash);
      return;
    }

    db.prepare(`
      UPDATE user_sessions
      SET is_current = 0, revoked_at = ?
      WHERE user_id = ? AND is_current = 1 AND revoked_at IS NULL
    `).run(now, userId);
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
    const rows = db.prepare(`
      SELECT * FROM user_sessions
      WHERE user_id = ?
        AND revoked_at IS NULL
        AND expires_at >= ?
      ORDER BY created_at DESC
    `).all(userId, now) as Array<{
      id: string;
      user_id: string;
      token_hash: string;
      ip_address: string;
      user_agent: string;
      device_label: string | null;
      is_current: number;
      created_at: string;
      expires_at: string;
      last_active_at: string;
      revoked_at: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      token_hash: row.token_hash,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      device_label: row.device_label ?? undefined,
      is_current: row.is_current === 1,
      created_at: row.created_at,
      expires_at: row.expires_at,
      last_active_at: row.last_active_at,
      revoked_at: row.revoked_at ?? undefined,
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
    db.prepare(`
      UPDATE users
      SET last_active_at = ?, updated_at = ?
      WHERE id = ?
    `).run(now, now, userId);
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
