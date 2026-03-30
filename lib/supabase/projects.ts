/**
 * Projects Data Layer
 *
 * Server-side functions for fetching project data from Supabase.
 * These functions are designed for use in Server Components and Server Actions.
 */

import { createClient } from './server';
import type { Project, TablesInsert, ProjectUpdate, Database } from '@/types/database';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

/**
 * Fallback projects data when database is not available
 */
const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Corporate Landing Page',
    description: 'Modern, responsive corporate landing page with smooth animations, contact forms, and conversion-optimized design.',
    slug: 'corporate-landing-page',
    tags: ['Landing Page', 'Responsive', 'Next.js', 'Tailwind CSS'],
    images: {
      thumbnail: '/images/projects/corporate-landing-page/thumb.svg',
      hero: '/images/projects/corporate-landing-page/hero.svg',
      gallery: ['/images/projects/corporate-landing-page/1.svg'],
      alt: 'Corporate landing page hero section with call-to-action'
    },
    demo_url: null,
    repo_url: null,
    featured: true,
    category: 'web',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'E-commerce Dashboard',
    description: 'Full-featured e-commerce admin dashboard with inventory management, sales analytics, order tracking, and customer insights.',
    slug: 'ecommerce-dashboard',
    tags: ['Dashboard', 'E-commerce', 'Analytics', 'Charts'],
    images: {
      thumbnail: '/images/projects/ecommerce-dashboard/thumb.svg',
      hero: '/images/projects/ecommerce-dashboard/hero.svg',
      gallery: ['/images/projects/ecommerce-dashboard/1.svg', '/images/projects/ecommerce-dashboard/2.svg'],
      alt: 'E-commerce dashboard showing sales charts and inventory metrics'
    },
    demo_url: null,
    repo_url: null,
    featured: true,
    category: 'dashboard',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Fintech UI System',
    description: 'Comprehensive fintech user interface system with reusable components, dark mode support, and banking-grade security features.',
    slug: 'fintech-ui-system',
    tags: ['Fintech', 'UI Components', 'Design System', 'TypeScript'],
    images: {
      thumbnail: '/images/projects/fintech-ui-system/thumb.svg',
      hero: '/images/projects/fintech-ui-system/hero.svg',
      gallery: ['/images/projects/fintech-ui-system/1.svg', '/images/projects/fintech-ui-system/2.svg'],
      alt: 'Fintech UI system showing dashboard and transaction components'
    },
    demo_url: null,
    repo_url: null,
    featured: true,
    category: 'design',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Access Control System',
    description: 'A comprehensive access control and security management system with role-based permissions, user authentication, and audit logging capabilities.',
    slug: 'access-control-system',
    tags: ['Security', 'Authentication', 'React', 'TypeScript'],
    images: {
      thumbnail: '/images/projects/access-control-system/thumb.svg',
      hero: '/images/projects/access-control-system/hero.svg',
      gallery: ['/images/projects/access-control-system/1.svg'],
      alt: 'Access Control System interface showing user permissions and security settings'
    },
    demo_url: null,
    repo_url: null,
    featured: false,
    category: 'web',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'HR Management System',
    description: 'Human resources management platform with employee records, leave management, payroll processing, and performance tracking.',
    slug: 'hr-management-system',
    tags: ['HR', 'Management', 'Payroll', 'Analytics'],
    images: {
      thumbnail: '/images/projects/hr-management-system/thumb.svg',
      hero: '/images/projects/hr-management-system/hero.svg',
      gallery: ['/images/projects/hr-management-system/1.svg'],
      alt: 'HR management system showing employee dashboard and records'
    },
    demo_url: null,
    repo_url: null,
    featured: false,
    category: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Inventory Tracking System',
    description: 'Real-time inventory tracking system with barcode scanning, stock alerts, supplier management, and warehouse optimization.',
    slug: 'inventory-tracking-system',
    tags: ['Inventory', 'Tracking', 'Management', 'Real-time'],
    images: {
      thumbnail: '/images/projects/inventory-tracking-system/thumb.svg',
      hero: '/images/projects/inventory-tracking-system/hero.svg',
      gallery: ['/images/projects/inventory-tracking-system/1.svg'],
      alt: 'Inventory tracking system showing stock levels and product details'
    },
    demo_url: null,
    repo_url: null,
    featured: false,
    category: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  }
];

/**
 * Get all published projects
 *
 * @param options - Query options
 * @param options.limit - Maximum number of projects to return
 * @param options.offset - Number of projects to skip
 * @param options.category - Filter by category
 * @returns Array of projects
 */
export async function getProjects(options: {
  limit?: number;
  offset?: number;
  category?: string;
} = {}): Promise<Project[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('projects')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Database not available, using fallback data');
      let result = FALLBACK_PROJECTS;
      if (options.category) {
        result = result.filter(p => p.category === options.category);
      }
      if (options.limit) {
        result = result.slice(0, options.limit);
      }
      return result;
    }

    return (data || []) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    let result = FALLBACK_PROJECTS;
    if (options.category) {
      result = result.filter(p => p.category === options.category);
    }
    if (options.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }
}

/**
 * Get a single project by slug
 *
 * @param slug - The project slug
 * @returns Project or null if not found
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single();

    if (error) {
      console.warn(`Database not available, using fallback data for slug "${slug}"`);
      return FALLBACK_PROJECTS.find(p => p.slug === slug) || null;
    }

    return data as Project | null;
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}":`, error);
    return FALLBACK_PROJECTS.find(p => p.slug === slug) || null;
  }
}

/**
 * Get featured projects
 *
 * @param limit - Maximum number of featured projects to return
 * @returns Array of featured projects
 */
export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Database not available, using fallback data:', error.code || error.message);
      // Return featured projects from fallback data
      return FALLBACK_PROJECTS.filter(p => p.featured).slice(0, limit);
    }

    if (!data || data.length === 0) {
      console.warn('No featured projects found, using fallback data');
      return FALLBACK_PROJECTS.filter(p => p.featured).slice(0, limit);
    }

    return data as Project[];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return FALLBACK_PROJECTS.filter(p => p.featured).slice(0, limit);
  }
}

/**
 * Get projects filtered by tag
 *
 * @param tag - The tag to filter by
 * @returns Array of projects with the specified tag
 */
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .not('published_at', 'is', null)
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) {
    console.error(`Error fetching projects with tag "${tag}":`, error);
    return [];
  }

  return (data || []) as Project[];
}

/**
 * Search projects by query string
 *
 * Searches in title, description, and tags
 *
 * @param query - The search query
 * @returns Array of matching projects
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const supabase = await createClient();

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .not('published_at', 'is', null)
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error(`Error searching projects for "${query}":`, error);
    return [];
  }

  const projects = (data || []) as Project[];

  // Filter by tags in JavaScript since Postgres array containment is case-sensitive
  const filteredByTags = projects.filter((project) =>
    project.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  // Combine and deduplicate
  const allResults = [...projects, ...filteredByTags];
  const uniqueResults = Array.from(
    new Map(allResults.map((project) => [project.id, project])).values()
  );

  return uniqueResults;
}

/**
 * Get all unique tags from projects
 *
 * @returns Array of unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('tags')
    .not('published_at', 'is', null);

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Extract and flatten all tags, then deduplicate
  const projects = data as Project[];
  const allTags = projects.flatMap((project) => project.tags);
  const uniqueTags = Array.from(new Set(allTags)).sort() as string[];

  return uniqueTags;
}

/**
 * Get all unique categories from projects
 *
 * @returns Array of unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .not('published_at', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Extract and deduplicate categories
  const projects = data as Project[];
  const categories = Array.from(new Set(projects.map((p) => p.category))).sort() as string[];

  return categories;
}

/**
 * Get project count by category
 *
 * @returns Record mapping category to count
 */
export async function getProjectCountByCategory(): Promise<Record<string, number>> {
  const projects = await getProjects();

  const counts: Record<string, number> = {};

  for (const project of projects) {
    counts[project.category] = (counts[project.category] || 0) + 1;
  }

  return counts;
}

/**
 * Get related projects based on category or tags
 *
 * Fetches more projects than needed and filters client-side to avoid
 * complex Supabase array queries that can fail with special characters.
 *
 * @param slug - The project slug to find related projects for
 * @param limit - Maximum number of related projects to return
 * @returns Array of related projects
 */
export async function getRelatedProjects(
  slug: string,
  limit: number = 3
): Promise<Project[]> {
  const project = await getProjectBySlug(slug);

  if (!project) {
    return [];
  }

  const supabase = await createClient();

  try {
    // Fetch more projects to allow filtering
    const fetchLimit = Math.min(limit * 3, 20); // cap at 20
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .not('published_at', 'is', null)
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(fetchLimit);

    if (error) {
      console.error(`Error fetching related projects for "${slug}":`, error.message || error);
      return [];
    }

    const allProjects = (data || []) as Project[];

    if (!project.tags || project.tags.length === 0) {
      // No tags, return projects from same category only
      return allProjects
        .filter(p => p.category === project.category)
        .slice(0, limit);
    }

    // Create lowercase tag set for case-insensitive matching
    const tagSet = new Set(project.tags.map(t => t.toLowerCase()));

    // Filter: match by category OR any tag
    const related = allProjects.filter(p => {
      // Same category match
      if (p.category === project.category) return true;

      // Tag match (case-insensitive)
      return p.tags.some(tag => tagSet.has(tag.toLowerCase()));
    });

    return related.slice(0, limit);
  } catch (err) {
    console.error(`Exception fetching related projects for "${slug}:`, err);
    return [];
  }
}

/**
 * Server Actions for project mutations (if needed for admin)
 * These should be used with proper authentication checks
 */

/**
 * Create a new project
 *
 * @param project - The project data to insert
 * @returns Created project or null
 */
export async function createProject(
  project: TablesInsert<'projects'>
): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data as Project | null;
}

/**
 * Update an existing project
 *
 * @param slug - The project slug
 * @param updates - The updates to apply
 * @returns Updated project or null
 */
export async function updateProject(
  slug: string,
  updates: ProjectUpdate
): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error updating project "${slug}":`, error);
    return null;
  }

  return data as Project | null;
}

/**
 * Delete a project
 *
 * @param slug - The project slug
 * @returns True if successful, false otherwise
 */
export async function deleteProject(slug: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from('projects').delete().eq('slug', slug);

  if (error) {
    console.error(`Error deleting project "${slug}":`, error);
    return false;
  }

  return true;
}

/**
 * Admin: Get all projects (including drafts)
 *
 * @param options - Query options
 * @returns Array of all projects
 */
export async function adminGetAllProjects(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }

  return (data || []) as Project[];
}

/**
 * Admin: Get a single project by ID
 *
 * @param id - The project ID
 * @returns Project or null if not found
 */
export async function adminGetProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching project with id "${id}":`, error);
    return null;
  }

  return data as Project | null;
}

/**
 * Admin: Publish a project
 *
 * @param slug - The project slug
 * @returns Updated project or null
 */
export async function adminPublishProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error publishing project "${slug}":`, error);
    return null;
  }

  return data as Project | null;
}

/**
 * Admin: Unpublish a project
 *
 * @param slug - The project slug
 * @returns Updated project or null
 */
export async function adminUnpublishProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({
      published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error(`Error unpublishing project "${slug}":`, error);
    return null;
  }

  return data as Project | null;
}

/**
 * Admin: Bulk delete projects
 *
 * @param slugs - Array of project slugs to delete
 * @returns Object with success flag and results
 */
export async function adminBulkDeleteProjects(slugs: string[]): Promise<{
  success: boolean;
  deleted: string[];
  failed: string[];
}> {
  const supabase = await createClient();

  const deleted: string[] = [];
  const failed: string[] = [];

  for (const slug of slugs) {
    const { error } = await supabase.from('projects').delete().eq('slug', slug);
    if (error) {
      console.error(`Error deleting project "${slug}":`, error);
      failed.push(slug);
    } else {
      deleted.push(slug);
    }
  }

  return {
    success: failed.length === 0,
    deleted,
    failed,
  };
}

/**
 * Admin: Bulk publish projects
 *
 * @param slugs - Array of project slugs to publish
 * @returns Object with success flag and results
 */
export async function adminBulkPublishProjects(slugs: string[]): Promise<{
  success: boolean;
  published: string[];
  failed: string[];
}> {
  const supabase = await createClient();

  const published: string[] = [];
  const failed: string[] = [];

  for (const slug of slugs) {
    const { error } = await supabase
      .from('projects')
      .update({
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    if (error) {
      console.error(`Error publishing project "${slug}":`, error);
      failed.push(slug);
    } else {
      published.push(slug);
    }
  }

  return {
    success: failed.length === 0,
    published,
    failed,
  };
}
