'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define types for our data
interface DashboardData {
  counts: {
    products: number;
    categories: number;
    contactSubmissions: number;
  };
  recentContactSubmissions: {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
          <div className="mt-4 text-xl font-semibold text-gray-700">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-red-600">Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the Gopal Metals admin panel.</p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardCard 
            title="Products" 
            count={data?.counts.products.toString() || "0"} 
            link="/admin/products" 
            icon="📦" 
          />
          <DashboardCard 
            title="Categories" 
            count={data?.counts.categories.toString() || "0"} 
            link="/admin/categories" 
            icon="🗂️" 
          />
          <DashboardCard 
            title="Contact Submissions" 
            count={data?.counts.contactSubmissions.toString() || "0"} 
            link="/admin/contacts" 
            icon="📧" 
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Recent Inquiries</h2>
            {data?.recentContactSubmissions && data.recentContactSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.recentContactSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{submission.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{submission.subject}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No recent inquiries found.</p>
            )}
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