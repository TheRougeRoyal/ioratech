import crypto from 'crypto';
import { getDb, nowIso } from '@/lib/sqlite';
import type {
  ApiKey,
  ApiKeyScope,
  ApiKeyUsageLog,
  HttpMethod,
  NotificationPreferences,
  User,
  UserRole,
  UserStatus,
} from '@/types/database';

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email_reports: true,
  risk_alerts: true,
  compliance_updates: true,
  product_updates: true,
  weekly_digest: true,
  security_alerts: true,
  preferred_channel: 'email',
};

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  job_title: string | null;
  bio: string | null;
  timezone: string | null;
  locale: string | null;
  role: UserRole;
  status: UserStatus;
  subscription_tier: User['subscription_tier'];
  email_verified: number;
  two_factor_enabled: number;
  onboarding_completed: number;
  notification_preferences: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  last_active_at: string | null;
  deleted_at: string | null;
}

interface ApiKeyRow {
  id: string;
  user_id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  key_hash: string;
  key_preview: string;
  scopes: string | null;
  allowed_ips: string | null;
  allowed_origins: string | null;
  rate_limit_per_minute: number;
  created_at: string;
  revoked_at: string | null;
  revoked_by: string | null;
  is_active: number;
  expires_at: string | null;
  last_used_at: string | null;
  last_used_ip: string | null;
  usage_count: number;
}

interface SessionIdentityRow {
  user_id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface SessionIdentity {
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

function toBoolean(value: number | null | undefined): boolean {
  return value === 1;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? undefined,
    avatar_url: row.avatar_url ?? undefined,
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    industry: row.industry ?? undefined,
    job_title: row.job_title ?? undefined,
    bio: row.bio ?? undefined,
    timezone: row.timezone ?? 'UTC',
    locale: row.locale ?? 'en-US',
    role: row.role,
    status: row.status,
    subscription_tier: row.subscription_tier,
    email_verified: toBoolean(row.email_verified),
    two_factor_enabled: toBoolean(row.two_factor_enabled),
    onboarding_completed: toBoolean(row.onboarding_completed),
    notification_preferences: parseJson<NotificationPreferences>(
      row.notification_preferences,
      DEFAULT_NOTIFICATION_PREFERENCES
    ),
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_sign_in_at: row.last_sign_in_at ?? undefined,
    last_active_at: row.last_active_at ?? undefined,
    deleted_at: row.deleted_at ?? undefined,
  };
}

function mapApiKeyRow(row: ApiKeyRow): ApiKey {
  return {
    id: row.id,
    user_id: row.user_id,
    organization_id: row.organization_id ?? undefined,
    name: row.name,
    description: row.description ?? undefined,
    key_hash: row.key_hash,
    key_preview: row.key_preview,
    scopes: parseJson<ApiKeyScope[]>(row.scopes, ['read']),
    allowed_ips: parseJson<string[] | undefined>(row.allowed_ips, undefined),
    allowed_origins: parseJson<string[] | undefined>(row.allowed_origins, undefined),
    rate_limit_per_minute: row.rate_limit_per_minute,
    created_at: row.created_at,
    revoked_at: row.revoked_at ?? undefined,
    revoked_by: row.revoked_by ?? undefined,
    is_active: toBoolean(row.is_active),
    expires_at: row.expires_at ?? undefined,
    last_used_at: row.last_used_at ?? undefined,
    last_used_ip: row.last_used_ip ?? undefined,
    usage_count: row.usage_count,
  };
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1')
    .get(email) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return {
    ...mapUserRow(row),
    password_hash: row.password_hash,
  };
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(userId) as UserRow | undefined;
  return row ? mapUserRow(row) : null;
}

export async function createUserAccount(params: {
  email: string;
  passwordHash: string;
  name?: string;
  company?: string;
  job_title?: string;
}): Promise<User> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = nowIso();
  const normalizedEmail = params.email.trim().toLowerCase();

  db.prepare(`
    INSERT INTO users (
      id, email, password_hash, name, company, job_title,
      role, status, subscription_tier, email_verified, two_factor_enabled, onboarding_completed,
      notification_preferences, created_at, updated_at
    ) VALUES (
      @id, @email, @password_hash, @name, @company, @job_title,
      'member', 'active', 'free', 0, 0, 0,
      @notification_preferences, @created_at, @updated_at
    )
  `).run({
    id,
    email: normalizedEmail,
    password_hash: params.passwordHash,
    name: params.name?.trim() || null,
    company: params.company?.trim() || null,
    job_title: params.job_title?.trim() || null,
    notification_preferences: JSON.stringify(DEFAULT_NOTIFICATION_PREFERENCES),
    created_at: now,
    updated_at: now,
  });

  const createdUser = await getUserProfile(id);
  if (!createdUser) {
    throw new Error('Failed to create user account');
  }

  return createdUser;
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  const db = getDb();
  const allowedColumns = new Set<keyof User>([
    'name',
    'avatar_url',
    'phone',
    'company',
    'industry',
    'job_title',
    'bio',
    'timezone',
    'locale',
    'role',
    'status',
    'subscription_tier',
    'email_verified',
    'two_factor_enabled',
    'onboarding_completed',
    'notification_preferences',
    'last_sign_in_at',
    'last_active_at',
    'deleted_at',
  ]);

  const setClauses: string[] = [];
  const parameters: Record<string, unknown> = { id: userId };

  for (const [rawKey, value] of Object.entries(updates)) {
    const key = rawKey as keyof User;
    if (!allowedColumns.has(key) || value === undefined) {
      continue;
    }

    setClauses.push(`${key} = @${key}`);
    if (key === 'notification_preferences') {
      parameters[key] = JSON.stringify(value);
    } else if (
      key === 'email_verified' ||
      key === 'two_factor_enabled' ||
      key === 'onboarding_completed'
    ) {
      parameters[key] = value ? 1 : 0;
    } else {
      parameters[key] = value ?? null;
    }
  }

  if (setClauses.length === 0) {
    const existingUser = await getUserProfile(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return existingUser;
  }

  parameters.updated_at = nowIso();
  setClauses.push('updated_at = @updated_at');

  db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id = @id`).run(parameters);

  const updated = await getUserProfile(userId);
  if (!updated) {
    throw new Error('User not found');
  }
  return updated;
}

export async function updateUserLastSignIn(userId: string): Promise<void> {
  const db = getDb();
  const now = nowIso();
  db.prepare(`
    UPDATE users
    SET last_sign_in_at = ?, updated_at = ?
    WHERE id = ?
  `).run(now, now, userId);
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE users
    SET password_hash = ?, updated_at = ?
    WHERE id = ?
  `).run(passwordHash, now, userId);
}

export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM api_keys
      WHERE user_id = ? AND is_active = 1
      ORDER BY created_at DESC
    `)
    .all(userId) as ApiKeyRow[];

  return rows.map(mapApiKeyRow);
}

export async function getApiKeyForUser(keyId: string, userId: string): Promise<ApiKey | null> {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM api_keys WHERE id = ? AND user_id = ? LIMIT 1')
    .get(keyId, userId) as ApiKeyRow | undefined;
  return row ? mapApiKeyRow(row) : null;
}

export async function createApiKey(
  userId: string,
  name: string,
  keyHash: string,
  keyPreview: string,
  expiresAt?: string,
  extras?: {
    description?: string;
    scopes?: ApiKeyScope[];
    allowed_ips?: string[];
    allowed_origins?: string[];
    rate_limit_per_minute?: number;
    organization_id?: string;
  }
): Promise<ApiKey> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = nowIso();

  db.prepare(`
    INSERT INTO api_keys (
      id, user_id, organization_id, name, description, key_hash, key_preview, scopes,
      allowed_ips, allowed_origins, rate_limit_per_minute, created_at, is_active, expires_at, usage_count
    ) VALUES (
      @id, @user_id, @organization_id, @name, @description, @key_hash, @key_preview, @scopes,
      @allowed_ips, @allowed_origins, @rate_limit_per_minute, @created_at, 1, @expires_at, 0
    )
  `).run({
    id,
    user_id: userId,
    organization_id: extras?.organization_id || null,
    name,
    description: extras?.description || null,
    key_hash: keyHash,
    key_preview: keyPreview,
    scopes: JSON.stringify(extras?.scopes || ['read']),
    allowed_ips: extras?.allowed_ips ? JSON.stringify(extras.allowed_ips) : null,
    allowed_origins: extras?.allowed_origins ? JSON.stringify(extras.allowed_origins) : null,
    rate_limit_per_minute: extras?.rate_limit_per_minute || 60,
    created_at: now,
    expires_at: expiresAt || null,
  });

  const row = db.prepare('SELECT * FROM api_keys WHERE id = ? LIMIT 1').get(id) as ApiKeyRow | undefined;
  if (!row) {
    throw new Error('Failed to create API key');
  }

  return mapApiKeyRow(row);
}

export async function revokeApiKey(keyId: string, userId: string): Promise<ApiKey> {
  const db = getDb();
  const now = nowIso();

  db.prepare(`
    UPDATE api_keys
    SET is_active = 0, revoked_at = ?, revoked_by = ?
    WHERE id = ? AND user_id = ?
  `).run(now, userId, keyId, userId);

  const row = db.prepare('SELECT * FROM api_keys WHERE id = ? LIMIT 1').get(keyId) as ApiKeyRow | undefined;
  if (!row) {
    throw new Error('API key not found');
  }

  return mapApiKeyRow(row);
}

export async function findApiKeyByHash(keyHash: string): Promise<ApiKey | null> {
  const db = getDb();
  const now = nowIso();

  const row = db
    .prepare(`
      SELECT * FROM api_keys
      WHERE key_hash = ?
        AND is_active = 1
        AND (expires_at IS NULL OR expires_at > ?)
      LIMIT 1
    `)
    .get(keyHash, now) as ApiKeyRow | undefined;

  return row ? mapApiKeyRow(row) : null;
}

export async function logApiKeyUsage(
  apiKeyId: string,
  userId: string,
  endpoint: string,
  method: HttpMethod,
  statusCode: number,
  ipAddress: string,
  extras?: {
    userAgent?: string;
    responseTimeMs?: number;
    organizationId?: string;
    requestBodySize?: number;
    responseBodySize?: number;
    errorMessage?: string;
  }
): Promise<void> {
  try {
    const db = getDb();
    const now = nowIso();

    db.prepare(`
      INSERT INTO api_key_usage_logs (
        id, api_key_id, user_id, organization_id, timestamp, endpoint, method, status_code,
        response_time_ms, ip_address, user_agent, request_body_size, response_body_size, error_message
      ) VALUES (
        @id, @api_key_id, @user_id, @organization_id, @timestamp, @endpoint, @method, @status_code,
        @response_time_ms, @ip_address, @user_agent, @request_body_size, @response_body_size, @error_message
      )
    `).run({
      id: crypto.randomUUID(),
      api_key_id: apiKeyId,
      user_id: userId,
      organization_id: extras?.organizationId || null,
      timestamp: now,
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: extras?.responseTimeMs ?? null,
      ip_address: ipAddress,
      user_agent: extras?.userAgent || null,
      request_body_size: extras?.requestBodySize ?? null,
      response_body_size: extras?.responseBodySize ?? null,
      error_message: extras?.errorMessage || null,
    });

    db.prepare(`
      UPDATE api_keys
      SET usage_count = usage_count + 1, last_used_at = ?, last_used_ip = ?
      WHERE id = ?
    `).run(now, ipAddress, apiKeyId);
  } catch (error) {
    console.error('Error logging API key usage:', error);
  }
}

export async function getApiKeyUsageStats(apiKeyId: string): Promise<ApiKeyUsageLog[]> {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM api_key_usage_logs
      WHERE api_key_id = ?
      ORDER BY timestamp DESC
      LIMIT 100
    `)
    .all(apiKeyId) as Array<{
      id: string;
      api_key_id: string;
      user_id: string;
      organization_id: string | null;
      timestamp: string;
      endpoint: string;
      method: HttpMethod;
      status_code: number;
      response_time_ms: number | null;
      ip_address: string;
      user_agent: string | null;
      request_body_size: number | null;
      response_body_size: number | null;
      error_message: string | null;
    }>;

  return rows.map((row) => ({
    id: row.id,
    api_key_id: row.api_key_id,
    user_id: row.user_id,
    organization_id: row.organization_id ?? undefined,
    timestamp: row.timestamp,
    endpoint: row.endpoint,
    method: row.method,
    status_code: row.status_code,
    response_time_ms: row.response_time_ms ?? undefined,
    ip_address: row.ip_address,
    user_agent: row.user_agent ?? undefined,
    request_body_size: row.request_body_size ?? undefined,
    response_body_size: row.response_body_size ?? undefined,
    error_message: row.error_message ?? undefined,
  }));
}

export async function getSessionIdentityByTokenHash(tokenHash: string): Promise<SessionIdentity | null> {
  const db = getDb();
  const now = nowIso();

  const row = db
    .prepare(`
      SELECT u.id AS user_id, u.email, u.role, u.status
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.revoked_at IS NULL
        AND s.expires_at > ?
      ORDER BY s.created_at DESC
      LIMIT 1
    `)
    .get(tokenHash, now) as SessionIdentityRow | undefined;

  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

export async function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: string,
  ipAddress?: string
): Promise<void> {
  const db = getDb();

  db.prepare(`
    INSERT INTO password_reset_tokens (
      id, user_id, token_hash, ip_address, expires_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    userId,
    tokenHash,
    ipAddress || null,
    expiresAt,
    nowIso()
  );
}

export async function consumePasswordResetToken(tokenHash: string): Promise<{ userId: string } | null> {
  const db = getDb();
  const now = nowIso();

  const row = db
    .prepare(`
      SELECT id, user_id
      FROM password_reset_tokens
      WHERE token_hash = ?
        AND used_at IS NULL
        AND expires_at > ?
      LIMIT 1
    `)
    .get(tokenHash, now) as { id: string; user_id: string } | undefined;

  if (!row) {
    return null;
  }

  db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(now, row.id);
  return { userId: row.user_id };
}
