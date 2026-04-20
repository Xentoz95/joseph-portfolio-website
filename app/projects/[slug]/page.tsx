/**
 * Individual Project Page - Supabase Based
 *
 * Displays a single project with details, gallery, links.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Play, X } from 'lucide-react';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { Header } from '@/components/header';
import { getProjectBySlug, getRelatedProjects as getRelatedProjectsDb } from '@/lib/supabase/projects';
import { ProjectDetail } from '@/components/projects/project-detail';
import type { Project as DbProject, ProjectImages } from '@/types/database';

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

// Transform Supabase project to page format
function adaptDbProject(dbProject: DbProject): Project {
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
    hero: images.hero || '',
    gallery: images.gallery || [],
    alt: images.alt || dbProject.title,
    featured: dbProject.featured,
    technologies: [],
    liveUrl: dbProject.demo_url || '#',
    githubUrl: dbProject.repo_url || '#',
    published: dbProject.published_at !== null,
  };
}

async function getProjectBySlugFromDb(slug: string): Promise<Project | null> {
  const dbProject = await getProjectBySlug(slug);
  if (!dbProject) return null;
  return adaptDbProject(dbProject);
}

async function getRelatedProjects(slug: string, limit: number = 3): Promise<Project[]> {
  const dbProjects = await getRelatedProjectsDb(slug, limit);
  return dbProjects.map(adaptDbProject);
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugFromDb(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
    alternates: {
      canonical: `https://josephthuo.com/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      url: `https://josephthuo.com/projects/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
    },
  };
}

const categoryNames: Record<string, string> = {
  web: 'Web Application',
  system: 'Business System',
  dashboard: 'Dashboard',
  design: 'Design',
  video: 'Video',
  branding: 'Branding',
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugFromDb(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(slug, 3);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-16">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              items={[
                { name: 'Projects', item: 'https://josephthuo.com/projects' },
                { name: project.title, item: `https://josephthuo.com/projects/${project.slug}` },
              ]}
            />
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            {/* Back Link */}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            {/* Category & Featured */}
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{categoryNames[project.category] || project.category}</Badge>
              {project.featured && (
                <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
              )}
              {project.category === 'video' && (
                <Badge className="bg-purple-600/10 text-purple-600 border-purple-600/20">
                  <Play className="w-3 h-3 mr-1" />
                  Video
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
              {project.description}
            </p>

            {/* Action Buttons */}
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
                <Link href="/contact">
                  Discuss Project
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Hero Media - Image or Video */}
        {project.thumbnail && (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ProjectDetail
                src={project.thumbnail}
                alt={project.alt || project.title}
                title={project.title}
                allMedia={project.gallery && project.gallery.length > 0 ? project.gallery : [project.thumbnail]}
                currentIndex={0}
              />
            </div>
          </section>
        )}

        {/* Long Description */}
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

        {/* Tags / Technologies */}
        {(project.tags.length > 0 || project.technologies.length > 0) && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
            <div className="max-w-6xl mx-auto">
              {(project.technologies.length > 0 || project.tags.length > 0) && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {project.technologies.length > 0 ? 'Tech Stack' : 'Tags'}
                  </h2>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {[...project.technologies, ...project.tags].map((item) => (
                  <Badge key={item} variant="secondary" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((imgSrc, index) => (
                  <ProjectDetail
                    key={index}
                    src={imgSrc}
                    alt={`${project.title} screenshot ${index + 1}`}
                    title={project.title}
                    allMedia={project.gallery}
                    currentIndex={index}
                  />
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
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.slug}`}
                    className="group"
                  >
                    <article className="bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                      {relatedProject.thumbnail && (
                        <div className="relative aspect-video bg-muted">
                          <Image
                            src={relatedProject.thumbnail}
                            alt={relatedProject.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {relatedProject.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedProject.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Need a similar project?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let's discuss how I can help bring your ideas to life.
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
