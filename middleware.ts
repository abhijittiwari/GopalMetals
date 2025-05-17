import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic middleware without auth checking for debugging
export function middleware(request: NextRequest) {
  // Only log the path for now
  console.log('Middleware accessed path:', request.nextUrl.pathname);
  return NextResponse.next();
}

// Temporarily disable middleware by not matching any paths
export const config = {
  matcher: []
}; 