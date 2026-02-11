import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// =============================================================================
// In-Memory Rate Limiter (sliding window)
// =============================================================================

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const windowMs = 60 * 1000;
  for (const [key, entry] of rateLimitStore.entries()) {
    const recent = entry.timestamps.filter((t) => now - t < windowMs);
    if (recent.length === 0) {
      rateLimitStore.delete(key);
    } else {
      entry.timestamps = recent;
    }
  }
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanupStaleEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(key) || { timestamps: [] };

  // Filter to only timestamps within the sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  const remaining = Math.max(0, maxRequests - entry.timestamps.length);
  const resetTime =
    entry.timestamps.length > 0
      ? Math.ceil((entry.timestamps[0] + windowMs) / 1000)
      : Math.ceil((now + windowMs) / 1000);

  if (entry.timestamps.length >= maxRequests) {
    rateLimitStore.set(key, entry);
    return { allowed: false, remaining: 0, resetTime };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return { allowed: true, remaining: remaining - 1, resetTime };
}

// =============================================================================
// Helpers
// =============================================================================

// Public endpoints exempt from strict rate limiting
const PUBLIC_PATHS = ['/api/leaderboard', '/api/docs'];

function isGameAction(pathname: string): boolean {
  return pathname.startsWith('/api/games/');
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  resetTime: number,
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(resetTime));
  return response;
}

// =============================================================================
// Middleware
// =============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  console.log(`[MIDDLEWARE] Incoming request: ${method} ${pathname} (full URL: ${request.nextUrl.toString()})`);

  // Handle CORS preflight for API routes
  if (method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response);
  }

  // =========================================================================
  // Rate Limiting + Auth for API routes
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    const clientIP = getClientIP(request);
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

    // Public endpoints: skip rate limiting, add CORS, pass through
    if (isPublic) {
      console.log(`[MIDDLEWARE] Allowed public endpoint: ${pathname}`);
      const response = NextResponse.next();
      return addCorsHeaders(response);
    }

    // Apply rate limiting to all non-public API routes
    const isGame = isGameAction(pathname);
    const limit = isGame ? 10 : 60;
    const rateLimitKey = `${clientIP}:${isGame ? 'game' : 'general'}`;
    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, limit);

    if (!allowed) {
      console.log(`[MIDDLEWARE] Rate limited (429): ${clientIP} on ${pathname}`);
      const response = NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Slow down, crusty friend.',
          retryAfter: resetTime - Math.floor(Date.now() / 1000),
        },
        { status: 429 },
      );
      addRateLimitHeaders(response, limit, 0, resetTime);
      addCorsHeaders(response);
      return response;
    }

    // Skip auth check for registration, debug, and auth routes
    if (
      pathname.startsWith('/api/agents/register') ||
      pathname.startsWith('/api/debug/') ||
      pathname.startsWith('/api/auth/')
    ) {
      console.log(`[MIDDLEWARE] Non-protected API route, passing through: ${method} ${pathname}`);
      const response = NextResponse.next();
      addRateLimitHeaders(response, limit, remaining, resetTime);
      addCorsHeaders(response);
      return response;
    }

    // Auth check for protected endpoints
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    // NextAuth v5 uses authjs.session-token, v4 uses next-auth.session-token
    const sessionCookie =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    console.log(
      `[MIDDLEWARE] Auth check for ${pathname}: authHeader=${!!authHeader}, apiKey=${!!apiKey}, sessionCookie=${!!sessionCookie}`,
    );

    if (!apiKey && !sessionCookie) {
      console.log(`[MIDDLEWARE] Blocked (401): ${method} ${pathname} - no auth credentials`);
      const response = NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
      addRateLimitHeaders(response, limit, remaining, resetTime);
      addCorsHeaders(response);
      return response;
    }

    // Pass API key in header for downstream use
    if (apiKey) {
      console.log(`[MIDDLEWARE] Passed through with API key: ${method} ${pathname}`);
      const response = NextResponse.next();
      response.headers.set('x-api-key', apiKey);
      addRateLimitHeaders(response, limit, remaining, resetTime);
      addCorsHeaders(response);
      return response;
    }

    console.log(`[MIDDLEWARE] Passed through with session cookie: ${method} ${pathname}`);
    const response = NextResponse.next();
    addRateLimitHeaders(response, limit, remaining, resetTime);
    addCorsHeaders(response);
    return response;
  }

  // Non-API routes pass through
  console.log(`[MIDDLEWARE] Non-API route, passing through: ${method} ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
