import { PrismaClient } from '../app/generated/prisma';
import { hash } from 'bcrypt';

console.log('Starting seeding...');

// Create a new PrismaClient instance
const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const password = await hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@gopalmetals.com',
        name: 'Admin',
        password,
        role: 'admin',
      },
    });
    console.log(`Created admin user: ${admin.email}`);
    
    // Create a sample category
    const category = await prisma.category.create({
      data: {
        name: 'Welded Mesh',
        slug: 'welded-mesh',
        image: '/images/placeholder.svg',
      }
    });
    console.log(`Created category: ${category.name}`);
    
    // Create a sample product
    const product = await prisma.product.create({
      data: {
        name: 'Galvanized Welded Mesh',
        slug: 'galvanized-welded-mesh',
        description: 'High-quality galvanized welded wire mesh.',
        categoryId: category.id,
        featured: true,
        images: '/images/placeholder.svg',
      }
    });
    console.log(`Created product: ${product.name}`);
    
    // Create default settings
    const settings = await prisma.settings.create({
      data: {
        id: 1,
        data: JSON.stringify({
          contactInfo: {
            companyName: 'Gopal Metals',
            address: {
              headOffice: '# 28, Example Road, Bengaluru – 560002',
              corporateOffice: '# 320-2-22, Example Address, Mysore Road, Bengaluru- 560026',
            },
            phone: {
              bangalore: '+91 9035000749',
              hyderabad: '+91 9393031722',
            },
            email: 'info@gopalmetals.com',
            contactFormEmails: ['info@gopalmetals.com'],
            hours: 'Mon to Sat 9:30AM to 6:30PM',
            googleMapsUrl: 'https://www.google.com/maps/embed?example',
          },
          socialLinks: {
            facebook: 'https://facebook.com/gopalmetals',
            twitter: 'https://twitter.com/gopalmetals',
            instagram: 'https://instagram.com/gopalmetals',
            linkedin: 'https://linkedin.com/company/gopalmetals',
            youtube: 'https://youtube.com/gopalmetals',
          },
          logo: {
            url: '/images/logo.png',
            alt: 'Gopal Metals Logo',
          },
          heroImage: {
            url: '/images/hero-image.jpg',
            alt: 'Wire Mesh Hero Image',
          },
        }),
      }
    });
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  }); 