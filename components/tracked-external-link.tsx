'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface TrackedExternalLinkProps {
  href: string;
  children: React.ReactNode;
  linkType?: 'social' | 'project' | 'blog' | 'other';
  className?: string;
  [key: string]: unknown;
}

export function TrackedExternalLink({
  href,
  children,
  linkType = 'other',
  className = '',
  ...rest
}: TrackedExternalLinkProps) {
  const { trackExternalLinkClick } = useAnalyticsTracking();

  const handleClick = () => {
    trackExternalLinkClick(href, linkType);
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </Link>
  );
}
