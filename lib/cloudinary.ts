/**
 * Cloudinary Configuration
 *
 * This module configures the Cloudinary SDK for image management and optimization.
 */

import { v2 as cloudinary, type TransformationOptions } from 'cloudinary';

// Validate required environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined');
}

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_CLOUDINARY_API_KEY is not defined');
}

if (!apiSecret) {
  throw new Error('CLOUDINARY_API_SECRET is not defined');
}

// Configure Cloudinary SDK (server-side only)
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Export configured instance for server-side use
export { cloudinary };

// Export cloud name for client-side use
export const CLOUDINARY_CLOUD_NAME = cloudName;

/**
 * Cloudinary URL builder for client-side image generation
 */
export interface CloudinaryUrlOptions {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  crop?: 'scale' | 'fill' | 'fit' | 'crop' | 'thumb';
  gravity?: 'auto' | 'center' | 'faces' | 'north' | 'south' | 'east' | 'west';
}

export function buildCloudinaryUrl(options: CloudinaryUrlOptions): string {
  const {
    src,
    width,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  // If it's already a full URL, return it
  if (src.startsWith('http')) {
    return src;
  }

  // Build Cloudinary URL with transformations
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  if (width || height) transformations.push(`c_${crop}`);
  if (gravity !== 'auto') transformations.push(`g_${gravity}`);

  const transformationString = transformations.join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${src}`;
}

/**
 * Default transformation options
 */
export const DEFAULT_TRANSFORMATIONS: TransformationOptions = {
  quality: 'auto',
  fetch_format: 'auto',
  crop: 'fill',
  gravity: 'auto',
};

/**
 * Image presets for different use cases
 */
export const IMAGE_PRESETS = {
  thumbnail: {
    width: 400,
    height: 300,
    quality: 80,
    crop: 'fill' as const,
  },
  featured: {
    width: 1200,
    height: 630,
    quality: 90,
    crop: 'fill' as const,
  },
  gallery: {
    width: 800,
    height: 600,
    quality: 85,
    crop: 'fill' as const,
  },
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
    crop: 'fill' as const,
  },
} as const;

/**
 * Upload an image to Cloudinary
 *
 * @param file - The file to upload (base64 data URL or buffer)
 * @param options - Upload options
 * @returns Upload result with public ID and URL
 */
export async function uploadImage(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: TransformationOptions;
  } = {}
): Promise<{
  publicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
}> {
  // Convert Buffer to base64 string if needed
  const fileData = Buffer.isBuffer(file) ? file.toString('base64') : file;

  const uploadResult = await cloudinary.uploader.upload(fileData, {
    folder: options.folder || 'portfolio',
    public_id: options.publicId,
    transformation: options.transformation,
    resource_type: 'image',
  });

  return {
    publicId: uploadResult.public_id,
    url: uploadResult.url,
    secureUrl: uploadResult.secure_url,
    width: uploadResult.width,
    height: uploadResult.height,
  };
}

/**
 * Delete an image from Cloudinary
 *
 * @param publicId - The public ID of the image to delete
 * @returns True if successful
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Extract public ID from Cloudinary URL
 *
 * @param url - The Cloudinary URL
 * @returns The public ID or null if not a Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('cloudinary.com')) {
      return null;
    }

    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) {
      return null;
    }

    // Remove version if present
    let publicId = pathParts.slice(uploadIndex + 1).join('/');
    if (publicId.match(/^v\d+\//)) {
      publicId = publicId.substring(publicId.indexOf('/') + 1);
    }

    // Remove extension and transformations
    publicId = publicId.split('.')[0];

    return publicId;
  } catch {
    return null;
  }
}
