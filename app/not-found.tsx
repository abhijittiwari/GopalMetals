'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// Component that uses search params (wrapped in suspense)
function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-primary-600 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Return to Home
          </Link>
          <Link
            href="/products"
            className="inline-block text-primary-600 hover:text-primary-800 font-medium py-2 transition duration-150 ease-in-out"
          >
            Browse Products
          </Link>
          <Link
            href="/contact"
            className="inline-block text-gray-600 hover:text-gray-800 font-medium py-2 transition duration-150 ease-in-out"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with suspense boundary
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 