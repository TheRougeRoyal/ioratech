# Supabase Authentication & API Key Management System

A complete, production-ready authentication and API key management system built with Next.js, TypeScript, and Supabase.

## Features

### Authentication
- ✅ Email/password signup with validation
- ✅ User login with session management
- ✅ Password reset via email
- ✅ Secure session handling with HTTP-only cookies
- ✅ Rate limiting on auth endpoints
- ✅ Email verification support

### API Key Management
- ✅ Create multiple API keys per user
- ✅ View all API keys (masked for security)
- ✅ Revoke/delete API keys
- ✅ Secure API key hashing with SHA-256
- ✅ Unique key generation with random bytes
- ✅ Key metadata (name, creation date, last used)
- ✅ Expiration date support
- ✅ Usage tracking and analytics
- ✅ Rate limiting by user and API key
- ✅ Key validation endpoint for external services

### Security
- ✅ Password strength validation
- ✅ Input sanitization and validation
- ✅ Row Level Security (RLS) in Supabase
- ✅ CORS configuration
- ✅ Rate limiting (auth and API endpoints)
- ✅ Secure password hashing
- ✅ CSRF protection ready
- ✅ Error messages don't leak information

### Database
- ✅ PostgreSQL with Supabase
- ✅ Users table with profile data
- ✅ API Keys table with secure hashing
- ✅ Usage logs table for analytics
- ✅ Proper indexing for performance

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, React 18
- **Backend**: Next.js API Routes with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth, JWT tokens
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui (Radix UI)
- **Validation**: Custom validation functions

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── reset-password/
│   │   └── api-keys/
│   │       ├── create/
│   │       ├── list/
│   │       ├── revoke/
│   │       └── validate/
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   └── dashboard/
│       └── api-keys/
├── components/
│   └── ui/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   ├── api-key-utils.ts     # API key generation and hashing
│   ├── auth-middleware.ts   # Authentication middleware
│   ├── api-response.ts      # API response utilities
│   ├── rate-limit.ts        # Rate limiting utilities
│   └── utils.js             # General utilities
├── types/
│   ├── database.ts          # Database types
│   ├── auth.ts              # Auth types
│   └── api.ts               # API types
├── migrations/
│   └── 001_initial_schema.sql # Database schema
├── .env.example             # Environment variables example
├── .env.local               # Environment variables (local)
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

### 1. Clone and Install

```bash
git clone <repository>
cd ioratech
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys
3. Create a new database (PostgreSQL is included)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-change-this

# API Key Configuration
API_KEY_HASH_SECRET=your-api-key-hash-secret-change-this
API_KEY_PREFIX=sk_

# Rate Limiting
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60

# Email Configuration (for password reset)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Environment
NODE_ENV=development
```

### 4. Initialize the Database

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the content from `migrations/001_initial_schema.sql`
5. Click "Run"

Alternatively, use the Supabase CLI:

```bash
supabase db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}

Response (201):
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_xxxxx"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGc..."
  }
}

Headers:
Set-Cookie: auth_token=...; Path=/; HttpOnly; SameSite=Strict
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully",
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### Reset Password Request
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Reset Password with Token
```http
POST /api/auth/reset-password?type=reset
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

### API Key Endpoints

#### Create API Key
```http
POST /api/api-keys/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Production API Key",
  "expires_in_days": 90
}

Response (201):
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "api_key": {
      "id": "uuid",
      "name": "Production API Key",
      "key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "key_preview": "sk_xxxx...xxxx",
      "created_at": "2024-01-01T12:00:00Z",
      "expires_at": "2024-03-31T12:00:00Z"
    }
  }
}
```

#### List API Keys
```http
GET /api/api-keys/list
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "api_keys": [
      {
        "id": "uuid",
        "name": "Production API Key",
        "key_preview": "sk_xxxx...xxxx",
        "created_at": "2024-01-01T12:00:00Z",
        "last_used_at": "2024-01-15T10:30:00Z",
        "is_active": true,
        "usage_count": 150,
        "expires_at": "2024-03-31T12:00:00Z"
      }
    ]
  }
}
```

#### Revoke API Key
```http
DELETE /api/api-keys/revoke
Authorization: Bearer <token>
Content-Type: application/json

{
  "api_key_id": "uuid"
}

Response (200):
{
  "success": true,
  "message": "API key revoked successfully"
}
```

#### Validate API Key
```http
POST /api/api-keys/validate
Content-Type: application/json

{
  "api_key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

Response (200):
{
  "success": true,
  "data": {
    "valid": true,
    "user_id": "uuid",
    "api_key_id": "uuid",
    "message": "API key is valid"
  }
}
```

## Frontend Pages

### Public Pages
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset request

### Protected Pages
- `/dashboard` - Main dashboard
- `/dashboard/api-keys` - View all API keys
- `/dashboard/api-keys/create` - Create new API key

## Password Requirements

Passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*, etc.)

Example: `SecurePassword123!`

## Rate Limiting

### Authentication Endpoints
- 5 attempts per minute per IP address for signup/login
- 5 attempts per minute per IP address for password reset

### API Endpoints
- 30 times per hour per user for API key creation
- 50 times per hour per user for API key revocation
- 60 requests per minute per user for API usage

Adjust these limits in `.env.local`:
```env
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60
```

## Security Best Practices

### For Users
1. **Never share your API keys** - Treat them like passwords
2. **Rotate keys regularly** - Revoke old keys and create new ones
3. **Use key expiration** - Set expiration dates for temporary access
4. **Monitor usage** - Check the "Last Used" date regularly
5. **Revoke unused keys** - Delete keys you no longer need

### For Developers
1. **Environment variables** - Never commit `.env.local` to git
2. **HTTPS only** - Always use HTTPS in production
3. **Key storage** - Never log full API keys
4. **Rate limiting** - Configure appropriate rate limits
5. **Input validation** - Validate all user input
6. **Error handling** - Don't expose sensitive info in errors
7. **Database** - Use RLS policies for data isolation
8. **CORS** - Configure CORS origins properly

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub, GitLab, or Bitbucket repository

### Steps

1. **Push to Repository**
```bash
git add .
git commit -m "Add Supabase auth system"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Select your repository
- Click "Import"

3. **Configure Environment Variables**
- In Vercel project settings, go to "Environment Variables"
- Add all variables from `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`
  - `API_KEY_HASH_SECRET`
  - `API_KEY_PREFIX`
  - `RATE_LIMIT_AUTH_PER_MINUTE`
  - `RATE_LIMIT_API_PER_MINUTE`
  - `RESEND_API_KEY` (if using email)
  - `FROM_EMAIL` (if using email)
  - `CORS_ORIGINS`

4. **Update Supabase Settings**
- Go to your Supabase project
- Update `Auth > URL Configuration` to include your Vercel domain
- Update `Auth > Email Templates` if needed

5. **Deploy**
- Click "Deploy"
- Wait for deployment to complete
- Visit your Vercel domain

## Troubleshooting

### "Missing Supabase credentials"
- Check that `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify the values match your Supabase project

### "RLS policy violation"
- Check that RLS policies are enabled on all tables
- Run the migration again to ensure policies are created
- Verify user ID matches in tokens

### "Rate limit exceeded"
- Wait for the rate limit window to reset (typically 1 minute)
- Adjust rate limit values in `.env.local` if needed
- Consider implementing Redis for distributed rate limiting

### "Email not sending"
- Verify `RESEND_API_KEY` is set correctly
- Check that `FROM_EMAIL` is a verified sender
- Check Resend dashboard for sending history

### "CORS errors"
- Add your domain to `CORS_ORIGINS` in `.env.local`
- Ensure the domain matches exactly (including protocol)

## API Documentation

See [API.md](./API.md) for detailed API documentation with examples.

## Monitoring & Analytics

### API Key Usage
- View usage count in the dashboard
- Check "Last Used" date for active keys
- Monitor usage trends over time

### Rate Limiting
- Check rate limit status in responses
- Monitor failed requests due to rate limiting
- Adjust limits based on usage patterns

### Database
- Monitor database storage in Supabase
- View query performance
- Check RLS policy effectiveness

## Maintenance

### Regular Tasks
1. Review and revoke unused API keys
2. Rotate security secrets quarterly
3. Update dependencies monthly
4. Monitor database performance
5. Check for security advisories

### Database Backups
- Supabase provides automatic backups
- Configure backup retention in Supabase settings
- Test restore procedures regularly

### Log Rotation
- Check database for old usage logs
- Archive or delete logs as needed
- Maintain 90-day retention policy

## Support & Contact

For issues, questions, or feature requests:
1. Check this README and [API.md](./API.md)
2. Review [SECURITY.md](./SECURITY.md) for security concerns
3. Check Supabase documentation: https://supabase.com/docs
4. Create an issue in the repository

## License

This project is provided as-is for educational and development purposes.

## Changelog

### Version 1.0.0 (Initial Release)
- Complete authentication system
- API key management
- Rate limiting
- Database schema with RLS
- Frontend pages and dashboard
- Comprehensive documentation

---

**Happy coding! 🚀**
