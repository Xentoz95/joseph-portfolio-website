/**
 * Cloudinary Helper Functions
 *
 * Utility functions for image transformations including resize, crop, and format operations.
 */

import type { TransformationOptions } from 'cloudinary';

/**
 * Transformation options for image operations
 */
export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif' | 'gif';
  crop?: 'scale' | 'fill' | 'fit' | 'crop' | 'thumb' | 'limit' | 'pad';
  gravity?: 'auto' | 'center' | 'faces' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
  aspectRatio?: string; // e.g., "16:9", "4:3", "1:1"
  zoom?: number; // 1.0 - 100.0
  rotate?: number; // 0 - 359
  opacity?: number; // 0 - 100
  background?: string; // hex color or RGB
}

/**
 * Generate Cloudinary transformation string
 */
export function generateTransformations(options: ImageTransformOptions): string {
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.aspectRatio) transformations.push(`ar_${options.aspectRatio}`);
  if (options.zoom) transformations.push(`z_${options.zoom}`);
  if (options.rotate) transformations.push(`a_${options.rotate}`);
  if (options.opacity) transformations.push(`o_${options.opacity}`);
  if (options.background) transformations.push(`b_${options.background}`);

  return transformations.join(',');
}

/**
 * Generate Cloudinary URL with transformations
 * If the input is a local path (starts with /), it returns it as-is
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: ImageTransformOptions = {},
  cloudName?: string
): string {
  // If it's already a full URL (http/https), return it
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  // If it's a local path (starts with /), return it as-is
  // This allows the app to use local images from the public folder
  if (publicId.startsWith('/')) {
    return publicId;
  }

  const cloud = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloud) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  const transformations = generateTransformations(options);
  const transformString = transformations ? `${transformations}/` : '';

  return `https://res.cloudinary.com/${cloud}/image/upload/${transformString}${publicId}`;
}

/**
 * Resize transformation
 */
export function resize(
  publicId: string,
  width?: number,
  height?: number,
  options: Partial<ImageTransformOptions> = {}
): string {
  return buildCloudinaryUrl(publicId, {
    ...options,
    width,
    height,
    crop: options.crop || 'fill',
  });
}

/**
 * Crop transformation
 */
export function crop(
  publicId: string,
  width: number,
  height: number,
  gravity: ImageTransformOptions['gravity'] = 'auto'
): string {
  return buildCloudinaryUrl(publicId, {
    width,
    height,
    crop: 'crop',
    gravity,
  });
}

/**
 * Format conversion
 */
export function format(
  publicId: string,
  format: ImageTransformOptions['format'] = 'auto'
): string {
  return buildCloudinaryUrl(publicId, { format });
}

/**
 * Quality optimization
 */
export function optimize(
  publicId: string,
  quality: number = 80,
  format: ImageTransformOptions['format'] = 'auto'
): string {
  return buildCloudinaryUrl(publicId, { quality, format });
}

/**
 * Generate responsive image sizes
 */
export interface ResponsiveImageSource {
  src: string;
  width: number;
}

export function generateResponsiveImages(
  publicId: string,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920],
  options: ImageTransformOptions = {}
): ResponsiveImageSource[] {
  return breakpoints.map((width) => ({
    src: buildCloudinaryUrl(publicId, { ...options, width }),
    width,
  }));
}

/**
 * Generate srcset attribute value
 */
export function generateSrcSet(
  publicId: string,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920],
  options: ImageTransformOptions = {}
): string {
  const sources = generateResponsiveImages(publicId, breakpoints, options);
  return sources.map((s) => `${s.src} ${s.width}w`).join(', ');
}

/**
 * Common preset transformations
 */
export const presets = {
  /**
   * Thumbnail preset (400x300)
   */
  thumbnail: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 400,
      height: 300,
      quality: 80,
      crop: 'fill',
      format: 'auto',
    }),

  /**
   * Featured/OG image preset (1200x630)
   */
  featured: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1200,
      height: 630,
      quality: 90,
      crop: 'fill',
      format: 'auto',
    }),

  /**
   * Gallery preset (800x600)
   */
  gallery: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 800,
      height: 600,
      quality: 85,
      crop: 'fill',
      format: 'auto',
    }),

  /**
   * Hero preset (1920x1080)
   */
  hero: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1920,
      height: 1080,
      quality: 90,
      crop: 'fill',
      format: 'auto',
    }),

  /**
   * Avatar preset (square, various sizes)
   */
  avatar: (publicId: string, size: number = 200): string =>
    buildCloudinaryUrl(publicId, {
      width: size,
      height: size,
      quality: 85,
      crop: 'thumb',
      gravity: 'faces',
      format: 'auto',
    }),

  /**
   * Mobile preset (max width 640px)
   */
  mobile: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 640,
      quality: 80,
      crop: 'scale',
      format: 'auto',
    }),

  /**
   * Tablet preset (max width 1024px)
   */
  tablet: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1024,
      quality: 85,
      crop: 'scale',
      format: 'auto',
    }),

  /**
   * Desktop preset (max width 1920px)
   */
  desktop: (publicId: string): string =>
    buildCloudinaryUrl(publicId, {
      width: 1920,
      quality: 90,
      crop: 'scale',
      format: 'auto',
    }),
};

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // Find the upload folder
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) {
      return null;
    }

    // Skip transformations and version if present
    let startIndex = uploadIndex + 1;
    const versionPattern = /^v\d+$/;

    while (startIndex < pathParts.length && versionPattern.test(pathParts[startIndex])) {
      startIndex++;
    }

    // The rest is the public ID (including folders)
    const publicId = pathParts.slice(startIndex).join('/');

    // Remove file extension if present
    return publicId.replace(/\.[^.]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Convert local image path to Cloudinary public ID format
 */
export function pathToCloudinaryPublicId(
  localPath: string,
  baseFolder: string = 'portfolio'
): string {
  // Remove leading slashes and 'public/' if present
  let cleanPath = localPath.replace(/^\/+/, '').replace(/^public\//, '');

  // Remove file extension
  cleanPath = cleanPath.replace(/\.[^.]+$/, '');

  // Add base folder prefix
  return `${baseFolder}/${cleanPath}`;
}

/**
 * Validation helpers
 */
export const validation = {
  /**
   * Check if a string is a valid Cloudinary public ID
   */
  isValidPublicId: (id: string): boolean => {
    return /^[a-zA-Z0-9/_-]+$/.test(id) && id.length > 0 && id.length <= 1024;
  },

  /**
   * Check if a URL is a Cloudinary URL
   */
  isCloudinaryUrl: (url: string): boolean => {
    return url.includes('cloudinary.com') && url.includes('/image/upload/');
  },

  /**
   * Validate image dimensions
   */
  isValidDimensions: (width: number, height: number): boolean => {
    return (
      Number.isInteger(width) &&
      Number.isInteger(height) &&
      width > 0 &&
      width <= 10000 &&
      height > 0 &&
      height <= 10000
    );
  },

  /**
   * Validate quality value
   */
  isValidQuality: (quality: number): boolean => {
    return Number.isInteger(quality) && quality >= 1 && quality <= 100;
  },
};
