/**
 * Migration Script: Projects from Local Data to Supabase + Cloudinary
 *
 * This script:
 * 1. Reads project data from data/projects.ts
 * 2. Uploads all local project images to Cloudinary
 * 3. Inserts projects into Supabase database
 * 4. Returns summary of migration
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { projects } from '../data/projects';
import type { ProjectImages, ProjectInsert } from '../types/database';

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');

    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Could not load .env.local file:', error);
  }
}

// Load environment variables
loadEnvFile();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables');
}
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary environment variables');
}

// Initialize Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Initialize Supabase client with service role for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Migration configuration
const PROJECTS_TO_MIGRATE = [
  'ecommerce-dashboard',
  'hr-management-system',
  'corporate-landing-page',
  'inventory-tracking-system',
  'fintech-ui-system',
  'access-control-system',
];

interface MigrationResult {
  uploadedImages: number;
  insertedProjects: number;
  skippedProjects: number;
  errors: string[];
  imageMap: Map<string, string>;
}

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(
  localPath: string,
  publicId: string
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      folder: 'projects',
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return result.public_id;
  } catch (error) {
    console.error(`Failed to upload ${localPath}:`, error);
    return null;
  }
}

/**
 * Upload all images for a project
 */
async function uploadProjectImages(
  projectSlug: string,
  images: ProjectImages
): Promise<ProjectImages> {
  const publicDir = join(process.cwd(), 'public');
  const imageMap = new Map<string, string>();
  const uploadedImages: string[] = [];

  // Helper to upload and track
  const uploadAndTrack = async (
    imagePath: string | null | undefined,
    imageType: string
  ): Promise<string | null> => {
    if (!imagePath) return null;

    // If already a URL (already uploaded), return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const fullPath = join(publicDir, imagePath);
    if (!existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return null;
    }

    // Generate Cloudinary public ID
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/^[^/]+\//, '');
    const publicId = `projects/${projectSlug}/${cleanPath.replace(/\.[^.]+$/, '')}`;

    const uploadedId = await uploadImage(fullPath, publicId);
    if (uploadedId) {
      uploadedImages.push(uploadedId);
      imageMap.set(imagePath, uploadedId);
    }

    return uploadedId;
  };

  // Upload thumbnail
  const thumbnail = await uploadAndTrack(images.thumbnail, 'thumbnail');

  // Upload hero
  const hero = await uploadAndTrack(images.hero, 'hero');

  // Upload gallery images
  const gallery: string[] = [];
  if (images.gallery && images.gallery.length > 0) {
    for (const galleryImage of images.gallery) {
      const uploaded = await uploadAndTrack(galleryImage, 'gallery');
      if (uploaded) {
        gallery.push(uploaded);
      }
    }
  }

  return {
    thumbnail,
    hero,
    gallery,
    alt: images.alt,
  };
}

/**
 * Convert local Project to database ProjectInsert
 */
function convertToDbProject(
  localProject: typeof projects[0],
  uploadedImages: ProjectImages
): ProjectInsert {
  return {
    id: localProject.id,
    title: localProject.title,
    description: localProject.description,
    slug: localProject.slug,
    tags: localProject.tags,
    images: uploadedImages,
    demo_url: localProject.links?.liveDemo || null,
    repo_url: localProject.links?.github || null,
    featured: localProject.featured || false,
    category: localProject.category,
    published_at: new Date().toISOString(),
  };
}

/**
 * Main migration function
 */
async function migrate(): Promise<MigrationResult> {
  console.log('=== Starting Project Migration ===\n');

  const result: MigrationResult = {
    uploadedImages: 0,
    insertedProjects: 0,
    skippedProjects: 0,
    errors: [],
    imageMap: new Map(),
  };

  // Filter projects to migrate
  const projectsToMigrate = projects.filter((p) =>
    PROJECTS_TO_MIGRATE.includes(p.slug)
  );

  console.log(`Found ${projectsToMigrate.length} projects to migrate\n`);

  // Process each project
  for (const project of projectsToMigrate) {
    console.log(`\n--- Processing: ${project.title} (${project.slug}) ---`);

    try {
      // Check if project already exists
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', project.slug)
        .single();

      if (existing) {
        console.log(`  Skipping: Project already exists in database`);
        result.skippedProjects++;
        continue;
      }

      // Upload images
      console.log('  Uploading images...');
      const uploadedImages = await uploadProjectImages(
        project.slug,
        project.images as ProjectImages
      );

      const imageCount = [
        uploadedImages.thumbnail,
        uploadedImages.hero,
        ...uploadedImages.gallery,
      ].filter(Boolean).length;
      result.uploadedImages += imageCount;
      console.log(`  Uploaded ${imageCount} images`);

      // Convert to database format
      const dbProject = convertToDbProject(project, uploadedImages);

      // Insert into database
      console.log('  Inserting into database...');
      const { error: insertError } = await supabase
        .from('projects')
        .insert(dbProject);

      if (insertError) {
        throw new Error(`Failed to insert project: ${insertError.message}`);
      }

      result.insertedProjects++;
      console.log(`  Successfully migrated ${project.title}`);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`${project.slug}: ${message}`);
      console.error(`  Error: ${message}`);
    }
  }

  return result;
}

/**
 * Display migration results
 */
function displayResults(result: MigrationResult): void {
  console.log('\n=== Migration Results ===');
  console.log(`Projects inserted: ${result.insertedProjects}`);
  console.log(`Projects skipped: ${result.skippedProjects}`);
  console.log(`Images uploaded: ${result.uploadedImages}`);

  if (result.errors.length > 0) {
    console.log('\n=== Errors ===');
    result.errors.forEach((error) => console.error(`  - ${error}`));
  }

  console.log('\n=== Image Map ===');
  result.imageMap.forEach((cloudinaryId, localPath) => {
    console.log(`  ${localPath} -> ${cloudinaryId}`);
  });

  console.log('\n=== Migration Complete ===');
}

/**
 * Run the migration
 */
async function main(): Promise<void> {
  try {
    const result = await migrate();
    displayResults(result);

    // Exit with error code if there were errors
    if (result.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { migrate, displayResults };
export type { MigrationResult };
