/**
 * Test script to verify our analytics system works correctly
 */

const { PrismaClient } = require('../app/generated/prisma');
const { UAParser } = require('ua-parser-js');

const prisma = new PrismaClient();

async function testAnalytics() {
  console.log('Testing analytics system...');
  
  try {
    // Test user agent parsing
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    
    console.log('User agent parsed successfully:');
    console.log('- Browser:', browser.name, browser.version);
    console.log('- OS:', os.name, os.version);
    console.log('- Device:', device.type || 'Desktop');
    
    // Test database connection and record a test page view
    const analytics = await prisma.analytics.create({
      data: {
        ipAddress: '127.0.0.1',
        country: 'Test',
        city: 'Test',
        region: 'Test',
        browser: `${browser.name || 'Unknown'} ${browser.version || ''}`,
        device: device.type || 'Desktop',
        os: `${os.name || 'Unknown'} ${os.version || ''}`,
        path: '/test',
        referrer: 'test'
      }
    });
    
    console.log('Test analytics record created successfully:', analytics.id);
    
    // Clean up the test record
    await prisma.analytics.delete({
      where: {
        id: analytics.id
      }
    });
    
    console.log('Test analytics record deleted successfully');
    console.log('Analytics system is working correctly!');
  } catch (error) {
    console.error('Analytics test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalytics(); 
 