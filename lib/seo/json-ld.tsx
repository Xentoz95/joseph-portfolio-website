/**
 * JSON-LD Structured Data Components
 *
 * Generates JSON-LD structured data for SEO.
 * Supports schema.org types for websites, organizations, articles, and creative works.
 */

import React from 'react';

const SITE_URL = 'https://josephthuo.com';
const SITE_NAME = 'Joseph Thuo Portfolio';
const AUTHOR_NAME = 'Joseph Thuo';

interface BaseJsonLdProps {
  type: string;
  id?: string;
}

/**
 * Base JSON-LD component
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema
 */
export interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export function OrganizationSchema({
  name = AUTHOR_NAME,
  url = SITE_URL,
  logo,
  description,
  sameAs = [],
}: OrganizationSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return <JsonLd data={data} />;
}

/**
 * Person Schema (for portfolio owner)
 */
export interface PersonSchemaProps {
  name?: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
  worksFor?: string;
  email?: string;
}

export function PersonSchema({
  name = AUTHOR_NAME,
  url = SITE_URL,
  image,
  jobTitle = 'Full Stack Developer',
  description,
  sameAs = [],
  worksFor = 'Freelance',
  email,
}: PersonSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(image && { image }),
    jobTitle,
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
    worksFor: {
      '@type': 'Organization',
      name: worksFor,
    },
    ...(email && { email }),
  };

  return <JsonLd data={data} />;
}

/**
 * WebSite Schema
 */
export interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  searchAction?: boolean;
}

export function WebSiteSchema({
  name = SITE_NAME,
  url = SITE_URL,
  description,
  searchAction = true,
}: WebSiteSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
    ...(searchAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url}/search?q={search_term_string}`,
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'search_term_string',
        },
      },
    }),
  };

  return <JsonLd data={data} />;
}

/**
 * WebPage Schema
 */
export interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: {
    name: string;
    item: string;
  }[];
}

export function WebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  breadcrumb,
}: WebPageSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };

  if (breadcrumb && breadcrumb.length > 0) {
    data.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    };
  }

  return <JsonLd data={data} />;
}

/**
 * Article Schema (for blog posts)
 */
export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  tags?: string[];
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = AUTHOR_NAME,
  publisher = SITE_NAME,
  tags,
}: ArticleSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  if (tags && tags.length > 0) {
    data.keywords = tags.join(', ');
  }

  return <JsonLd data={data} />;
}

/**
 * CreativeWork Schema (for projects)
 */
export interface CreativeWorkSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  dateCreated?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
  category?: string;
}

export function CreativeWorkSchema({
  title,
  description,
  url,
  image,
  dateCreated,
  dateModified,
  author = AUTHOR_NAME,
  keywords,
  category,
}: CreativeWorkSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url,
    ...(image && { image }),
    ...(dateCreated && { dateCreated }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author,
    },
  };

  if (keywords && keywords.length > 0) {
    data.keywords = keywords.join(', ');
  }

  if (category) {
    data.genre = category;
  }

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList Schema
 */
export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbListSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * CollectionPage Schema (for listing pages like /projects, /blog)
 */
export interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
  items?: {
    name: string;
    url: string;
    description?: string;
    image?: string;
  }[];
}

export function CollectionPageSchema({
  name,
  description,
  url,
  items = [],
}: CollectionPageSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
  };

  if (items.length > 0) {
    data.mainEntity = {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: item.name,
          url: item.url,
          ...(item.description && { description: item.description }),
          ...(item.image && { image: item.image }),
        },
      })),
    };
  }

  return <JsonLd data={data} />;
}

/**
 * ProfilePage Schema (for homepage)
 */
export interface ProfilePageSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
}

export function ProfilePageSchema({
  name,
  description,
  url,
  image,
  sameAs,
  jobTitle,
}: ProfilePageSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: new Date().toISOString(),
    about: {
      '@type': 'Person',
      name,
      url,
      ...(image && { image }),
      ...(sameAs && sameAs.length > 0 && { sameAs }),
      ...(jobTitle && { jobTitle }),
      description,
    },
  };

  return <JsonLd data={data} />;
}
