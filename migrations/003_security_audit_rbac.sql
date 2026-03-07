-- Migration 003: Enhanced security, audit logging, RBAC, and organization support
-- This migration adds new columns and tables for:
--   • User roles, status, subscription tiers
--   • Organizations & team members
--   • API key scopes, IP/origin restrictions
--   • Audit logs, login attempts, user sessions
--   • Enhanced notification preferences

-- ──────────────────────────────────────────────
-- 1. Extend users table with RBAC & status
-- ──────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US',
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'pending_verification', 'deactivated')),
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update default notification_preferences to include new keys
-- (existing rows keep their current value; new rows get the full default)
ALTER TABLE public.users
  ALTER COLUMN notification_preferences SET DEFAULT '{
    "email_reports": true,
    "risk_alerts": true,
    "compliance_updates": true,
    "product_updates": true,
    "weekly_digest": true,
    "security_alerts": true,
    "preferred_channel": "email"
  }'::jsonb;

-- ──────────────────────────────────────────────
-- 2. Organizations & team membership
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members can view their organization" ON public.organizations;
CREATE POLICY "Org members can view their organization"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Org owners can update organization" ON public.organizations;
CREATE POLICY "Org owners can update organization"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Members can view org membership" ON public.organization_members;
CREATE POLICY "Members can view org membership"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

-- ──────────────────────────────────────────────
-- 3. Enhanced API keys — scopes, restrictions
-- ──────────────────────────────────────────────

ALTER TABLE public.api_keys
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS scopes TEXT[] DEFAULT ARRAY['read'],
  ADD COLUMN IF NOT EXISTS allowed_ips TEXT[],
  ADD COLUMN IF NOT EXISTS allowed_origins TEXT[],
  ADD COLUMN IF NOT EXISTS rate_limit_per_minute INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS revoked_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS last_used_ip TEXT;

-- Enhanced usage logs
ALTER TABLE public.api_key_usage_logs
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS request_body_size INTEGER,
  ADD COLUMN IF NOT EXISTS response_body_size INTEGER,
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- ──────────────────────────────────────────────
-- 4. Audit logs
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- 5. Login attempts (brute-force protection)
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT
    CHECK (failure_reason IS NULL OR failure_reason IN ('invalid_password', 'account_locked', 'account_suspended', 'mfa_failed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_timestamp ON public.login_attempts(timestamp);

-- No RLS needed — accessed only via service role from API routes.
-- Keep RLS enabled but add a permissive service-role-only policy.
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────
-- 6. User sessions
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL DEFAULT '',
  device_label TEXT,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can revoke own sessions" ON public.user_sessions;
CREATE POLICY "Users can revoke own sessions"
  ON public.user_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- 7. Auto-update triggers for new tables
-- ──────────────────────────────────────────────

-- organizations.updated_at trigger
DROP TRIGGER IF EXISTS update_organizations_updated_at_trigger ON public.organizations;
CREATE TRIGGER update_organizations_updated_at_trigger
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at(); -- reuses existing function

-- ──────────────────────────────────────────────
-- 8. Cleanup function for expired sessions (run periodically via cron)
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.user_sessions
  WHERE expires_at < NOW() - INTERVAL '7 days';

  DELETE FROM public.login_attempts
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
