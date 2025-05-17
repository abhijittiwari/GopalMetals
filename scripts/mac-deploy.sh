#!/bin/bash

# Gopal Metals macOS Deployment Script

# Terminal Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_section() {
  echo -e "\n${GREEN}>>> $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}WARNING: $1${NC}"
}

print_error() {
  echo -e "${RED}ERROR: $1${NC}"
}

# Configuration
PORT=3004
DB_PATH="./prisma/dev.db"

# Get app version from package.json
APP_VERSION=$(grep -o '"version": "[^"]*' package.json | cut -d'"' -f4)
print_section "Deploying Gopal Metals version: $APP_VERSION"

# Check Node.js version
NODE_VERSION=$(node -v)
print_section "Using Node.js $NODE_VERSION"

# If the required Node.js version doesn't match, suggest installing it
REQUIRED_NODE="v18.19.1"
if [[ "$NODE_VERSION" != "$REQUIRED_NODE"* ]]; then
  print_warning "Recommended Node.js version is $REQUIRED_NODE, but you have $NODE_VERSION"
  read -p "Would you like to continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled. Please install Node.js $REQUIRED_NODE using nvm or from nodejs.org"
    exit 1
  fi
fi

# Update dependencies using exact versions from package-lock.json
print_section "Installing dependencies"
npm ci

# Make sure we have proper .env file for Prisma
if [ ! -f ".env" ] || ! grep -q "DATABASE_URL" .env; then
  print_section "Creating .env file with DATABASE_URL"
  echo "DATABASE_URL=\"file:./dev.db\"" > .env
fi

# Generate Prisma client with specific version
print_section "Generating Prisma client"
npx prisma@5.11.0 generate --schema=./prisma/schema.prisma

# Create the database if it doesn't exist
if [ ! -f "$DB_PATH" ]; then
  print_warning "Database file not found, creating new database"
  npx prisma@5.11.0 migrate dev --name init --schema=./prisma/schema.prisma
  npx prisma@5.11.0 db push --schema=./prisma/schema.prisma
  # Seed the database
  npx prisma@5.11.0 db seed
else
  print_section "Database file found at $DB_PATH"
fi

# Build the app with flags to skip type checking using pinned Next.js version
print_section "Building the application"
NEXT_TELEMETRY_DISABLED=1 DISABLE_ESLINT_PLUGIN=true DISABLE_TYPESCRIPT=true npx next@15.3.1 build

# Start the app
print_section "Starting the application"
npm run start -- -p $PORT

print_section "Deployment complete"
echo "Website should be available at: http://localhost:$PORT"
echo "You can now log in to the admin panel at http://localhost:$PORT/admin/login with:"
echo "Email: admin@gopalmetals.com"
echo "Password: gopal123" 