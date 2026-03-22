// Database type definitions for SQL-backed auth/data

// ──────────────────────────────────────────────
// Enums & Literal Types
// ──────────────────────────────────────────────

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type ApiKeyScope = 'read' | 'write' | 'admin' | 'full_access';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuditAction =
  | 'login'
  | 'logout'
  | 'password_change'
  | 'password_reset_request'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'profile_updated'
  | 'settings_updated'
  | 'report_generated'
  | 'data_exported'
  | 'user_invited'
  | 'role_changed';

// ──────────────────────────────────────────────
// Core User
// ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  company?: string;
  industry?: string;
  job_title?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
  role: UserRole;
  status: UserStatus;
  subscription_tier: SubscriptionTier;
  email_verified: boolean;
  two_factor_enabled: boolean;
  onboarding_completed: boolean;
  notification_preferences?: NotificationPreferences;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  last_active_at?: string;
  deleted_at?: string;
}

export interface NotificationPreferences {
  email_reports: boolean;
  risk_alerts: boolean;
  compliance_updates: boolean;
  product_updates: boolean;
  weekly_digest: boolean;
  security_alerts: boolean;
  preferred_channel: 'email' | 'in_app' | 'both';
}

// ──────────────────────────────────────────────
// Organization / Team Support
// ──────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  owner_id: string;
  subscription_tier: SubscriptionTier;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  invited_by?: string;
  invited_at?: string;
  accepted_at?: string;
  created_at: string;
}

// ──────────────────────────────────────────────
// API Keys — with scopes & rate limit tiers
// ──────────────────────────────────────────────

export interface ApiKey {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  description?: string;
  key_hash: string;
  key_preview: string; // First 4 and last 4 characters
  scopes: ApiKeyScope[];
  allowed_ips?: string[];
  allowed_origins?: string[];
  rate_limit_per_minute: number;
  created_at: string;
  revoked_at?: string;
  revoked_by?: string;
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  last_used_ip?: string;
  usage_count: number;
}

export interface ApiKeyUsageLog {
  id: string;
  api_key_id: string;
  user_id: string;
  organization_id?: string;
  timestamp: string;
  endpoint: string;
  method: HttpMethod;
  status_code: number;
  response_time_ms?: number;
  ip_address: string;
  user_agent?: string;
  request_body_size?: number;
  response_body_size?: number;
  error_message?: string;
}

export interface RateLimitEntry {
  user_id: string;
  api_key_id?: string;
  request_count: number;
  window_start: string;
  window_end: string;
  limit: number;
  is_throttled: boolean;
}

// ──────────────────────────────────────────────
// Security & Audit
// ──────────────────────────────────────────────

export interface AuditLog {
  id: string;
  user_id: string;
  organization_id?: string;
  action: AuditAction;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  ip_address: string;
  user_agent?: string;
  timestamp: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  token_hash: string;
  ip_address: string;
  user_agent: string;
  device_label?: string;
  is_current: boolean;
  created_at: string;
  expires_at: string;
  last_active_at: string;
  revoked_at?: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: 'invalid_password' | 'account_locked' | 'account_suspended' | 'mfa_failed';
  timestamp: string;
}

// ──────────────────────────────────────────────
// Utility types for create/update operations
// ──────────────────────────────────────────────

export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_sign_in_at' | 'last_active_at' | 'deleted_at'>;
export type UpdateUser = Partial<Omit<User, 'id' | 'email' | 'created_at'>>;
export type CreateApiKey = Omit<ApiKey, 'id' | 'key_hash' | 'key_preview' | 'created_at' | 'revoked_at' | 'revoked_by' | 'last_used_at' | 'last_used_ip' | 'usage_count'>;
export type CreateOrganization = Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
