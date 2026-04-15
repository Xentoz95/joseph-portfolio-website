'use client';

/**
 * Post Form Component - Simplified
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { MediaUpload } from '@/components/admin/media-upload';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  coverImage: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PostFormProps {
  initialData: Partial<Post>;
  onSave: (data: Partial<Post>) => void;
  onCancel: () => void;
}

export function PostForm({ initialData, onSave, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<Partial<Post>>(initialData);

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="mb-8 border-primary">
      <CardHeader>
        <CardTitle>{initialData.id ? 'Edit Post' : 'Create New Post'}</CardTitle>
        <CardDescription>Share your thoughts, tutorials, or case studies</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post Title"
              autoFocus
              className="mt-1"
            />
          </div>

          {/* Cover Image + Category side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Cover Image</Label>
              <MediaUpload
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                type="image"
                aspectRatio="video"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  value={formData.category || 'tutorial'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="tutorial">Tutorial</option>
                  <option value="case-study">Case Study</option>
                  <option value="blog">Blog</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="React, Next.js, TypeScript"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary of your post"
              rows={2}
              className="mt-1"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here... (Markdown supported)"
              rows={8}
              className="mt-1"
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="published">Status</Label>
              <select
                id="published"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                value={formData.published ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, published: e.target.value === 'yes' })}
              >
                <option value="yes">Published</option>
                <option value="no">Draft</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Post
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
