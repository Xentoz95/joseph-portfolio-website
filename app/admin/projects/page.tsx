'use client';

/**
 * Admin Projects Page - LocalStorage Based
 *
 * Manages projects locally and exports to JSON for the website.
 * Works on Vercel without needing Supabase.
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Eye, EyeOff, Download, Image as ImageIcon, Copy } from 'lucide-react';
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

const STORAGE_KEY = 'portfolio-projects';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  // Load from localStorage
  const loadProjects = () => {
    setLoading(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch {
        setProjects([]);
      }
    }
    setLoading(false);
  };

  // Save to localStorage
  const saveProjects = (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    setProjects(projects);
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
      published: true,
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
    if (!savedData.slug) {
      savedData.slug = savedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    savedData.tags = savedData.tags || [];
    savedData.technologies = savedData.technologies || [];

    const existingIndex = projects.findIndex(p => p.id === savedData.id);
    let updatedProjects = [...projects];
    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = savedData as Project;
    } else {
      updatedProjects.push(savedData as Project);
    }

    saveProjects(updatedProjects);
    toast({ title: 'Success', description: 'Project saved!' });
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
    toast({ title: 'Success', description: 'Project deleted' });
  };

  const handleTogglePublish = (project: Project) => {
    const updatedProjects = projects.map(p =>
      p.id === project.id ? { ...p, published: !p.published } : p
    );
    saveProjects(updatedProjects);
    toast({ title: 'Success', description: project.published ? 'Project unpublished' : 'Project published' });
  };

  // Export to JSON format
  const handleExport = () => {
    const publishedProjects = projects.filter(p => p.published);
    const json = JSON.stringify(publishedProjects, null, 2);
    navigator.clipboard.writeText(json);
    toast({ title: 'Copied!', description: 'JSON copied to clipboard. Paste this into data/projects-data.json' });
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
          <div className="flex gap-2">
            {!isCreating && !editingId && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>How to publish:</strong> Click "Copy JSON", then paste the content into your <code>data/projects-data.json</code> file and push to GitHub.
            </p>
          </CardContent>
        </Card>

        {(isCreating || editingId) && (
          <ProjectForm
            initialData={formData}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
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
                            <Badge className="bg-green-600">Published</Badge>
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
      </div>
    </AdminAuth>
  );
}
