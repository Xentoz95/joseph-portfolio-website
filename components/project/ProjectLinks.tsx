'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface ProjectLinksProps {
  demoUrl: string | null;
  repoUrl: string | null;
  projectId: string;
}

export function ProjectLinks({ demoUrl, repoUrl, projectId }: ProjectLinksProps) {
  const { trackExternalLinkClick } = useAnalyticsTracking();

  const handleDemoClick = () => {
    if (demoUrl) {
      trackExternalLinkClick(demoUrl, 'project');
    }
  };

  const handleRepoClick = () => {
    if (repoUrl) {
      trackExternalLinkClick(repoUrl, 'project');
    }
  };

  if (!demoUrl && !repoUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {demoUrl && (
        <Button asChild size="lg" className="gap-2" onClick={handleDemoClick}>
          <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-5 h-5" />
            View Live Demo
          </Link>
        </Button>
      )}
      {repoUrl && (
        <Button variant="outline" size="lg" className="gap-2" asChild onClick={handleRepoClick}>
          <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
            <Github className="w-5 h-5" />
            View Source Code
          </Link>
        </Button>
      )}
    </div>
  );
}
