'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Dashboard component that will show statistics and recent activities
export default function AdminDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    contactSubmissions: 0,
  });

  // Mock data - in a real app this would come from an API
  const recentActivity = [
    { id: 1, type: 'product', action: 'created', name: 'Galvanized Welded Mesh', user: 'Admin', time: '2 hours ago' },
    { id: 2, type: 'category', action: 'updated', name: 'Welded Mesh', user: 'Admin', time: '3 hours ago' },
    { id: 3, type: 'user', action: 'created', name: 'Support Staff', user: 'Admin', time: '1 day ago' },
    { id: 4, type: 'contact', action: 'received', name: 'Product Inquiry', user: 'John Doe', time: '2 days ago' },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      // In a real app, you would fetch this data from your API
      setStats({
        products: 24,
        categories: 5,
        users: 3,
        contactSubmissions: 17,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <p className="mt-3 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name || 'Admin'}
        </h1>
        <p className="mt-1 text-gray-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Products"
          value={stats.products}
          icon={
            <svg
              className="h-8 w-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          }
          change="+3"
          linkTo="/admin/products"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
          }
          change="+1"
          linkTo="/admin/categories"
        />
        <StatCard
          title="Users"
          value={stats.users}
          icon={
            <svg
              className="h-8 w-8 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          }
          change="0"
          linkTo="/admin/users"
        />
        <StatCard
          title="Contact Submissions"
          value={stats.contactSubmissions}
          icon={
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          }
          change="+5"
          linkTo="/admin/contacts"
        />
      </div>

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="py-3">
                  <div className="flex items-center">
                    <ActivityIcon type={activity.type} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action === 'created' && 'Created '}
                        {activity.action === 'updated' && 'Updated '}
                        {activity.action === 'received' && 'Received '}
                        <span className="font-semibold">
                          {activity.type === 'product' && 'product '}
                          {activity.type === 'category' && 'category '}
                          {activity.type === 'user' && 'user '}
                          {activity.type === 'contact' && 'contact '}
                        </span>
                        {activity.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        By {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New Product
              </Link>
              <Link
                href="/admin/categories/new"
                className="flex items-center rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New Category
              </Link>
              <Link
                href="/admin/users/new"
                className="flex items-center rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New User
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Website Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, linkTo }: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  linkTo: string;
}) {
  return (
    <Link href={linkTo} className="block">
      <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs font-medium text-green-600">
              {parseInt(change) > 0 && '+'}{change} from last week
            </p>
          </div>
          <div className="rounded-full bg-gray-100 p-3">{icon}</div>
        </div>
      </div>
    </Link>
  );
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'product':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-5 w-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
        </div>
      );
    case 'category':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            ></path>
          </svg>
        </div>
      );
    case 'user':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
          <svg
            className="h-5 w-5 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
      );
    case 'contact':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </div>
      );
  }
} 