/**
 * Projects Listing Page - Uses Local JSON Data
 *
 * Displays all projects with filtering by tags and search functionality.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, ExternalLink, Github, Play } from 'lucide-react';
import { Header } from '@/components/header';
import { getProjects, getAllTags as getTagsFromDb } from '@/lib/supabase/projects';
import { ProjectList } from '@/components/projects/project-list';
import type { Project } from '@/types/database';

// Get all unique tags
async function getAllTags(): Promise<string[]> {
  return await getTagsFromDb();
}

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse my portfolio of web applications, dashboards, systems, and design projects.',
  alternates: {
    canonical: 'https://josephthuo.com/projects',
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{
    tag?: string;
    search?: string;
  }>;
};

/**
 * Main page component
 */
export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tagFilter = typeof params.tag === 'string' ? params.tag : undefined;
  const searchQuery = typeof params.search === 'string' ? params.search : undefined;

  let projects = await getProjects();
  const allTags = await getAllTags();

  // Filter by tag if provided
  if (tagFilter) {
    projects = projects.filter((p) => p.tags.includes(tagFilter));
  }

  // Filter by search if provided
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Projects</span>
            </nav>
          </div>
        </section>

        {/* Header Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50 relative overflow-hidden">
          {/* Brand Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/brand/4.png"
              alt=""
              fill
              className="object-cover opacity-[0.05] grayscale"
            />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              My Projects
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Browse my portfolio of web applications, dashboards, systems, and design projects.
            </p>

            {/* Search Form */}
            <form method="get" action="/projects" className="flex gap-2 max-w-md">
              {tagFilter && <input type="hidden" name="tag" value={tagFilter} />}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter by Tags */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Filter by Tag</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/projects"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !tagFilter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
                  }`}
                >
                  All Tags
                </Link>
                {allTags.map((tagItem) => (
                  <Link
                    key={tagItem}
                    href={`/projects?tag=${encodeURIComponent(tagItem)}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      tagFilter === tagItem
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
                    }`}
                  >
                    {tagItem}
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(tagFilter || searchQuery) && (
              <div className="mb-8 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {tagFilter && (
                  <Badge variant="secondary" className="gap-1">
                    Tag: {tagFilter}
                    <Link
                      href={searchQuery ? `/projects?search=${encodeURIComponent(searchQuery)}` : '/projects'}
                      className="ml-1 hover:text-primary"
                    >
                      ×
                    </Link>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <Link
                      href={tagFilter ? `/projects?tag=${encodeURIComponent(tagFilter)}` : '/projects'}
                      className="ml-1 hover:text-primary"
                    >
                      ×
                    </Link>
                  </Badge>
                )}
              </div>
            )}

            {/* Projects Grid */}
            <ProjectList projects={projects} />

            {/* Results Count */}
            <div className="mt-8 text-sm text-muted-foreground">
              Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
