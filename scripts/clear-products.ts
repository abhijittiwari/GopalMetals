import * as fs from 'fs';
import * as path from 'path';
import { Database } from 'sqlite3';

async function clearData() {
  try {
    console.log('Clearing database data...');
    
    // Get the path to the database file
    const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
    
    // Check if the database file exists
    if (!fs.existsSync(dbPath)) {
      console.log(`Database file not found at ${dbPath}`);
      return;
    }
    
    console.log(`Opening database at ${dbPath}`);
    
    // Open the database
    const db = new Database(dbPath);
    
    // Delete all products first (because of foreign key constraints)
    const deleteProducts = () => {
      return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM Product', (err: Error | null) => {
          if (err) {
            console.error('Error deleting products:', err);
          } else {
            console.log('All products deleted successfully');
          }
          resolve();
        });
      });
    };
    
    // Delete all categories
    const deleteCategories = () => {
      return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM Category', (err: Error | null) => {
          if (err) {
            console.error('Error deleting categories:', err);
          } else {
            console.log('All categories deleted successfully');
          }
          resolve();
        });
      });
    };
    
    // Run all queries sequentially
    await deleteProducts();
    await deleteCategories();
    
    // Close the database connection
    db.close();
    
    console.log('Database cleanup completed');
    
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Run the function
clearData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 