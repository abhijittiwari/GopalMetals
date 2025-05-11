'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that silently tracks page views for analytics
 * This should be added to the main layout file
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    // Track page view when route changes
    const trackPageView = async () => {
      // Skip during development to avoid polluting analytics
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics tracking disabled in development mode');
        return;
      }
      
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            path: pathname
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to track page view');
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    
    // Don't track on first render to avoid double counting
    // the initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      trackPageView();
    } else {
      trackPageView();
    }
  }, [pathname]);
  
  // This component doesn't render anything
  return null;
} 