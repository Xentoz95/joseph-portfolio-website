/**
 * Admin Upload API Route
 *
 * Handles image uploads to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as string | null;
    const folder = formData.get('folder') as string | null;

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

    // Upload to Cloudinary
    const result = await uploadImage(fileData, {
      folder: folder || 'portfolio',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
