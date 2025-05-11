import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This middleware tracks analytics and protects admin routes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Track analytics for all pages except API routes and admin dashboard
  // Skip analytics in development to avoid issues with missing libraries
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev && !pathname.startsWith('/api/') && !pathname.startsWith('/admin/')) {
    // Use a server-side fetch to avoid client-side tracking issues
    try {
      // Clone the URL for the analytics API
      const analyticsUrl = new URL('/api/analytics', request.url);
      
      // Create a fetch request in the background
      // In a real app, you might want to use a more robust solution
      fetch(analyticsUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: pathname,
        }),
      }).catch(error => {
        console.error('Failed to track analytics:', error);
      });
    } catch (error) {
      console.error('Analytics middleware error:', error);
      // Continue processing even if analytics fails
    }
  }
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If not authenticated, redirect to login
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Check if the user has admin role
    if (token.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 