import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function corsMiddleware(req: NextRequest) {
  const res = NextResponse.next();

  // Set CORS headers to allow all origins, methods, and headers
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origins in production
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE,PATCH');
  res.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization, *');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}
