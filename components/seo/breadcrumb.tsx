/**
 * Breadcrumb Navigation Component
 *
 * Displays breadcrumb navigation with JSON-LD structured data for SEO.
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbListSchema, type BreadcrumbItem } from '@/lib/seo/json-ld';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  homeLabel?: string;
  homeUrl?: string;
}

/**
 * Breadcrumb navigation component with SEO structured data
 */
export function Breadcrumb({
  items,
  className,
  separator,
  homeLabel = 'Home',
  homeUrl = '/',
}: BreadcrumbProps) {
  // Ensure home is the first item
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: homeLabel, item: new URL(homeUrl, 'https://josephthuo.com').href },
    ...items,
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      <BreadcrumbListSchema items={breadcrumbItems} />

      {/* Visual breadcrumb */}
      <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
        <ol className="flex items-center gap-1 flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={item.item} className="flex items-center gap-1">
                {index > 0 && (
                  <span className="text-muted-foreground/50" aria-hidden="true">
                    {separator || <ChevronRight className="h-4 w-4" />}
                  </span>
                )}

                {isFirst ? (
                  <Link
                    href={homeUrl}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span className="sr-only">{homeLabel}</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.item.replace('https://josephthuo.com', '')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Breadcrumb trail helper - generates breadcrumb items from a path
 */
export function generateBreadcrumbsFromPath(
  path: string,
  additionalItems?: Array<{ name: string; path: string }>
): BreadcrumbItem[] {
  const baseUrl = 'https://josephthuo.com';
  const items: BreadcrumbItem[] = [];

  // Split path and generate items
  const segments = path.split('/').filter(Boolean);

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert slug to readable title
    const title = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    items.push({
      name: title,
      item: `${baseUrl}${currentPath}`,
    });
  });

  // Add additional items if provided (e.g., for dynamic pages like blog posts)
  if (additionalItems) {
    additionalItems.forEach((item) => {
      const itemUrl = item.path.startsWith('http') ? item.path : `${baseUrl}${item.path}`;
      items.push({
        name: item.name,
        item: itemUrl,
      });
    });
  }

  return items;
}

/**
 * Project breadcrumb component
 */
interface ProjectBreadcrumbProps {
  projectSlug: string;
  projectTitle: string;
  className?: string;
}

export function ProjectBreadcrumb({ projectSlug, projectTitle, className }: ProjectBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Projects', item: 'https://josephthuo.com/projects' },
    { name: projectTitle, item: `https://josephthuo.com/projects/${projectSlug}` },
  ];

  return <Breadcrumb items={items} className={className} />;
}

/**
 * Blog post breadcrumb component
 */
interface BlogPostBreadcrumbProps {
  postSlug: string;
  postTitle: string;
  className?: string;
}

export function BlogPostBreadcrumb({ postSlug, postTitle, className }: BlogPostBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Blog', item: 'https://josephthuo.com/blog' },
    { name: postTitle, item: `https://josephthuo.com/blog/${postSlug}` },
  ];

  return <Breadcrumb items={items} className={className} />;
}

/**
 * Category/Tag breadcrumb component
 */
interface CategoryBreadcrumbProps {
  type: 'projects' | 'blog';
  category: string;
  className?: string;
}

export function CategoryBreadcrumb({ type, category, className }: CategoryBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { name: type === 'projects' ? 'Projects' : 'Blog', item: `https://josephthuo.com/${type}` },
    {
      name: category,
      item: `https://josephthuo.com/${type}?category=${encodeURIComponent(category)}`,
    },
  ];

  return <Breadcrumb items={items} className={className} />;
}
