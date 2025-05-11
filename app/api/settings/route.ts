import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Default settings to use if no settings are found in the database
const defaultSettings = {
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
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.82070664402!2d77.4882556754598!3d12.919242387391359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f3763ec586d%3A0x2a17e78e5278525d!2sGOPAL%20METALS%20%26%20ENGINEERS-SS%20WIREMESH%2CSS%20PERFORATED%20SHEET%2CSS%20MOSQUITO%20MESH%2CFLOOR%20PROTECTION%20SHEET%20MANUFACTURER%20IN%20BANGALORE!5e0!3m2!1sen!2sin!4v1746526662202!5m2!1sen!2sin',
  },
  socialLinks: {
    facebook: 'https://facebook.com/gopalmetals',
    twitter: 'https://twitter.com/gopalmetals',
    instagram: 'https://instagram.com/gopalmetals',
    linkedin: 'https://linkedin.com/company/gopalmetals',
    youtube: 'https://youtube.com/gopalmetals',
  },
  logo: {
    url: '/images/placeholder.svg',
    alt: 'Gopal Metals Logo',
  },
  heroImage: {
    url: '/images/hero-placeholder.svg',
    alt: 'Wire Mesh Hero Image',
  },
};

// GET endpoint to retrieve settings
export async function GET() {
  try {
    // Get settings from database
    const settings = await prisma.settings.findFirst({
      where: {
        id: 1, // We'll always use ID 1 for the site settings
      },
    });

    // If settings exist, return them, otherwise return default settings
    if (settings && settings.data) {
      return NextResponse.json(JSON.parse(settings.data));
    } else {
      // If no settings exist yet, create them with default values
      await prisma.settings.create({
        data: {
          id: 1,
          data: JSON.stringify(defaultSettings),
        },
      });
      
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(defaultSettings, { status: 200 });
  }
}

// PUT endpoint to update settings
export async function PUT(request: Request) {
  try {
    // Verify admin is authenticated
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const data = await request.json();
    
    // Update settings in database
    await prisma.settings.upsert({
      where: {
        id: 1,
      },
      update: {
        data: JSON.stringify(data),
      },
      create: {
        id: 1,
        data: JSON.stringify(data),
      },
    });
    
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}