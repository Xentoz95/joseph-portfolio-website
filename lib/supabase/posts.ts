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
    id: '1',
    title: 'Getting Started with Modern Web Development',
    slug: 'getting-started-with-modern-web-development',
    content: '# Introduction\n\nWeb development has evolved significantly over the years. Today, we have access to powerful tools and frameworks that make building modern web applications easier than ever.\n\n## The Modern Stack\n\nWhen starting a new project, choosing the right stack is crucial. Here are some considerations:\n\n- **React** for component-based UI\n- **Next.js** for server-side rendering and routing\n- **TypeScript** for type safety\n- **Tailwind CSS** for rapid styling\n- **Supabase** for backend and database\n\n## Getting Started\n\nFirst, create a new Next.js project:\n\n```bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n```\n\n## Conclusion\n\nThis is just the beginning of your web development journey. Keep learning and building!',
    excerpt: 'Learn about the modern web development stack including React, Next.js, TypeScript, and more. This guide covers everything you need to get started.',
    cover_image: '/images/projects/fintech-ui-system/hero.svg',
    tags: ['Web Development', 'React', 'Next.js', 'Tutorial'],
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Mastering TypeScript for React Applications',
    slug: 'mastering-typescript-for-react',
    content: '# Why TypeScript?\n\nTypeScript brings type safety to JavaScript, making your React applications more robust and easier to maintain.\n\n## Key Benefits\n\n1. **Type Safety** - Catch errors at compile time\n2. **Better IDE Support** - Autocomplete and inline documentation\n3. **Refactoring** - Make changes with confidence\n\n## Getting Started\n\n```tsx\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: "primary" | "secondary";\n}\n\nfunction Button({ label, onClick, variant = "primary" }: ButtonProps) {\n  return <button onClick={onClick}>{label}</button>;\n}\n```\n\nStart small and gradually add types to your existing React projects!',
    excerpt: 'Discover how TypeScript can improve your React applications with type safety, better IDE support, and easier refactoring.',
    cover_image: '/images/projects/hr-management-system/hero.svg',
    tags: ['TypeScript', 'React', 'Web Development'],
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Building Scalable Applications with Next.js',
    slug: 'building-scalable-applications-with-nextjs',
    content: '# Next.js: The React Framework for Production\n\nNext.js provides a complete solution for building modern web applications with React.\n\n## Key Features\n\n- **Server-Side Rendering** - Better SEO and performance\n- **Static Site Generation** - Pre-render pages at build time\n- **API Routes** - Build API endpoints alongside your pages\n- **File-based Routing** - Simple and intuitive routing\n\n## Project Structure\n\n```\napp/\n├── page.tsx          # Homepage\n├── about/\n│   └── page.tsx      # About page\n└── blog/\n    ├── page.tsx      # Blog listing\n│   └── [slug]/\n│       └── page.tsx  # Blog post detail\n```\n\n## Deployment\n\nDeploy your Next.js application to Vercel with a single command:\n\n```bash\nvercel deploy\n```\n\nYour app will be live in seconds!',
    excerpt: 'Learn how to build production-ready applications with Next.js, featuring SSR, SSG, API routes, and more.',
    cover_image: '/images/projects/ecommerce-dashboard/hero.svg',
    tags: ['Next.js', 'React', 'Web Development', 'Deployment'],
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
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
 * Get all unique tags from posts
 *
 * @returns Array of unique tags
 */
export async function getAllPostTags(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('tags')
    .eq('published', true)
    .not('published_at', 'is', null);

  if (error) {
    console.error('Error fetching post tags:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Extract and flatten all tags, then deduplicate
  const posts = data as Post[];
  const allTags = posts.flatMap((post) => post.tags || []) as string[];
  const uniqueTags = Array.from(new Set(allTags)).sort() as string[];

  return uniqueTags;
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
    console.error(`Error fetching related posts for "${currentSlug}":`, error);
    // Fallback to local JSON
    const fallbackPosts = await getFallbackPosts();
    return fallbackPosts
      .filter(p => p.slug !== currentSlug && p.published)
      .slice(0, limit);
  }

  return (data || []) as Post[];
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
