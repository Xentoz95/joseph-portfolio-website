/**
 * Projects Listing Page
 *
 * Displays all projects with filtering by tags and search functionality.
 * Fetches data from Supabase database with real-time updates.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects, getAllTags } from '@/lib/supabase/projects';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { SearchFormWithAnalytics } from '@/components/search-form-with-analytics';
import { ProjectsRealtimeWrapper } from './projects-realtime';
import { CollectionPageSchema } from '@/lib/seo/json-ld';
import { Breadcrumb } from '@/components/seo/breadcrumb';

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse my portfolio of web applications, dashboards, systems, and design projects.',
  alternates: {
    canonical: 'https://josephthuo.com/projects',
  },
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Browse my portfolio of web applications, dashboards, systems, and design projects.',
    type: 'website',
    url: 'https://josephthuo.com/projects',
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{
    tag?: string;
    search?: string;
  }>;
}

/**
 * Projects grid component with filters
 */
async function ProjectsGrid({ tag, search }: { tag?: string; search?: string }) {
  // Fetch projects
  let projects = await getProjects();

  // Filter by tag if provided
  if (tag) {
    projects = projects.filter((p) => p.tags.includes(tag));
  }

  // Filter by search if provided
  if (search) {
    const searchLower = search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  // Fetch all tags for filter
  const allTags = await getAllTags();

  return (
    <div className="space-y-8">
      {/* Filter by Tags */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filter by Tag</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!tag ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href="/projects">All Tags</Link>
          </Button>
          {allTags.map((tagItem) => (
            <Button
              key={tagItem}
              variant={tag === tagItem ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={`/projects?tag=${encodeURIComponent(tagItem)}`}>
                {tagItem}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(tag || search) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {tag && (
            <Badge variant="secondary" className="gap-1">
              Tag: {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                asChild
              >
                <Link href={search ? `/projects?search=${encodeURIComponent(search)}` : '/projects'}>
                  ×
                </Link>
              </Button>
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                asChild
              >
                <Link href={tag ? `/projects?tag=${encodeURIComponent(tag)}` : '/projects'}>
                  ×
                </Link>
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No projects found matching your criteria.
          </p>
          <Button variant="outline" asChild>
            <Link href="/projects">Clear all filters</Link>
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}


/**
 * Main page component
 */
export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Fetch projects for structured data
  const projects = await getProjects();

  // Generate collection page structured data
  const collectionItems = projects.slice(0, 20).map((project) => ({
    name: project.title,
    url: `https://josephthuo.com/projects/${project.slug}`,
    description: project.description,
  }));

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <CollectionPageSchema
        name="Projects"
        description="Browse my portfolio of web applications, dashboards, systems, and design projects."
        url="https://josephthuo.com/projects"
        items={collectionItems}
      />

      {/* Breadcrumb */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[{ name: 'Projects', item: 'https://josephthuo.com/projects' }]}
          />
        </div>
      </section>

      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Projects
            </h1>
            {/* Real-time connection status */}
            <ProjectsRealtimeWrapper />
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Browse my portfolio of web applications, dashboards, systems, and design projects.
          </p>
          <SearchFormWithAnalytics
            currentSearch={search}
            action="/projects"
            placeholder="Search projects..."
            resultCount={0}
            searchType="projects"
          />
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="text-center py-8">Loading projects...</div>}>
            <ProjectsGrid tag={tag} search={search} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
