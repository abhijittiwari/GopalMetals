'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch product and category counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // You would replace these with actual API calls
        // For now, we'll just set some placeholder values
        setProductCount(24);
        setCategoryCount(8);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {/* Stat Card - Products */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {productCount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/products" className="font-medium text-primary-600 hover:text-primary-500">
                    Manage Products
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Stat Card - Categories */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Product Categories</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {categoryCount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/categories" className="font-medium text-primary-600 hover:text-primary-500">
                    Manage Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings Quick Access */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-5 py-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Website Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/settings?tab=contact"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Contact Information</h3>
                    <p className="text-sm text-gray-500">Update company contact details</p>
                  </div>
                </Link>
                
                <Link
                  href="/admin/settings?tab=social"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Social Media</h3>
                    <p className="text-sm text-gray-500">Configure social media links</p>
                  </div>
                </Link>
                
                <Link
                  href="/admin/settings?tab=images"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Website Images</h3>
                    <p className="text-sm text-gray-500">Update logo and hero images</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-5 py-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Add New Product</h3>
                      <p className="text-sm text-gray-500">Create a new product listing</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/products/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Product
                  </Link>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Add New Category</h3>
                      <p className="text-sm text-gray-500">Create a new product category</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Category
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Google Analytics Info */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-5 py-6">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-gray-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.9991,13.5 L11.9991,7 L7,7 L7,17 L17,17 L17,13.5 L11.9991,13.5 Z M20,3 L20,1 L18,1 L18,3 L6,3 L6,1 L4,1 L4,3 L0,3 L0,21 L24,21 L24,3 L20,3 Z M22,19 L2,19 L2,8 L22,8 L22,19 Z M22,6 L2,6 L2,5 L22,5 L22,6 Z" />
                </svg>
                <h2 className="text-lg font-medium text-gray-900">Website Analytics</h2>
              </div>
              <p className="mb-3 text-gray-600">
                This website is integrated with Google Analytics for tracking visitor statistics. 
                You can access your full analytics data directly through the Google Analytics dashboard.
              </p>
              <a 
                href="https://analytics.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Open Google Analytics
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}