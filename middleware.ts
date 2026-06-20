import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = [
  "/api/auth/",
  "/_next/",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }

  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|ttf|eot|css|js|map)$/)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
