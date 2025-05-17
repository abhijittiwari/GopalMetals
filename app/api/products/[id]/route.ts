import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET a single product by ID
export async function GET(request: NextRequest, context: any) {
  const id = context.params.id;
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT to update a product
export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;
  
  try {
    const data = await request.json();
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check for duplicate slug if slug is being changed
    if (data.slug && data.slug !== existingProduct.slug) {
      const duplicateSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (duplicateSlug) {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
      }
    }
    
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        images: data.images,
        price: data.price,
        categoryId: data.categoryId,
        featured: data.featured,
        features: data.features,
        applications: data.applications,
        materials: data.materials,
        thickness: data.thickness,
        specifications: data.specifications,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: NextRequest, context: any) {
  const id = context.params.id;
  
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 