// Fix Google Maps URL in database settings
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database
const dbPath = path.join(__dirname, '../prisma/dev.db');

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// Get the settings data
db.get('SELECT * FROM Settings WHERE id = 1', [], (err, row) => {
  if (err) {
    console.error('Error querying settings:', err.message);
    db.close();
    process.exit(1);
  }
  
  if (!row) {
    console.error('No settings found in the database.');
    db.close();
    process.exit(1);
  }
  
  console.log('Found settings record.');
  
  try {
    // Parse the JSON data
    const settings = JSON.parse(row.data);
    
    // Check if we need to fix the Google Maps URL
    if (settings.contactInfo && settings.contactInfo.googleMapsUrl && settings.contactInfo.googleMapsUrl.includes('<iframe')) {
      console.log('Current Google Maps URL:', settings.contactInfo.googleMapsUrl);
      
      // Extract the URL from the iframe src attribute
      const srcMatch = settings.contactInfo.googleMapsUrl.match(/src=["']([^"']+)["']/);
      
      if (srcMatch && srcMatch[1]) {
        const extractedUrl = srcMatch[1];
        console.log('Extracted URL:', extractedUrl);
        
        // Update the URL
        settings.contactInfo.googleMapsUrl = extractedUrl;
        
        // Save the updated settings
        const updatedData = JSON.stringify(settings);
        
        db.run('UPDATE Settings SET data = ?, updatedAt = datetime("now") WHERE id = 1', [updatedData], function(err) {
          if (err) {
            console.error('Error updating settings:', err.message);
          } else {
            console.log('Successfully updated Google Maps URL in settings!');
          }
          db.close();
        });
      } else {
        console.error('Could not extract URL from iframe code.');
        db.close();
      }
    } else {
      console.log('Google Maps URL does not need to be fixed.');
      db.close();
    }
  } catch (e) {
    console.error('Error processing settings data:', e.message);
    db.close();
    process.exit(1);
  }
}); 