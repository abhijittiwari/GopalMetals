'use client';

import { useState, useEffect } from 'react';
import { getServerSettings } from '@/lib/getServerSettings';
import Script from 'next/script';
import { WebsiteSettings } from '@/lib/settings';

// Organization JSON-LD
export function OrganizationJsonLd({ settings }: { settings: WebsiteSettings }) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.contactInfo?.companyName || 'Gopal Metals',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com'}${settings?.logo?.url || '/logo.png'}`,
    sameAs: [
      settings?.socialLinks?.facebook,
      settings?.socialLinks?.twitter,
      settings?.socialLinks?.linkedin,
      settings?.socialLinks?.instagram,
      settings?.socialLinks?.youtube,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings?.contactInfo?.phone?.bangalore,
      contactType: 'customer service',
      email: settings?.contactInfo?.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.contactInfo?.address?.headOffice,
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560000',
      addressCountry: 'IN',
    },
  };

  return (
    <Script 
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(organizationData) 
      }}
    />
  );
}

// Product JSON-LD
type ProductJsonLdProps = {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: string;
  availability?: 'InStock' | 'OutOfStock';
};

export function ProductJsonLd({ 
  name, 
  description, 
  imageUrl, 
  category,
  price,
  availability = 'InStock' 
}: ProductJsonLdProps) {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: imageUrl.startsWith('http') 
      ? imageUrl 
      : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com'}${imageUrl}`,
    category,
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${availability}`,
      ...(price && { price, priceCurrency: 'INR' }),
    },
    brand: {
      '@type': 'Brand',
      name: 'Gopal Metals',
    },
  };

  return (
    <Script 
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(productData) 
      }}
    />
  );
}

// WebPage JSON-LD for generic pages
export function WebPageJsonLd({ 
  title, 
  description, 
  url,
  settings
}: { 
  title: string; 
  description: string; 
  url: string;
  settings: WebsiteSettings;
}) {
  const pageData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: settings?.contactInfo?.companyName || 'Gopal Metals',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com'}${settings?.logo?.url || '/logo.png'}`,
      }
    }
  };

  return (
    <Script 
      id="webpage-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(pageData)
      }}
    />
  );
} 