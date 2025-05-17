import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET() {
  try {
    let featuredProducts = await prisma.product.findMany({
      where: {
        featured: true
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 8, // Limit to 8 products for the homepage
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If no featured products are found, try to seed the database
    if (featuredProducts.length === 0) {
      try {
        // Dynamically import seed functions to avoid circular dependencies
        const { seedProducts } = await import('@/lib/seed');
        await seedProducts();
        
        // Try fetching again after seeding
        featuredProducts = await prisma.product.findMany({
          where: {
            featured: true
          },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
          take: 8,
          orderBy: {
            createdAt: 'desc',
          },
        });
      } catch (seedError) {
        console.error('Error seeding products:', seedError);
        // Continue with empty array if seeding fails
      }
    }

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
} 