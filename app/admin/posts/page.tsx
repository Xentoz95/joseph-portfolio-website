'use client';

/**
 * Admin Posts Page
 *
 * Posts management interface with list, create, edit, and delete functionality
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminAuth } from '@/components/admin/admin-auth';
import {
  adminGetPostsAction,
  adminDeletePostAction,
  adminPublishPostAction,
  adminUnpublishPostAction,
  adminBulkDeletePostsAction,
  adminBulkPublishPostsAction,
} from './actions';
import type { Post } from '@/types/database';
import {
  Search,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type FilterStatus = 'all' | 'published' | 'drafts';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await adminGetPostsAction();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const success = await adminDeletePostAction(id);
      if (success) {
        toast.success('Post deleted');
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    try {
      if (post.published && post.published_at) {
        await adminUnpublishPostAction(id);
        toast.success('Post unpublished');
      } else {
        await adminPublishPostAction(id);
        toast.success('Post published');
      }
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Error toggling publish:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const result = await adminBulkDeletePostsAction(Array.from(selectedIds));
      if (result.success) {
        toast.success(`${result.deleted.length} post(s) deleted`);
      } else {
        toast.warning(`Deleted ${result.deleted.length}, ${result.failed.length} failed`);
      }
      setSelectedIds(new Set());
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete posts');
      console.error('Error bulk deleting:', error);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;

    try {
      const result = await adminBulkPublishPostsAction(Array.from(selectedIds));
      if (result.success) {
        toast.success(`${result.published.length} post(s) published`);
      } else {
        toast.warning(`Published ${result.published.length}, ${result.failed.length} failed`);
      }
      setSelectedIds(new Set());
      fetchPosts();
    } catch (error) {
      toast.error('Failed to publish posts');
      console.error('Error bulk publishing:', error);
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
              Manage your blog content
            </p>
          </div>
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
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
              <Select value={statusFilter} onValueChange={(v: FilterStatus) => setStatusFilter(v)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="drafts">Drafts</SelectItem>
                </SelectContent>
              </Select>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Selected Posts</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedIds.size} post(s)? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <Checkbox
                    checked={selectedIds.size === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <div className="flex-1">Post</div>
                  <div className="hidden sm:block w-24">Status</div>
                  <div className="hidden md:block w-24">Tags</div>
                  <div className="hidden lg:block w-24">Updated</div>
                  <div className="w-24">Actions</div>
                </div>

                {/* Rows */}
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.has(post.id)}
                      onCheckedChange={() => handleToggleSelect(post.id)}
                    />
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
                    <div className="hidden lg:block w-24 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                    </div>
                    <div className="flex gap-2 w-24 justify-end">
                      <Link href={`/admin/posts/${post.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(post.id)}
                      >
                        {post.published && post.published_at ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === post.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminAuth>
  );
}
