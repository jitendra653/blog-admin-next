import { corsMiddleware } from './middleware/cors';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Apply CORS middleware
  const corsResponse = corsMiddleware(req);
  if (corsResponse) {
    return corsResponse;
  }

  // Proceed with authentication after CORS
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

// Config to apply the middleware to the desired routes
export const config = {
  matcher: ['/admin/:path*', '/'], // Matches any path under "/admin" and the root "/"
};
