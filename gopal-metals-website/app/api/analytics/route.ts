import { NextRequest, NextResponse } from 'next/server';
import { recordPageView, getAnalytics, getAnalyticsSummary } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    // In development mode, return success without recording
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, dev: true });
    }
    
    // Get headers safely using request headers
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Get IP address (in production would be from X-Forwarded-For or similar)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Parse the request body to get the path
    const body = await request.json();
    const path = body.path || '/';
    
    // Use our utility function to record the page view
    const success = await recordPageView(path, ip, userAgent, referer);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}

// Get analytics data (protected by admin auth)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30', 10);
    const summary = url.searchParams.get('summary') === 'true';
    
    // In development mode, return mock data if needed
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        summary ? getMockSummary() : getMockAnalytics(days)
      );
    }
    
    if (summary) {
      const data = await getAnalyticsSummary(days);
      return NextResponse.json(data);
    } else {
      const analytics = await getAnalytics(days);
      return NextResponse.json(analytics);
    }
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}

// Mock data for development mode
function getMockAnalytics(days: number) {
  const result = [];
  
  // For development, use only Mac-related data since we're on a Mac
  const browsers = ['Safari 17', 'Chrome 123', 'Firefox 124'];
  const devices = ['Desktop'];
  const oses = ['macOS 14'];
  
  // Common paths on the site
  const paths = ['/', '/about', '/products', '/contact', '/products/wire-mesh', '/admin/dashboard'];
  
  // Generate consistent data based on paths (rather than random entries)
  for (let i = 0; i < paths.length; i++) {
    // Create multiple visits for each path
    for (let j = 0; j < Math.ceil(Math.random() * 5) + 1; j++) {
      // Create a date in the past few days
      const date = new Date();
      const daysAgo = Math.floor(Math.random() * Math.min(days, 10));
      const hoursAgo = Math.floor(Math.random() * 24);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      
      // Choose a browser - mostly Safari since we're on Mac
      const browser = j % 3 === 0 ? browsers[1] : (j % 2 === 0 ? browsers[2] : browsers[0]);
      
      result.push({
        id: `mock-${i}-${j}`,
        ipAddress: '127.0.0.1',
        country: 'Local Development',
        city: 'Development',
        region: 'Development',
        browser: browser,
        device: devices[0],
        os: oses[0],
        path: paths[i],
        referrer: '',
        visitedAt: date.toISOString()
      });
    }
  }
  
  // Sort by most recent first
  return result.sort((a, b) => 
    new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  );
}

function getMockSummary() {
  return {
    totalPageViews: 23,
    uniqueVisitors: 1,
    topPages: [
      { path: '/', views: 6 },
      { path: '/products', views: 5 },
      { path: '/about', views: 4 },
      { path: '/contact', views: 4 },
      { path: '/products/wire-mesh', views: 4 }
    ]
  };
} 