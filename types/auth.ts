// Authentication type definitions

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

export interface SessionData {
  user_id: string;
  email: string;
  name?: string;
  token?: string;
  expires_at?: number;
}

export interface AuthError {
  code: string;
  message: string;
  hint?: string;
}
