# Gopal Metals Website

This is the official website for Gopal Metals, a leading manufacturer and supplier of wire mesh products in India.

## Features

- Responsive design for desktop and mobile devices
- Product catalog with categories and detailed product pages
- Company information and contact details
- Admin panel for content management
- Google Analytics integration for website traffic monitoring
- Comprehensive SEO optimization for better search engine rankings

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (can be easily migrated to PostgreSQL, MySQL, etc.)
- **Authentication**: NextAuth.js
- **Analytics**: Custom implementation with geoip-lite and ua-parser-js
- **Email**: Nodemailer for sending emails from contact forms
- **Google Analytics**: Google Analytics 4
- **SEO**: Next.js Metadata API, JSON-LD structured data

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"

# SEO and Analytics
NEXT_PUBLIC_BASE_URL="https://www.gopalmetals.com"
```

## SEO Implementation

The website is fully optimized for search engines with the following features:

1. **Metadata and Open Graph Tags**: Dynamic metadata generation for each page type
2. **Structured Data (JSON-LD)**: Schema.org markup for organization, products, and webpages
3. **Canonical URLs**: Properly implemented to avoid duplicate content issues
4. **Sitemap.xml**: Automatically generated based on your content
5. **Robots.txt**: Configured to control search engine crawling
6. **Semantic HTML**: Proper use of heading tags, landmarks, and semantic elements
7. **Accessibility**: ARIA attributes and proper focus management
8. **Performance Optimization**: Image optimization with Next.js Image component

To customize SEO settings:

- Modify the base metadata in `app/layout.tsx`
- Update page-specific metadata in individual page components
- Set product-specific SEO details in product pages

## Google Analytics Configuration

The website is integrated with Google Analytics 4. To set up Google Analytics:

1. Create a Google Analytics 4 property in your [Google Analytics account](https://analytics.google.com/)
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Replace the placeholder ID in `components/GoogleAnalytics.tsx` with your actual Measurement ID:

```tsx
// Replace this with your actual Google Analytics measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

Google Analytics is automatically disabled during development to avoid tracking development data. It will only be active in production builds.

## Admin Panel

The admin panel is accessible at `/admin` and provides the following functionality:

- Dashboard with website statistics
- Product management (add, edit, delete)
- Category management
- Website settings (contact info, social media links, etc.)
- Image management for logo, hero images, etc.

## Deployment

### Important: Database Setup

This application uses Prisma with SQLite. For proper deployment on platforms like Vercel and Digital Ocean:

1. Make sure to set the following environment variables in your deployment platform:
   - `DATABASE_URL`: `file:./production.db`
   - `NODE_ENV`: `production`

2. For Vercel:
   - Go to your project settings
   - Add the environment variables mentioned above
   - Use the following build command: `chmod +x deploy.sh && ./deploy.sh`
   - Set the output directory to: `.next`

3. For Digital Ocean:
   - Add the environment variables in the App Platform settings
   - Use the deploy.sh script as part of your build command

### Alternative Approach

If you're still having issues with the database on serverless platforms like Vercel:

1. Generate a static export of your site locally:
   ```bash
   npm run build
   ```

2. Push the static files to your hosting platform.

## Database Initialization

If you need to manually initialize the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Additional Information

The site is built with:
- Next.js 15.3.1
- React 18
- Prisma ORM
- Tailwind CSS

For any issues during deployment, check the application logs in your hosting platform for detailed error messages.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by [Lunia Wire Netting](https://www.luniawirenetting.com)
- Icons from [Heroicons](https://heroicons.com/)

NODE_OPTIONS="--max_old_space_size=512" pm2 start npm --name "gopalmetals" -- start
