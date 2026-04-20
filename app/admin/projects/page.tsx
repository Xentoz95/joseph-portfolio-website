'use client';

/**
 * Admin Projects Page - Uses Supabase Directly
 *
 * Manages projects using Supabase browser client directly.
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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  published_at?: string | null;
}

// Transform Supabase project to flat format
function fromDbProject(p: any): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    longDescription: '',
    category: p.category,
    tags: p.tags || [],
    thumbnail: p.images?.thumbnail || '',
    hero: p.images?.hero || '',
    gallery: p.images?.gallery || [],
    alt: p.images?.alt || p.title,
    featured: p.featured,
    technologies: [],
    liveUrl: p.demo_url || '',
    githubUrl: p.repo_url || '',
    published: p.published_at !== null,
    published_at: p.published_at,
  };
}

// Transform flat project to Supabase format
function toDbProject(project: Partial<Project>) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    slug: project.slug || project.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
    tags: project.tags || [],
    images: {
      thumbnail: project.thumbnail || null,
      hero: project.hero || null,
      gallery: project.gallery || [],
      alt: project.alt || project.title || '',
    },
    demo_url: project.liveUrl || null,
    repo_url: project.githubUrl || null,
    featured: project.featured || false,
    category: project.category || 'web',
    published_at: project.published ? (project.published_at || new Date().toISOString()) : null,
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading:', error);
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' });
    } else {
      setProjects((data || []).map(fromDbProject));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      id: `proj-${Date.now()}`,
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
    if (!savedData.id || !savedData.title) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    if (!savedData.description) {
      toast({ title: 'Error', description: 'Slogan is required', variant: 'destructive' });
      return;
    }

    if ((savedData.category === 'web' || savedData.category === 'system') && !savedData.thumbnail) {
      toast({ title: 'Error', description: 'Screenshot/preview image is required', variant: 'destructive' });
      return;
    }

    if ((savedData.category === 'design' || savedData.category === 'video') && !savedData.thumbnail) {
      toast({ title: 'Error', description: 'Please upload an image or video', variant: 'destructive' });
      return;
    }

    if (!savedData.slug) {
      savedData.slug = savedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    savedData.tags = savedData.tags || [];
    savedData.technologies = savedData.technologies || [];

    const isNew = !projects.find(p => p.id === savedData.id);
    const dbProject = toDbProject(savedData);

    let result;
    if (isNew) {
      result = await supabase.from('projects').insert(dbProject);
    } else {
      result = await supabase.from('projects').update({ ...dbProject, updated_at: new Date().toISOString() }).eq('id', savedData.id);
    }

    if (result.error) {
      console.error('Save error:', result.error);
      toast({ title: 'Error', description: result.error.message, variant: 'destructive' });
    } else {
      await loadProjects();
      toast({ title: 'Success', description: 'Project saved!' });
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    }
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await loadProjects();
      toast({ title: 'Success', description: 'Project deleted' });
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({
        published_at: project.published ? null : new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await loadProjects();
      toast({ title: 'Success', description: project.published ? 'Project unpublished' : 'Project published' });
    }
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio projects
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          )}
        </div>

        {(isCreating || editingId) && (
          <ProjectForm
            initialData={formData}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

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
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={project.thumbnail || '/images/placeholder.png'}
                        alt={project.alt || project.title}
                        width={192}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {project.featured && <Badge className="bg-primary">Featured</Badge>}
                          {project.published ? (
                            <Badge variant="default" className="bg-green-600">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleTogglePublish(project)}>
                          {project.published ? <><EyeOff className="w-4 h-4 mr-2" />Unpublish</> : <><Eye className="w-4 h-4 mr-2" />Publish</>}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
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

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              How to Add Images
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click on the image upload area in the form</li>
              <li>Drag & drop an image or paste a URL</li>
              <li>For best results, use images from Cloudinary or similar</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminAuth>
  );
}
