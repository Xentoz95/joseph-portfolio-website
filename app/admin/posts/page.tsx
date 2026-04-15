'use client';

/**
 * Admin Posts Page - Local JSON Based
 *
 * Manage blog posts without coding! Add, edit, and delete posts.
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff, Search, Filter, Check } from 'lucide-react';
import Link from 'next/link';

// Post type
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

// Load posts from API
async function loadPosts(): Promise<Post[]> {
  try {
    const response = await fetch('/api/posts');
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Error loading posts:', e);
  }
  return [];
}

// Save posts to local JSON
async function savePosts(posts: Post[]): Promise<boolean> {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    });
    return response.ok;
  } catch (e) {
    console.error('Error saving posts:', e);
    return false;
  }
}

type FilterStatus = 'all' | 'published' | 'drafts';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Post>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPostsData();
  }, []);

  const loadPostsData = async () => {
    setLoading(true);
    const data = await loadPosts();
    setPosts(data);
    setLoading(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.published && post.published_at !== null) ||
      (statusFilter === 'drafts' && (!post.published || post.published_at === null));

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      id: `post-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: [],
      category: 'tutorial',
      coverImage: '/images/blog/placeholder.png',
      published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setFormData({ ...post });
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title) {
      toast.error('Please fill in required fields');
      return;
    }

    // Generate slug from title if not set
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    formData.updated_at = new Date().toISOString();

    const existingIndex = posts.findIndex(p => p.id === formData.id);
    let updatedPosts = [...posts];

    if (existingIndex >= 0) {
      updatedPosts[existingIndex] = formData as Post;
    } else {
      updatedPosts.push(formData as Post);
    }

    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      toast.success('Post saved!');
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    } else {
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      toast.success('Post deleted');
    } else {
      toast.error('Failed to delete post');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleTogglePublish = async (post: Post) => {
    const updatedPost = {
      ...post,
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const updatedPosts = posts.map(p => p.id === post.id ? updatedPost : p);
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      toast.success(updatedPost.published ? 'Post published' : 'Post unpublished');
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const updatedPosts = posts.filter(p => !selectedIds.has(p.id));
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      setSelectedIds(new Set());
      toast.success(`${selectedIds.size} post(s) deleted`);
    } else {
      toast.error('Failed to delete posts');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;
    const updatedPosts = posts.map(p =>
      selectedIds.has(p.id)
        ? { ...p, published: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        : p
    );
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      setSelectedIds(new Set());
      toast.success(`${selectedIds.size} post(s) published`);
    } else {
      toast.error('Failed to publish posts');
    }
  };

  // Edit/Create Form Component
  const PostForm = ({ post }: { post?: Post }) => (
    <Card className="mb-8 border-primary">
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
        <CardDescription>Fill in the details below. Separate tags with commas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post Title"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-slug (auto-generated if empty)"
              />
            </div>
          </div>

          <div>
            <Label>Excerpt *</Label>
            <Textarea
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief excerpt for post preview"
              rows={2}
            />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full post content"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <select
                className="w-full px-3 py-2 border rounded-lg bg-background"
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
              <Label>Published</Label>
              <select
                className="w-full px-3 py-2 border rounded-lg bg-background"
                value={formData.published ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, published: e.target.value === 'yes' })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={formData.coverImage || ''}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/images/blog/post.png"
              />
            </div>
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="React, Next.js, TypeScript"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Post
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your blog content - add, edit, and delete without coding!
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && <PostForm />}

        {/* Filters and Search */}
        {!isCreating && !editingId && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={statusFilter === 'published' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('published')}
                    >
                      Published
                    </Button>
                    <Button
                      variant={statusFilter === 'drafts' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('drafts')}
                    >
                      Drafts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedIds.size} post{selectedIds.size !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleBulkPublish}>
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'No posts found matching your filters'
                      : 'No posts yet. Create your first one!'}
                  </p>
                  <Button onClick={handleCreate} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 font-medium text-sm">
                      <button
                        onClick={handleToggleSelectAll}
                        className="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                      >
                        {selectedIds.size === filteredPosts.length && filteredPosts.length > 0 && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">Post</div>
                      <div className="hidden sm:block w-24">Status</div>
                      <div className="hidden md:block w-24">Tags</div>
                      <div className="w-24">Actions</div>
                    </div>

                    {/* Rows */}
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleSelect(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                        >
                          {selectedIds.has(post.id) && <Check className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-sm text-muted-foreground truncate hidden sm:block">
                            {post.excerpt || 'No excerpt'}
                          </p>
                        </div>
                        <div className="hidden sm:block w-24">
                          {post.published && post.published_at ? (
                            <Badge variant="default" className="bg-green-600">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <div className="hidden md:block w-24">
                          {post.tags.length > 0 ? (
                            <Badge variant="outline">{post.tags.length} tag{post.tags.length !== 1 ? 's' : ''}</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </div>
                        <div className="flex gap-2 w-24 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePublish(post)}
                          >
                            {post.published && post.published_at ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} post{posts.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </AdminAuth>
  );
}
