# Iora Technology Platform

ESG metrics, compliance tracking, risk analysis, and scenario simulation platform with an integrated ML service.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **Auth**: Firebase Authentication
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **ML Service**: FastAPI (Python 3.11) on Render
- **Deployment**: Vercel (frontend) + Render (ML service)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase project

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# API
NEXT_PUBLIC_API_URL=

# JWT
JWT_SECRET=

# API Keys
API_KEY_HASH_SECRET=
API_KEY_PREFIX=sk_

# Rate Limiting
RATE_LIMIT_AUTH_PER_MINUTE=5
RATE_LIMIT_API_PER_MINUTE=60

# CORS
CORS_ORIGINS=

# ML Service (optional)
NEXT_PUBLIC_ML_API=https://iora-ml.onrender.com
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

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Add environment variables in project settings
4. Deploy

### ML Service (Render)

| Field    | Value                    |
|----------|--------------------------|
| Runtime  | Python 3.11              |
| Build    | `cd ml && pip install -r requirements.txt` |
| Start    | `cd ml && uvicorn main:app --host 0.0.0.0 --port $PORT` |

After deploy, set `NEXT_PUBLIC_ML_API` in Vercel and redeploy.

Verify: `curl https://iora-ml.onrender.com/ml/health`

## Features

- **Landing page**: Hero, capabilities, how it works, industries, pricing, contact
- **Dashboard**: Carbon metrics, compliance, risk analysis, scenario simulator, reports
- **Authentication**: Firebase auth with signup, login, password reset
- **API keys**: Create, list, validate, revoke
- **Role-based access**: Owner, admin, member, viewer
- **Team management**: Invite, manage, and remove team members
- **Rate limiting**
- **Footer pages**: About, contact, blog, docs, API docs, status, security, DPA, privacy, terms, careers

## ML API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/ml/health`           | Health check                         |
| POST   | `/ml/forecast`         | Time-series forecasting              |
| POST   | `/ml/risk-score`       | ESG risk scoring                     |
| POST   | `/ml/anomaly-detect`   | Anomaly detection                    |
| POST   | `/ml/compliance-analyze` | Compliance analysis                |

## API Routes

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | `/api/auth/signup`        | Create account        |
| POST   | `/api/auth/login`         | Login                 |
| POST   | `/api/auth/logout`        | Logout                |
| POST   | `/api/auth/reset-password`| Reset password        |
| GET/PUT| `/api/profile`            | Get/update profile    |
| POST   | `/api/api-keys/create`    | Create API key        |
| GET    | `/api/api-keys/list`      | List API keys         |
| DELETE | `/api/api-keys/revoke`    | Revoke API key        |
| POST   | `/api/api-keys/validate`  | Validate API key      |
| GET    | `/api/dashboard/data`     | Dashboard data        |
| GET    | `/api/team/members`       | List team members     |
| POST   | `/api/team/members`       | Invite team member    |
| DELETE | `/api/team/members?id=`   | Remove team member    |
