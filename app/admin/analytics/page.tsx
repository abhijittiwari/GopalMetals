'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: {
    path: string;
    views: number;
  }[];
}

interface AnalyticsRecord {
  id: string;
  ipAddress: string;
  path: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  visitedAt: string;
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentVisits, setRecentVisits] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFrame, setTimeFrame] = useState(30); // default to 30 days

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch summary data
      const summaryResponse = await fetch(`/api/analytics?days=${timeFrame}&summary=true`);
      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch analytics summary');
      }
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      
      // Fetch recent visits
      const visitsResponse = await fetch(`/api/analytics?days=${timeFrame}`);
      if (!visitsResponse.ok) {
        throw new Error('Failed to fetch recent visits');
      }
      const visitsData = await visitsResponse.json();
      setRecentVisits(visitsData.slice(0, 20)); // Only show the 20 most recent visits
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Website Analytics</h1>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="timeFrame" className="text-sm font-medium text-gray-700">Time Period:</label>
              <select
                id="timeFrame"
                value={timeFrame}
                onChange={(e) => setTimeFrame(Number(e.target.value))}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
              
              <button
                onClick={fetchAnalytics}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* Analytics Summary Cards */}
              {summary && (
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Page Views</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalPageViews}</dd>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{summary.uniqueVisitors}</dd>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time on Site</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">N/A</dd>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Top Pages */}
              {summary && summary.topPages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h2>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {summary.topPages.map((page, index) => (
                        <li key={index} className="px-6 py-4 flex items-center justify-between">
                          <div className="text-sm text-gray-900">{page.path}</div>
                          <div className="text-sm font-medium text-primary-600">{page.views} views</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Recent Visits */}
              {recentVisits.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Visits</h2>
                  <div className="mt-2 flex flex-col">
                    <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Device
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Browser
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Time
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {recentVisits.map((visit) => (
                                <tr key={visit.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {visit.path}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {visit.device} / {visit.os}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {visit.browser}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(visit.visitedAt).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
 