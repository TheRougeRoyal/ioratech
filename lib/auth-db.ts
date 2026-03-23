import crypto from 'crypto';
import { getDb, nowIso } from '@/lib/mongodb';
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

export interface SessionIdentity {
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserWithPassword extends User {
  password_hash: string;
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

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const db = getDb();
  const row = await db.collection('users').findOne({ email: email.toLowerCase() });

  if (!row) {
    return null;
  }

  return mapUserRow(row, true) as UserWithPassword;
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const db = getDb();
  const row = await db.collection('users').findOne({ _id: userId });
  return row ? mapUserRow(row, false) : null;
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

  const doc = {
    _id: id,
    email: normalizedEmail,
    password_hash: params.passwordHash,
    name: params.name?.trim() || null,
    avatar_url: null,
    phone: null,
    company: params.company?.trim() || null,
    industry: null,
    job_title: params.job_title?.trim() || null,
    bio: null,
    timezone: 'UTC',
    locale: 'en-US',
    role: 'member' as UserRole,
    status: 'active' as UserStatus,
    subscription_tier: 'free' as const,
    email_verified: false,
    two_factor_enabled: false,
    onboarding_completed: false,
    notification_preferences: DEFAULT_NOTIFICATION_PREFERENCES,
    created_at: now,
    updated_at: now,
    last_sign_in_at: null,
    last_active_at: null,
    deleted_at: null,
  };

  await db.collection('users').insertOne(doc);

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

  const setDoc: Record<string, unknown> = {};

  for (const [rawKey, value] of Object.entries(updates)) {
    const key = rawKey as keyof User;
    if (!allowedColumns.has(key) || value === undefined) {
      continue;
    }

    if (key === 'notification_preferences') {
      setDoc[key] = value;
    } else {
      setDoc[key] = value;
    }
  }

  if (Object.keys(setDoc).length === 0) {
    const existingUser = await getUserProfile(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return existingUser;
  }

  setDoc.updated_at = nowIso();

  await db.collection('users').updateOne({ _id: userId }, { $set: setDoc });

  const updated = await getUserProfile(userId);
  if (!updated) {
    throw new Error('User not found');
  }
  return updated;
}

export async function updateUserLastSignIn(userId: string): Promise<void> {
  const db = getDb();
  const now = nowIso();
  await db.collection('users').updateOne(
    { _id: userId },
    { $set: { last_sign_in_at: now, updated_at: now } }
  );
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  const db = getDb();
  const now = nowIso();
  await db.collection('users').updateOne(
    { _id: userId },
    { $set: { password_hash: passwordHash, updated_at: now } }
  );
}

export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const db = getDb();
  const rows = await db
    .collection('api_keys')
    .find({ user_id: userId, is_active: true })
    .sort({ created_at: -1 })
    .toArray();

  return rows.map((row) => mapApiKeyRow(row));
}

export async function getApiKeyForUser(keyId: string, userId: string): Promise<ApiKey | null> {
  const db = getDb();
  const row = await db.collection('api_keys').findOne({ _id: keyId, user_id: userId });
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

  const doc = {
    _id: id,
    user_id: userId,
    organization_id: extras?.organization_id || null,
    name,
    description: extras?.description || null,
    key_hash: keyHash,
    key_preview: keyPreview,
    scopes: extras?.scopes || ['read'],
    allowed_ips: extras?.allowed_ips || null,
    allowed_origins: extras?.allowed_origins || null,
    rate_limit_per_minute: extras?.rate_limit_per_minute || 60,
    created_at: now,
    revoked_at: null,
    revoked_by: null,
    is_active: true,
    expires_at: expiresAt || null,
    last_used_at: null,
    last_used_ip: null,
    usage_count: 0,
  };

  await db.collection('api_keys').insertOne(doc);

  const row = await db.collection('api_keys').findOne({ _id: id });
  if (!row) {
    throw new Error('Failed to create API key');
  }

  return mapApiKeyRow(row);
}

export async function revokeApiKey(keyId: string, userId: string): Promise<ApiKey> {
  const db = getDb();
  const now = nowIso();

  await db.collection('api_keys').updateOne(
    { _id: keyId, user_id: userId },
    { $set: { is_active: false, revoked_at: now, revoked_by: userId } }
  );

  const row = await db.collection('api_keys').findOne({ _id: keyId });
  if (!row) {
    throw new Error('API key not found');
  }

  return mapApiKeyRow(row);
}

export async function findApiKeyByHash(keyHash: string): Promise<ApiKey | null> {
  const db = getDb();
  const now = nowIso();

  const row = await db.collection('api_keys').findOne({
    key_hash: keyHash,
    is_active: true,
    $or: [
      { expires_at: null },
      { expires_at: { $gt: now } },
    ],
  });

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

    await db.collection('api_key_usage_logs').insertOne({
      _id: crypto.randomUUID(),
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

    await db.collection('api_keys').updateOne(
      { _id: apiKeyId },
      {
        $inc: { usage_count: 1 },
        $set: { last_used_at: now, last_used_ip: ipAddress },
      }
    );
  } catch (error) {
    console.error('Error logging API key usage:', error);
  }
}

export async function getApiKeyUsageStats(apiKeyId: string): Promise<ApiKeyUsageLog[]> {
  const db = getDb();
  const rows = await db
    .collection('api_key_usage_logs')
    .find({ api_key_id: apiKeyId })
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();

  return rows.map((row) => ({
    id: row._id,
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

  const session = await db.collection('user_sessions').findOne({
    token_hash: tokenHash,
    revoked_at: null,
    expires_at: { $gt: now },
  });

  if (!session) {
    return null;
  }

  const user = await db.collection('users').findOne({ _id: session.user_id });
  if (!user) {
    return null;
  }

  return {
    userId: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: string,
  ipAddress?: string
): Promise<void> {
  const db = getDb();

  await db.collection('password_reset_tokens').insertOne({
    _id: crypto.randomUUID(),
    user_id: userId,
    token_hash: tokenHash,
    ip_address: ipAddress || null,
    expires_at: expiresAt,
    created_at: nowIso(),
    used_at: null,
  });
}

export async function consumePasswordResetToken(tokenHash: string): Promise<{ userId: string } | null> {
  const db = getDb();
  const now = nowIso();

  const row = await db.collection('password_reset_tokens').findOne({
    token_hash: tokenHash,
    used_at: null,
    expires_at: { $gt: now },
  });

  if (!row) {
    return null;
  }

  await db.collection('password_reset_tokens').updateOne(
    { _id: row._id },
    { $set: { used_at: now } }
  );

  return { userId: row.user_id };
}

// ──────────────────────────────────────────────
// Internal row mappers
// ──────────────────────────────────────────────

function mapUserRow(
  row: Record<string, unknown>,
  includePassword: boolean
): User | UserWithPassword {
  const user: User = {
    id: row._id as string,
    email: row.email as string,
    name: (row.name as string | null) ?? undefined,
    avatar_url: (row.avatar_url as string | null) ?? undefined,
    phone: (row.phone as string | null) ?? undefined,
    company: (row.company as string | null) ?? undefined,
    industry: (row.industry as string | null) ?? undefined,
    job_title: (row.job_title as string | null) ?? undefined,
    bio: (row.bio as string | null) ?? undefined,
    timezone: (row.timezone as string) ?? 'UTC',
    locale: (row.locale as string) ?? 'en-US',
    role: row.role as UserRole,
    status: row.status as UserStatus,
    subscription_tier: row.subscription_tier as User['subscription_tier'],
    email_verified: (row.email_verified as boolean) ?? false,
    two_factor_enabled: (row.two_factor_enabled as boolean) ?? false,
    onboarding_completed: (row.onboarding_completed as boolean) ?? false,
    notification_preferences:
      (row.notification_preferences as NotificationPreferences) ?? DEFAULT_NOTIFICATION_PREFERENCES,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    last_sign_in_at: (row.last_sign_in_at as string | null) ?? undefined,
    last_active_at: (row.last_active_at as string | null) ?? undefined,
    deleted_at: (row.deleted_at as string | null) ?? undefined,
  };

  if (includePassword) {
    return { ...user, password_hash: row.password_hash as string };
  }
  return user;
}

function mapApiKeyRow(row: Record<string, unknown>): ApiKey {
  return {
    id: row._id as string,
    user_id: row.user_id as string,
    organization_id: (row.organization_id as string | null) ?? undefined,
    name: row.name as string,
    description: (row.description as string | null) ?? undefined,
    key_hash: row.key_hash as string,
    key_preview: row.key_preview as string,
    scopes: (row.scopes as ApiKeyScope[]) ?? ['read'],
    allowed_ips: (row.allowed_ips as string[] | null | undefined) ?? undefined,
    allowed_origins: (row.allowed_origins as string[] | null | undefined) ?? undefined,
    rate_limit_per_minute: (row.rate_limit_per_minute as number) ?? 60,
    created_at: row.created_at as string,
    revoked_at: (row.revoked_at as string | null) ?? undefined,
    revoked_by: (row.revoked_by as string | null) ?? undefined,
    is_active: (row.is_active as boolean) ?? false,
    expires_at: (row.expires_at as string | null) ?? undefined,
    last_used_at: (row.last_used_at as string | null) ?? undefined,
    last_used_ip: (row.last_used_ip as string | null) ?? undefined,
    usage_count: (row.usage_count as number) ?? 0,
  };
}
