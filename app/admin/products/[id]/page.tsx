import { redirect } from 'next/navigation';
import EditProductClient from './edit-product-client';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { id: string } }) {
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

  return (
    <EditProductClient
      product={product}
      categories={categories}
    />
  );
} 
 