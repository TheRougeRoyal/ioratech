import crypto from 'crypto';

const API_KEY_PREFIX = process.env.API_KEY_PREFIX || 'sk_';
const API_KEY_LENGTH = 32; // Characters in the random part
const HASH_ALGORITHM = 'sha256';

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `${API_KEY_PREFIX}${randomBytes}`;
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(apiKey: string): string {
  const secret = process.env.API_KEY_HASH_SECRET || 'default-secret';
  const hash = crypto
    .createHmac(HASH_ALGORITHM, secret)
    .update(apiKey)
    .digest('hex');
  return hash;
}

/**
 * Create a preview of the API key (first 4 and last 4 chars)
 */
export function createApiKeyPreview(apiKey: string): string {
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  const numDots = Math.max(0, apiKey.length - 8);
  return `${start}${'•'.repeat(numDots)}${end}`;
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  // Check if it starts with the prefix and has minimum length
  return apiKey.startsWith(API_KEY_PREFIX) && apiKey.length > API_KEY_PREFIX.length + 10;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input (basic sanitization)
 */
export function sanitizeInput(input: string): string {
  return input.trim().substring(0, 500); // Max 500 chars
}

/**
 * Generate JWT token (for demonstration - use a proper JWT library in production)
 */
export function generateToken(userId: string, expiresIn: number = 3600): string {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + expiresIn;

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: expiresAt,
  }));

  const message = `${header}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return `${message}.${signature}`;
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { valid: boolean; userId?: string; error?: string } {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const parts = token.split('.');

    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [header, payload, signature] = parts;
    const message = `${header}.${payload}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, userId: decodedPayload.sub };
  } catch (error) {
    return { valid: false, error: 'Token verification failed' };
  }
}
