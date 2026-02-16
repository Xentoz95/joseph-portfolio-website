/**
 * Individual Project Page
 *
 * Displays a single project with details, gallery, links,
 * related projects, and SEO structured data.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectBySlug, getRelatedProjects } from '@/lib/supabase/projects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary-helpers';
import { CreativeWorkSchema, BreadcrumbListSchema } from '@/lib/seo/json-ld';
import { Breadcrumb } from '@/components/seo/breadcrumb';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const ogImage = project.images.hero
    ? getImageSrc(project.images.hero)
    : undefined;

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
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

/**
 * Helper function to get image source
 */
function getImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  if (src.startsWith('/images/')) {
    return src;
  }

  try {
    return buildCloudinaryUrl(src, {
      width: 1200,
      height: 630,
      quality: 85,
      crop: 'fill',
    });
  } catch {
    return src.startsWith('/') ? src : null;
  }
}

/**
 * Category display names
 */
const categoryNames: Record<string, string> = {
  web: 'Web Application',
  system: 'Business System',
  dashboard: 'Dashboard',
  design: 'Design System',
  mobile: 'Mobile App',
};

/**
 * Individual Project Page
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const heroImageSrc = getImageSrc(project.images.hero);
  const galleryImages = project.images.gallery
    .map((img) => getImageSrc(img))
    .filter((img): img is string => img !== null);
  const relatedProjects = await getRelatedProjects(slug, 3);

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <CreativeWorkSchema
        title={project.title}
        description={project.description}
        url={`https://josephthuo.com/projects/${project.slug}`}
        image={heroImageSrc || undefined}
        dateCreated={project.created_at}
        dateModified={project.updated_at}
        keywords={project.tags}
        category={project.category}
      />
      <BreadcrumbListSchema
        items={[
          { name: 'Projects', item: 'https://josephthuo.com/projects' },
          { name: project.title, item: `https://josephthuo.com/projects/${project.slug}` },
        ]}
      />

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
            {project.demo_url && (
              <Button asChild>
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Demo
                </a>
              </Button>
            )}
            {project.repo_url && (
              <Button variant="outline" asChild>
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
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

      {/* Hero Image */}
      {heroImageSrc && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
              <Image
                src={heroImageSrc}
                alt={project.images.alt || project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Tags */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Technologies</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Project Gallery</h2>
            <div className={`grid gap-6 ${
              galleryImages.length === 1
                ? 'grid-cols-1'
                : galleryImages.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {galleryImages.map((imgSrc, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={imgSrc}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Category</h3>
              <p className="text-foreground font-medium">
                {categoryNames[project.category] || project.category}
              </p>
            </div>
            {project.published_at && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Published</h3>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Links</h3>
              <div className="flex gap-4">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <article className="bg-background rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                    {relatedProject.images.thumbnail && (
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={getImageSrc(relatedProject.images.thumbnail) || ''}
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
  );
}
