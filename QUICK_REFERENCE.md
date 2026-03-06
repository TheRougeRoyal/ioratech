# Quick Reference Guide

Fast lookup for common tasks and commands.

## 🚀 Getting Started (Copy & Paste)

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

### Database Setup
Copy and run this SQL in Supabase SQL Editor:
```sql
-- See full migration: migrations/001_initial_schema.sql
-- Paste entire file into SQL Editor and run
```

## 📝 Environment Variables

### Required Variables (Must Set)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Security Secrets (Change Before Production)
```bash
# Generate strong random values
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_SECRET=<generated-value-here>
API_KEY_HASH_SECRET=<generated-value-here>
```

### Optional Variables
```env
API_KEY_PREFIX=sk_
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60
RESEND_API_KEY=your-email-service-key
FROM_EMAIL=noreply@yourdomain.com
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
NODE_ENV=development
```

## 🔑 Common API Calls

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Create API Key
```bash
curl -X POST http://localhost:3000/api/api-keys/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "expires_in_days": 90
  }'
```

### List API Keys
```bash
curl -X GET http://localhost:3000/api/api-keys/list \
  -H "Authorization: Bearer <token>"
```

### Validate API Key
```bash
curl -X POST http://localhost:3000/api/api-keys/validate \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

### Revoke API Key
```bash
curl -X DELETE http://localhost:3000/api/api-keys/revoke \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"api_key_id": "key-uuid-here"}'
```

## 🧪 Testing Checklist

### Local Testing
```bash
# 1. Start dev server
npm run dev

# 2. Test signup
# Visit http://localhost:3000/signup
# Create test account

# 3. Test login
# Visit http://localhost:3000/login
# Login with test account

# 4. Test API keys
# Visit http://localhost:3000/dashboard/api-keys
# Create, view, and revoke keys

# 5. Test API endpoints
# Use curl commands above
```

### Before Deployment
- [ ] `npm run build` completes without errors
- [ ] `npm start` works locally
- [ ] All env vars set
- [ ] `.env.local` not in git
- [ ] Database migrations applied
- [ ] Test signup → verify email → login
- [ ] Test API key creation
- [ ] Test API key validation

## 🌐 Deployment Checklist

### Vercel Preparation
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Vercel Setup (5 steps)
1. Go to vercel.com → New Project
2. Select repository
3. Click Import
4. Add environment variables (Settings → Environment Variables)
5. Redeploy with env vars

### Post-Deployment
1. Update Supabase Auth URLs (to Vercel domain)
2. Test signup/login
3. Test API keys
4. Configure custom domain (if needed)
5. Setup email service

## 🔍 Troubleshooting Quick Fixes

### "Cannot find module 'Supabase'"
```bash
npm install @supabase/supabase-js
```

### "Build fails with TypeScript errors"
```bash
npx tsc --noEmit  # Check errors
# Fix errors and retry
```

### "Missing environment variable"
1. Check `.env.local` has the variable
2. Restart dev server: `npm run dev`
3. For Vercel: add in Settings → Environment Variables

### "Rate limit exceeded"
Wait 60 seconds (default window) before retrying.

### "API key validation fails"
- Verify URL is `/api/api-keys/validate` (not `/validate`)
- Check key format starts with `sk_`
- Ensure key is not revoked

### "Email not sending"
1. Verify RESEND_API_KEY is set
2. Check FROM_EMAIL is verified in Resend
3. Check spam folder
4. Verify email service credentials

## 📁 Key Files at a Glance

| File | What It Does |
|------|-------------|
| `lib/supabase.ts` | Database operations |
| `lib/api-key-utils.ts` | Key generation and hashing |
| `lib/auth-middleware.ts` | Authentication checks |
| `lib/rate-limit.ts` | Request rate limiting |
| `app/api/auth/*` | Login/signup/password reset |
| `app/api/api-keys/*` | API key management |
| `app/*/page.tsx` | Frontend pages |
| `types/*.ts` | Type definitions |
| `migrations/001_initial_schema.sql` | Database schema |

## 🔐 Security Quick Tips

### For Users
- **Never share API keys** - they're like passwords
- **Rotate keys** - create new ones, revoke old
- **Set expiration** - automatic key rotation
- **Check usage** - look for unusual activity
- **Revoke unused** - clean up old keys

### For Developers
- **Never log API keys** - full or partial
- **Use HTTPS only** - automatic on Vercel
- **Scan dependencies** - `npm audit`
- **Update regularly** - security patches
- **Monitor errors** - use Sentry/LogRocket

## 📊 Performance Monitoring

### What to Monitor
- Build time (should be < 60s)
- First Contentful Paint (< 2s)
- Time to Interactive (< 3s)
- API response time (< 200ms)
- Error rate (< 1%)

### Tools
- Vercel Analytics (built-in)
- Supabase Dashboard (built-in)
- Sentry (optional, for errors)
- LogRocket (optional, for sessions)

## 🚀 Common Development Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build           # Build for production
npm run start           # Run production build
npm run lint            # Check code quality

# Database
# Use Supabase SQL Editor for migrations

# Deployment
git push origin main    # Triggers Vercel auto-deployment

# Dependencies
npm install             # Install all packages
npm update             # Update packages
npm audit              # Check for vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
```

## 📞 Getting Help

### Documentation
| Need | Read |
|------|------|
| Overview | README_AUTH.md |
| API endpoints | API.md |
| Security | SECURITY.md |
| Deployment | DEPLOYMENT.md |
| This guide | QUICK_REFERENCE.md |

### Quick Links
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

## 🎯 Common Use Cases

### "I want to add 2FA"
1. See SECURITY.md for recommendations
2. Consider TOTP (Time-based One-Time Password)
3. Add verification endpoint
4. Update login flow

### "I want to add email verification"
1. Supabase handles this automatically
2. Users get verification email on signup
3. Token expires after 24 hours
4. Already implemented!

### "I want to change rate limits"
Edit `.env.local`:
```env
RATE_LIMIT_AUTH_PER_MINUTE=10    # Changed from 5
RATE_LIMIT_API_PER_MINUTE=120    # Changed from 60
```

### "I want custom error messages"
Edit `lib/api-response.ts`:
```typescript
[ErrorCode.INVALID_PASSWORD]: 'Your error message here',
```

### "I want to add webhook notifications"
1. Each API endpoint returns structured response
2. Add Stripe/Sendgrid webhook integration
3. Listen for auth or key events
4. Send notifications

## ✅ Pre-Production Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] SSL/HTTPS enabled
- [ ] CORS origins configured
- [ ] Email service connected
- [ ] Error tracking configured
- [ ] Backups enabled
- [ ] Rate limits adjusted
- [ ] Secrets rotated
- [ ] Testing completed
- [ ] Documentation reviewed
- [ ] Monitoring setup
- [ ] Team trained

## 🎉 Success Indicators

✅ Project is working correctly if:
- Signup creates account and sends email
- Login works and returns token
- API keys can be created and viewed
- Keys can be revoked and show as inactive
- Rate limiting returns 429 on excess requests
- All endpoints return proper error codes
- Website loads with HTTPS (production)
- No sensitive data in error messages

## 📈 Scaling Path

```
Development      → Pro Plan      → Enterprise
(Free tier)      ($45/month)    (Custom)
└─ 1-10 users   └─ 100-1k users └─ 1k+ users
```

See DEPLOYMENT.md for detailed scaling guide.

---

**Pro Tip**: Bookmark this page. You'll refer back to it often! 🔖

**Last Updated**: March 5, 2026
**Version**: 1.0.0
