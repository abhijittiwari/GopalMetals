const https = require('https');
const http = require('http');

/**
 * Script to run after the build process to seed the database
 * This will be called automatically by Vercel when deploying
 */

console.log('🔄 Running post-build database setup...');

const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXTAUTH_URL || 'http://localhost:3000';

const setupUrl = `${baseUrl}/api/setup`;

// Create the request based on URL protocol
const client = baseUrl.startsWith('https://') ? https : http;
const setupKey = process.env.SETUP_SECRET_KEY || 'development-setup-key';

const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${setupKey}`
  },
  timeout: 30000 // 30 second timeout
};

// Try to connect multiple times with exponential backoff
let attempt = 1;
const maxAttempts = 3;

function makeRequest() {
  console.log(`Attempt ${attempt} of ${maxAttempts} to seed database...`);

  // Make the request to the setup endpoint
  const req = client.request(setupUrl, options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(data);
          console.log('✅ Database setup completed successfully:', result);
          process.exit(0);
        } catch (error) {
          console.log('✅ Database setup completed, but response parsing failed:', data);
          process.exit(0);
        }
      } else {
        console.error(`❌ Error during database setup: Status ${res.statusCode}`, data);
        retryOrExit();
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Error making setup request: ${error.message}`);
    retryOrExit();
  });

  req.on('timeout', () => {
    console.error('❌ Request timed out');
    req.abort();
    retryOrExit();
  });

  req.end();
}

function retryOrExit() {
  if (attempt < maxAttempts) {
    attempt++;
    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
    console.log(`Retrying in ${delay/1000} seconds...`);
    setTimeout(makeRequest, delay);
  } else {
    console.error('❌ Maximum retry attempts reached. Exiting.');
    process.exit(1);
  }
}

// Start the first attempt
makeRequest(); 