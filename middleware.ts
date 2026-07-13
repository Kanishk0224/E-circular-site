// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes: Record<string, string> = {
  '/staff': 'staff',
  '/hod': 'hod',
  '/principal': 'principal',
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const matchedRoute = Object.keys(protectedRoutes).find((r) => path.startsWith(r));

  if (matchedRoute) {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(decodeURIComponent(session)); // { email, role }

      if (user.role !== protectedRoutes[matchedRoute]) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      // Cookie exists but is malformed/tampered with — treat as logged out
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/:path*', '/hod/:path*', '/principal/:path*'],
};