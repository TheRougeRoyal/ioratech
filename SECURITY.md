# Security Best Practices & Documentation

## Overview

This document outlines the security measures implemented in the Supabase Authentication & API Key Management System and best practices for maintaining security.

## Implemented Security Features

### 1. Authentication Security

#### Password Hashing
- Uses Supabase Auth, which implements bcrypt for password hashing
- Passwords are never stored in plain text
- PASSWORD_SALT environment variable in Supabase handles salt generation

#### Password Strength Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character
- Validated on both client and server

```typescript
// Password validation
const passwordValidation = validatePassword(password);
if (!passwordValidation.valid) {
  // Return error with specific requirements not met
}
```

#### Session Management
- Uses HTTP-only cookies to store session tokens
- Tokens expire after 3600 seconds (1 hour)
- Cookies marked as SameSite=Strict to prevent CSRF
- Secure flag set for HTTPS connections

```typescript
// Set session cookie
response.headers.set(
  'Set-Cookie',
  `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
);
```

#### Token Expiration
- Access tokens expire after 1 hour
- Refresh tokens are handled by Supabase
- Expired tokens are rejected with 401 Unauthorized

### 2. API Key Security

#### Key Generation
- Uses `crypto.randomBytes()` for strong randomness
- Generates 24 random bytes encoded as hex (48 characters)
- Prefixed with `sk_` for easy identification

```typescript
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `${API_KEY_PREFIX}${randomBytes}`;
}
```

#### Key Hashing
- Uses HMAC-SHA256 for hashing API keys
- Keys are hashed before storage using a secret
- Hashes are unique and cannot be reversed

```typescript
export function hashApiKey(apiKey: string): string {
  const secret = process.env.API_KEY_HASH_SECRET;
  return crypto
    .createHmac('sha256', secret)
    .update(apiKey)
    .digest('hex');
}
```

#### Key Masking
- API keys are never fully returned in API responses
- Only shown once at creation time
- Dashboard displays masked version: `sk_xxxx...xxxx`
- Metadata includes creation date, last used date, and usage count

```typescript
export function createApiKeyPreview(apiKey: string): string {
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  return `${start}${'•'.repeat(numDots)}${end}`;
}
```

#### Key Expiration
- Optional expiration dates can be set (1-365 days)
- Expired keys are automatically rejected during validation
- Users can revoke keys at any time

### 3. Input Validation & Sanitization

#### Email Validation
- Uses regex pattern for email format validation
- Checked both client and server side
- Prevents invalid email addresses from being registered

```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### Input Sanitization
- All user input is trimmed and limited to 500 characters
- Special characters are preserved for passwords
- XSS prevention through React's built-in escaping

```typescript
export function sanitizeInput(input: string): string {
  return input.trim().substring(0, 500);
}
```

#### Request Body Validation
- JSON parsing errors are caught and logged
- Invalid request formats return 400 Bad Request
- Required fields are checked before processing

### 4. Database Security

#### Row Level Security (RLS)
- All tables have RLS enabled
- Policies restrict users to their own data
- Service role key bypasses RLS for admin operations

```sql
-- Users can only see their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only see their own API keys
CREATE POLICY "Users can view own API keys"
  ON public.api_keys
  FOR SELECT
  USING (auth.uid() = user_id);
```

#### Data Isolation
- Foreign keys ensure data integrity
- Cascading deletes prevent orphaned records
- User IDs are tied to Supabase Auth user IDs

#### Indexes
- Strategic indexes for query performance
- Prevents full table scans
- Improves response times

```sql
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
```

### 5. Rate Limiting

#### Authentication Endpoints
- 5 signup/login attempts per minute per IP
- 5 password reset attempts per minute per IP
- Prevents brute force attacks

#### API Endpoints
- 30 API key creations per hour per user
- 50 API key revocations per hour per user
- 60 API requests per minute per user

#### Implementation
```typescript
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
```

#### Production Considerations
- Current implementation uses in-memory storage
- For production, use Redis or similar
- Allows rate limiting across multiple servers

### 6. CORS Configuration

#### Allowed Origins
- Configurable via `CORS_ORIGINS` environment variable
- Comma-separated list of allowed domains
- Prevents cross-origin attacks

```typescript
const configuredOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : []
```

#### Request Validation
- Origin header is checked for all API requests
- Preflight requests are handled by Next.js
- Credentials are only sent to same-origin or whitelisted domains

### 7. Error Handling

#### Information Leakage Prevention
- Generic error messages for authentication failures
- No indication whether email exists in system
- Specific errors logged only on server side

```typescript
// Don't reveal if email exists
return createErrorResponseObj(
  ErrorCode.INVALID_CREDENTIALS,
  'Invalid email or password'  // Same for both wrong email and wrong password
);
```

#### Error Logging
- Full errors logged to console in development
- Structured error responses in production
- Request IDs for error tracking

```typescript
export interface ApiResponse {
  success: boolean;
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
```

### 8. Environment Variables

#### Secret Management
- Never commit `.env.local` to version control
- Store secrets in Vercel deployment settings
- Rotate secrets regularly

#### Required Secrets
- `SUPABASE_SERVICE_ROLE_KEY` - Backend only
- `JWT_SECRET` - For token generation
- `API_KEY_HASH_SECRET` - For key hashing

#### Public Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited scope, safe to expose

### 9. Middleware Protection

#### Authentication Middleware
- Verifies tokens before processing requests
- Checks API key validity and expiration
- Extracts user information for authorization

```typescript
export async function requireAuth(request: NextRequest) {
  const apiKeyAuth = await checkApiKeyAuth(request);
  if (apiKeyAuth.userId) {
    return { authenticated: true, userId: apiKeyAuth.userId };
  }

  const tokenAuth = await checkSupabaseAuth(request);
  if (tokenAuth.userId) {
    return { authenticated: true, userId: tokenAuth.userId };
  }

  return { authenticated: false };
}
```

## Security Checklist for Deployment

### Before Going to Production

- [ ] All environment variables set in production (Vercel)
- [ ] `JWT_SECRET` changed from default
- [ ] `API_KEY_HASH_SECRET` changed from default
- [ ] `CORS_ORIGINS` set to actual domain
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Database backups configured
- [ ] RLS policies verified on all tables
- [ ] Rate limits adjusted for expected traffic
- [ ] Email service configured (Resend or similar)
- [ ] Domain verified for email sending
- [ ] Monitoring and logging configured
- [ ] Security policy reviewed
- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] Contact email configured

### Ongoing Security Maintenance

#### Monthly
- [ ] Review API key usage patterns
- [ ] Check for unused keys
- [ ] Monitor failed authentication attempts
- [ ] Review error logs
- [ ] Update dependencies for security patches

#### Quarterly
- [ ] Rotate JWT_SECRET
- [ ] Rotate API_KEY_HASH_SECRET
- [ ] Review RLS policies
- [ ] Audit database access patterns
- [ ] Review IP-based rate limits

#### Annually
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Infrastructure review
- [ ] Compliance check
- [ ] Update security documentation

## Threat Mitigation

### Brute Force Attack
**Threat**: Attacker tries many password combinations

**Mitigations**:
- Rate limiting on login (5 attempts/minute)
- Account lockout could be added
- Strong password requirements
- Only 1 session per user at a time

### API Key Theft
**Threat**: Someone obtains an API key

**Mitigations**:
- Keys are hashed in database
- Masked in frontend/responses
- Expiration dates can be set
- Usage tracking enables detection
- User can revoke immediately
- Keys are unique

### Session Hijacking
**Threat**: Attacker steals session token

**Mitigations**:
- HTTP-only cookies
- SameSite=Strict CSRF protection
- HTTPS encryption
- Short expiration (1 hour)
- Rotating refresh tokens

### SQL Injection
**Threat**: Malicious SQL in input

**Mitigations**:
- Supabase client library handles parameterization
- No raw SQL queries from user input
- Input validation on all fields

### XSS (Cross-Site Scripting)
**Threat**: Malicious JavaScript injection

**Mitigations**:
- React's built-in XSS protection
- Input sanitization
- Content Security Policy ready
- No eval() or innerHTML from user input

### CSRF (Cross-Site Request Forgery)
**Threat**: Attacker tricks user into performing action

**Mitigations**:
- SameSite=Strict cookies
- JWT tokens in Authorization header
- Origin/Referer validation ready

### Information Disclosure
**Threat**: Exposing sensitive information

**Mitigations**:
- Generic error messages
- No stack traces in responses
- API keys masked in UI
- Passwords never logged
- Rate limit errors don't reveal limits

## Compliance Considerations

### GDPR
- User can request data export
- Right to be forgotten (delete account)
- Data processing agreements with Supabase
- Privacy policy required

### CCPA
- User privacy rights
- Transparent data collection
- Cookie consent if applicable
- Data sale opt-out mechanism

### PCI DSS (if storing payment info)
- Not directly applicable here
- Payment tokens should never be stored
- Use payment provider APIs

## Recommendations for Production

### 1. Add Monitoring
```typescript
// Use services like:
// - Sentry for error tracking
// - LogRocket for session replay
// - Datadog for infrastructure monitoring
```

### 2. Implement Advanced Rate Limiting
```typescript
// Replace in-memory store with:
// - Redis for distributed rate limiting
// - AWS WAF for DDoS protection
// - Cloudflare for edge protection
```

### 3. Add Email Verification
```typescript
// Verify email before account activation
// Verify email change requests
// Implement verified badge system
```

### 4. Implement MFA
```typescript
// Add two-factor authentication
// Support TOTP (Google Authenticator)
// Support backup codes
```

### 5. Add IP Whitelisting (Optional)
```typescript
// For enterprise customers
// Restrict API key usage to specific IPs
// Log all IP changes
```

### 6. Implement Audit Logging
```typescript
// Log all authentication events
// Log all API key operations
// Maintain audit trail for compliance
```

### 7. Add Content Security Policy
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Next.js Security](https://nextjs.org/docs/basic-features/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Send email to security@yourdomain.com
3. Include:
   - Description of vulnerability
   - Affected component
   - Potential impact
   - Suggested fix (if any)

4. We will:
   - Acknowledge receipt within 24 hours
   - Investigate within 7 days
   - Provide timeline for fix
   - Credit reporter if desired

---

**Last Updated**: March 2026
**Version**: 1.0.0
