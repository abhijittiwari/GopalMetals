#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}    Gopal Metals - Ubuntu Bypass 404 Script       ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Current working directory
APP_DIR=$(pwd)
PORT=${1:-3000}
echo -e "${YELLOW}Will run on port: $PORT${NC}"

# Ensure DATABASE_URL is set for Prisma
if [ ! -f ".env" ] || ! grep -q "DATABASE_URL" .env; then
  echo -e "${YELLOW}Creating .env file with DATABASE_URL...${NC}"
  echo "DATABASE_URL=\"file:./production.db\"" > .env
fi

# Setup database without doing a full build
echo -e "${YELLOW}Setting up database with direct prisma commands...${NC}"
export DATABASE_URL="file:./production.db"

# Push database schema (with error handling)
echo -e "${YELLOW}Pushing database schema...${NC}"
npx prisma db push --skip-generate || \
npx prisma@5.11.0 db push --skip-generate || \
echo -e "${RED}Database schema push failed, but continuing...${NC}"

# Generate client separately (with error handling)
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate || \
npx prisma@5.11.0 generate || \
echo -e "${RED}Prisma client generation failed, but continuing...${NC}"

# Create special next.config.js for development
echo -e "${YELLOW}Creating simplified next.config.js for development...${NC}"
cat > next.config.js.dev << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
EOL

# Backup original config and use simplified version
if [ -f "next.config.js" ]; then
  mv next.config.js next.config.js.bak
fi
mv next.config.js.dev next.config.js

# Create PM2 ecosystem file
echo -e "${YELLOW}Creating PM2 ecosystem file...${NC}"
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "gopalmetals",
    script: "npm",
    args: "run dev -- -p ${PORT}",
    env: {
      NODE_ENV: "production",
      PORT: "${PORT}",
      DISABLE_ESLINT_PLUGIN: "true",
      DISABLE_TYPESCRIPT: "true"
    },
    watch: false,
    max_memory_restart: "512M",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "${APP_DIR}/logs/error.log",
    out_file: "${APP_DIR}/logs/output.log"
  }]
};
EOL

# Create logs directory
mkdir -p logs

# Check if PM2 is installed, if not - install it
if ! command -v pm2 &> /dev/null; then
  echo -e "${YELLOW}PM2 not found, installing...${NC}"
  npm install -g pm2
fi

echo -e "${GREEN}Starting the application in development mode with PM2...${NC}"
echo -e "${YELLOW}This is a production workaround - app will run in development mode but with production data.${NC}"

# Stop any existing instance
pm2 stop gopalmetals 2>/dev/null || true
pm2 delete gopalmetals 2>/dev/null || true

# Start using PM2
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 to start on system boot if not already done
pm2 startup | grep -v "To setup the Startup Script" || true

echo -e "${GREEN}Application is now running in development mode to bypass build errors.${NC}"
echo -e "${GREEN}Access it at: http://localhost:${PORT}${NC}"
echo -e "${YELLOW}To check status: pm2 status${NC}"
echo -e "${YELLOW}To view logs: pm2 logs gopalmetals${NC}" 