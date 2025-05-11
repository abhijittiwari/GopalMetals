import { prisma } from '@/lib/prisma';
import { WebsiteSettings, defaultSettings } from './settings';

export async function getServerSettings(): Promise<WebsiteSettings> {
  // If running on Vercel, we might want to use default settings
  // since SQLite doesn't work well in serverless environments
  if (process.env.PLATFORM === 'vercel' || process.env.SKIP_DB_SEED === 'true') {
    console.log('Using default settings due to platform constraints');
    return defaultSettings;
  }

  try {
    // Attempt to connect to the database and fetch settings
    let settings;
    try {
      settings = await prisma.settings.findFirst({
        where: {
          id: 1,
        },
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // If database connection fails, return default settings
      return defaultSettings;
    }

    if (settings && settings.data) {
      try {
        const parsedSettings = JSON.parse(settings.data) as WebsiteSettings;
        
        // Ensure aboutInfo exists
        if (!parsedSettings.aboutInfo) {
          parsedSettings.aboutInfo = defaultSettings.aboutInfo;
        } else {
          // Ensure all aboutInfo properties exist
          parsedSettings.aboutInfo.companyDescription = parsedSettings.aboutInfo.companyDescription || '';
          parsedSettings.aboutInfo.companyImage = parsedSettings.aboutInfo.companyImage || '';
          parsedSettings.aboutInfo.mission = parsedSettings.aboutInfo.mission || '';
          parsedSettings.aboutInfo.vision = parsedSettings.aboutInfo.vision || '';
          parsedSettings.aboutInfo.values = parsedSettings.aboutInfo.values || [];
        }
        
        // Ensure contactInfo exists
        if (!parsedSettings.contactInfo) {
          parsedSettings.contactInfo = defaultSettings.contactInfo;
        } else {
          // Ensure contactFormEmails exists
          if (!parsedSettings.contactInfo.contactFormEmails) {
            parsedSettings.contactInfo.contactFormEmails = ['info@gopalmetals.com'];
          }
        }
        
        return parsedSettings;
      } catch (parseError) {
        console.error('Error parsing settings JSON:', parseError);
        return defaultSettings;
      }
    } else {
      console.info('No settings found in database, using defaults');
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching settings from server:', error);
    return defaultSettings;
  }
} 