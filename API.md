# API Documentation

Complete API reference for the Supabase Authentication & API Key Management System.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Authentication

All protected endpoints require authentication via one of:

### Method 1: Bearer Token
```http
Authorization: Bearer <jwt_token>
```

### Method 2: API Key
```http
Authorization: Bearer sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Method 3: Cookie
```
Cookie: auth_token=<jwt_token>
```

## Response Format

All responses follow a standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_xxxxx"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional information
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_xxxxx"
  }
}
```

## Error Codes

| Code | status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Invalid or malformed request |
| `INVALID_EMAIL` | 400 | Email format is invalid |
| `INVALID_PASSWORD` | 400 | Password doesn't meet requirements |
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `SESSION_EXPIRED` | 401 | Session or token has expired |
| `FORBIDDEN` | 403 | User lacks permission |
| `API_KEY_REVOKED` | 403 | API key has been revoked |
| `API_KEY_EXPIRED` | 403 | API key has expired |
| `NOT_FOUND` | 404 | Resource not found |
| `USER_NOT_FOUND` | 404 | User account not found |
| `API_KEY_NOT_FOUND` | 404 | API key not found |
| `USER_EXISTS` | 409 | User with this email already exists |
| `CONFLICT` | 409 | Resource already exists or conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Authentication Endpoints

### Sign Up

Create a new user account.

```http
POST /api/auth/signup
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | ✓ | User's email address |
| password | string | ✓ | User's password (must meet requirements) |
| name | string | ✗ | User's full name |

**Response (201)**:
```json
{
  "success": true,
  "message": "Signup successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Errors**:
- `INVALID_EMAIL` - Invalid email format
- `INVALID_PASSWORD` - Password doesn't meet requirements
- `USER_EXISTS` - User with this email already exists
- `RATE_LIMIT_EXCEEDED` - Too many signup attempts

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*, etc.)

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

---

### Login

Authenticate a user and receive a session token.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | ✓ | User's email address |
| password | string | ✓ | User's password |

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookies Set**:
- `auth_token`: HTTP-only session cookie (valid for 1 hour)

**Errors**:
- `INVALID_EMAIL` - Invalid email format
- `INVALID_CREDENTIALS` - Wrong email or password
- `RATE_LIMIT_EXCEEDED` - Too many login attempts

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Logout

End the current session.

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Cookies Cleared**:
- `auth_token`: Session cookie is cleared

**Errors**:
- `UNAUTHORIZED` - No valid authentication provided
- `INTERNAL_ERROR` - Server error during logout

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

---

### Request Password Reset

Send a password reset email to the user.

```http
POST /api/auth/reset-password
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | ✓ | User's email address |

**Response (200)**:
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "message": "If an account exists with this email, you will receive a password reset link."
  }
}
```

**Notes**:
- Returns success even if email doesn't exist (for security)
- Email link valid for 24 hours
- Contains one-time reset token

**Errors**:
- `INVALID_EMAIL` - Invalid email format
- `RATE_LIMIT_EXCEEDED` - Too many reset attempts

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

### Confirm Password Reset

Reset password using token from email.

```http
POST /api/auth/reset-password?type=reset
Content-Type: application/json
```

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | ✓ | Reset token from email |
| password | string | ✓ | New password (must meet requirements) |

**Response (200)**:
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Errors**:
- `INVALID_PASSWORD` - Password doesn't meet requirements
- `INVALID_REQUEST` - Invalid or expired token

**Example**:
```bash
curl -X POST "http://localhost:3000/api/auth/reset-password?type=reset" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token_from_email",
    "password": "NewPass123!"
  }'
```

---

## API Key Management Endpoints

### Create API Key

Generate a new API key for the authenticated user.

```http
POST /api/api-keys/create
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Production API Key",
  "expires_in_days": 90
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | ✓ | Friendly name for the key |
| expires_in_days | number | ✗ | Days until expiration (1-365) |

**Response (201)**:
```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "api_key": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Production API Key",
      "key": "sk_32charshexstringrepresentation",
      "key_preview": "sk_xxxx...xxxx",
      "created_at": "2024-01-01T12:00:00Z",
      "expires_at": "2024-03-31T12:00:00Z"
    }
  }
}
```

**Important Notes**:
- Full key is shown **only once** at creation
- Save the key immediately (cannot be retrieved later)
- Use key preview for identification

**Errors**:
- `UNAUTHORIZED` - Not authenticated
- `INVALID_REQUEST` - Name not provided or invalid
- `RATE_LIMIT_EXCEEDED` - Too many keys created

**Example**:
```bash
curl -X POST http://localhost:3000/api/api-keys/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "expires_in_days": 90
  }'
```

---

### List API Keys

Retrieve all API keys for the authenticated user.

```http
GET /api/api-keys/list
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "api_keys": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Production API Key",
        "key_preview": "sk_xxxx...xxxx",
        "created_at": "2024-01-01T12:00:00Z",
        "last_used_at": "2024-01-15T10:30:00Z",
        "is_active": true,
        "usage_count": 150,
        "expires_at": "2024-03-31T12:00:00Z"
      },
      {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "name": "Development API Key",
        "key_preview": "sk_yyyy...yyyy",
        "created_at": "2024-01-10T08:15:00Z",
        "last_used_at": null,
        "is_active": false,
        "usage_count": 0,
        "expires_at": null
      }
    ]
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique API key identifier |
| name | string | Friendly name of the key |
| key_preview | string | Masked key (first 4 and last 4 chars) |
| created_at | ISO 8601 | When the key was created |
| last_used_at | ISO 8601 | Last time the key was validated/used |
| is_active | boolean | Whether key is active (not revoked) |
| usage_count | number | Number of times key has been used |
| expires_at | ISO 8601 | When the key expires (null = never) |

**Errors**:
- `UNAUTHORIZED` - Not authenticated

**Example**:
```bash
curl -X GET http://localhost:3000/api/api-keys/list \
  -H "Authorization: Bearer <token>"
```

---

### Revoke API Key

Deactivate an API key (cannot be reactivated).

```http
DELETE /api/api-keys/revoke
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "api_key_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| api_key_id | string | ✓ | ID of key to revoke |

**Response (200)**:
```json
{
  "success": true,
  "message": "API key revoked successfully",
  "data": {
    "message": "API key revoked successfully"
  }
}
```

**Errors**:
- `UNAUTHORIZED` - Not authenticated
- `API_KEY_NOT_FOUND` - Key doesn't exist or belongs to another user
- `API_KEY_REVOKED` - Key is already revoked
- `RATE_LIMIT_EXCEEDED` - Too many revocation attempts

**After Revocation**:
- Key cannot be used for authentication
- Cannot be reactivated
- All future uses will be rejected

**Alternative: POST Method**
```http
POST /api/api-keys/revoke
Authorization: Bearer <token>
Content-Type: application/json

{
  "api_key_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/api-keys/revoke \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"api_key_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

---

### Validate API Key

Check if an API key is valid and get associated user information.

```http
POST /api/api-keys/validate
Content-Type: application/json
```

**Request Body**:
```json
{
  "api_key": "sk_32charshexstringrepresentation"
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| api_key | string | ✓ | API key to validate |

**Response (200)**:
```json
{
  "success": true,
  "message": "API key is valid",
  "data": {
    "valid": true,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "api_key_id": "550e8400-e29b-41d4-a716-446655440001",
    "message": "API key is valid"
  }
}
```

**Response Fields** (when valid=true):
| Field | Type | Description |
|-------|------|-------------|
| valid | boolean | Whether API key is valid |
| user_id | string | ID of the key owner |
| api_key_id | string | ID of the API key |
| message | string | Status message |

**Invalid Response**:
```json
{
  "success": true,
  "data": {
    "valid": false,
    "message": "Invalid API key"
  }
}
```

**Side Effects**:
- Valid key usage is logged
- Last used date is updated
- Usage count is incremented
- Invalid attempts are logged

**Alternative: GET Method**
```http
GET /api/api-keys/validate?key=sk_xxxx
```

**Errors**:
- `INVALID_REQUEST` - API key not provided
- `USER_NOT_FOUND` - Key owner not in system
- `RATE_LIMIT_EXCEEDED` - User exceeded rate limit

**Example**:
```bash
curl -X POST http://localhost:3000/api/api-keys/validate \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

---

## Rate Limiting

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1609459200
```

### Rate Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/signup` | 5 | 1 minute (per IP) |
| `/api/auth/login` | 5 | 1 minute (per IP) |
| `/api/auth/reset-password` | 5 | 1 minute (per IP) |
| `/api/api-keys/create` | 30 | 1 hour (per user) |
| `/api/api-keys/revoke` | 50 | 1 hour (per user) |
| `/api/api-keys/validate` | 60 | 1 minute (per user) |
| `/api/api-keys/list` | 60 | 1 minute (per user) |

### Handling Rate Limits

When rate limited, the API returns 429 Too Many Requests:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 60
    }
  }
}
```

**Best Practices**:
1. Implement exponential backoff
2. Respect X-RateLimit-Reset header
3. Cache responses when possible
4. Contact support if limits are too restrictive

---

## Common Patterns

### Authentication Flow

1. **Sign Up**
   ```bash
   POST /api/auth/signup
   ```
   → User receives verification email

2. **Verify Email** (click link in email)

3. **Login**
   ```bash
   POST /api/auth/login
   ```
   → Returns JWT token

4. **Use Protected Endpoints**
   ```bash
   GET /api/api-keys/list
   Authorization: Bearer <jwt_token>
   ```

### API Key Workflow

1. **Create Key**
   ```bash
   POST /api/api-keys/create
   Authorization: Bearer <jwt_token>
   ```
   → Save returned key immediately

2. **List Keys**
   ```bash
   GET /api/api-keys/list
   Authorization: Bearer <jwt_token>
   ```

3. **Use Key**
   ```bash
   POST /api/api-keys/validate
   {"api_key": "sk_xxxx"}
   ```
   → Verify key is valid

4. **Revoke Key**
   ```bash
   DELETE /api/api-keys/revoke
   Authorization: Bearer <jwt_token>
   ```

### Error Handling

```typescript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    switch (data.error.code) {
      case 'INVALID_CREDENTIALS':
        // Show user-friendly message
        showError('Invalid email or password');
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Wait before retrying
        showError('Too many attempts. Please wait a moment.');
        break;
      default:
        showError(data.error.message);
    }
    return;
  }

  // Success
  localStorage.setItem('token', data.data.token);
} catch (error) {
  showError('Network error. Please try again.');
}
```

---

## Webhooks (Future Enhancement)

Currently not implemented. Consider adding:

- User authentication events
- API key lifecycle events
- Usage milestone notifications
- Security alerts

---

## Pagination (Future Enhancement)

Currently all results returned in single page. For large result sets, consider:

```http
GET /api/api-keys/list?page=1&limit=20
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-05 | Initial release |

---

For questions or issues, refer to the main [README.md](./README_AUTH.md) or [SECURITY.md](./SECURITY.md).
