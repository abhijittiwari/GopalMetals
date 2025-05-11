'use server';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getServerSettings } from '@/lib/getServerSettings';
import { WebPageJsonLd } from '@/components/SEO/JsonLd';

// Define types based on the prisma schema
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string | null;
  price: number | null;
  categoryId: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  };
}

// Make the component async to fetch data
export default async function ProductsPage() {
  // Fetch settings
  const settings = await getServerSettings();
  
  // Fetch categories from database
  const categories = await prisma.category.findMany();
  
  // Fetch featured products from database
  const featuredProducts = await prisma.product.findMany({
    where: {
      featured: true
    },
    include: {
      category: true
    },
    take: 4
  });

  return (
    <>
      <WebPageJsonLd 
        title="Our Products - Gopal Metals"
        description="Explore our complete range of high-quality metal products."
        url="/products"
        settings={settings}
      />
      
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-xl font-semibold mb-2">Quality control is our top Priority</p>
            <p className="text-xl max-w-3xl">
              Delivering exceptional metal products with precision and reliability
            </p>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-effect">
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={category.image || "/images/placeholder.svg"} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">Available in various patterns and materials</p>
                    <Link 
                      href={`/products/${category.slug}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      View Products <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-effect">
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={product.images || "/images/placeholder.svg"} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full mb-2">
                      {product.category.name}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description || 'No description available'}
                    </p>
                    <Link 
                      href={`/products/${product.category.slug}/${product.slug}`}
                      className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                    >
                      Know More <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Request Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Product?</h2>
                <p className="text-gray-600 mb-6">
                  We can manufacture wire mesh products to your exact specifications. Contact our team to discuss your requirements.
                </p>
                <Link 
                  href="/contact"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-effect"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 