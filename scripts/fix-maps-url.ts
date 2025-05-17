import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to fix Google Maps URL...');

  try {
    // Get the current settings
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      console.error('Settings not found in database!');
      return;
    }

    // Parse the JSON string to an object
    const settingsData = JSON.parse(settings.data);
    console.log('Current Google Maps URL:', settingsData.contactInfo.googleMapsUrl);

    // Check if the URL contains HTML iframe code
    if (settingsData.contactInfo.googleMapsUrl && settingsData.contactInfo.googleMapsUrl.includes('<iframe')) {
      // Extract just the URL from src attribute
      const srcMatch = settingsData.contactInfo.googleMapsUrl.match(/src=["']([^"']+)["']/);
      
      if (srcMatch && srcMatch[1]) {
        const extractedUrl = srcMatch[1];
        console.log('Extracted URL:', extractedUrl);
        
        // Update the settings with the extracted URL
        settingsData.contactInfo.googleMapsUrl = extractedUrl;
        
        // Save updated settings back to database (stringify the JSON)
        await prisma.settings.update({
          where: { id: settings.id },
          data: { 
            data: JSON.stringify(settingsData) 
          },
        });
        
        console.log('Google Maps URL successfully updated!');
      } else {
        console.error('Could not extract URL from iframe code!');
      }
    } else {
      console.log('URL appears to be correct already (not iframe HTML)');
    }
  } catch (error) {
    console.error('Error accessing or updating settings:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 