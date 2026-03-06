// Database type definitions for Supabase

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_preview: string; // First 4 and last 4 characters
  created_at: string;
  revoked_at?: string;
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  usage_count: number;
}

export interface ApiKeyUsageLog {
  id: string;
  api_key_id: string;
  user_id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status_code: number;
  ip_address: string;
}

export interface RateLimitEntry {
  user_id: string;
  api_key_id?: string;
  request_count: number;
  window_start: string;
  window_end: string;
}
