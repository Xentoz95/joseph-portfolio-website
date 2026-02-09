'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types/database';
import { buildCloudinaryUrl } from '@/lib/cloudinary-helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface ProjectCardProps {
  project: Project;
}

const categoryColors: Record<string, string> = {
  web: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  system: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  dashboard: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
  design: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30',
  mobile: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
};

const categoryBadgeColors: Record<string, string> = {
  web: 'bg-blue-500 text-white',
  system: 'bg-purple-500 text-white',
  dashboard: 'bg-green-500 text-white',
  design: 'bg-pink-500 text-white',
  mobile: 'bg-orange-500 text-white',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { trackProjectClick, trackExternalLinkClick } = useAnalyticsTracking();
  const categoryColor = categoryColors[project.category] || categoryColors.web;
  const badgeColor = categoryBadgeColors[project.category] || categoryBadgeColors.web;

  // Get image source - handle both local paths and Cloudinary URLs
  const getImageSrc = (src: string | null | undefined): string => {
    if (!src) return '/placeholder.svg';

    // If it's already a full URL (http/https), return it
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }

    // If it's a local path (starts with /), use it directly
    if (src.startsWith('/images/')) {
      return src;
    }

    // For Cloudinary public IDs, build the URL
    try {
      return buildCloudinaryUrl(src, {
        width: 400,
        height: 300,
        quality: 80,
        crop: 'fill',
      });
    } catch {
      return src.startsWith('/') ? src : `/placeholder.svg`;
    }
  };

  const thumbnailSrc = getImageSrc(project.images.thumbnail);
  const demoUrl = (project as any).demo_url || (project as any).links?.liveDemo;
  const repoUrl = (project as any).repo_url || (project as any).links?.github;

  const handleProjectClick = () => {
    trackProjectClick(project.id, project.title);
  };

  const handleExternalLinkClick = (url: string, type: 'project' | 'repo') => {
    trackExternalLinkClick(url, type);
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block" onClick={handleProjectClick}>
      <div className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1 flex flex-col h-full">
        {/* Project Image */}
        <div className="relative w-full h-56 overflow-hidden bg-muted">
          <Image
            src={thumbnailSrc}
            alt={project.images.alt || project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={thumbnailSrc.endsWith('.svg')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`${badgeColor} px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm`}>
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-foreground/75 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-primary/20">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline" className="text-xs border-primary/20">
                +{project.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
