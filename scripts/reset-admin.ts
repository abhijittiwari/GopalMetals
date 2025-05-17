import { PrismaClient } from '../app/generated/prisma';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

// Create a Prisma client instance
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

interface User {
  id: string;
  email: string;
}

// Define a function to reset the admin password
async function resetAdmin() {
  console.log('Starting admin reset process...');
  
  try {
    // New admin credentials
    const email = 'admin@gopalmetals.com';
    const newPassword = 'gopal123';
    const passwordHash = await hash(newPassword, 10);

    // Create tables if they don't exist (ensure the schema is applied)
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'admin',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`;
    
    // Check if user exists
    const existingUsers = await prisma.$queryRaw<User[]>`SELECT * FROM "User" WHERE "email" = ${email}`;
    const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;
    
    if (existingUser) {
      // Update existing user with raw SQL
      await prisma.$executeRaw`UPDATE "User" SET "password" = ${passwordHash}, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${existingUser.id}`;
      console.log(`Updated admin user: ${email}`);
    } else {
      // Create new admin user with raw SQL
      const id = randomUUID();
      const now = new Date().toISOString();
      await prisma.$executeRaw`INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt") 
        VALUES (${id}, 'Admin', ${email}, ${passwordHash}, 'admin', ${now}, ${now})`;
      console.log(`Created new admin user: ${email}`);
    }
    
    console.log(`
==================================
Admin reset completed successfully!
==================================
Login credentials:
Email: admin@gopalmetals.com
Password: gopal123
==================================
`);
  } catch (error) {
    console.error('Error during admin reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset function
resetAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 