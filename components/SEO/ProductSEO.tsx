'use client';

import { ProductJsonLd, WebPageJsonLd } from './JsonLd';
import { Metadata } from 'next';
import Head from 'next/head';

type ProductSEOProps = {
  product: {
    name: string;
    description: string;
    category: string;
    slug: string;
    imageUrl: string;
    price?: string;
    availability?: 'InStock' | 'OutOfStock';
    breadcrumbs: Array<{
      name: string;
      url: string;
    }>;
    specifications?: Record<string, string>;
    keywords?: string[];
  };
};

/**
 * ProductSEO Component
 * Adds all necessary SEO elements for product pages including:
 * - Meta tags
 * - JSON-LD structured data
 * - Breadcrumb markup
 */
export default function ProductSEO({ product }: ProductSEOProps) {
  const {
    name,
    description,
    category,
    slug,
    imageUrl,
    price,
    availability = 'InStock',
    breadcrumbs,
    specifications,
    keywords = [],
  } = product;

  // Generate canonical URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com';
  const canonicalUrl = `${baseUrl}/products/${slug}`;

  return (
    <>
      <Head>
        {/* Product specific meta tags */}
        <meta property="product:brand" content="Gopal Metals" />
        <meta property="product:availability" content={availability} />
        {price && <meta property="product:price:amount" content={price} />}
        {price && <meta property="product:price:currency" content="INR" />}
        
        {/* Add breadcrumb data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': crumb.name,
                'item': `${baseUrl}${crumb.url}`,
              })),
            }),
          }}
        />
      </Head>

      {/* Product structured data */}
      <ProductJsonLd
        name={name}
        description={description}
        imageUrl={imageUrl}
        category={category}
        price={price}
        availability={availability}
      />

      {/* Webpage structured data */}
      <WebPageJsonLd
        title={`${name} | Gopal Metals`}
        description={description}
        url={canonicalUrl}
      />
    </>
  );
}

/**
 * Helper function to generate metadata for product pages
 */
export function generateProductMetadata(product: ProductSEOProps['product']): Metadata {
  const keywords = [
    ...product.keywords || [],
    'wire mesh',
    'metal products',
    product.category,
    'India',
    'quality products',
  ];

  return {
    title: `${product.name} | Gopal Metals`,
    description: product.description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/products/${product.slug}`,
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
      siteName: 'Gopal Metals',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
} 