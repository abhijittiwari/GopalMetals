'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardNew() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard (New)</h1>
          <p className="text-gray-600">Welcome to the Gopal Metals admin panel.</p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardCard 
            title="Products" 
            count="0" 
            link="/admin/products" 
            icon="📦" 
          />
          <DashboardCard 
            title="Categories" 
            count="0" 
            link="/admin/categories" 
            icon="🗂️" 
          />
          <DashboardCard 
            title="Contact Submissions" 
            count="0" 
            link="/admin/contacts" 
            icon="📧" 
          />
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/products/new" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add New Product
            </Link>
            <Link href="/admin/categories/new" className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add New Category
            </Link>
            <Link href="/" className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
              View Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, count, link, icon }: { title: string, count: string, link: string, icon: string }) {
  return (
    <Link href={link} className="block">
      <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </div>
    </Link>
  );
} 