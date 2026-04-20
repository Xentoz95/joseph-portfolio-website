'use client';

/**
 * Admin Projects Page
 *
 * Projects are saved to localStorage in your browser.
 * Export JSON to update the website.
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Eye, EyeOff, Copy, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ProjectForm } from '@/components/admin/project-form';

const STORAGE_KEY = 'my-portfolio-projects';

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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch {
        setProjects([]);
      }
    }
    setLoading(false);
  }, []);

  const saveToStorage = (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    setProjects(projects);
  };

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

  const handleFormSave = async (data: Partial<Project>) => {
    if (!data.title || !data.description) {
      toast({ title: 'Error', description: 'Title and slogan required', variant: 'destructive' });
      return;
    }

    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    data.tags = data.tags || [];
    data.technologies = data.technologies || [];

    const existing = projects.findIndex(p => p.id === data.id);
    const updated = [...projects];

    if (existing >= 0) {
      updated[existing] = data as Project;
    } else {
      updated.push(data as Project);
    }

    saveToStorage(updated);
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
    if (!confirm('Delete this project?')) return;
    saveToStorage(projects.filter(p => p.id !== id));
    toast({ title: 'Deleted' });
  };

  const handleTogglePublish = (project: Project) => {
    const updated = projects.map(p => p.id === project.id ? { ...p, published: !p.published } : p);
    saveToStorage(updated);
    toast({ title: project.published ? 'Unpublished' : 'Published' });
  };

  const handleExport = () => {
    const published = projects.filter(p => p.published);
    navigator.clipboard.writeText(JSON.stringify(published, null, 2));
    toast({ title: 'Copied!', description: 'Paste into data/projects-data.json and push to GitHub' });
  };

  const handleClearAll = () => {
    if (!confirm('Clear all local projects? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setProjects([]);
    toast({ title: 'Cleared' });
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio</p>
          </div>
          <div className="flex gap-2">
            {!isCreating && !editingId && (
              <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" />New Project</Button>
            )}
            {projects.length > 0 && (
              <Button variant="outline" onClick={handleExport}><Copy className="mr-2 h-4 w-4" />Export JSON</Button>
            )}
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>To publish:</strong> Click "Export JSON", copy the JSON, paste into <code>data/projects-data.json</code>, and push to GitHub.
            </p>
          </CardContent>
        </Card>

        {(isCreating || editingId) && (
          <ProjectForm initialData={formData} onSave={handleFormSave} onCancel={handleFormCancel} />
        )}

        {loading ? (
          <div className="text-center py-12"><p>Loading...</p></div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects. Create your first one!</p>
              <Button onClick={handleCreate} className="mt-4"><Plus className="mr-2 h-4 w-4" />Create Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-muted">
                      <Image src={project.thumbnail || '/images/placeholder.png'} alt={project.alt || project.title} width={192} height={128} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {project.featured && <Badge className="bg-primary">Featured</Badge>}
                          {project.published ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => handleTogglePublish(project)}>{project.published ? <><EyeOff className="w-4 h-4 mr-2" />Unpublish</> : <><Eye className="w-4 h-4 mr-2" />Publish</>}</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-800">
                <strong>Danger zone:</strong> <Button variant="destructive" size="sm" onClick={handleClearAll}>Clear All Local Projects</Button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminAuth>
  );
}
