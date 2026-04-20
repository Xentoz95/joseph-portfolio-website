'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Play, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Project as DbProject, ProjectImages } from '@/types/database';

interface ProjectImages {
  thumbnail: string | null;
  hero: string | null;
  gallery: string[];
  alt: string;
}

// Adapter interface that matches component expectations
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  thumbnail: string;
  hero?: string;
  gallery: string[];
  alt: string;
  featured: boolean;
  technologies?: string[];
  liveUrl: string;
  githubUrl: string;
  published: boolean;
}

interface ProjectListProps {
  projects: Project[] | DbProject[];
}

// Transform Supabase project to component format
function adaptProject(project: DbProject | Project): Project {
  // If already in component format (has flat thumbnail), return as-is
  if ('thumbnail' in project && typeof project.thumbnail === 'string') {
    return project as Project;
  }

  // Transform from Supabase format
  const dbProject = project as DbProject;
  const images = dbProject.images || { thumbnail: null, hero: null, gallery: [], alt: '' };

  return {
    id: dbProject.id,
    slug: dbProject.slug,
    title: dbProject.title,
    description: dbProject.description,
    longDescription: '',
    category: dbProject.category,
    tags: dbProject.tags || [],
    thumbnail: images.thumbnail || '',
    hero: images.hero || undefined,
    gallery: images.gallery || [],
    alt: images.alt || dbProject.title,
    featured: dbProject.featured,
    technologies: [],
    liveUrl: dbProject.demo_url || '#',
    githubUrl: dbProject.repo_url || '#',
    published: dbProject.published_at !== null,
  };
}

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  title: string;
}

export function ProjectList({ projects }: ProjectListProps) {
  const [viewingMedia, setViewingMedia] = useState<MediaItem | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [currentProjectMedia, setCurrentProjectMedia] = useState<MediaItem[]>([]);

  // Adapt all projects to component format
  const adaptedProjects = projects.map(adaptProject);

  const isVideo = (src: string) => {
    if (!src) return false;
    return src.includes('video') ||
      src.endsWith('.mp4') ||
      src.endsWith('.webm') ||
      src.endsWith('.mov') ||
      (src.includes('cloudinary.com') && src.includes('/video/'));
  };

  const openMediaViewer = (project: Project) => {
    // Build media array from thumbnail + gallery
    const media: MediaItem[] = [];
    if (project.thumbnail) {
      media.push({
        type: isVideo(project.thumbnail) ? 'video' : 'image',
        src: project.thumbnail,
        title: project.title
      });
    }
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach((src) => {
        if (src) {
          media.push({
            type: isVideo(src) ? 'video' : 'image',
            src: src,
            title: project.title
          });
        }
      });
    }

    setCurrentProjectMedia(media);
    setMediaIndex(0);
    if (media.length > 0) {
      setViewingMedia(media[0]);
    }
  };

  const goToPrevious = useCallback(() => {
    if (currentProjectMedia.length === 0) return;
    const newIndex = mediaIndex === 0 ? currentProjectMedia.length - 1 : mediaIndex - 1;
    setMediaIndex(newIndex);
    setViewingMedia(currentProjectMedia[newIndex]);
  }, [mediaIndex, currentProjectMedia]);

  const goToNext = useCallback(() => {
    if (currentProjectMedia.length === 0) return;
    const newIndex = mediaIndex === currentProjectMedia.length - 1 ? 0 : mediaIndex + 1;
    setMediaIndex(newIndex);
    setViewingMedia(currentProjectMedia[newIndex]);
  }, [mediaIndex, currentProjectMedia]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!viewingMedia) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setViewingMedia(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingMedia, goToPrevious, goToNext]);

  if (adaptedProjects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg mb-4">
          No projects found matching your criteria.
        </p>
        <Button variant="outline" asChild>
          <Link href="/projects">Clear all filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adaptedProjects.map((project) => (
          <div
            key={project.id}
            className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group flex flex-col"
          >
            {/* Media - Image or Video */}
            <div className="relative h-48 overflow-hidden cursor-pointer"
              onClick={() => openMediaViewer(project)}
            >
              {isVideo(project.thumbnail) ? (
                <>
                  <video
                    src={project.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </>
              ) : project.thumbnail ? (
                <>
                  <Image
                    src={project.thumbnail}
                    alt={project.alt || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="flex items-center gap-2 text-white text-sm font-medium">
                      <ZoomIn className="w-4 h-4" />
                      View Full Size
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No preview</span>
                </div>
              )}
              {project.category === 'video' && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                </div>
              )}
              {project.gallery && project.gallery.length > 0 && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-black/70 text-white">
                    {project.gallery.length + 1} items
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                {project.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
                {project.description}
              </p>

              {/* Links */}
              <div className="flex gap-4 pt-4 border-t border-border/50">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                )}
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex items-center gap-1 text-sm text-primary hover:underline ml-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Viewer Dialog */}
      <Dialog open={!!viewingMedia} onOpenChange={() => setViewingMedia(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{viewingMedia?.title}</DialogTitle>

          {/* Close button */}
          <button
            onClick={() => setViewingMedia(null)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Previous */}
          {currentProjectMedia.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Navigation - Next */}
          {currentProjectMedia.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Counter */}
          {currentProjectMedia.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {mediaIndex + 1} / {currentProjectMedia.length}
            </div>
          )}

          {/* Media Content */}
          {viewingMedia && viewingMedia.src && (
            viewingMedia.type === 'video' ? (
              <video
                src={viewingMedia.src}
                controls
                autoPlay
                className="w-full h-full max-h-[85vh] object-contain"
              />
            ) : (
              <img
                src={viewingMedia.src}
                alt={viewingMedia.title || ''}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
