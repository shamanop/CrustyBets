import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  console.log(`[MIDDLEWARE] Incoming request: ${method} ${pathname} (full URL: ${request.nextUrl.toString()})`);

  // API routes: check for auth on protected endpoints
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/agents/register') && !pathname.startsWith('/api/debug/')) {
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    // Allow browser sessions (cookie-based auth) through
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
                          request.cookies.get('__Secure-next-auth.session-token');

    console.log(`[MIDDLEWARE] Auth check for ${pathname}: authHeader=${!!authHeader}, apiKey=${!!apiKey}, sessionCookie=${!!sessionCookie}`);

    if (!apiKey && !sessionCookie) {
      // Allow public endpoints
      if (pathname === '/api/leaderboard') {
        console.log(`[MIDDLEWARE] Allowed public endpoint: ${pathname}`);
        return NextResponse.next();
      }
      console.log(`[MIDDLEWARE] Blocked (401): ${method} ${pathname} - no auth credentials`);
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Pass API key in header for downstream use
    if (apiKey) {
      console.log(`[MIDDLEWARE] Passed through with API key: ${method} ${pathname}`);
      const response = NextResponse.next();
      response.headers.set('x-api-key', apiKey);
      return response;
    }

    console.log(`[MIDDLEWARE] Passed through with session cookie: ${method} ${pathname}`);
  } else {
    console.log(`[MIDDLEWARE] Non-protected route, passing through: ${method} ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
