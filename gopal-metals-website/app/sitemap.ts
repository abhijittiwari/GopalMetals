import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * Generate a sitemap for the Gopal Metals website
 * This helps search engines discover and index your pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com';
  
  // Get all products
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      updatedAt: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  });
  
  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });
  
  // Static pages with their last update time
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];
  
  // Generate product URLs
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.category.slug}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Generate category URLs
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  // Combine all URLs
  return [...staticPages, ...categoryUrls, ...productUrls];
} 