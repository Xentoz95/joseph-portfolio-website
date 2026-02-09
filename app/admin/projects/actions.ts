'use server';

/**
 * Admin Projects Server Actions
 *
 * Server actions for the admin projects page
 * These allow client components to interact with the database
 */

import {
  adminGetAllProjects,
  adminGetProjectById,
  createProject,
  updateProject,
  deleteProject,
  adminPublishProject,
  adminUnpublishProject,
  adminBulkDeleteProjects,
  adminBulkPublishProjects,
} from '@/lib/supabase/projects';
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/database';

/**
 * Get all projects (including drafts)
 */
export async function adminGetProjects(options: {
  limit?: number;
  offset?: number;
} = {}): Promise<Project[]> {
  return await adminGetAllProjects(options);
}

/**
 * Get a single project by ID
 */
export async function adminGetProjectByIdAction(id: string): Promise<Project | null> {
  return await adminGetProjectById(id);
}

/**
 * Create a new project
 */
export async function adminCreateProject(
  project: ProjectInsert
): Promise<Project | null> {
  return await createProject(project);
}

/**
 * Update an existing project
 */
export async function adminUpdateProject(
  id: string,
  updates: ProjectUpdate
): Promise<Project | null> {
  const project = await adminGetProjectById(id);
  if (!project) {
    return null;
  }

  return await updateProject(project.slug, updates);
}

/**
 * Delete a project
 */
export async function adminDeleteProjectAction(id: string): Promise<boolean> {
  const project = await adminGetProjectById(id);
  if (!project) {
    return false;
  }

  return await deleteProject(project.slug);
}

/**
 * Publish a project
 */
export async function adminPublishProjectAction(id: string): Promise<Project | null> {
  const project = await adminGetProjectById(id);
  if (!project) {
    return null;
  }

  return await adminPublishProject(project.slug);
}

/**
 * Unpublish a project
 */
export async function adminUnpublishProjectAction(id: string): Promise<Project | null> {
  const project = await adminGetProjectById(id);
  if (!project) {
    return null;
  }

  return await adminUnpublishProject(project.slug);
}

/**
 * Bulk delete projects
 */
export async function adminBulkDeleteProjectsAction(ids: string[]): Promise<{
  success: boolean;
  deleted: string[];
  failed: string[];
}> {
  const projects = await Promise.all(
    ids.map((id) => adminGetProjectById(id))
  );

  const slugs = projects
    .filter((p): p is Project => p !== null)
    .map((p) => p.slug);

  return await adminBulkDeleteProjects(slugs);
}

/**
 * Bulk publish projects
 */
export async function adminBulkPublishProjectsAction(ids: string[]): Promise<{
  success: boolean;
  published: string[];
  failed: string[];
}> {
  const projects = await Promise.all(
    ids.map((id) => adminGetProjectById(id))
  );

  const slugs = projects
    .filter((p): p is Project => p !== null)
    .map((p) => p.slug);

  return await adminBulkPublishProjects(slugs);
}
