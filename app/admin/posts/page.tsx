'use client';

/**
 * Admin Posts Page - Local JSON Based
 *
 * Manage blog posts without coding! Add, edit, and delete posts.
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Eye, EyeOff, Search, Check } from 'lucide-react';
import { PostForm } from '@/components/admin/post-form';

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
    setEditingId(null);
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
    setIsCreating(false);
    setFormData({ ...post });
  };

  const handleFormSave = async (savedData: Partial<Post>) => {
    if (!savedData.id || !savedData.title) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    // Generate slug from title if not set
    if (!savedData.slug) {
      savedData.slug = savedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    savedData.updated_at = new Date().toISOString();

    const existingIndex = posts.findIndex(p => p.id === savedData.id);
    let updatedPosts = [...posts];

    if (existingIndex >= 0) {
      updatedPosts[existingIndex] = savedData as Post;
    } else {
      updatedPosts.push(savedData as Post);
    }

    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      toast({
        title: 'Success',
        description: 'Post saved!',
      });
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      });
    }
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    const updatedPosts = posts.filter(p => p.id !== id);
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      toast({
        title: 'Success',
        description: 'Post deleted',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
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
      toast({
        title: 'Success',
        description: updatedPost.published ? 'Post published' : 'Post unpublished',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
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
    if (!confirm(`Delete ${selectedIds.size} post(s)?`)) {
      return;
    }
    const updatedPosts = posts.filter(p => !selectedIds.has(p.id));
    const success = await savePosts(updatedPosts);
    if (success) {
      setPosts(updatedPosts);
      setSelectedIds(new Set());
      toast({
        title: 'Success',
        description: `${selectedIds.size} post(s) deleted`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete posts',
        variant: 'destructive',
      });
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
      toast({
        title: 'Success',
        description: `${selectedIds.size} post(s) published`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to publish posts',
        variant: 'destructive',
      });
    }
  };

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
        {(isCreating || editingId) && (
          <PostForm
            initialData={formData}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

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
