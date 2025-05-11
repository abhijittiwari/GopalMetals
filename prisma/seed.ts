import { PrismaClient } from '../app/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');
  
  // Create admin user
  const password = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gopalmetals.com' },
    update: {},
    create: {
      email: 'admin@gopalmetals.com',
      name: 'Admin',
      password,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);
  
  // Create categories if they don't exist
  const categories = [
    {
      name: 'Welded Mesh',
      slug: 'welded-mesh',
      image: '/images/placeholder.svg',
    },
    {
      name: 'Wire Mesh',
      slug: 'wire-mesh',
      image: '/images/placeholder.svg',
    },
    {
      name: 'Expanded Metal',
      slug: 'expanded-metal',
      image: '/images/placeholder.svg',
    },
    {
      name: 'Perforated Sheet',
      slug: 'perforated-sheet',
      image: '/images/placeholder.svg',
    },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!existingCategory) {
      await prisma.category.create({ data: category });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category exists: ${category.name}`);
    }
  }

  // Get the category IDs
  const weldedMeshCategory = await prisma.category.findUnique({
    where: { slug: 'welded-mesh' },
  });
  
  const wireMeshCategory = await prisma.category.findUnique({
    where: { slug: 'wire-mesh' },
  });
  
  const expandedMetalCategory = await prisma.category.findUnique({
    where: { slug: 'expanded-metal' },
  });
  
  const perforatedSheetCategory = await prisma.category.findUnique({
    where: { slug: 'perforated-sheet' },
  });

  if (!weldedMeshCategory || !wireMeshCategory || !expandedMetalCategory || !perforatedSheetCategory) {
    throw new Error('Failed to find categories');
  }

  // Create products if they don't exist
  const products = [
    {
      name: 'Galvanized Welded Mesh',
      slug: 'galvanized-welded-mesh',
      description: 'High-quality galvanized welded wire mesh suitable for industrial and construction applications.',
      categoryId: weldedMeshCategory.id,
      featured: true,
      images: '/images/placeholder.svg',
    },
    {
      name: 'Stainless Steel Wire Mesh',
      slug: 'stainless-steel-wire-mesh',
      description: 'Premium stainless steel wire mesh with excellent corrosion resistance and durability.',
      categoryId: wireMeshCategory.id,
      featured: true,
      images: '/images/placeholder.svg',
    },
    {
      name: 'Standard Expanded Metal',
      slug: 'standard-expanded-metal',
      description: 'Standard expanded metal mesh for various industrial applications and filtration systems.',
      categoryId: expandedMetalCategory.id,
      featured: true,
      images: '/images/placeholder.svg',
    },
    {
      name: 'Round Hole Perforated Sheet',
      slug: 'round-hole-perforated-sheet',
      description: 'Round hole perforated sheet is a type of metal sheet that has a pattern of holes punched into it.',
      categoryId: perforatedSheetCategory.id,
      featured: true,
      images: '/images/products/round-hole-perforated-sheet.jpg',
      features: `Evenly spaced round-shaped holes punched through metal sheets.
Customizable hole size, shape, and pattern.
Effective filtration, ventilation, and separation properties.`,
      applications: `Filtration and Separation: Used in filters, screens, and sieves.
Architectural Design: Decorative panels, facades, and signage.
Industrial: Ventilation, noise reduction, and heat dissipation.`,
      materials: 'SS/GI/MS',
      thickness: '0.5mm - 10mm',
      specifications: `Hole Size: 1mm - 25mm
Open Area: 20% - 70%
Pattern: Staggered or Straight Line`
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existingProduct) {
      await prisma.product.create({ data: product });
      console.log(`Created product: ${product.name}`);
    } else {
      // Update existing product
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: product,
      });
      console.log(`Updated product: ${product.name}`);
    }
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 