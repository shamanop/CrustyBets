import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes: check for auth on protected endpoints
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/agents/register')) {
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    // Allow browser sessions (cookie-based auth) through
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
                          request.cookies.get('__Secure-next-auth.session-token');

    if (!apiKey && !sessionCookie) {
      // Allow public endpoints
      if (pathname === '/api/leaderboard') {
        return NextResponse.next();
      }
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Pass API key in header for downstream use
    if (apiKey) {
      const response = NextResponse.next();
      response.headers.set('x-api-key', apiKey);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
