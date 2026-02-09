/**
 * Blog Listing Page
 *
 * Displays all published blog posts with filtering by tags and search functionality.
 * Fetches data from Supabase database with real-time updates.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getAllPostTags, getPostsByTag, searchPosts } from '@/lib/supabase/posts';
import type { Post } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary-helpers';
import { SearchFormWithAnalytics } from '@/components/search-form-with-analytics';
import { PostsRealtimeWrapper } from './posts-realtime';
import { CollectionPageSchema } from '@/lib/seo/json-ld';
import { Breadcrumb } from '@/components/seo/breadcrumb';

export const metadata: Metadata = {
  title: 'Blog | Portfolio',
  description: 'Read articles, tutorials, and thoughts on web development, design, and technology.',
  alternates: {
    canonical: 'https://josephthuo.com/blog',
  },
  openGraph: {
    title: 'Blog | Portfolio',
    description: 'Read articles, tutorials, and thoughts on web development, design, and technology.',
    type: 'website',
    url: 'https://josephthuo.com/blog',
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    tag?: string;
    search?: string;
  }>;
}

/**
 * Helper function to get image source with proper handling for local paths and SVGs
 */
function getImageSrc(src: string | null | undefined): string {
  if (!src) return '/placeholder.svg';

  // If it's already a full URL (http/https), return it
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a local path (starts with /), use it directly
  if (src.startsWith('/images/')) {
    return src;
  }

  // For Cloudinary public IDs, build the URL
  try {
    return buildCloudinaryUrl(src, {
      width: 800,
      height: 400,
      quality: 85,
      crop: 'fill',
    });
  } catch {
    return src.startsWith('/') ? src : '/placeholder.svg';
  }
}

/**
 * Blog post card component
 */
function PostCard({ post }: { post: Post }) {
  // Calculate reading time
  const readingTime = Math.ceil((post.excerpt?.length || 0) / 200);

  const coverImageSrc = post.cover_image ? getImageSrc(post.cover_image) : null;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="bg-background rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1 flex flex-col h-full">
        {/* Cover Image */}
        {coverImageSrc && (
          <div className="relative w-full h-52 overflow-hidden bg-muted">
            <Image
              src={coverImageSrc}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={coverImageSrc.endsWith('.svg')}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            {post.published_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * Posts grid component with filters
 */
async function PostsGrid({ tag, search }: { tag?: string; search?: string }) {
  // Fetch posts
  let posts = await getPosts();

  // Filter by tag if provided
  if (tag) {
    posts = await getPostsByTag(tag);
  }

  // Filter by search if provided
  if (search) {
    posts = await searchPosts(search);
  }

  // Fetch all tags for filter
  const allTags = await getAllPostTags();

  return (
    <div className="space-y-8">
      {/* Filter by Tags */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filter by Tag</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!tag ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/blog">All Tags</Link>
          </Button>
          {allTags.map((tagItem) => (
            <Button
              key={tagItem}
              variant={tag === tagItem ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={`/blog?tag=${encodeURIComponent(tagItem)}`}>
                {tagItem}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(tag || search) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {tag && (
            <Badge variant="secondary" className="gap-1">
              Tag: {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                asChild
              >
                <Link href={search ? `/blog?search=${encodeURIComponent(search)}` : '/blog'}>
                  ×
                </Link>
              </Button>
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                asChild
              >
                <Link href={tag ? `/blog?tag=${encodeURIComponent(tag)}` : '/blog'}>
                  ×
                </Link>
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No posts found matching your criteria.
          </p>
          <Button variant="outline" asChild>
            <Link href="/blog">Clear all filters</Link>
          </Button>
        </div>
      )}

      {/* Results Count */}
      {posts.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}


/**
 * Main page component
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Fetch posts for structured data
  const posts = await getPosts();

  // Generate collection page structured data
  const collectionItems = posts.slice(0, 20).map((post) => ({
    name: post.title,
    url: `https://josephthuo.com/blog/${post.slug}`,
    description: post.excerpt || post.title,
  }));

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <CollectionPageSchema
        name="Blog"
        description="Read articles, tutorials, and thoughts on web development, design, and technology."
        url="https://josephthuo.com/blog"
        items={collectionItems}
      />

      {/* Breadcrumb */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[{ name: 'Blog', item: 'https://josephthuo.com/blog' }]}
          />
        </div>
      </section>

      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Blog
            </h1>
            {/* Real-time connection status */}
            <PostsRealtimeWrapper />
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Read articles, tutorials, and thoughts on web development, design, and technology.
          </p>
          <SearchFormWithAnalytics
            currentSearch={search}
            action="/blog"
            placeholder="Search blog posts..."
            resultCount={0}
            searchType="blog"
          />
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="text-center py-8">Loading posts...</div>}>
            <PostsGrid tag={tag} search={search} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
