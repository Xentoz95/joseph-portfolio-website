'use client';

/**
 * Optimized Image Component
 *
 * Uses Cloudinary's CldImage component for optimized image delivery.
 * Features automatic format selection, lazy loading, and responsive sizing.
 */

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CldImageProps } from 'next-cloudinary';

export interface OptimizedImageProps extends Omit<CldImageProps, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component using Cloudinary
 *
 * Automatically selects the best format, optimizes quality, and provides
 * responsive images for different screen sizes.
 */
export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  placeholder = 'empty',
  sizes,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Check if src is already a full URL or a public ID
  const isCloudinaryUrl = src.includes('cloudinary.com');
  const imageSrc = isCloudinaryUrl ? src : src;

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-slate-100 dark:bg-slate-800 flex items-center justify-center',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm text-slate-400 dark:text-slate-600">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse"
          style={{ width, height }}
        />
      )}
      <CldImage
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        quality="auto"
        format="auto"
        loading={priority ? 'eager' : 'lazy'}
        placeholder={placeholder}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Preset-optimized image components
 */

export interface ThumbnailImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  size?: 'sm' | 'md' | 'lg';
}

const thumbnailSizes = {
  sm: { width: 200, height: 150 },
  md: { width: 400, height: 300 },
  lg: { width: 600, height: 450 },
};

/**
 * Thumbnail-optimized image for galleries and previews
 */
export function ThumbnailImage({ size = 'md', ...props }: ThumbnailImageProps) {
  const { width, height } = thumbnailSizes[size];

  return (
    <OptimizedImage
      {...props}
      width={width}
      height={height}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
    />
  );
}

/**
 * Featured/hero image optimized for social sharing and headers
 */
export function FeaturedImage({
  width = 1200,
  height = 630,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={width}
      height={height}
      priority
      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
    />
  );
}

/**
 * Gallery image optimized for photo galleries
 */
export function GalleryImage({
  width = 800,
  height = 600,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={width}
      height={height}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
    />
  );
}

/**
 * Avatar image optimized for user profiles and thumbnails
 */
export function AvatarImage({
  size = 'md',
  ...props
}: ThumbnailImageProps & { size?: 'sm' | 'md' | 'lg' }) {
  const avatarSizes = {
    sm: 32,
    md: 64,
    lg: 128,
  };

  const dimension = avatarSizes[size];

  return (
    <OptimizedImage
      {...props}
      width={dimension}
      height={dimension}
      sizes={`${dimension}px`}
      className={cn('rounded-full object-cover', props.className)}
    />
  );
}
