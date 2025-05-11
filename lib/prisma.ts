import { PrismaClient } from '@/app/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Function to create Prisma client with error handling
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    // Return a mock PrismaClient that returns default values
    return {
      settings: {
        findFirst: async () => null,
      },
      // Add other models as needed with mock implementations
      $connect: async () => {},
      $disconnect: async () => {},
    } as unknown as PrismaClient;
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 