import { PrismaClient } from '../app/generated/prisma';
import { seedDatabase } from '../lib/seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Running database seed during deployment...');
  await seedDatabase();
  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 