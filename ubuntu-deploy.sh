#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}      Gopal Metals - Ubuntu Deployment Script     ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Function to check if command succeeded
check_status() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: $1${NC}"
        exit 1
    else
        echo -e "${GREEN}$2${NC}"
    fi
}

# Configuration variables
REPO_URL="https://github.com/abhijittiwari/GopalMetals.git"
APP_DIR="/var/www/gopalmetals"
DOMAIN_NAME="gopalmetals.com"
NODE_VERSION="18"
GITHUB_BRANCH="main"

# Ask for confirmation
read -p "This script will install Gopal Metals on this Ubuntu server. Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
fi

# Step 1: Update system and install dependencies
echo -e "\n${YELLOW}Step 1: Updating system and installing dependencies...${NC}"
sudo apt update -y
check_status "Failed to update system" "System updated successfully"

sudo apt upgrade -y
check_status "Failed to upgrade system" "System upgraded successfully"

# Install required packages
echo -e "\n${YELLOW}Installing required packages...${NC}"
sudo apt install -y curl wget git nginx ufw build-essential
check_status "Failed to install required packages" "Required packages installed successfully"

# Step 2: Install Node.js
echo -e "\n${YELLOW}Step 2: Installing Node.js ${NODE_VERSION}...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
check_status "Failed to add Node.js repository" "Node.js repository added successfully"

sudo apt install -y nodejs
check_status "Failed to install Node.js" "Node.js installed successfully"

# Verify Node.js and npm installation
node_version=$(node -v)
npm_version=$(npm -v)
echo -e "${GREEN}Node.js version: ${node_version}${NC}"
echo -e "${GREEN}npm version: ${npm_version}${NC}"

# Step 3: Create swap space if memory is less than 2GB
echo -e "\n${YELLOW}Step 3: Setting up swap space...${NC}"
total_memory=$(free -m | awk '/^Mem:/{print $2}')
if [ $total_memory -lt 2048 ]; then
    echo "Server has less than 2GB RAM. Setting up 2GB swap space..."
    sudo swapoff -a
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    check_status "Failed to set up swap space" "Swap space configured successfully"
else
    echo -e "${GREEN}Server has sufficient memory. Skipping swap creation.${NC}"
fi

# Step 4: Clone the repository
echo -e "\n${YELLOW}Step 4: Cloning the Gopal Metals repository...${NC}"
# Create application directory if it doesn't exist
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Remove directory contents if exists and not empty
if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
    echo "Cleaning existing directory..."
    sudo rm -rf $APP_DIR/*
fi

# Clone the repository
git clone -b $GITHUB_BRANCH $REPO_URL $APP_DIR
check_status "Failed to clone repository" "Repository cloned successfully to $APP_DIR"

# Step 5: Install application dependencies
echo -e "\n${YELLOW}Step 5: Installing application dependencies...${NC}"
cd $APP_DIR
npm install
check_status "Failed to install npm dependencies" "npm dependencies installed successfully"

# Step A: Setup Prisma and database
echo -e "\n${YELLOW}Step 6: Setting up database...${NC}"
# Create environment file
cat > .env.local << EOL
DATABASE_URL="file:./production.db"
NODE_ENV="production"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="https://${DOMAIN_NAME}"
EOL
check_status "Failed to create environment file" "Environment file created successfully"

# Generate Prisma client
npx prisma generate
check_status "Failed to generate Prisma client" "Prisma client generated successfully"

# Create database and run migrations if needed
if [ ! -d prisma/migrations ]; then
    echo "Setting up initial database..."
    npx prisma migrate dev --name init
    check_status "Failed to initialize database" "Database initialized successfully"
fi

# Step 7: Build the application
echo -e "\n${YELLOW}Step 7: Building the application...${NC}"
NODE_OPTIONS="--max_old_space_size=2048" npm run build
check_status "Failed to build application" "Application built successfully"

# Step 8: Setup PM2 for process management
echo -e "\n${YELLOW}Step 8: Setting up PM2 process manager...${NC}"
sudo npm install -g pm2
check_status "Failed to install PM2" "PM2 installed successfully"

# Setup PM2 startup script
pm2 startup ubuntu
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u $USER --hp $HOME
check_status "Failed to setup PM2 startup" "PM2 startup configured successfully"

# Start the application
pm2 start npm --name "gopalmetals" -- start
check_status "Failed to start application with PM2" "Application started successfully with PM2"

pm2 save
check_status "Failed to save PM2 configuration" "PM2 configuration saved successfully"

# Step 9: Configure Nginx
echo -e "\n${YELLOW}Step 9: Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/gopalmetals << EOL
server {
    listen 80;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
check_status "Failed to create Nginx config" "Nginx config created successfully"

# Enable the site
sudo ln -sf /etc/nginx/sites-available/gopalmetals /etc/nginx/sites-enabled/
check_status "Failed to enable Nginx site" "Nginx site enabled successfully"

# Test Nginx configuration
sudo nginx -t
check_status "Nginx configuration test failed" "Nginx configuration test passed"

# Restart Nginx
sudo systemctl restart nginx
check_status "Failed to restart Nginx" "Nginx restarted successfully"

# Step 10: Configure firewall
echo -e "\n${YELLOW}Step 10: Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable
check_status "Failed to configure firewall" "Firewall configured successfully"

# Step 11: Setup SSL with Let's Encrypt (optional)
echo -e "\n${YELLOW}Step 11: Would you like to set up SSL with Let's Encrypt? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo apt install -y certbot python3-certbot-nginx
    check_status "Failed to install Certbot" "Certbot installed successfully"
    
    sudo certbot --nginx -d ${DOMAIN_NAME} -d www.${DOMAIN_NAME}
    check_status "Failed to obtain SSL certificate" "SSL certificate obtained successfully"
    
    # Auto-renewal for SSL
    echo -e "${YELLOW}Setting up auto-renewal for SSL certificates...${NC}"
    sudo systemctl status certbot.timer
fi

# Final message
echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}      Gopal Metals Deployment Complete!           ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "\nYour website should now be accessible at: http://${DOMAIN_NAME}"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "and securely at: https://${DOMAIN_NAME}"
fi
echo -e "\nImportant paths:"
echo -e "  - Application directory: ${APP_DIR}"
echo -e "  - Nginx config: /etc/nginx/sites-available/gopalmetals"
echo -e "\nUseful commands:"
echo -e "  - Check application status: pm2 status"
echo -e "  - View application logs: pm2 logs gopalmetals"
echo -e "  - Restart application: pm2 restart gopalmetals"
echo -e "\nMake sure your domain DNS is pointed to this server's IP address!" 