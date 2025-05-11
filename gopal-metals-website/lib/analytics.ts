/**
 * Analytics utility functions that don't rely on problematic 
 * third-party packages like geoip-lite
 */

import { UAParser } from 'ua-parser-js';
import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

// Function to parse and save analytics data
export async function recordPageView(
  path: string, 
  ipAddress: string, 
  userAgent: string, 
  referrer: string
) {
  try {
    // Parse user agent
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    // Record the analytics
    await prisma.analytics.create({
      data: {
        ipAddress: ipAddress,
        country: 'Unknown', // Default value as we're not using geoip
        city: 'Unknown',
        region: 'Unknown',
        browser: `${browser.name || 'Unknown'} ${browser.version || ''}`,
        device: device.type || (device.vendor && device.model ? `${device.vendor} ${device.model}` : 'Desktop'),
        os: `${os.name || 'Unknown'} ${os.version || ''}`,
        path: path,
        referrer: referrer
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to record analytics:', error);
    return false;
  }
}

// Function to get analytics data
export async function getAnalytics(days: number = 30) {
  try {
    // Calculate date 'days' ago
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    // Get analytics data
    const analytics = await prisma.analytics.findMany({
      where: {
        visitedAt: {
          gte: date
        }
      },
      orderBy: {
        visitedAt: 'desc'
      }
    });
    
    return analytics;
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return [];
  }
}

// Function to get analytics summary
export async function getAnalyticsSummary(days: number = 30) {
  try {
    // Calculate date 'days' ago
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    // Count total page views
    const totalPageViews = await prisma.analytics.count({
      where: {
        visitedAt: {
          gte: date
        }
      }
    });
    
    // Get unique visitors (by IP)
    const uniqueVisitors = await prisma.analytics.groupBy({
      by: ['ipAddress'],
      where: {
        visitedAt: {
          gte: date
        }
      },
      _count: {
        ipAddress: true
      }
    });
    
    // Get top pages
    const topPages = await prisma.analytics.groupBy({
      by: ['path'],
      where: {
        visitedAt: {
          gte: date
        }
      },
      _count: {
        path: true
      },
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 5
    });
    
    return {
      totalPageViews,
      uniqueVisitors: uniqueVisitors.length,
      topPages: topPages.map(page => ({
        path: page.path,
        views: page._count.path
      }))
    };
  } catch (error) {
    console.error('Failed to get analytics summary:', error);
    return {
      totalPageViews: 0,
      uniqueVisitors: 0,
      topPages: []
    };
  }
} 
 