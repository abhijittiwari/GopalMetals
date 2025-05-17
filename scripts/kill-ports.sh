#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ports commonly used by Next.js applications
PORTS=(3000 3001 3002 3003 3004 3005 4000)

echo -e "${YELLOW}Checking for processes using common Node.js ports...${NC}"

for PORT in "${PORTS[@]}"; do
  # Get process IDs using the port
  PIDS=$(lsof -ti:$PORT)
  
  if [ -n "$PIDS" ]; then
    echo -e "${YELLOW}Found processes using port $PORT: $PIDS${NC}"
    
    # Ask for confirmation before killing
    read -p "Kill processes on port $PORT? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Killing processes on port $PORT...${NC}"
      kill -9 $PIDS
      echo -e "${GREEN}Processes on port $PORT killed.${NC}"
    else
      echo -e "${YELLOW}Skipping port $PORT.${NC}"
    fi
  else
    echo -e "${GREEN}No processes found using port $PORT.${NC}"
  fi
done

echo -e "${GREEN}Done checking ports.${NC}" 