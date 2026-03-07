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

  // Allow public routes through
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and tries to access login/signup, redirect to dashboard
    const authToken = request.cookies.get('auth_token')?.value;
    if (authToken && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check for auth token cookie
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    // Redirect to login with the original URL as a callback parameter
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow the request through
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
