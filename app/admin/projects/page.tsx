'use client';

/**
 * Admin Projects Page - JSONBin.io Based
 *
 * Projects are saved to and read from JSONBin.io
 * No Supabase or SQL needed!
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Plus, Trash2, Edit, Eye, EyeOff, Save, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ProjectForm } from '@/components/admin/project-form';

// JSONBin.io configuration
// Get your own free API key from https://jsonbin.io
const JSONBIN_API_KEY = 'your-jsonbin-api-key';
const JSONBIN_BIN_ID = 'your-bin-id';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

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

// Fetch projects from JSONBin
async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(JSONBIN_URL, {
      headers: {
        'X-Access-Key': JSONBIN_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.record || [];
    }
  } catch (e) {
    console.error('Error fetching:', e);
  }
  return [];
}

// Save projects to JSONBin
async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify(projects),
    });
    return response.ok;
  } catch (e) {
    console.error('Error saving:', e);
    return false;
  }
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
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

    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({ title: 'Success', description: 'Project saved!' });
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
    } else {
      toast({ title: 'Error', description: 'Failed to save. Check JSONBin setup.', variant: 'destructive' });
    }
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedProjects = projects.filter(p => p.id !== id);
    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({ title: 'Success', description: 'Project deleted' });
    } else {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const updatedProjects = projects.map(p =>
      p.id === project.id ? { ...p, published: !p.published } : p
    );
    const success = await saveProjects(updatedProjects);
    if (success) {
      setProjects(updatedProjects);
      toast({ title: 'Success', description: project.published ? 'Project unpublished' : 'Project published' });
    }
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
          </div>
          {!isCreating && !editingId && (
            <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" />New Project</Button>
          )}
        </div>

        {(isCreating || editingId) && (
          <ProjectForm initialData={formData} onSave={handleFormSave} onCancel={handleFormCancel} />
        )}

        {loading ? (
          <div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects yet. Create your first one!</p>
              <Button onClick={handleCreate} className="mt-4"><Plus className="mr-2 h-4 w-4" />Create Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={project.thumbnail || '/images/placeholder.png'} alt={project.alt || project.title} width={192} height={128} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {project.featured && <Badge className="bg-primary">Featured</Badge>}
                          {project.published ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
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
      </div>
    </AdminAuth>
  );
}
