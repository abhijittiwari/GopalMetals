#!/bin/bash

# Deployment script for Gopal Metals website

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "DATABASE_URL=\"file:./production.db\"" > .env.local
  echo "NODE_ENV=\"production\"" >> .env.local
fi

# Create database directory if it doesn't exist
if [ ! -d prisma/migrations ]; then
  echo "Setting up database..."
  npx prisma migrate dev --name init
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building application..."
npm run build

echo "Deployment preparation complete!"
echo "You can now start the application with: npm run start" 