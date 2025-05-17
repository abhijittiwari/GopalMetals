import * as fs from 'fs';
import * as path from 'path';
import { Database } from 'sqlite3';

interface CountResult {
  count: number;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

async function checkData() {
  try {
    console.log('Checking database data...');
    
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
    
    // Use promises for better async flow
    const getProductCount = () => {
      return new Promise<number>((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM Product', (err: Error | null, row: CountResult) => {
          if (err) {
            console.error('Error counting products:', err);
            resolve(0);
          } else {
            resolve(row?.count || 0);
          }
        });
      });
    };
    
    const getCategoryCount = () => {
      return new Promise<number>((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM Category', (err: Error | null, row: CountResult) => {
          if (err) {
            console.error('Error counting categories:', err);
            resolve(0);
          } else {
            resolve(row?.count || 0);
          }
        });
      });
    };
    
    const getProducts = () => {
      return new Promise<Product[]>((resolve, reject) => {
        db.all('SELECT id, name, categoryId, slug FROM Product LIMIT 10', (err: Error | null, rows: Product[]) => {
          if (err) {
            console.error('Error fetching products:', err);
            resolve([]);
          } else {
            resolve(rows || []);
          }
        });
      });
    };
    
    const getCategories = () => {
      return new Promise<Category[]>((resolve, reject) => {
        db.all('SELECT id, name, slug FROM Category', (err: Error | null, rows: Category[]) => {
          if (err) {
            console.error('Error fetching categories:', err);
            resolve([]);
          } else {
            resolve(rows || []);
          }
        });
      });
    };
    
    // Run all queries sequentially
    const productCount = await getProductCount();
    console.log(`Product count: ${productCount}`);
    
    const categoryCount = await getCategoryCount();
    console.log(`Category count: ${categoryCount}`);
    
    if (productCount > 0) {
      const products = await getProducts();
      console.log(`First 10 products: ${JSON.stringify(products, null, 2)}`);
    }
    
    if (categoryCount > 0) {
      const categories = await getCategories();
      console.log(`Categories: ${JSON.stringify(categories, null, 2)}`);
    }
    
    // Close the database connection
    db.close();
    
  } catch (error) {
    console.error('Error checking data:', error);
  }
}

// Run the function
checkData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 