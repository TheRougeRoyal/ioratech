# Deployment Guide - Vercel

Complete step-by-step guide to deploy the Supabase Authentication & API Key Management System to Vercel.

## Prerequisites

- ✅ Next.js project with TypeScript
- ✅ Supabase project created and configured
- ✅ Database schema applied
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Vercel account

## Step 1: Prepare Your Repository

### 1.1 Clean Up Sensitive Files

Ensure these files are in `.gitignore`:

```gitignore
# Environment variables - NEVER commit!
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 1.2 Create Environment Example File

Commit `.env.example` with all variables (no values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
API_KEY_HASH_SECRET=your-api-key-hash-secret
API_KEY_PREFIX=sk_
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
NODE_ENV=development
```

### 1.3 Update package.json

Ensure scripts are correct:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.4 Verify TypeScript Configuration

Ensure `tsconfig.json` is valid:

```bash
npx tsc --noEmit
```

### 1.5 Test Build Locally

```bash
npm run build
npm start
```

Visit http://localhost:3000 and ensure everything works.

### 1.6 Commit Changes

```bash
git add .
git commit -m "Configure app for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub/GitLab/Bitbucket account
3. Click "New Project"
4. Select your repository
5. Click "Import"

### 2.2 Configure Project Settings

In the "Configure Project" step:

- **Framework Preset**: Next.js ✓ (should auto-detect)
- **Root Directory**: `./` (default)
- **Build and Output Settings**:
  - Build Command: `npm run build` (default)
  - Output Directory: `.next` (default)
  - Install Command: `npm install` (default)

Click "Deploy" for now - we'll add environment variables next.

### 2.3 Add Environment Variables

After deployment, go to your project dashboard:

1. **Settings Tab**
2. **Environment Variables**
3. Add each variable:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
JWT_SECRET = your-jwt-secret-randomly-generated
API_KEY_HASH_SECRET = your-api-key-hash-secret-randomly-generated
API_KEY_PREFIX = sk_
RATE_LIMIT_AUTH_PER_MINUTE = 5
RATE_LIMIT_API_PER_MINUTE = 60
RESEND_API_KEY = your-resend-api-key
FROM_EMAIL = noreply@yourdomain.com
CORS_ORIGINS = http://localhost:3000,https://yourdomain.vercel.app
NODE_ENV = production
```

**Important Notes**:
- Generate strong random values for JWT_SECRET and API_KEY_HASH_SECRET
- Use your actual Vercel domain in CORS_ORIGINS
- Don't copy values from .env.local - use production values

#### Generate Strong Secrets

```bash
# On macOS/Linux
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Click "Save" after adding all variables.

### 2.4 Redeploy with Environment Variables

1. Go to **Deployments** tab
2. Click the most recent deployment
3. Click **⋯ (More)**
4. Click **Redeploy**
5. Confirm redeploy

Wait for deployment to complete. You should see a green "Ready" status.

## Step 3: Configure Supabase

Now tell Supabase about your Vercel domain.

### 3.1 Update Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Click **Authentication** in left sidebar
3. Click **URL Configuration**
4. Update these URLs:

**Site URL**:
```
https://projectname.vercel.app
```

**Redirect URLs**:
```
https://projectname.vercel.app/
https://projectname.vercel.app/auth/callback
https://projectname.vercel.app/dashboard
https://projectname.vercel.app/login
```

Click **Save**.

### 3.2 Test Authentication

1. Visit https://projectname.vercel.app
2. Click "Sign Up"
3. Create an account
4. Check email for verification link
5. Click verification link
6. Log in
7. Create an API key

If all works, continue to Step 4.

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to your Vercel project **Settings**
2. Click **Domains**
3. Enter your domain name
4. Vercel shows DNS records to add

### 4.2 Update DNS Records

Go to your domain registrar and add the DNS records shown by Vercel.

This typically includes:
- CNAME record pointing to Vercel
- TXT record for verification

### 4.3 Verify Domain

Vercel will automatically verify. Once verified:
- Check "Redirect to comment domain" if you want redirect
- Your domain should be active

### 4.4 Update Supabase Configuration

Repeat Step 3.1 with your custom domain instead of Vercel domain.

### 4.5 Update CORS_ORIGINS

Update the environment variable in Vercel:

```
CORS_ORIGINS = http://localhost:3000,https://yourdomain.com
```

## Step 5: Email Configuration

### 5.1 Setup Resend (Email Service)

[Resend](https://resend.com) makes email easy. Alternative options: SendGrid, Mailgun, AWS SES.

1. **Sign up** at [resend.com](https://resend.com)
2. **Create API Key** in dashboard
3. **Verify domain** (follow Resend instructions)
4. **Copy API Key**

### 5.2 Add to Vercel Environment Variables

1. Go to Vercel project **Settings > Environment Variables**
2. Update `RESEND_API_KEY` with your key
3. Update `FROM_EMAIL` with your verified email

### 5.3 Test Email Sending

1. Visit your Vercel deployment
2. Go to **Forgot Password** page
3. Enter email and submit
4. Check email for reset link
5. Should arrive within 1-2 minutes

## Step 6: Enable Monitoring and Logging

### 6.1 Vercel Analytics

1. Go to **Settings > Analytics**
2. Enable **Web Analytics** (checks browser performance)
3. Viewable in **Analytics** tab

### 6.2 Enable All Features

In Vercel **Settings**:

- [ ] **Serverless Function** size limits (default fine)
- [ ] **Build caching** (enabled by default)
- [ ] **Edge Middleware** (optional, for security)

### 6.3 Error Tracking Integration (Optional)

Consider adding error tracking like Sentry:

```bash
npm install @sentry/nextjs
```

Then configure in `next.config.js`:

```javascript
import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig({
  // ...nextConfig
}, {
  // Sentry options
  org: 'your-org',
  project: 'your-project',
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

## Step 7: Testing Checklist

### Pre-deploy Tests
- [ ] Local `npm run build` succeeds
- [ ] Local `npm start` works
- [ ] All environment variables set in Vercel
- [ ] `.env.local` NOT committed to git

### Post-deploy Tests

**Authentication Flow**:
- [ ] Sign up page loads
- [ ] Signup creates account
- [ ] Verification email sent
- [ ] Email links work
- [ ] Login page loads
- [ ] Login works
- [ ] Logout works
- [ ] Session persists on reload
- [ ] Forgot password works

**API Key Management**:
- [ ] Dashboard loads
- [ ] Can create API key
- [ ] Can copy key preview
- [ ] Can list keys
- [ ] Can revoke key
- [ ] Revoked key shows as inactive

**API Endpoints**:
- [ ] `POST /api/auth/signup` returns 201
- [ ] `POST /api/auth/login` returns 200
- [ ] `GET /api/api-keys/list` requires auth
- [ ] `POST /api/api-keys/validate` works without auth
- [ ] Rate limiting returns 429 when exceeded

**Security Checks**:
- [ ] HTTPS enforced (redirect from HTTP)
- [ ] Full API keys never returned
- [ ] Error messages generic
- [ ] Passwords not logged
- [ ] CORS working correctly

## Step 8: Monitoring in Production

### 8.1 Regular Checks

**Daily**:
- No deployment errors
- Build times reasonable
- Error rate is low

**Weekly**:
- Review Vercel Analytics
- Check database usage
- Monitor authentication logs

**Monthly**:
- Review usage patterns
- Update dependencies
- Security audit
- Performance optimization

### 8.2 Alerts to Setup

Consider setting up alerts for:
- Failed deployments
- High error rate
- Database size exceeding limits
- Unusual authentication patterns

### 8.3 Backup Strategy

Supabase automatically backs up, but:
- [ ] Test backup restoration
- [ ] Keep database exports
- [ ] Document backup retention

## Step 9: Performance Optimization

### 9.1 Vercel Serverless Function Optimization

The deployment is already optimized, but consider:

**For large API responses**:
```javascript
// Implement pagination
export default async function handler(req, res) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  // ...
}
```

**For slow external calls**:
```javascript
// Add caching headers
res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
```

### 9.2 Database Query Optimization

Review indexes:
```sql
-- These are already created in initial migration
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_key_usage_logs_timestamp ON public.api_key_usage_logs(timestamp);
```

## Step 10: Rollback Plan

### If deployment fails:

1. **Revert code**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Vercel auto-redeploys** on git push

3. **Or use Vercel UI**:
   - Go to **Deployments**
   - Find last working deployment
   - Click **⋯** > **Promote to Production**

### If environment variables are wrong:

1. Go to **Settings > Environment Variables**
2. Fix the incorrect variable
3. Go to **Deployments**
4. Click **⋯** > **Redeploy**

## Troubleshooting

### "502 Bad Gateway" or "500 Internal Error"

**Causes**:
- Missing environment variables
- Database connection issue
- Code error in deployment

**Solutions**:
1. Check **Deployments > Logs** for errors
2. Verify all env vars set
3. Check Supabase dashboard for status
4. Review error logs in browser console

### "Build failed"

**Causes**:
- TypeScript errors
- Missing dependencies
- Module not found

**Solutions**:
```bash
# Test build locally first
npm run build
npm run lint

# Fix errors
npm install
git commit -am "Fix build errors"
git push
```

### "Database Connection Refused"

**Causes**:
- Wrong Supabase credentials
- Firewall blocking connection
- Database down

**Solutions**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` matches project
2. Check Supabase dashboard for status
3. Verify API key permissions
4. Contact Supabase support

### "CORS error"

**Solutions**:
1. Add domain to `CORS_ORIGINS`
2. Ensure protocol is correct (https/http)
3. Redeploy after changing env vars
4. Check browser console for exact error

## Cost Optimization

### Vercel Pricing
- **Free tier**: Up to 100GB bandwidth/month, suitable for testing
- **Pro**: $20/month for production use
- **Enterprise**: Custom pricing

### Supabase Pricing
- **Free tier**: 500MB storage, good for prototypes
- **Pro**: $25/month, suitable for production
- **Enterprise**: Custom pricing

### Ways to Reduce Costs

1. **Enable Build Caching** (default in Vercel)
2. **Optimize Database Queries** (good indexes)
3. **Implement Rate Limiting** (prevent abuse)
4. **Archive Old Logs** (manage storage)
5. **Use CDN** (Vercel provides)

## Next Steps

1. [ ] Complete all deployment steps
2. [ ] Run testing checklist
3. [ ] Monitor for 24 hours
4. [ ] Update documentation
5. [ ] Plan scaling strategy
6. [ ] Setup backup procedures
7. [ ] Implement monitoring alerts
8. [ ] Train team on system

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Deployment Guide](https://supabase.com/docs/guides/hosting/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/projects/environment-variables)

## Support

If you encounter issues:

1. Check [API.md](./API.md) for endpoint details
2. Review [SECURITY.md](./SECURITY.md) for security configuration
3. Check [README_AUTH.md](./README_AUTH.md) for general help
4. Contact Vercel support (deployment issues)
5. Contact Supabase support (database issues)

---

**Happy deploying! 🚀**

Last updated: March 2026
