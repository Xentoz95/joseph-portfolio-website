'use client';

/**
 * Admin Projects Page - Local JSON Based
 *
 * Manage projects without coding! Add, edit, and delete projects.
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ProjectForm } from '@/components/admin/project-form';

// Project type
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  thumbnail: string;
  hero: string;
  gallery: string[];
  alt: string;
  featured: boolean;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  published: boolean;
}

// Load projects from API
async function loadProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects');
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Error loading projects:', e);
  }
  return [];
}

// Save projects to API
async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    // Save to API
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects),
    });
    if (response.ok) {
      // Also save to localStorage as backup
      localStorage.setItem('portfolio-projects', JSON.stringify(projects));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error saving projects:', e);
    return false;
  }
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    loadProjectsData();
  }, []);

  const loadProjectsData = async () => {
    setLoading(true);
    const data = await loadProjects();

    // Check localStorage for any user-added projects
    const stored = localStorage.getItem('portfolio-projects');
    if (stored) {
      try {
        const userProjects = JSON.parse(stored);
        // Merge with default projects
        const merged = [...data];
        userProjects.forEach((p: Project) => {
          if (!merged.find(x => x.id === p.id)) {
            merged.push(p);
          }
        });
        setProjects(merged);
      } catch {
        setProjects(data);
      }
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      id: `project-${Date.now()}`,
      slug: '',
      title: '',
      description: '',
      longDescription: '',
      category: 'web',
      tags: [],
      thumbnail: '/images/placeholder.png',
      hero: '/images/placeholder.png',
      gallery: [],
      alt: '',
      featured: false,
      technologies: [],
      liveUrl: '#',
      githubUrl: '#',
      published: false,
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setIsCreating(false);
    setFormData({ ...project });
  };

  const handleFormSave = async (savedData: Partial<Project>) => {
    // Validate required fields
    if (!savedData.id || !savedData.title) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!savedData.description) {
      toast({
        title: 'Error',
        description: 'Slogan is required',
        variant: 'destructive',
      });
      return;
    }

    // For dev categories, require thumbnail
    if ((savedData.category === 'web' || savedData.category === 'system') && !savedData.thumbnail) {
      toast({
        title: 'Error',
        description: 'Screenshot/preview image is required',
        variant: 'destructive',
      });
      return;
    }

    // For media categories, require thumbnail
    if ((savedData.category === 'design' || savedData.category === 'video') && !savedData.thumbnail) {
      toast({
        title: 'Error',
        description: 'Please upload an image or video',
        variant: 'destructive',
      });
      return;
    }

    // Generate slug from title if not set
    if (!savedData.slug) {
      savedData.slug = savedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Ensure arrays exist
    savedData.tags = savedData.tags || [];
    savedData.technologies = savedData.technologies || [];

    const existingIndex = projects.findIndex(p => p.id === savedData.id);
    let updatedProjects = [...projects];

    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = savedData as Project;
    } else {
      updatedProjects.push(savedData as Project);
    }

    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({
        title: 'Success',
        description: 'Project saved!',
      });
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save project',
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
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    const updatedProjects = projects.filter(p => p.id !== id);
    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({
        title: 'Success',
        description: 'Project deleted',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const updatedProjects = projects.map(p =>
      p.id === project.id ? { ...p, published: !p.published } : p
    );
    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({
        title: 'Success',
        description: project.published ? 'Project unpublished' : 'Project published',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update project',
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
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio projects - add, edit, and delete without coding!
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <ProjectForm
            initialData={formData}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects yet. Create your first one!</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={project.thumbnail || '/images/placeholder.png'}
                        alt={project.alt || project.title}
                        width={192}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {project.featured && (
                            <Badge className="bg-primary">Featured</Badge>
                          )}
                          {project.published ? (
                            <Badge variant="default" className="bg-green-600">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(project)}
                        >
                          {project.published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              How to Add Images
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy your images to <code className="bg-muted px-1 rounded">public/images/projects/your-project/</code></li>
              <li>Use paths like <code className="bg-muted px-1 rounded">/images/projects/your-project/thumb.png</code></li>
              <li>Enter the full URLs for external images (Cloudinary, etc.)</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminAuth>
  );
}
