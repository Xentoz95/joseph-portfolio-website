'use client';

/**
 * Admin Projects Page - Local JSON Based
 *
 * Manage projects without coding! Add, edit, and delete projects.
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
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

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

// Save projects to local JSON (simulated - in real app would need API)
async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    // For demo, we'll save to localStorage and show success
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
    return true;
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
    setFormData({ ...project });
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title || !formData.slug) {
      toast.error('Please fill in required fields');
      return;
    }

    // Generate slug from title if not set
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const existingIndex = projects.findIndex(p => p.id === formData.id);
    let updatedProjects = [...projects];

    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = formData as Project;
    } else {
      updatedProjects.push(formData as Project);
    }

    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast.success('Project saved!');
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    } else {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast.success('Project deleted');
    } else {
      toast.error('Failed to delete project');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, technologies });
  };

  const handleGalleryChange = (value: string) => {
    const gallery = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, gallery });
  };

  // Edit/Create Form Component
  const ProjectForm = ({ project }: { project?: Project }) => (
    <Card className="mb-8 border-primary">
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
        <CardDescription>Fill in the details below. Separate tags/technologies with commas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project Title"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="project-slug (auto-generated if empty)"
              />
            </div>
          </div>

          <div>
            <Label>Short Description *</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description for project cards"
              rows={2}
            />
          </div>

          <div>
            <Label>Long Description</Label>
            <Textarea
              value={formData.longDescription || ''}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="Detailed description for project page"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <select
                className="w-full px-3 py-2 border rounded-lg bg-background"
                value={formData.category || 'web'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="web">Web Development</option>
                <option value="system">System</option>
                <option value="dashboard">Dashboard</option>
                <option value="branding">Branding</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label>Featured</Label>
              <select
                className="w-full px-3 py-2 border rounded-lg bg-background"
                value={formData.featured ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'yes' })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
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
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="React, Next.js, TypeScript"
            />
          </div>

          <div>
            <Label>Technologies (comma separated)</Label>
            <Input
              value={formData.technologies?.join(', ') || ''}
              onChange={(e) => handleTechnologiesChange(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Thumbnail Image URL</Label>
              <Input
                value={formData.thumbnail || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="/images/projects/project/thumb.png"
              />
            </div>
            <div>
              <Label>Hero Image URL</Label>
              <Input
                value={formData.hero || ''}
                onChange={(e) => setFormData({ ...formData, hero: e.target.value })}
                placeholder="/images/projects/project/hero.png"
              />
            </div>
          </div>

          <div>
            <Label>Gallery Images (comma separated URLs)</Label>
            <Input
              value={formData.gallery?.join(', ') || ''}
              onChange={(e) => handleGalleryChange(e.target.value)}
              placeholder="/images/projects/1.png, /images/projects/2.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Live URL</Label>
              <Input
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <Input
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div>
            <Label>Alt Text</Label>
            <Input
              value={formData.alt || ''}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              placeholder="Description of the project"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Project
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
        {(isCreating || editingId) && <ProjectForm />}

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
                          onClick={() => {
                            setFormData({
                              ...project,
                              published: !project.published
                            });
                            setEditingId(project.id);
                          }}
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
