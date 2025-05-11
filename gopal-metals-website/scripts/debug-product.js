const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all categories
    const categories = await prisma.category.findMany();
    console.log('Categories:');
    categories.forEach(category => {
      console.log(`- ${category.name} (slug: ${category.slug}, id: ${category.id})`);
    });
    
    // Get the perforated sheet category
    const perforatedCategory = categories.find(c => c.slug === 'perforated-sheet');
    if (!perforatedCategory) {
      console.log('Perforated Sheet category not found!');
      return;
    }
    
    // Get products in that category
    const products = await prisma.product.findMany({
      where: {
        categoryId: perforatedCategory.id
      },
      include: {
        category: true
      }
    });
    
    console.log('\nProducts in Perforated Sheet category:');
    products.forEach(product => {
      console.log(`- ${product.name} (slug: ${product.slug}, id: ${product.id})`);
      console.log(`  Category: ${product.category.name} (slug: ${product.category.slug})`);
    });
    
    // Try to directly find the Round Hole Perforated Sheet product
    const roundHoleProduct = await prisma.product.findUnique({
      where: {
        slug: 'round-hole-perforated-sheet'
      },
      include: {
        category: true
      }
    });
    
    console.log('\nDirect lookup of Round Hole Perforated Sheet:');
    if (roundHoleProduct) {
      console.log('FOUND:');
      console.log(`- ${roundHoleProduct.name} (slug: ${roundHoleProduct.slug}, id: ${roundHoleProduct.id})`);
      console.log(`  Category: ${roundHoleProduct.category.name} (slug: ${roundHoleProduct.category.slug})`);
    } else {
      console.log('NOT FOUND! The product with slug "round-hole-perforated-sheet" does not exist.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 