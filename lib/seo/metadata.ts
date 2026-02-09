/**
 * SEO Metadata Utilities
 *
 * Helper functions for generating consistent metadata across the application.
 */

import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  nofollow?: boolean;
  alternateLanguages?: { lang: string; url: string }[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

const SITE_URL = 'https://josephthuo.com';
const DEFAULT_OG_IMAGE = '/og-image.jpg';
const SITE_NAME = 'Joseph Thuo Portfolio';
const TWITTER_HANDLE = '@josephthuo';

/**
 * Generate full page title with site name suffix
 */
export function generatePageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraph(config: SEOConfig): Metadata['openGraph'] {
  const {
    title,
    description,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  } = config;

  const og: Metadata['openGraph'] = {
    type: ogType,
    locale: 'en_US',
    url: config.canonical,
    title,
    description,
    siteName: SITE_NAME,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  // Article-specific properties
  if (ogType === 'article') {
    if (publishedTime) (og as any).publishedTime = publishedTime;
    if (modifiedTime) (og as any).modifiedTime = modifiedTime;
    if (authors) (og as any).authors = authors;
    if (section) (og as any).section = section;
    if (tags) (og as any).tags = tags;
  }

  return og;
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCard(config: SEOConfig): Metadata['twitter'] {
  const {
    title,
    description,
    ogImage = DEFAULT_OG_IMAGE,
    twitterCard = 'summary_large_image',
  } = config;

  return {
    card: twitterCard,
    title,
    description,
    images: [ogImage],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  };
}

/**
 * Generate robots metadata
 */
export function generateRobots(noindex?: boolean, nofollow?: boolean): Metadata['robots'] {
  return {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

/**
 * Generate complete metadata object
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonical,
    noindex,
    nofollow,
    alternateLanguages,
  } = config;

  const canonicalUrl = canonical || generateCanonicalUrl('/');

  return {
    title: generatePageTitle(title),
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages?.reduce(
        (acc, { lang, url }) => ({
          ...acc,
          [lang]: url,
        }),
        {}
      ),
    },
    openGraph: generateOpenGraph({ ...config, canonical: canonicalUrl }),
    twitter: generateTwitterCard(config),
    robots: generateRobots(noindex, nofollow),
  };
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata(config: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const canonicalUrl = generateCanonicalUrl(config.path);

  return generateMetadata({
    title: config.title,
    description: config.description,
    canonical: canonicalUrl,
    ogImage: config.ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
  });
}

/**
 * Generate metadata for article pages (blog posts, project details)
 */
export function generateArticleMetadata(config: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}): Metadata {
  const canonicalUrl = generateCanonicalUrl(config.path);

  return generateMetadata({
    title: config.title,
    description: config.description,
    canonical: canonicalUrl,
    ogImage: config.ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    publishedTime: config.publishedTime,
    modifiedTime: config.modifiedTime,
    authors: config.authors,
    section: config.section,
    tags: config.tags,
  });
}
