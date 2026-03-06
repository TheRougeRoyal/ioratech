import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User, ApiKey, ApiKeyUsageLog } from '@/types/database';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create Supabase client (singleton pattern)
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

/**
 * Get admin Supabase client with service role key (server-side only)
 */
export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(client: SupabaseClient) {
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Fetch user profile from users table
 */
export async function getUserProfile(client: SupabaseClient, userId: string): Promise<User | null> {
  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  client: SupabaseClient,
  userId: string,
  updates: Partial<User>
) {
  try {
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Create initial user profile
 */
export async function createUserProfile(client: SupabaseClient, userId: string, email: string, name?: string) {
  try {
    const { data, error } = await client
      .from('users')
      .insert({
        id: userId,
        email,
        name,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Fetch user's API keys
 */
export async function getUserApiKeys(client: SupabaseClient, userId: string): Promise<ApiKey[]> {
  try {
    const { data, error } = await client
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as ApiKey[];
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
}

/**
 * Create a new API key
 */
export async function createApiKey(
  client: SupabaseClient,
  userId: string,
  name: string,
  keyHash: string,
  keyPreview: string,
  expiresAt?: string
) {
  try {
    const { data, error } = await client
      .from('api_keys')
      .insert({
        user_id: userId,
        name,
        key_hash: keyHash,
        key_preview: keyPreview,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as ApiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(client: SupabaseClient, keyId: string, userId: string) {
  try {
    const { data, error } = await client
      .from('api_keys')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
      })
      .eq('id', keyId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as ApiKey;
  } catch (error) {
    console.error('Error revoking API key:', error);
    throw error;
  }
}

/**
 * Find API key by hash (used for validation)
 */
export async function findApiKeyByHash(adminClient: SupabaseClient, keyHash: string): Promise<ApiKey | null> {
  try {
    const { data, error } = await adminClient
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    // Check if key has expired
    if (data.expires_at) {
      const expiryDate = new Date(data.expires_at);
      if (expiryDate < new Date()) {
        return null;
      }
    }

    return data as ApiKey;
  } catch (error) {
    console.error('Error finding API key:', error);
    return null;
  }
}

/**
 * Log API key usage
 */
export async function logApiKeyUsage(
  adminClient: SupabaseClient,
  apiKeyId: string,
  userId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  ipAddress: string,
  userAgent?: string,
  responseTimeMs?: number
) {
  try {
    const { error } = await adminClient
      .from('api_key_usage_logs')
      .insert({
        api_key_id: apiKeyId,
        user_id: userId,
        endpoint,
        method,
        status_code: statusCode,
        ip_address: ipAddress,
        user_agent: userAgent,
        response_time_ms: responseTimeMs,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error logging API key usage:', error);
    // Don't throw - logging should not fail the request
  }
}

/**
 * Get API key usage stats
 */
export async function getApiKeyUsageStats(adminClient: SupabaseClient, apiKeyId: string) {
  try {
    const { data, error } = await adminClient
      .from('api_key_usage_logs')
      .select('*')
      .eq('api_key_id', apiKeyId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return data as ApiKeyUsageLog[];
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return [];
  }
}
