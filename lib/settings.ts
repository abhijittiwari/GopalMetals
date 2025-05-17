// Utility functions for fetching website settings

export interface ContactInfo {
  companyName: string;
  address: {
    headOffice: string;
    corporateOffice: string;
  };
  phone: {
    bangalore: string;
    hyderabad: string;
  };
  email: string;
  contactFormEmails: string[]; // Array of email addresses to receive contact form submissions
  hours: string;
  googleMapsUrl: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface Logo {
  url: string;
  alt?: string;
}

export interface HeroImage {
  url: string;
  alt?: string;
}

export interface WebsiteSettings {
  contactInfo: ContactInfo;
  aboutInfo: {
    companyDescription?: string;
    companyImage?: string; // URL of the company image
    mission?: string;
    vision?: string;
    values?: string[];
  };
  socialLinks: SocialLinks;
  logo: Logo;
  heroImage: HeroImage;
}

// Default settings as fallback
export const defaultSettings: WebsiteSettings = {
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
    contactFormEmails: ['info@gopalmetals.com'], // Default recipient
    hours: 'Mon to Sat 9:30AM to 6:30PM',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.82070664402!2d77.4882556754598!3d12.919242387391359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f3763ec586d%3A0x2a17e78e5278525d!2sGOPAL%20METALS%20%26%20ENGINEERS-SS%20WIREMESH%2CSS%20PERFORATED%20SHEET%2CSS%20MOSQUITO%20MESH%2CFLOOR%20PROTECTION%20SHEET%20MANUFACTURER%20IN%20BANGALORE!5e0!3m2!1sen!2sin!4v1746526662202!5m2!1sen!2sin',
  },
  aboutInfo: {
    companyDescription: '',
    companyImage: '',
    mission: '',
    vision: '',
    values: [],
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

// Function to fetch settings from the API
export async function getSettings(): Promise<WebsiteSettings> {
  try {
    const response = await fetch('/api/settings', { 
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return defaultSettings;
  }
}