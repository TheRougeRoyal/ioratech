---
name: vercel-deploy
description: Prepare a Next.js project for Vercel deployment — fix config, split Firebase client/server, generate lockfile, set env vars.
---

# Vercel Deployment Readiness

Checklist-driven workflow to make a Next.js project deployable on Vercel. Derived from repeated deployment fixes across ioratech, bo, markov, bollingerbands-backtest, and psychic-waffle projects.

## When to use

- User asks to "deploy to Vercel", "make it Vercel-ready", or "make it deployable"
- Project has client-side crashes or token failures after deploying to Vercel
- Project uses Firebase and fails on Vercel's serverless runtime

## Checklist

Work through each item. Skip only if verified not applicable.

### 1. `next.config.js` / `next.config.mjs`

- Remove `output: 'standalone'` — this is Docker-only, causes build failures on Vercel
- Remove `NODE_ENV=development` overrides — Vercel sets this to `production`
- Add `transpilePackages: ['recharts', 'firebase']` if using these libraries — webpack tree-shaking can strip exports like `Cell` that are only used as JSX children
- Verify no hardcoded `localhost` URLs in config

### 2. Package manager & lockfile

- Vercel needs a lockfile (`package-lock.json` or `yarn.lock`) for deterministic installs
- Remove `packageManager` field from `package.json` if it conflicts with the lockfile present
- Generate lockfile: `npm install` (preferred) or `yarn install`
- Do NOT mix npm and yarn — pick one and be consistent

### 3. Environment variables

- `NEXT_PUBLIC_API_URL` must be empty or point to the Vercel domain — never `localhost:3000`
- `NEXT_PUBLIC_*` env vars must be set in the Vercel dashboard — they are NOT deployed from `.env.local`
- Move secrets (`JWT_SECRET`, `API_KEY_HASH_SECRET`, etc.) to Vercel dashboard env vars
- For Firebase: set all `NEXT_PUBLIC_FIREBASE_*` vars in Vercel dashboard
- In Firebase Console → Authentication → Settings → Authorized Domains → add the `.vercel.app` domain

### 4. Firebase client/server split (critical for Next.js + Firebase)

**Problem**: `getAuth()` from `firebase/auth` crashes in Vercel's serverless runtime when imported server-side. `getFirestore()` works fine server-side.

**Solution**: Split into two files:

- `lib/firebase.ts` (NO `"use client"`) — exports only `app` and `db` (Firestore). Safe for server-side API routes.
- `lib/auth.ts` (`"use client"`) — creates its own `getAuth(app)` instance. Browser-only auth APIs go here.

**Why**: Next.js API routes run server-side. If `firebase.ts` calls `getAuth()`, the serverless function crashes with "client-side exception".

### 5. `"use client"` directives

- Any file using browser-only APIs (`signInWithPopup`, `createUserWithEmailAndPassword`, `window`, `localStorage`) MUST have `"use client"` at the top
- Without it, Next.js tries to import the file server-side during SSR and crashes
- Common offenders: auth context providers, Firebase auth wrappers, files using `document` or `window`

### 6. Vercel-incompatible Node.js APIs

- `Buffer.from()` may not exist in Vercel serverless — use `atob()` for base64 decoding instead
- `fs.readFileSync` / `fs.writeFileSync` — serverless functions are read-only filesystem; avoid
- `process.env` works but only for vars set in Vercel dashboard

### 7. Build verification

- Run `npm run build` locally before pushing — catch errors before Vercel
- Common build failures: missing `"use client"`, webpack tree-shaking stripped exports, TypeScript errors in `.js` files
- `.js` files cannot use TypeScript `as` syntax — webpack rejects it

### 8. API route compatibility

- API routes in `app/api/` run as serverless functions on Vercel
- No long-running processes (> 10s on Hobby plan)
- Verify `requireAuth()` middleware works with Firebase ID tokens (not session cookies)
- For token verification: fetch Google public keys from `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`, cache for 1 hour

## Known gotchas (from real deployments)

| Symptom | Root cause | Fix |
|---|---|---|
| "Application error: client-side exception" | `getAuth()` called at module load, imported server-side | Split Firebase into server-safe `firebase.ts` and client-only `auth.ts` |
| "Invalid or expired tokens" | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` not set on Vercel | Add all `NEXT_PUBLIC_*` vars to Vercel dashboard |
| `Buffer is not defined` | `Buffer.from()` used in serverless function | Replace with `atob()` |
| `Cell is not defined` (Recharts) | Webpack tree-shaking strips `Cell` export | Add `transpilePackages: ['recharts']` to next.config |
| Build fails with `output: 'standalone'` | Standalone is Docker-only | Remove `output` from next.config |
| Yarn/npm mismatch | `packageManager: yarn` in package.json but `package-lock.json` present | Remove `packageManager` field, regenerate lockfile with one tool |
| Firebase `configuration-not-found` | Firebase config not in Vercel env vars | Set `NEXT_PUBLIC_FIREBASE_*` in Vercel dashboard |

## Procedure

1. Run `git status` and read `next.config.js`, `package.json`, `.env.local`
2. Work through checklist items 1-6
3. Run `npm run build` to verify
4. Run `git add . && git commit && git push origin main` to deploy (Vercel auto-deploys from main)
5. Remind user to set env vars in Vercel dashboard if not already done

## Output

- List of changes made with rationale
- Any remaining manual steps (Vercel dashboard env vars, Firebase authorized domains)
- Verification that `npm run build` passes
