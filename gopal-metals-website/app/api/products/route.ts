import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import { getServerSession } from 'next-auth/next';

const prisma = new PrismaClient();

// GET all products
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST to create a new product
export async function POST(request: NextRequest) {
  try {
    // In a real app, check authentication
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug || !data.categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, and category are required' },
        { status: 400 }
      );
    }
    
    // Check for duplicate slug
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        images: data.images || null,
        price: data.price || null,
        categoryId: data.categoryId,
        featured: data.featured || false,
        features: data.features || null,
        applications: data.applications || null,
        materials: data.materials || null,
        thickness: data.thickness || null,
        specifications: data.specifications || null,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 