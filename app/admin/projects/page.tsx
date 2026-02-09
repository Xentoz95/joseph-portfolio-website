'use client';

/**
 * Admin Projects Page
 *
 * Projects management interface with list, create, edit, and delete functionality
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
  adminGetProjects,
  adminDeleteProjectAction,
  adminPublishProjectAction,
  adminUnpublishProjectAction,
  adminBulkDeleteProjectsAction,
  adminBulkPublishProjectsAction,
} from './actions';
import type { Project } from '@/types/database';
import {
  Search,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  MoreVertical,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type FilterStatus = 'all' | 'published' | 'drafts';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await adminGetProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && project.published_at !== null) ||
      (statusFilter === 'drafts' && project.published_at === null);

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
    if (selectedIds.size === filteredProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map((p) => p.id)));
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const success = await adminDeleteProjectAction(id);
      if (success) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    try {
      if (project.published_at) {
        await adminUnpublishProjectAction(id);
        toast.success('Project unpublished');
      } else {
        await adminPublishProjectAction(id);
        toast.success('Project published');
      }
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error toggling publish:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const result = await adminBulkDeleteProjectsAction(Array.from(selectedIds));
      if (result.success) {
        toast.success(`${result.deleted.length} project(s) deleted`);
      } else {
        toast.warning(`Deleted ${result.deleted.length}, ${result.failed.length} failed`);
      }
      setSelectedIds(new Set());
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete projects');
      console.error('Error bulk deleting:', error);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;

    try {
      const result = await adminBulkPublishProjectsAction(Array.from(selectedIds));
      if (result.success) {
        toast.success(`${result.published.length} project(s) published`);
      } else {
        toast.warning(`Published ${result.published.length}, ${result.failed.length} failed`);
      }
      setSelectedIds(new Set());
      fetchProjects();
    } catch (error) {
      toast.error('Failed to publish projects');
      console.error('Error bulk publishing:', error);
    }
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio projects
            </p>
          </div>
          <Link href="/admin/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
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
                    placeholder="Search projects..."
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
                  <SelectItem value="all">All Projects</SelectItem>
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
                  {selectedIds.size} project{selectedIds.size !== 1 ? 's' : ''} selected
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
                        <AlertDialogTitle>Delete Selected Projects</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedIds.size} project(s)? This action cannot be undone.
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

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'No projects found matching your filters'
                  : 'No projects yet. Create your first one!'}
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
                    checked={selectedIds.size === filteredProjects.length && filteredProjects.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <div className="flex-1">Project</div>
                  <div className="hidden sm:block w-24">Status</div>
                  <div className="hidden md:block w-32">Category</div>
                  <div className="hidden lg:block w-24">Updated</div>
                  <div className="w-24">Actions</div>
                </div>

                {/* Rows */}
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.has(project.id)}
                      onCheckedChange={() => handleToggleSelect(project.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-sm text-muted-foreground truncate hidden sm:block">
                        {project.description}
                      </p>
                    </div>
                    <div className="hidden sm:block w-24">
                      {project.published_at ? (
                        <Badge variant="default" className="bg-green-600">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <div className="hidden md:block w-32">
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                    <div className="hidden lg:block w-24 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                    </div>
                    <div className="flex gap-2 w-24 justify-end">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(project.id)}
                      >
                        {project.published_at ? (
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
                            disabled={deletingId === project.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)}>
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
