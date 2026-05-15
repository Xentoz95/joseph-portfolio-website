/**
 * Posts Data Layer
 *
 * Server-side functions for fetching blog post data from Supabase.
 * These functions are designed for use in Server Components and Server Actions.
 */

import { createClient } from './server';
import type { Post, PostInsert, PostUpdate } from '@/types/database';

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

/**
 * Fallback posts data when database is not available - reads from local JSON
 */
async function getFallbackPosts(): Promise<Post[]> {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'posts-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const posts = JSON.parse(fileContent);
    return posts as Post[];
  } catch (error) {
    console.error('Error reading fallback posts from JSON:', error);
    return [];
  }
}

/**
 * Synchronous fallback posts for backward compatibility
 */
const FALLBACK_POSTS_STATIC: Post[] = [
  {
    id: 'post-1776452321992',
    title: 'its a monday',
    slug: 'its-a-monday',
    content: "It's a Monday just uh trying to keep my mind busy",
    excerpt: 'This is me creating a poster of Monday just still training myself on how to do graphics more more better off',
    cover_image: 'https://res.cloudinary.com/dszboz3se/image/upload/v1776453365/portfolio/media/vka2bsksz6381n3ouog2.jpg',
    tags: ['Graphics', 'Design', 'Learning'],
    published: true,
    created_at: '2026-04-17T18:58:41.992Z',
    updated_at: '2026-04-17T19:00:51.404Z',
    published_at: '2026-04-17T18:58:41.992Z'
  },
  {
    id: 'post-1776671972028',
    title: 'meee',
    slug: 'meee',
    content: 'my brand',
    excerpt: 'my brand',
    cover_image: 'https://res.cloudinary.com/dszboz3se/image/upload/v1776671988/portfolio/media/dzzg5sphduqtgkkmxs1x.png',
    tags: ['Brand', 'Personal'],
    published: true,
    created_at: '2026-04-20T07:59:32.028Z',
    updated_at: '2026-04-20T08:00:15.884Z',
    published_at: '2026-04-20T07:59:32.028Z'
  }
];

/**
 * Get all published posts
 *
 * @param options - Query options
 * @param options.limit - Maximum number of posts to return
 * @param options.offset - Number of posts to skip
 * @returns Array of posts
 */
export async function getPosts(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<Post[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Database not available, using fallback data');
      const fallbackPosts = await getFallbackPosts();
      let result = fallbackPosts;
      if (options.limit) {
        result = result.slice(0, options.limit);
      }
      if (options.offset) {
        result = result.slice(options.offset);
      }
      return result;
    }

    return (data || []) as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    const fallbackPosts = await getFallbackPosts();
    let result = fallbackPosts;
    if (options.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }
}

/**
 * Get a single post by slug
 *
 * @param slug - The post slug
 * @returns Post or null if not found
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .not('published_at', 'is', null)
      .single();

    if (error) {
      console.warn(`Database not available, using fallback data for slug "${slug}"`);
      // Try to find in local JSON fallback
      const fallbackPosts = await getFallbackPosts();
      return fallbackPosts.find(p => p.slug === slug) || null;
    }

    return data as Post | null;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    // Try to find in local JSON fallback
    const fallbackPosts = await getFallbackPosts();
    return fallbackPosts.find(p => p.slug === slug) || null;
  }
}

/**
 * Check if Supabase is configured
 */
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

/**
 * Get all unique tags from posts
 *
 * @returns Array of unique tags
 */
export async function getAllPostTags(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const fallbackPosts = await getFallbackPosts();
    const allTags = fallbackPosts.flatMap((post) => post.tags || []) as string[];
    return Array.from(new Set(allTags)).sort() as string[];
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('published', true)
      .not('published_at', 'is', null);

    if (error) {
      console.warn('Error fetching post tags, using fallback:', error);
      const fallbackPosts = await getFallbackPosts();
      const allTags = fallbackPosts.flatMap((post) => post.tags || []) as string[];
      return Array.from(new Set(allTags)).sort() as string[];
    }

    if (!data) {
      return [];
    }

    // Extract and flatten all tags, then deduplicate
    const posts = data as Post[];
    const allTags = posts.flatMap((post) => post.tags || []) as string[];
    const uniqueTags = Array.from(new Set(allTags)).sort() as string[];

    return uniqueTags;
  } catch (error) {
    console.warn('Error fetching post tags, using fallback:', error);
    const fallbackPosts = await getFallbackPosts();
    const allTags = fallbackPosts.flatMap((post) => post.tags || []) as string[];
    return Array.from(new Set(allTags)).sort() as string[];
  }
}

/**
 * Get posts filtered by tag
 *
 * @param tag - The tag to filter by
 * @returns Array of posts with the specified tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .not('published_at', 'is', null)
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) {
    console.error(`Error fetching posts with tag "${tag}":`, error);
    return [];
  }

  return (data || []) as Post[];
}

/**
 * Search posts by query string
 *
 * Searches in title, excerpt, and tags
 *
 * @param query - The search query
 * @returns Array of matching posts
 */
export async function searchPosts(query: string): Promise<Post[]> {
  const supabase = await createClient();

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .not('published_at', 'is', null)
    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error(`Error searching posts for "${query}":`, error);
    return [];
  }

  const posts = (data || []) as Post[];

  // Filter by tags in JavaScript since Postgres array containment is case-sensitive
  const filteredByTags = posts.filter((post) =>
    (post.tags || []).some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  // Combine and deduplicate
  const allResults = [...posts, ...filteredByTags];
  const uniqueResults = Array.from(
    new Map(allResults.map((post) => [post.id, post])).values()
  );

  return uniqueResults;
}

/**
 * Get related posts based on tags
 *
 * @param currentSlug - The current post slug to exclude
 * @param tags - Tags to find related posts by
 * @param limit - Maximum number of related posts to return
 * @returns Array of related posts
 */
export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit: number = 3
): Promise<Post[]> {
  if (tags.length === 0) {
    return [];
  }

  if (!isSupabaseConfigured()) {
    const fallbackPosts = await getFallbackPosts();
    return fallbackPosts
      .filter(p => p.slug !== currentSlug && p.published)
      .slice(0, limit);
  }

  try {
    const supabase = await createClient();

    // Get posts with matching tags
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .not('published_at', 'is', null)
      .neq('slug', currentSlug)
      .contains('tags', tags)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn(`Error fetching related posts for "${currentSlug}", using fallback:`, error);
      const fallbackPosts = await getFallbackPosts();
      return fallbackPosts
        .filter(p => p.slug !== currentSlug && p.published)
        .slice(0, limit);
    }

    return (data || []) as Post[];
  } catch (error) {
    console.warn(`Error fetching related posts for "${currentSlug}", using fallback:`, error);
    const fallbackPosts = await getFallbackPosts();
    return fallbackPosts
      .filter(p => p.slug !== currentSlug && p.published)
      .slice(0, limit);
  }
}

/**
 * Server Actions for post mutations (if needed for admin)
 * These should be used with proper authentication checks
 */

/**
 * Create a new post
 *
 * @param post - The post data to insert
 * @returns Created post or null
 */
export async function createPost(
  post: PostInsert
): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data as Post | null;
}

/**
 * Update an existing post
 *
 * @param slug - The post slug
 * @param updates - The updates to apply
 * @returns Updated post or null
 */
export async function updatePost(
  slug: string,
  updates: PostUpdate
): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error updating post "${slug}":`, error);
    return null;
  }

  return data as Post | null;
}

/**
 * Delete a post
 *
 * @param slug - The post slug
 * @returns True if successful, false otherwise
 */
export async function deletePost(slug: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').delete().eq('slug', slug);

  if (error) {
    console.error(`Error deleting post "${slug}":`, error);
    return false;
  }

  return true;
}

/**
 * Admin: Get all posts (including drafts)
 *
 * @param options - Query options
 * @returns Array of all posts
 */
export async function adminGetAllPosts(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<Post[]> {
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }

  return (data || []) as Post[];
}

/**
 * Admin: Get a single post by ID
 *
 * @param id - The post ID
 * @returns Post or null if not found
 */
export async function adminGetPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching post with id "${id}":`, error);
    return null;
  }

  return data as Post | null;
}

/**
 * Admin: Publish a post
 *
 * @param slug - The post slug
 * @returns Updated post or null
 */
export async function adminPublishPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .update({
      published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error publishing post "${slug}":`, error);
    return null;
  }

  return data as Post | null;
}

/**
 * Admin: Unpublish a post
 *
 * @param slug - The post slug
 * @returns Updated post or null
 */
export async function adminUnpublishPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .update({
      published: false,
      published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error unpublishing post "${slug}":`, error);
    return null;
  }

  return data as Post | null;
}

/**
 * Admin: Bulk delete posts
 *
 * @param slugs - Array of post slugs to delete
 * @returns Object with success flag and results
 */
export async function adminBulkDeletePosts(slugs: string[]): Promise<{
  success: boolean;
  deleted: string[];
  failed: string[];
}> {
  const supabase = await createClient();

  const deleted: string[] = [];
  const failed: string[] = [];

  for (const slug of slugs) {
    const { error } = await supabase.from('posts').delete().eq('slug', slug);
    if (error) {
      console.error(`Error deleting post "${slug}":`, error);
      failed.push(slug);
    } else {
      deleted.push(slug);
    }
  }

  return {
    success: failed.length === 0,
    deleted,
    failed,
  };
}

/**
 * Admin: Bulk publish posts
 *
 * @param slugs - Array of post slugs to publish
 * @returns Object with success flag and results
 */
export async function adminBulkPublishPosts(slugs: string[]): Promise<{
  success: boolean;
  published: string[];
  failed: string[];
}> {
  const supabase = await createClient();

  const published: string[] = [];
  const failed: string[] = [];

  for (const slug of slugs) {
    const { error } = await supabase
      .from('posts')
      .update({
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    if (error) {
      console.error(`Error publishing post "${slug}":`, error);
      failed.push(slug);
    } else {
      published.push(slug);
    }
  }

  return {
    success: failed.length === 0,
    published,
    failed,
  };
}
