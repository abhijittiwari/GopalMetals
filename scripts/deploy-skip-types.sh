#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}      Gopal Metals - Deployment Script (Skip Types)${NC}"
echo -e "${GREEN}==================================================${NC}"

# Switch to project directory
cd $(dirname "$0")/..

# Default port and allow override
PORT=${1:-3000}
CLEAN=${2:-0}  # 0=no clean, 1=clean
echo -e "${YELLOW}Will try to use port: $PORT${NC}"

# Clean build directory if requested
if [ "$CLEAN" = "1" ]; then
  echo -e "${YELLOW}Cleaning .next directory...${NC}"
  rm -rf .next
  echo -e "${GREEN}Build directory cleaned.${NC}"
fi

# Kill any process using our port
echo -e "${YELLOW}Checking if port $PORT is in use...${NC}"
PIDS=$(lsof -ti:$PORT)
if [ -n "$PIDS" ]; then
  echo -e "${YELLOW}Port $PORT is in use by process(es): $PIDS${NC}"
  echo -e "${YELLOW}Attempting to kill the process(es)...${NC}"
  kill -9 $PIDS || true
  sleep 2
  echo -e "${GREEN}Process(es) killed.${NC}"
else
  echo -e "${GREEN}Port $PORT is available.${NC}"
fi

# Get app version from package.json
APP_VERSION=$(grep -o '"version": "[^"]*' package.json | cut -d'"' -f4)
echo -e "${GREEN}Deploying Gopal Metals version: $APP_VERSION${NC}"

# Install dependencies using exact versions from package-lock.json
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci

# Ensure DATABASE_URL is set for Prisma
if [ ! -f ".env" ] || ! grep -q "DATABASE_URL" .env; then
  echo -e "${YELLOW}Creating .env file with DATABASE_URL...${NC}"
  echo "DATABASE_URL=\"file:./production.db\"" > .env
fi

# Generate Prisma client to avoid runtime issues
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma@5.11.0 generate --schema=./prisma/schema.prisma || true

# Build without type checking
echo -e "${YELLOW}Starting build...${NC}"
NEXT_TELEMETRY_DISABLED=1 DISABLE_ESLINT_PLUGIN=true DISABLE_TYPESCRIPT=true npx next@15.3.1 build || true

# Check if build directory exists and has files
if [ ! -d ".next" ] || [ -z "$(ls -A .next 2>/dev/null)" ]; then
  echo -e "${RED}Build directory .next missing or empty. Build may have failed.${NC}"
  echo -e "${YELLOW}Creating minimal .next directory for development...${NC}"
  mkdir -p .next
fi

# Start the development server if the build failed
if [ ! -f ".next/BUILD_ID" ]; then
  echo -e "${YELLOW}BUILD_ID not found. Starting in development mode instead...${NC}"
  echo -e "${YELLOW}Starting Next.js development server on port $PORT...${NC}"
  PORT=$PORT npm run dev -- -p $PORT
else
  # Start the production server
  echo -e "${YELLOW}Starting the production server on port $PORT...${NC}"
  PORT=$PORT npm run start -- -p $PORT 