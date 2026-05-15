/**
 * Individual Project Page
 *
 * Displays a single project from local JSON data.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github, Tag, Play, ZoomIn } from 'lucide-react';
import { Header } from '@/components/header';
import { ProjectDetail } from '@/components/projects/project-detail';

// Local project type (matches projects-data.json structure)
interface LocalProject {
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
  featured?: boolean;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  published?: boolean;
}

const categoryNames: Record<string, string> = {
  web: 'Web Application',
  system: 'Business System',
  dashboard: 'Dashboard',
  design: 'Design',
  video: 'Video',
  branding: 'Branding',
};

/**
 * Get all projects from data file (server-side only)
 */
async function getProjects(): Promise<LocalProject[]> {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'projects-data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Get a project by slug
 */
async function getProjectBySlug(slug: string): Promise<LocalProject | null> {
  const projects = await getProjects();
  return projects.find((p: LocalProject) => p.slug === slug && p.published) || null;
}

/**
 * Get related projects
 */
async function getRelatedProjects(slug: string, limit: number = 3): Promise<LocalProject[]> {
  const projects = await getProjects();
  const project = projects.find((p: LocalProject) => p.slug === slug);
  if (!project) return [];
  return projects.filter((p: LocalProject) => p.slug !== slug && p.published).slice(0, limit);
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = await getRelatedProjects(slug, 3);

  // Build all media items for gallery
  const allMedia = [
    project.thumbnail,
    ...(project.gallery || [])
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
              <span>/</span>
              <span className="text-foreground">{project.title}</span>
            </nav>
          </div>
        </section>

        {/* Header Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{categoryNames[project.category] || project.category}</Badge>
              {project.featured && (
                <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-8">{project.description}</p>

            <div className="flex flex-wrap gap-4">
              {project.liveUrl && project.liveUrl !== '#' && (
                <Button asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && project.githubUrl !== '#' && (
                <Button variant="outline" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/contact">Discuss Project</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Media Display */}
        {allMedia.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ProjectDetail
                src={allMedia[0]}
                alt={project.alt || project.title}
                title={project.title}
                allMedia={allMedia}
              />
            </div>
          </section>
        )}

        {/* Description */}
        {project.longDescription && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-4">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.longDescription}
              </p>
            </div>
          </section>
        )}

        {/* Technologies/Tags */}
        {(project.tags?.length > 0 || (project.technologies?.length ?? 0) > 0) && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Technologies</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...(project.technologies || []), ...(project.tags || [])].map((item: string) => (
                  <Badge key={item} variant="secondary" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rp) => (
                  <Link key={rp.id} href={`/projects/${rp.slug}`} className="group">
                    <article className="bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                      {rp.thumbnail && (
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={rp.thumbnail}
                            alt={rp.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {rp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {rp.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">Need a similar project?</h2>
            <p className="text-muted-foreground mb-6">
              Let&apos;s discuss how I can help bring your ideas to life.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}