'use server';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WebPageJsonLd } from '@/components/SEO/JsonLd';
import { generateMetadata as generateSEOMetadata } from '@/components/SEO/Metadata';
import { getServerSettings } from '@/lib/getServerSettings';

// Using 'any' type for Next.js 15 compatibility

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: any) {
  const { categorySlug } = params;
  
  // Fetch category data
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
  
  return generateSEOMetadata({
    title: `${category.name} - Wire Mesh Products | Gopal Metals`,
    description: `Browse our selection of high-quality ${category.name.toLowerCase()} wire mesh products. Manufactured with precision and available in various specifications.`,
    keywords: [
      category.name,
      'wire mesh',
      'metal products',
      category.name.toLowerCase() + ' products',
      'industrial supplies',
      'India',
    ],
    url: `/products/${categorySlug}`,
    type: 'website',
  });
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });
  
  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: any) {
  const { categorySlug } = params;
  
  // Fetch settings for the JsonLd component
  const settings = await getServerSettings();

  // Fetch category with related products
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
  
  if (!category) {
    notFound();
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com';
  const canonicalUrl = `${baseUrl}/products/${categorySlug}`;
  
  return (
    <>
      {/* Structured data for the webpage */}
      <WebPageJsonLd 
        title={`${category.name} Products - Gopal Metals`}
        description={`Explore our collection of high-quality ${category.name.toLowerCase()} products.`}
        url={`/products/${category.slug}`}
        settings={settings}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs for SEO and user navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/products" className="ml-2 text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium" aria-current="page">
                {category.name}
              </span>
            </li>
          </ol>
        </nav>
        
        {/* Category header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
        </header>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${categorySlug}/${product.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-4 aspect-h-3 relative h-48">
                  {product.images ? (
                    <Image
                      src={product.images.split(',')[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {category.products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No products available in this category yet. Please check back later.
            </p>
          </div>
        )}
      </div>
    </>
  );
} 