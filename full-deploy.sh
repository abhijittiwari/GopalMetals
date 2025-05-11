#!/bin/bash

# ===============================================
# Gopal Metals - Comprehensive Deployment Script
# ===============================================

# Usage:
# ./full-deploy.sh [platform]
# 
# Where platform is one of:
# - vercel (default)
# - digitalocean
# - vps
# - static

# Set environment variables
export NODE_ENV=production

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default platform is vercel
PLATFORM=${1:-vercel}

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   Gopal Metals Deployment Script      ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo
echo -e "${YELLOW}Deploying to:${NC} $PLATFORM"
echo

# Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to install dependencies${NC}"
  exit 1
fi
echo -e "${GREEN}Dependencies installed successfully!${NC}"
echo

# Environment setup
echo -e "${YELLOW}Step 2: Setting up environment...${NC}"
case $PLATFORM in
  vercel)
    echo "DATABASE_URL=\"file:./production.db\"" > .env.local
    echo "NODE_ENV=\"production\"" >> .env.local
    echo "PLATFORM=\"vercel\"" >> .env.local
    echo -e "${GREEN}Environment variables set for Vercel deployment${NC}"
    ;;
  digitalocean)
    echo "DATABASE_URL=\"file:./production.db\"" > .env.local
    echo "NODE_ENV=\"production\"" >> .env.local
    echo "PLATFORM=\"digitalocean\"" >> .env.local
    echo -e "${GREEN}Environment variables set for DigitalOcean deployment${NC}"
    ;;
  vps)
    echo "DATABASE_URL=\"file:./production.db\"" > .env.local
    echo "NODE_ENV=\"production\"" >> .env.local
    echo "PLATFORM=\"vps\"" >> .env.local
    echo -e "${GREEN}Environment variables set for VPS deployment${NC}"
    ;;
  static)
    echo "DATABASE_URL=\"file:./production.db\"" > .env.local
    echo "NODE_ENV=\"production\"" >> .env.local
    echo "PLATFORM=\"static\"" >> .env.local
    echo -e "${GREEN}Environment variables set for static export${NC}"
    ;;
  *)
    echo -e "${RED}Error: Unknown platform '$PLATFORM'${NC}"
    echo "Valid platforms are: vercel, digitalocean, vps, static"
    exit 1
    ;;
esac
echo

# Database setup
echo -e "${YELLOW}Step 3: Setting up database...${NC}"

# Ensure prisma directory exists
mkdir -p prisma

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo -e "${RED}Warning: Failed to generate Prisma client. Continuing anyway...${NC}"
fi

# Run migrations if on VPS or local development
if [ "$PLATFORM" = "vps" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
  if [ $? -ne 0 ]; then
    echo -e "${RED}Warning: Failed to run migrations. Attempting to create database...${NC}"
    npx prisma migrate dev --name init
  fi
fi
echo -e "${GREEN}Database setup completed!${NC}"
echo

# Build step
echo -e "${YELLOW}Step 4: Building application...${NC}"
if [ "$PLATFORM" = "static" ]; then
  # For static export
  echo "Building static export..."
  npm run build
  # Create the out directory if it doesn't exist
  mkdir -p out
  # Copy the static assets
  cp -r .next/static out/
else
  # Regular build
  npm run build
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Build failed${NC}"
  exit 1
fi
echo -e "${GREEN}Build completed successfully!${NC}"
echo

# Platform-specific post-build steps
echo -e "${YELLOW}Step 5: Running platform-specific tasks...${NC}"
case $PLATFORM in
  vercel)
    echo "Vercel deployment is handled by Vercel's platform."
    echo "Make sure you've set the following in your Vercel project:"
    echo "1. Environment Variables: DATABASE_URL, NODE_ENV"
    echo "2. Build Command: chmod +x full-deploy.sh && ./full-deploy.sh vercel"
    echo "3. Output Directory: .next"
    ;;
  digitalocean)
    echo "DigitalOcean deployment is handled by the App Platform."
    echo "Make sure you've set the following in your App Platform settings:"
    echo "1. Environment Variables: DATABASE_URL, NODE_ENV"
    echo "2. Build Command: chmod +x full-deploy.sh && ./full-deploy.sh digitalocean"
    ;;
  vps)
    echo "Starting application on VPS..."
    if command -v pm2 &> /dev/null; then
      # Use PM2 if available
      echo "Using PM2 for process management..."
      NODE_OPTIONS="--max_old_space_size=512" pm2 start npm --name "gopalmetals" -- start
      echo -e "${GREEN}Application started with PM2!${NC}"
    else
      # Otherwise use regular npm start
      echo "PM2 not found, using regular npm start..."
      npm start &
      echo -e "${GREEN}Application started!${NC}"
    fi
    ;;
  static)
    echo "Static export generated in the 'out' directory."
    echo "Upload these files to your web server to deploy."
    ;;
esac
echo

echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}Deployment process completed successfully!${NC}"
echo -e "${BLUE}=======================================${NC}"
echo
echo "Thank you for using Gopal Metals deployment script."
echo -e "Visit ${YELLOW}https://gopalmetals.com${NC} to see your website." 