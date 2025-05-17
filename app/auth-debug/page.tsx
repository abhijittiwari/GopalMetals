'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  async function testSignIn() {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      console.log('Session data:', data);
    } catch (err) {
      setError('Error fetching session: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Session fetch error:', err);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold">Auth Status</h2>
        <pre className="bg-white p-2 rounded mt-2 overflow-auto max-h-60">
          {status === 'loading' ? 'Loading...' : JSON.stringify({ session, status }, null, 2)}
        </pre>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={testSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Session API
        </button>
        
        <a 
          href="/admin/login" 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
        >
          Go to Admin Login
        </a>
      </div>
    </div>
  );
} 