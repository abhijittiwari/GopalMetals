import { MetadataRoute } from 'next';

/**
 * Generate robots.txt rules for the website
 * This controls how search engines crawl the site
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',    // Don't index admin pages
        '/api/',      // Don't index API routes
        '/_next/',    // Don't index Next.js system files
        '/login',     // Don't index login page
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 