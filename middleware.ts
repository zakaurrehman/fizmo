import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Get subdomain from hostname
  // Examples: broker1.fizmo.com -> broker1, localhost:3000 -> localhost
  const subdomain = hostname.split('.')[0].split(':')[0];

  // Store broker slug in request header for API routes to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-broker-slug', subdomain);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply middleware to all routes except static files and API routes that don't need tenant context
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
