'use client';

/**
 * Project Form Component - Simplified & Category-Aware
 *
 * Design/Video = minimal fields
 * System/Website = detailed fields
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X, Film, Image as ImageIcon, Code, Globe } from 'lucide-react';
import { MediaUpload } from '@/components/admin/media-upload';

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

interface ProjectFormProps {
  initialData: Partial<Project>;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'design', label: 'Design', icon: ImageIcon, color: 'text-pink-500' },
  { value: 'video', label: 'Video', icon: Film, color: 'text-purple-500' },
  { value: 'web', label: 'Website', icon: Globe, color: 'text-blue-500' },
  { value: 'system', label: 'System', icon: Code, color: 'text-green-500' },
];

export function ProjectForm({ initialData, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(initialData);

  // Update form when initialData changes (e.g., when creating new project)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const isMediaCategory = formData.category === 'design' || formData.category === 'video';
  const isDevCategory = formData.category === 'web' || formData.category === 'system';

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, technologies });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="mb-8 border-primary">
      <CardHeader>
        <CardTitle>{initialData.id ? 'Edit Project' : 'Create New Project'}</CardTitle>
        <CardDescription>
          {isMediaCategory
            ? 'Upload your design or video work'
            : 'Share your website or system project'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <Label className="mb-2 block">Project Type *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${formData.category === cat.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <Icon className={`h-6 w-6 ${cat.color}`} />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project Title"
              autoFocus
              className="mt-1"
            />
          </div>

          {/* Slogan / Short Description */}
          <div>
            <Label htmlFor="description">Slogan *</Label>
            <Input
              id="description"
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A catchy one-liner about this project"
              className="mt-1"
            />
          </div>

          {/* Media Upload - for Design/Video */}
          {isMediaCategory && (
            <div>
              <Label className="mb-2 block">
                {formData.category === 'video' ? 'Upload Video *' : 'Upload Image *'}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MediaUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                  type={formData.category === 'video' ? 'video' : 'image'}
                  aspectRatio={formData.category === 'video' ? 'video' : 'square'}
                />
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alt">Alt Text</Label>
                    <Input
                      id="alt"
                      type="text"
                      value={formData.alt || ''}
                      onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                      placeholder="Describe your work"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input
                      id="liveUrl"
                      type="text"
                      value={formData.liveUrl || ''}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://yoursite.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      type="text"
                      value={formData.githubUrl || ''}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username/repo"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail + Long Description - for Website/System */}
          {isDevCategory && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Screenshot/Preview *</Label>
                  <MediaUpload
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    type="image"
                    aspectRatio="video"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="longDescription">Project Description *</Label>
                    <Textarea
                      id="longDescription"
                      value={formData.longDescription || ''}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      placeholder="What does this project do? What problem does it solve?"
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stack/Technologies */}
              <div>
                <Label htmlFor="technologies">Tech Stack</Label>
                <Input
                  id="technologies"
                  type="text"
                  value={formData.technologies?.join(', ') || ''}
                  onChange={(e) => handleTechnologiesChange(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL, Supabase"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of technologies used
                </p>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="portfolio, fullstack, dashboard"
                  className="mt-1"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="text"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="mt-1"
                />
              </div>
            </>
          )}

          {/* Featured + Published toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="featured">Featured</Label>
              <select
                id="featured"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                value={formData.featured ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'yes' })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <Label htmlFor="published">Status</Label>
              <select
                id="published"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                value={formData.published ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, published: e.target.value === 'yes' })}
              >
                <option value="yes">Published</option>
                <option value="no">Draft</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
