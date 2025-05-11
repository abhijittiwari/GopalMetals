# Gopal Metals Website

This is the official website for Gopal Metals, a leading manufacturer of wire mesh products in India.

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

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

The website can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a custom server.

```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by [Lunia Wire Netting](https://www.luniawirenetting.com)
- Icons from [Heroicons](https://heroicons.com/)

NODE_OPTIONS="--max_old_space_size=512" pm2 start npm --name "gopalmetals" -- start
