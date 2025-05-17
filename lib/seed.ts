import { prisma } from './prisma';

// Function to seed categories if they don't exist
export async function seedCategories() {
  const count = await prisma.category.count();
  
  if (count === 0) {
    console.log('🌱 Seeding categories...');
    await prisma.category.createMany({
      data: [
        { name: 'Welded Mesh', slug: 'welded-mesh' },
        { name: 'Wire Mesh', slug: 'wire-mesh' },
        { name: 'Expanded Metal', slug: 'expanded-metal' },
        { name: 'Perforated Sheet', slug: 'perforated-sheet' }
      ]
    });
    console.log('✅ Categories seeded!');
    return true;
  }
  return false;
}

// Function to seed products if featured products don't exist
export async function seedProducts() {
  // Check if we have any featured products
  const featuredCount = await prisma.product.count({
    where: { featured: true }
  });
  
  if (featuredCount === 0) {
    console.log('🌱 Seeding featured products...');
    
    // Get all categories first
    const categories = await prisma.category.findMany();
    
    if (categories.length === 0) {
      // Make sure categories exist
      await seedCategories();
      // Fetch them again
      categories.push(...await prisma.category.findMany());
    }
    
    // Sample products data
    const products = [
      {
        name: 'Welded Mesh SS304',
        slug: 'welded-mesh-ss304',
        description: 'Weldmesh is one of the most versatile of industrial wire products and has innumerable applications throughout all types of industry.',
        images: JSON.stringify(['/images/placeholder.svg']),
        featured: true,
        categoryId: categories.find(c => c.slug === 'welded-mesh')?.id
      },
      {
        name: 'Wire Mesh Stainless Steel',
        slug: 'wire-mesh-stainless-steel',
        description: 'Wiremesh can offer wide-ranging characteristics depending on the configuration of wire thickness in relation to the aperture size, as well as type of weave.',
        images: JSON.stringify(['/images/placeholder.svg']),
        featured: true,
        categoryId: categories.find(c => c.slug === 'wire-mesh')?.id
      },
      {
        name: 'Expanded Metal Grating',
        slug: 'expanded-metal-grating',
        description: 'Expanded Metal means versatility. Versatile is the key word describing Expanded Metal. New applications are found for it every day in industry, offices and home.',
        images: JSON.stringify(['/images/placeholder.svg']),
        featured: true,
        categoryId: categories.find(c => c.slug === 'expanded-metal')?.id
      },
      {
        name: 'Perforated Sheet Round Hole',
        slug: 'perforated-sheet-round-hole',
        description: 'Perforated sheets are available in various patterns, thickness and materials. Perforated patterns consists of round, square, slotted and other custom designed patterns.',
        images: JSON.stringify(['/images/placeholder.svg']),
        featured: true,
        categoryId: categories.find(c => c.slug === 'perforated-sheet')?.id
      }
    ];
    
    // Create products with proper error handling
    for (const product of products) {
      if (!product.categoryId) {
        console.warn(`Skipping product ${product.name} - category not found`);
        continue;
      }
      
      try {
        // Check if product with this slug already exists
        const existing = await prisma.product.findUnique({
          where: { slug: product.slug }
        });
        
        if (existing) {
          // Update to make it featured
          await prisma.product.update({
            where: { slug: product.slug },
            data: { featured: true }
          });
          console.log(`Product ${product.name} already exists, marked as featured`);
        } else {
          // Create new product
          await prisma.product.create({
            data: product
          });
          console.log(`Created product: ${product.name}`);
        }
      } catch (error) {
        console.error(`Error creating product ${product.name}:`, error);
      }
    }
    
    console.log('✅ Featured products seeded successfully!');
    return true;
  }
  
  return false;
}

// Main seeding function that runs all seed operations
export async function seedDatabase() {
  try {
    console.log('🔄 Checking database for seed requirements...');
    
    const categoryResult = await seedCategories();
    const productResult = await seedProducts();
    
    console.log('✅ Database seeding complete!');
    
    return {
      categoriesSeeded: categoryResult,
      productsSeeded: productResult,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
} 