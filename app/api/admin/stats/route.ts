/**
 * Admin Stats API Route
 *
 * Returns statistics for the admin dashboard
 */

import { NextResponse } from 'next/server';
import {
  adminGetAllPosts,
} from '@/lib/supabase/posts';
import {
  adminGetAllProjects,
} from '@/lib/supabase/projects';
import {
  getContacts,
  getUnreadCount,
} from '@/lib/supabase/contacts';

export async function GET() {
  try {
    // Fetch all data in parallel
    const [posts, projects, contacts, unreadCount] = await Promise.all([
      adminGetAllPosts(),
      adminGetAllProjects(),
      getContacts(),
      getUnreadCount(),
    ]);

    // Calculate stats
    const stats = {
      projects: {
        total: projects.length,
        published: projects.filter((p) => p.published_at !== null).length,
        drafts: projects.filter((p) => p.published_at === null).length,
      },
      posts: {
        total: posts.length,
        published: posts.filter((p) => p.published && p.published_at !== null).length,
        drafts: posts.filter((p) => !p.published || p.published_at === null).length,
      },
      contacts: {
        total: contacts.length,
        unread: unreadCount,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
