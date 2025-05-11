#!/bin/bash

# Script to be run directly on the server to fix build issues
# Usage: Upload this script to your server and run it with bash server-build.sh

# Create a very large swap (4GB) for the build process
echo "Creating a large 4GB swap file..."
swapoff /swapfile 2>/dev/null || true
rm -f /swapfile
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "Swap status:"
free -h

# Navigate to the app directory
cd /var/www/gopalmetals

# Stop any existing processes
echo "Stopping existing processes..."
pm2 stop all
pm2 delete all
pm2 save

# Clean up completely
echo "Cleaning up existing files..."
rm -rf .next
rm -rf node_modules

# Install dependencies freshly
echo "Installing dependencies..."
npm install

# Diagnose the app structure
echo "App structure:"
ls -la

# Check package.json
echo "Package.json content:"
cat package.json

# Try to build manually with verbose output and extra memory
echo "Building application with verbose output..."
NODE_OPTIONS="--max_old_space_size=2048" npm run build -- --verbose

# Check if build succeeded
if [ -d ".next" ]; then
  echo "Build succeeded! Directory contents:"
  ls -la .next
  
  # Start the application
  echo "Starting application with PM2..."
  NODE_ENV=production NODE_OPTIONS="--max_old_space_size=1024" pm2 start npm --name "gopalmetals" -- start
  
  # Save PM2 configuration
  pm2 save
  
  # Verify the app is running
  echo "Checking if app is running on port 3000..."
  sleep 10
  netstat -tulpn | grep 3000
  
  echo "Recent logs:"
  pm2 logs --lines 10 gopalmetals
else
  echo "Build failed. Trying alternative build method..."
  
  # Try an alternative build method
  NODE_ENV=production NODE_OPTIONS="--max_old_space_size=2048" npx next build
  
  if [ -d ".next" ]; then
    echo "Alternative build method succeeded!"
    ls -la .next
    
    # Start the application
    echo "Starting application with PM2..."
    NODE_ENV=production NODE_OPTIONS="--max_old_space_size=1024" pm2 start npm --name "gopalmetals" -- start
    pm2 save
  else
    echo "All build attempts failed. Please check the logs above for detailed errors."
  fi
fi

# Check NGINX configuration
echo "Checking NGINX configuration..."
nginx -t

# Restart NGINX
echo "Restarting NGINX..."
systemctl restart nginx

echo "Script completed. Check if your site is now accessible." 