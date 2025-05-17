'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';

// Error content component
function ErrorContent({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but we encountered an unexpected error.
        </p>
        <div className="mb-6 text-left p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700 font-mono break-all">
            {error.message || 'Unknown error'}
            {error.digest && <span className="block mt-2 text-xs">Error ID: {error.digest}</span>}
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <button
            onClick={reset}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block text-primary-600 hover:text-primary-800 font-medium py-2 transition duration-150 ease-in-out"
          >
            Return to Home
          </Link>
          <Link
            href="/contact"
            className="inline-block text-gray-600 hover:text-gray-800 font-medium py-2 transition duration-150 ease-in-out"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Error component with suspense boundary
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Suspense fallback={<div>Loading error handler...</div>}>
      <ErrorContent error={error} reset={reset} />
    </Suspense>
  );
} 