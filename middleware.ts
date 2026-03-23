import { NextRequest, NextResponse } from 'next/server';

/**
 * Public routes that don't require authentication.
 * All other routes will redirect to /login if no auth_token cookie is present.
 */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/request-access',
];

/**
 * Route prefixes that should always be accessible (API auth routes, static assets, etc.)
 */
const PUBLIC_PREFIXES = [
  '/api/auth/',
  '/_next/',
  '/favicon.ico',
];

function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Prefix match for public prefixes
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return true;
    }
  }

  // Allow static files (images, fonts, etc.)
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|ttf|eot|css|js|map)$/)) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect landing and auth pages directly to the dashboard
  if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/request-access') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Bypass any authentication checks for all routes and allow direct access.
  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes except Next.js internals and static files
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
