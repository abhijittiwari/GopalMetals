import { redirect } from 'next/navigation';
import EditProductClient from './edit-product-client';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: any) {
  // Fetch product data server-side
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  // Fetch categories
  const categories = await prisma.category.findMany();

  if (!product) {
    redirect('/admin/products');
  }

  // Convert dates to strings for client component
  const serializedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
      ...product.category,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    }
  };

  // Convert category dates to strings
  const serializedCategories = categories.map(category => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));

  return (
    <EditProductClient
      product={serializedProduct}
      categories={serializedCategories}
    />
  );
} 
 