import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Set CORS headers globally
  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your specific origin in production
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  // Redirect unauthenticated users from admin pages
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect authenticated users from home to admin
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Apply CORS headers to the response and proceed
  return res;
}

// Config to apply the middleware to the desired routes
export const config = {
  matcher: ["/admin/:path*", "/"], // Matches any path under "/admin" and the root "/"
};
