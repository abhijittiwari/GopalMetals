'use client';

import { Suspense } from 'react';

// Global error content component
function GlobalErrorContent({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: '#e53e3e', marginBottom: '16px', fontSize: '24px' }}>
              Critical Error
            </h1>
            <p style={{ color: '#4a5568', marginBottom: '24px' }}>
              The application encountered a critical error and cannot continue.
            </p>
            
            <div style={{ 
              background: '#f7fafc', 
              padding: '12px', 
              borderRadius: '4px',
              marginBottom: '24px',
              fontFamily: 'monospace',
              fontSize: '14px',
              wordBreak: 'break-all',
              textAlign: 'left'
            }}>
              {error.message || 'Unknown error'}
              {error.digest && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  Error ID: {error.digest}
                </div>
              )}
            </div>
            
            <button
              onClick={reset}
              style={{
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

// Global Error component with suspense boundary
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Suspense fallback={<div>Loading error handler...</div>}>
      <GlobalErrorContent error={error} reset={reset} />
    </Suspense>
  );
} 