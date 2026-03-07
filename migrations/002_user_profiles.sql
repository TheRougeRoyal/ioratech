-- Migration: Extend users table with profile settings fields
-- This adds profile-specific columns so each user account stores their settings

-- Add profile columns to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "email_reports": true,
    "risk_alerts": true,
    "compliance_updates": true,
    "product_updates": true
  }'::jsonb;

-- Allow users to insert their own profile (needed for signup flow)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
