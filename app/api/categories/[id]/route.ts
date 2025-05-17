import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET a single category by ID
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT to update a category
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    // In a real app, check authentication
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: context.params.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate slug if slug is being changed
    if (data.slug && data.slug !== existingCategory.slug) {
      const duplicateSlug = await prisma.category.findUnique({
        where: {
          slug: data.slug,
        },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update the category
    const category = await prisma.category.update({
      where: {
        id: context.params.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    // In a real app, check authentication
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        products: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Delete all products in this category first
    if (existingCategory.products.length > 0) {
      await prisma.product.deleteMany({
        where: {
          categoryId: context.params.id,
        },
      });
    }
    
    // Delete the category
    await prisma.category.delete({
      where: {
        id: context.params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 