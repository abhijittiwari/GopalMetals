import { PrismaClient } from '../app/generated/prisma/index.js';

// Initialize Prisma client
const prisma = new PrismaClient();

// Sample product data
const sampleProducts = [
  {
    name: 'Welded Mesh SS304',
    slug: 'welded-mesh-ss304',
    description: 'Weldmesh is one of the most versatile of industrial wire products and has innumerable applications throughout all types of industry.',
    images: JSON.stringify(['/images/placeholder.svg']),
    featured: true
  },
  {
    name: 'Wire Mesh Stainless Steel',
    slug: 'wire-mesh-stainless-steel',
    description: 'Wiremesh can offer wide-ranging characteristics depending on the configuration of wire thickness in relation to the aperture size, as well as type of weave.',
    images: JSON.stringify(['/images/placeholder.svg']),
    featured: true
  },
  {
    name: 'Expanded Metal Grating',
    slug: 'expanded-metal-grating',
    description: 'Expanded Metal means versatility. Versatile is the key word describing Expanded Metal. New applications are found for it every day in industry, offices and home.',
    images: JSON.stringify(['/images/placeholder.svg']),
    featured: true
  },
  {
    name: 'Perforated Sheet Round Hole',
    slug: 'perforated-sheet-round-hole',
    description: 'Perforated sheets are available in various patterns, thickness and materials. Perforated patterns consists of round, square, slotted and other custom designed patterns.',
    images: JSON.stringify(['/images/placeholder.svg']),
    featured: true
  }
];

async function seedCategories() {
  try {
    const categoryCount = await prisma.category.count();
    
    if (categoryCount === 0) {
      console.log('No categories found. Creating sample categories...');
      
      // Create sample categories
      await prisma.category.createMany({
        data: [
          { name: 'Welded Mesh', slug: 'welded-mesh' },
          { name: 'Wire Mesh', slug: 'wire-mesh' },
          { name: 'Expanded Metal', slug: 'expanded-metal' },
          { name: 'Perforated Sheet', slug: 'perforated-sheet' }
        ]
      });
      
      console.log('✅ Sample categories created!');
    }
    
    return await prisma.category.findMany();
  } catch (error) {
    console.error('Error seeding categories:', error);
    return [];
  }
}

async function seedProducts(categories) {
  try {
    // Create featured products
    for (const product of sampleProducts) {
      // Find corresponding category
      const category = categories.find(c => c.slug === product.slug.split('-')[0] + '-' + product.slug.split('-')[1]);
      
      if (!category) {
        console.warn(`Skipping product ${product.name} - could not find matching category`);
        continue;
      }
      
      // Skip if product with this slug already exists
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      });
      
      if (existing) {
        console.log(`Product ${product.name} already exists, updating...`);
        await prisma.product.update({
          where: { slug: product.slug },
          data: { featured: true }
        });
      } else {
        await prisma.product.create({
          data: {
            ...product,
            categoryId: category.id
          }
        });
        console.log(`Created product: ${product.name}`);
      }
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

async function main() {
  try {
    console.log('🌱 Starting to seed featured products...');
    
    // First seed categories and get them
    const categories = await seedCategories();
    
    // Then seed products using the categories
    await seedProducts(categories);
    
    console.log('✅ Featured products seeding completed!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 