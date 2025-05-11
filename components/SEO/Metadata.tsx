import { Metadata } from 'next';

type MetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
}

/**
 * Creates standardized metadata for SEO based on provided props
 */
export function generateMetadata({
  title = "Gopal Metals - Wire Mesh Manufacturer and Supplier",
  description = "Leading wire mesh manufacturer and supplier in India offering a wide range of welded mesh, wire mesh, expanded metal, and perforated sheets.",
  keywords = ["wire mesh", "welded mesh", "expanded metal", "perforated sheets", "wire mesh manufacturer", "India"],
  url = "",
  imageUrl = "/images/og-image.jpg",
  imageAlt = "Gopal Metals - Wire Mesh Products",
  type = "website"
}: MetadataProps): Metadata {
  // Base URL - replace with actual domain in production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gopalmetals.com";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Gopal Metals",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
  };
} 