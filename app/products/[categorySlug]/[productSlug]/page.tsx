'use server';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { generateProductMetadata } from '@/components/SEO/ProductSEO';
import ProductSEO from '@/components/SEO/ProductSEO';
import { getServerSettings } from '@/lib/getServerSettings';
import { WebPageJsonLd } from '@/components/SEO/JsonLd';

type ProductPageProps = {
  params: {
    categorySlug: string;
    productSlug: string;
  };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = params;
  
  // Fetch product data
  const product = await prisma.product.findFirst({
    where: { 
      slug: productSlug,
      category: {
        slug: categorySlug,
      },
    },
    include: {
      category: true,
    },
  });
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
  
  const productSEOData = {
    name: product.name,
    description: product.description || `${product.name} - High quality wire mesh product from Gopal Metals.`,
    category: product.category.name,
    slug: product.slug,
    imageUrl: product.images?.split(',')[0] || '/images/product-placeholder.jpg',
    price: product.price?.toString(),
    availability: 'InStock' as const,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.category.name, url: `/products/${categorySlug}` },
      { name: product.name, url: `/products/${categorySlug}/${productSlug}` },
    ],
    keywords: [
      product.name,
      product.category.name,
      'wire mesh',
      'metal products',
      'industrial supplies',
    ],
  };
  
  return generateProductMetadata(productSEOData);
}

// Generate static paths for all products
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  });
  
  return products.map((product) => ({
    categorySlug: product.category.slug,
    productSlug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = params;
  
  // Fetch settings for JsonLd
  const settings = await getServerSettings();
  
  // Fetch product data
  const product = await prisma.product.findFirst({
    where: { 
      slug: productSlug,
      category: {
        slug: categorySlug,
      },
    },
    include: {
      category: true,
    },
  });
  
  if (!product) {
    notFound();
  }
  
  // Prepare images array
  const images = product.images ? product.images.split(',') : [];
  const mainImage = images[0] || '/images/product-placeholder.jpg';
  
  // Parse specifications if they exist
  let specifications: Record<string, string> = {};
  if (product.specifications) {
    try {
      specifications = JSON.parse(product.specifications);
    } catch (e) {
      console.error('Error parsing product specifications:', e);
    }
  }
  
  // SEO Data
  const productSEOData = {
    name: product.name,
    description: product.description || `${product.name} - High quality wire mesh product from Gopal Metals.`,
    category: product.category.name,
    slug: product.slug,
    imageUrl: mainImage,
    price: product.price?.toString(),
    availability: 'InStock' as const,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.category.name, url: `/products/${categorySlug}` },
      { name: product.name, url: `/products/${categorySlug}/${productSlug}` },
    ],
    specifications,
  };
  
  return (
    <>
      <WebPageJsonLd 
        title={`${product.name} - ${product.category.name} - Gopal Metals`}
        description={product.description || `High-quality ${product.name} from Gopal Metals.`}
        url={`/products/${categorySlug}/${productSlug}`}
        settings={settings}
      />
      
      {/* SEO Component */}
      <ProductSEO product={productSEOData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
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
              <Link href={`/products/${categorySlug}`} className="ml-2 text-gray-500 hover:text-gray-700">
                {product.category.name}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Image gallery */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
                    <div className="relative h-24">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 12vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Category: <Link href={`/products/${categorySlug}`} className="text-primary-600 hover:text-primary-500">
                  {product.category.name}
                </Link>
              </p>
            </div>
            
            {product.price && (
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                  <span className="text-sm text-gray-600 ml-2 line-through">
                    ₹{Math.round(product.price * 1.15).toLocaleString('en-IN')}
                  </span>
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {product.description || 'No description available for this product.'}
              </div>
            </div>
            
            {/* Specifications */}
            {Object.keys(specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="border-t border-gray-200">
                  {Object.entries(specifications).map(([key, value], index) => (
                    <div key={key} className={`py-4 ${index !== Object.keys(specifications).length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <dt className="text-sm font-medium text-gray-600">{key}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA */}
            <div className="mt-8 space-y-4">
              <p className="text-base text-gray-700">
                For more information or to place an order, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <Link 
                  href="/contact?product=true" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Request Quote
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 