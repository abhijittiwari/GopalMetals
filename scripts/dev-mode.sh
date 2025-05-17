#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}      Gopal Metals - Development Mode Script      ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Switch to project directory
cd $(dirname "$0")/..

# Default port and allow override
PORT=${1:-3000}
echo -e "${YELLOW}Will try to use port: $PORT${NC}"

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
echo -e "${GREEN}Starting Gopal Metals version: $APP_VERSION in development mode${NC}"

# Ensure DATABASE_URL is set for Prisma
if [ ! -f ".env" ] || ! grep -q "DATABASE_URL" .env; then
  echo -e "${YELLOW}Creating .env file with DATABASE_URL...${NC}"
  echo "DATABASE_URL=\"file:./production.db\"" > .env
fi

# Generate Prisma client to avoid runtime issues (quietly)
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma@5.11.0 generate --schema=./prisma/schema.prisma > /dev/null 2>&1 || true

# Start directly in development mode
echo -e "${YELLOW}Starting Next.js in development mode on port $PORT...${NC}"
echo -e "${GREEN}This mode bypasses build issues and is suitable for development and testing.${NC}"
NEXT_TELEMETRY_DISABLED=1 DISABLE_ESLINT_PLUGIN=true DISABLE_TYPESCRIPT=true PORT=$PORT npm run dev -- -p $PORT 