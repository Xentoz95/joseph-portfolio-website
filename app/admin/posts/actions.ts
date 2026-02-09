'use server';

/**
 * Admin Posts Server Actions
 *
 * Server actions for the admin posts page
 * These allow client components to interact with the database
 */

import {
  adminGetAllPosts,
  adminGetPostById,
  createPost,
  updatePost,
  deletePost,
  adminPublishPost,
  adminUnpublishPost,
  adminBulkDeletePosts,
  adminBulkPublishPosts,
} from '@/lib/supabase/posts';
import type { Post, PostInsert, PostUpdate } from '@/types/database';

/**
 * Get all posts (including drafts)
 */
export async function adminGetPostsAction(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<Post[]> {
  return await adminGetAllPosts(options);
}

/**
 * Get a single post by ID
 */
export async function adminGetPostByIdAction(id: string): Promise<Post | null> {
  return await adminGetPostById(id);
}

/**
 * Create a new post
 */
export async function adminCreatePost(
  post: PostInsert
): Promise<Post | null> {
  return await createPost(post);
}

/**
 * Update an existing post
 */
export async function adminUpdatePostAction(
  id: string,
  updates: PostUpdate
): Promise<Post | null> {
  const post = await adminGetPostById(id);
  if (!post) {
    return null;
  }

  return await updatePost(post.slug, updates);
}

/**
 * Delete a post
 */
export async function adminDeletePostAction(id: string): Promise<boolean> {
  const post = await adminGetPostById(id);
  if (!post) {
    return false;
  }

  return await deletePost(post.slug);
}

/**
 * Publish a post
 */
export async function adminPublishPostAction(id: string): Promise<Post | null> {
  const post = await adminGetPostById(id);
  if (!post) {
    return null;
  }

  return await adminPublishPost(post.slug);
}

/**
 * Unpublish a post
 */
export async function adminUnpublishPostAction(id: string): Promise<Post | null> {
  const post = await adminGetPostById(id);
  if (!post) {
    return null;
  }

  return await adminUnpublishPost(post.slug);
}

/**
 * Bulk delete posts
 */
export async function adminBulkDeletePostsAction(ids: string[]): Promise<{
  success: boolean;
  deleted: string[];
  failed: string[];
}> {
  const posts = await Promise.all(
    ids.map((id) => adminGetPostById(id))
  );

  const slugs = posts
    .filter((p): p is Post => p !== null)
    .map((p) => p.slug);

  return await adminBulkDeletePosts(slugs);
}

/**
 * Bulk publish posts
 */
export async function adminBulkPublishPostsAction(ids: string[]): Promise<{
  success: boolean;
  published: string[];
  failed: string[];
}> {
  const posts = await Promise.all(
    ids.map((id) => adminGetPostById(id))
  );

  const slugs = posts
    .filter((p): p is Post => p !== null)
    .map((p) => p.slug);

  return await adminBulkPublishPosts(slugs);
}
