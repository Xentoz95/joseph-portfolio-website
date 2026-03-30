'use client';

/**
 * Admin Edit Post Page
 *
 * Form for editing an existing blog post
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { ImageUpload } from '@/components/admin/image-upload';
import {
  adminGetPostByIdAction,
  adminUpdatePostAction,
} from './actions';
import type { Post } from '@/types/database';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Store original publication state
  const [originalPublished, setOriginalPublished] = useState<boolean>(false);
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const post = await adminGetPostByIdAction(postId);
      if (!post) {
        setNotFound(true);
        return;
      }

      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt || '');
      setTags(post.tags || []);
      setCoverImage(post.cover_image);
      setIsPublished(post.published);
      setOriginalPublished(post.published);
      setOriginalPublishedAt(post.published_at);
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Determine published status and published_at
      let published: boolean;
      let publishedAt: string | null;

      if (originalPublished && isPublished) {
        // Already published and still published: keep original date
        published = true;
        publishedAt = originalPublishedAt;
      } else if (isPublished) {
        // Newly published
        published = true;
        publishedAt = new Date().toISOString();
      } else {
        // Unpublished
        published = false;
        publishedAt = null;
      }

      const updates = {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        tags: tags.length > 0 ? tags : undefined,
        published,
        published_at: publishedAt,
      };

      const result = await adminUpdatePostAction(postId, updates);

      if (result) {
        toast.success('Post updated successfully');
        router.push('/admin/posts');
      } else {
        toast.error('Failed to update post');
      }
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Error updating post:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </AdminAuth>
    );
  }

  if (notFound) {
    return (
      <AdminAuth>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-destructive font-medium">Post not found</p>
          <Link href="/admin/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
            <p className="text-muted-foreground mt-1">
              Update blog post
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Title, slug, and markdown content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  placeholder="Post Title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                  Slug <span className="text-destructive">*</span>
                </label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="post-title"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Lowercase letters, numbers, and hyphens only"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly version of the title (changing this will change the URL)
                </p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Content (Markdown) <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Write your post content in Markdown..."
                  rows={15}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports standard Markdown syntax (headings, lists, code blocks, etc.)
                </p>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                  Excerpt (optional)
                </label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short summary of the post..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Brief description shown in blog listings (defaults to first 160 chars of content)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Keywords for the post (press Enter to add)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag..."
                  className="mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Featured image for the blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-2" />
                  Cover Image
                </label>
                <ImageUpload
                  value={coverImage || undefined}
                  onChange={setCoverImage}
                  folder="blog/covers"
                  aspectRatio="video"
                  className="max-w-lg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Wide image for post header and social sharing (recommended: 1200x630)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published (uncheck to save as draft)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/posts">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving || !title || !slug || !content}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminAuth>
  );
}
