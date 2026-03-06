// API request/response type definitions

export interface ApiKeyCreateRequest {
  name: string;
  expires_in_days?: number;
}

export interface ApiKeyCreateResponse {
  success: boolean;
  message?: string;
  data?: {
    api_key?: {
      id: string;
      name: string;
      key: string; // Full key - only shown once on creation
      key_preview: string;
      created_at: string;
      expires_at?: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiKeyListResponse {
  success: boolean;
  api_keys: Array<{
    id: string;
    name: string;
    key_preview: string;
    created_at: string;
    last_used_at?: string;
    is_active: boolean;
    usage_count: number;
    expires_at?: string;
  }>;
}

export interface ApiKeyRevokeRequest {
  api_key_id: string;
}

export interface ApiKeyRevokeResponse {
  success: boolean;
  message: string;
}

export interface ApiKeyValidateRequest {
  api_key: string;
}

export interface ApiKeyValidateResponse {
  success: boolean;
  valid: boolean;
  user_id?: string;
  api_key_id?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
