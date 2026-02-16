/**
 * Individual Blog Post Page
 *
 * Displays a single blog post with markdown content rendering,
 * related posts, and SEO structured data.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getRelatedPosts } from '@/lib/supabase/posts';
import { MarkdownRenderer, calculateReadingTime } from '@/components/blog/markdown-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary-helpers';
import { ArticleSchema, BreadcrumbListSchema } from '@/lib/seo/json-ld';
import { Breadcrumb } from '@/components/seo/breadcrumb';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const ogImage = post.cover_image
    ? buildCloudinaryUrl(post.cover_image, { width: 1200, height: 630, quality: 85 })
    : undefined;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `https://josephthuo.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      url: `https://josephthuo.com/blog/${post.slug}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: ['Joseph Thuo'],
      tags: post.tags,
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

/**
 * Helper function to get image source
 */
function getImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  if (src.startsWith('/images/')) {
    return src;
  }

  try {
    return buildCloudinaryUrl(src, {
      width: 1200,
      height: 630,
      quality: 85,
      crop: 'fill',
    });
  } catch {
    return src.startsWith('/') ? src : null;
  }
}

/**
 * Individual Blog Post Page
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const coverImageSrc = getImageSrc(post.cover_image);
  const relatedPosts = await getRelatedPosts(slug, post.tags, 3);

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.title}
        url={`https://josephthuo.com/blog/${post.slug}`}
        image={coverImageSrc || undefined}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        tags={post.tags}
      />
      <BreadcrumbListSchema
        items={[
          { name: 'Blog', item: 'https://josephthuo.com/blog' },
          { name: post.title, item: `https://josephthuo.com/blog/${post.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { name: 'Blog', item: 'https://josephthuo.com/blog' },
              { name: post.title, item: `https://josephthuo.com/blog/${post.slug}` },
            ]}
          />
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Joseph Thuo</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {coverImageSrc && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
              <Image
                src={coverImageSrc}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <div className="text-foreground">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-background rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-muted-foreground mb-6">
            Get in touch to discuss your project or collaborate on something amazing.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Me</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
