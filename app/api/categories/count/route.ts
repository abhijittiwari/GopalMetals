import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Optionally check for authentication if needed
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Count categories
    const count = await prisma.category.count();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching category count:', error);
    return NextResponse.json({ error: 'Failed to fetch category count' }, { status: 500 });
  }
} 