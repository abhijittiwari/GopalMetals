# Gopal Metals Website

Modern website for Gopal Metals, a leading manufacturer and supplier of wire mesh products in India.

## Features

- Responsive design
- Product catalog with categories
- Admin dashboard
- Contact form with email notification
- Analytics tracking
- Authentication system

## Technologies

- Next.js 15
- React 18
- Tailwind CSS
- Prisma ORM
- SQLite database
- NextAuth.js for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/abhijittiwari/GopalMetals.git
   cd GopalMetals
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Initialize the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed the database
   ```bash
   npm run seed
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm start
```

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Configure the following environment variables in Vercel dashboard:
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: A secure random string
   - `SETUP_SECRET_KEY`: Secret key for database setup
   - Other required environment variables from your `.env.local`
3. Vercel will automatically run the build process and post-build database setup

### Deploying with PM2

PM2 is a production process manager for Node.js applications.

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Deploy using the included ecosystem config:
   ```bash
   pm2 start ecosystem.config.js
   ```

3. Save the PM2 process list and configure startup:
   ```bash
   pm2 save
   pm2 startup
   ```

4. Monitor your application:
   ```bash
   pm2 monit
   ```

### Deploying to Custom VPS

1. Set up a server with Node.js 18+ installed

2. Clone the repository to your server:
   ```bash
   git clone https://github.com/abhijittiwari/GopalMetals.git
   cd GopalMetals
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create and configure `.env` file with production settings

5. Build the application:
   ```bash
   npm run build
   ```

6. Set up a process manager (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

7. Configure Nginx as a reverse proxy:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. Set up SSL with Certbot:
   ```bash
   certbot --nginx -d yourdomain.com
   ```

### Database Seeding in Production

The application automatically seeds the database with sample data if none exists, using:

1. Automatic seeding during application startup
2. Post-build script for deployment platforms
3. API endpoint for manual seeding

To manually trigger seeding, run:
```bash
npm run setup-db
```

## Admin Access

Admin dashboard is available at `/admin`

For security reasons, default login credentials are not provided in this README. Please set up your admin user through the database seeding process or contact the system administrator.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
