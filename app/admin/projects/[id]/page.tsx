'use client';

/**
 * Admin Edit Project Page
 *
 * Form for editing an existing portfolio project
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminAuth } from '@/components/admin/admin-auth';
import { ImageUpload } from '@/components/admin/image-upload';
import {
  adminGetProjectByIdAction,
  adminUpdateProject,
} from './actions';
import type { Project, ProjectCategory } from '@/types/database';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('web');
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);

  // Images state
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [hero, setHero] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [alt, setAlt] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const project = await adminGetProjectByIdAction(projectId);
      if (!project) {
        setNotFound(true);
        return;
      }

      // Populate form state
      setTitle(project.title);
      setSlug(project.slug);
      setDescription(project.description);
      setTags(project.tags || []);
      setCategory(project.category);
      setDemoUrl(project.demo_url || '');
      setRepoUrl(project.repo_url || '');
      setFeatured(project.featured);
      setIsPublished(project.published_at !== null);
      setOriginalPublishedAt(project.published_at);
      setThumbnail(project.images.thumbnail);
      setHero(project.images.hero);
      setGallery(project.images.gallery || []);
      setAlt(project.images.alt || '');
    } catch (error) {
      toast.error('Failed to load project');
      console.error('Error fetching project:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Only auto-generate if slug hasn't been manually edited
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddGallery = (url: string) => {
    if (url && !gallery.includes(url)) {
      setGallery([...gallery, url]);
    }
  };

  const handleRemoveGallery = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Determine published_at based on original and current state
      let publishedAt: string | null;
      if (originalPublishedAt && isPublished) {
        // Keep original published date if already published and still published
        publishedAt = originalPublishedAt;
      } else if (isPublished) {
        // Set to now if newly published
        publishedAt = new Date().toISOString();
      } else {
        // Unpublish
        publishedAt = null;
      }

      const updates = {
        title,
        description,
        slug,
        tags: tags.length > 0 ? tags : undefined,
        images: {
          thumbnail: thumbnail || null,
          hero: hero || null,
          gallery: gallery.length > 0 ? gallery : [],
          alt: alt || '',
        },
        demo_url: demoUrl || null,
        repo_url: repoUrl || null,
        featured: featured || false,
        category,
        published_at: publishedAt,
      };

      const result = await adminUpdateProject(projectId, updates);

      if (result) {
        toast.success('Project updated successfully');
        router.push('/admin/projects');
      } else {
        toast.error('Failed to update project');
      }
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </AdminAuth>
    );
  }

  if (notFound) {
    return (
      <AdminAuth>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-destructive font-medium">Project not found</p>
          <Link href="/admin/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
            <p className="text-muted-foreground mt-1">
              Update project details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Title, description, and category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                  Slug <span className="text-destructive">*</span>
                </label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="my-awesome-project"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Lowercase letters, numbers, and hyphens only"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly version of the title (changing this will change the URL)
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="A brief description of the project..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select value={category} onValueChange={(v: ProjectCategory) => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="system">Business System</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="design">Design System</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Technologies and keywords (press Enter to add)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag..."
                  className="mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>Demo and repository URLs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="demoUrl" className="block text-sm font-medium mb-2">
                  Demo URL
                </label>
                <Input
                  id="demoUrl"
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="repoUrl" className="block text-sm font-medium mb-2">
                  Repository URL
                </label>
                <Input
                  id="repoUrl"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Thumbnail, hero, and gallery images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-2" />
                  Thumbnail <span className="text-destructive">*</span>
                </label>
                <ImageUpload
                  value={thumbnail || undefined}
                  onChange={setThumbnail}
                  folder="projects/thumbnails"
                  aspectRatio="square"
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Square image for project cards (recommended: 600x600)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-2" />
                  Hero Image <span className="text-destructive">*</span>
                </label>
                <ImageUpload
                  value={hero || undefined}
                  onChange={setHero}
                  folder="projects/hero"
                  aspectRatio="video"
                  className="max-w-lg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Wide banner image for project detail page (recommended: 1920x1080)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-2" />
                  Gallery Images
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {gallery.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGallery(index)}
                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <ImageUpload
                    onChange={handleAddGallery}
                    folder="projects/gallery"
                    aspectRatio="video"
                    className="w-32 h-24"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Additional screenshots or images (recommended: 1920x1080)
                </p>
              </div>

              <div>
                <label htmlFor="alt" className="block text-sm font-medium mb-2">
                  Alt Text
                </label>
                <Input
                  id="alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Descriptive text for accessibility..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Describe images for screen readers and SEO
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked as boolean)}
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured project (will be highlighted on homepage)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published (uncheck to save as draft)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/projects">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving || !title || !slug || !description || !category}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminAuth>
  );
}
