import { prisma } from '@/lib/prisma';
import { WebsiteSettings, defaultSettings } from './settings';

export async function getServerSettings(): Promise<WebsiteSettings> {
  try {
    const settings = await prisma.settings.findFirst({
      where: {
        id: 1,
      },
    });

    if (settings && settings.data) {
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
    } else {
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching settings from server:', error);
    return defaultSettings;
  }
} 