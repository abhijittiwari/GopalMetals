import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

interface PageParams {
  params: {
    slug: string[];
  };
}

// Define Product interface to match our updated schema
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string | null;
  price: number | null;
  categoryId: string;
  featured: boolean;
  features: string | null;
  applications: string | null;
  materials: string | null;
  thickness: string | null;
  specifications: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default async function DynamicProductPage({ params }: PageParams) {
  // Properly await and destructure params
  const { slug } = params;
  const slugs = slug;

  // If we have two segments, it's a product page
  if (slugs.length === 2) {
    const [categorySlug, productSlug] = slugs;

    // Find the category
    const category = await prisma.category.findUnique({ 
      where: { slug: categorySlug } 
    });
    if (!category) notFound();

    // Find the product in this category
    const product = await prisma.product.findFirst({
      where: { 
        slug: productSlug,
        categoryId: category.id
      }
    });
    if (!product) notFound();

    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Link href={`/products/${category.slug}`} className="text-white hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {category.name}
              </Link>
            </div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-xl mt-2 max-w-3xl">{product.description?.split('\n')[0] || product.name}</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={product.images || "/images/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 text-lg mb-6">{product.description || 'No description available'}</p>
                  
                    {/* Unique Features Section */}
                    {product.features && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Unique Feature:</h3>
                        <ul className="space-y-4 list-none pl-0">
                          {product.features.split('\n').filter(Boolean).map((feature, index) => (
                            <li key={index} className="pl-8 relative">
                              <span className="absolute left-0 top-0">&bull;</span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Applications Section */}
                    {product.applications && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Applications:</h3>
                        <ul className="space-y-4 list-none pl-0">
                          {product.applications.split('\n').filter(Boolean).map((application, index) => (
                            <li key={index} className="pl-8 relative">
                              <span className="absolute left-0 top-0">&bull;</span>
                              <span className="text-gray-700 font-medium">{application.split(':')[0]}:</span>
                              <span className="text-gray-700">{application.split(':')[1] || ''}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Specifications Section */}
                    {(product.materials || product.thickness || product.specifications) && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Specifications:</h3>
                        <div className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow p-4">
                          {product.materials && (
                            <>
                              <div className="text-gray-700 font-medium">Materials Available:</div>
                              <div className="text-gray-700">{product.materials}</div>
                            </>
                          )}
                          
                          {product.thickness && (
                            <>
                              <div className="text-gray-700 font-medium">Sheet Thickness (mm):</div>
                              <div className="text-gray-700">{product.thickness}</div>
                            </>
                          )}
                          
                          {product.specifications && product.specifications.split('\n').filter(Boolean).map((spec, index) => {
                            const [key, value] = spec.split(':').map(s => s.trim());
                            return (
                              <React.Fragment key={index}>
                                <div className="text-gray-700 font-medium">{key}:</div>
                                <div className="text-gray-700">{value}</div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Interested in this product?</h3>
                  <p className="text-gray-600 mb-6">
                    Contact our team to discuss your requirements or request a quote.
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
          </div>
        </section>
      </main>
    );
  }

  // If we have one segment, it's a category page
  if (slugs.length === 1) {
    const categorySlug = slugs[0];

    // Try to find the category with this slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });
    
    // If category doesn't exist, show 404
    if (!category) {
      notFound();
    }
    
    // Fetch products in this category
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return (
      <main className="bg-gray-50 min-h-screen">
        {/* Category Header Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Link href="/products" className="text-white hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Products
              </Link>
            </div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <p className="text-xl mt-2 max-w-3xl">
              Browse our selection of {category.name.toLowerCase()} products
            </p>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-effect">
                      <div className="h-48 bg-gray-200">
                        <img 
                          src={product.images || "/images/placeholder.svg"} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description || 'No description available'}
                        </p>
                        <Link 
                          href={`/products/${category.slug}/${product.slug}`}
                          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                        >
                          Know More <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
                <p className="text-gray-600 mb-8">
                  We don't have any products listed in this category yet. Please check back later.
                </p>
                <Link 
                  href="/products" 
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-effect"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Product?</h2>
                <p className="text-gray-600 mb-6">
                  We can manufacture {category.name.toLowerCase()} to your exact specifications. Contact our team to discuss your requirements.
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
    );
  }

  // If we don't have the right number of segments, show 404
  notFound();
} 