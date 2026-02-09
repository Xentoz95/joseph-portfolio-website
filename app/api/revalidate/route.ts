/**
 * Revalidation API Route
 *
 * Called by real-time hooks to revalidate Next.js cache
 * when data changes in Supabase.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag');

    if (!tag) {
      return NextResponse.json(
        { error: 'Missing tag parameter' },
        { status: 400 }
      );
    }

    // Revalidate the specified tag
    revalidateTag(tag, request.url);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { revalidated: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
