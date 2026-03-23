# Iora Technology Platform

A Next.js platform for ESG (Environmental, Social, Governance) metrics, compliance tracking, and risk analysis.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **Auth**: Custom token + API key authentication
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Environment Variables

Create a `.env` file based on `.env.example`, or set these in your deployment environment:

```env
# MongoDB
MONGO_URL=mongodb+srv://<user>:<password>@<host>/?appName=Cluster0
DB_NAME=ioratech

# JWT
JWT_SECRET=<your-secret>

# API Keys
API_KEY_HASH_SECRET=<your-secret>
API_KEY_PREFIX=sk_

# Rate Limiting
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60

# CORS
CORS_ORIGINS=*
```

### Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

## Deployment to Vercel

1. Fork or push this repo to GitHub
2. Import into Vercel
3. Add environment variables in Vercel project settings (see `.env.example` for full list)
4. Deploy

The `next.config.js` is pre-configured for Vercel serverless with `output: 'standalone'`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `POST /api/auth/reset-password` — Request/reset password

### Profile
- `GET/PUT /api/profile` — Get/update user profile

### API Keys
- `POST /api/api-keys/create` — Create API key
- `GET /api/api-keys/list` — List user's API keys
- `DELETE /api/api-keys/revoke` — Revoke API key
- `POST /api/api-keys/validate` — Validate API key

## Features

- User authentication with session tokens and API keys
- Dashboard with carbon metrics, compliance, and risk analysis
- Scenario simulator
- Role-based access control (owner, admin, member, viewer)
- Audit logging
- Rate limiting
