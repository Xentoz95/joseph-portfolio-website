/**
 * Admin Upload API Route
 *
 * Handles image and video uploads to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as string | null;
    const folder = formData.get('folder') as string | null;
    const fileType = formData.get('fileType') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Ensure the file is a valid base64 data URL
    let fileData = file;
    if (!fileData.startsWith('data:')) {
      // If it's not a data URL, assume it needs the prefix
      fileData = `data:image/jpeg;base64,${fileData}`;
    }

    // Determine resource type
    const isVideo = fileType === 'video' || file.startsWith('data:video/');

    let result;

    if (isVideo) {
      // Upload video to Cloudinary
      result = await uploadVideo(fileData, {
        folder: folder || 'portfolio/videos',
      });
    } else {
      // Upload image to Cloudinary
      result = await uploadImage(fileData, {
        folder: folder || 'portfolio',
      });
    }

    return NextResponse.json({
      publicId: result.publicId,
      url: result.url,
      secureUrl: result.secureUrl,
      ...(result.width && { width: result.width }),
      ...(result.height && { height: result.height }),
      ...(result.duration && { duration: result.duration }),
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
