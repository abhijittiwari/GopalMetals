import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get counts from different tables
    const [
      productsCount,
      categoriesCount,
      contactSubmissionsCount,
      recentContactSubmissions
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          createdAt: true
        }
      })
    ]);

    // Return formatted data
    return NextResponse.json({
      counts: {
        products: productsCount,
        categories: categoriesCount,
        contactSubmissions: contactSubmissionsCount
      },
      recentContactSubmissions
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 