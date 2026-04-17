/**
 * Admin Upload API Route
 *
 * Returns Cloudinary signature for direct browser uploads.
 * This avoids server timeouts for large files by having the browser
 * upload directly to Cloudinary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileType = formData.get('fileType') as string | null;
    const folder = formData.get('folder') as string | null;
    const fileName = formData.get('fileName') as string | null;

    if (!fileType) {
      return NextResponse.json(
        { error: 'No file type provided' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured' },
        { status: 500 }
      );
    }

    // Determine resource type
    const resourceType = fileType === 'video' ? 'video' : 'image';

    // Generate timestamp for the signature
    const timestamp = Math.floor(Date.now() / 1000);

    // Build the parameters to sign (only folder and timestamp for signed uploads)
    // Note: For signed uploads, we don't use upload_preset - the signature authenticates
    const paramsToSign: Record<string, string> = {
      timestamp: timestamp.toString(),
      folder: folder || `portfolio/${resourceType}s`,
    };

    // Generate the signature using Cloudinary's utility
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

    return NextResponse.json({
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder: paramsToSign.folder,
      resourceType,
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}