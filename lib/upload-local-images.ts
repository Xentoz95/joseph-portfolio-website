/**
 * Local Images Helper for Cloudinary Upload
 *
 * This script helps prepare and list local images for Cloudinary upload.
 * It will be used in US-003 for the actual migration.
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface LocalImage {
  project: string;
  filename: string;
  fullPath: string;
  relativePath: string;
  size: number;
  type: 'hero' | 'thumb' | 'detail';
}

export interface ProjectImages {
  project: string;
  images: LocalImage[];
  cloudinaryFolder: string;
}

/**
 * Get all project images from the public/images/projects directory
 */
export async function getLocalProjectImages(
  projectsDir: string = 'public/images/projects'
): Promise<ProjectImages[]> {
  const projects: ProjectImages[] = [];

  try {
    // Check if directory exists
    const dirExists = await fs
      .access(projectsDir)
      .then(() => true)
      .catch(() => false);

    if (!dirExists) {
      console.warn(`Projects directory not found: ${projectsDir}`);
      return projects;
    }

    // Get all project directories
    const entries = await fs.readdir(projectsDir, { withFileTypes: true });
    const projectDirs = entries.filter((entry) => entry.isDirectory());

    for (const projectDir of projectDirs) {
      const projectName = projectDir.name;
      const projectPath = path.join(projectsDir, projectName);

      // Get all images in the project directory
      const imageEntries = await fs.readdir(projectPath);
      const imageFiles = imageEntries.filter(
        (file) =>
          file.endsWith('.jpg') ||
          file.endsWith('.jpeg') ||
          file.endsWith('.png') ||
          file.endsWith('.webp') ||
          file.endsWith('.gif')
      );

      const images: LocalImage[] = [];

      for (const filename of imageFiles) {
        const fullPath = path.join(projectPath, filename);
        const relativePath = path.join(projectsDir, projectName, filename);
        const stats = await fs.stat(fullPath);

        // Classify image type
        let type: LocalImage['type'] = 'detail';
        if (filename === 'hero.jpg' || filename === 'hero.png') {
          type = 'hero';
        } else if (filename === 'thumb.jpg' || filename === 'thumb.png') {
          type = 'thumb';
        }

        images.push({
          project: projectName,
          filename,
          fullPath,
          relativePath,
          size: stats.size,
          type,
        });
      }

      projects.push({
        project: projectName,
        images,
        cloudinaryFolder: `portfolio/projects/${projectName}`,
      });
    }
  } catch (error) {
    console.error('Error reading project images:', error);
  }

  return projects;
}

/**
 * Generate Cloudinary public ID for a local image
 */
export function generateCloudinaryPublicId(
  projectName: string,
  filename: string,
  baseFolder: string = 'portfolio/projects'
): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');

  return `${baseFolder}/${projectName}/${nameWithoutExt}`;
}

/**
 * Get upload URL for Cloudinary upload widget
 */
export function generateUploadUrl(
  cloudName: string,
  uploadPreset: string,
  folder?: string
): string {
  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const params = new URLSearchParams({
    upload_preset: uploadPreset,
  });

  if (folder) {
    params.append('folder', folder);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Prepare images for batch upload
 */
export async function prepareUploadBatch(
  projectsDir: string = 'public/images/projects'
): Promise<
  {
    localPath: string;
    cloudinaryPublicId: string;
    folder: string;
    project: string;
    type: string;
  }[]
> {
  const projectImages = await getLocalProjectImages(projectsDir);
  const uploadBatch: {
    localPath: string;
    cloudinaryPublicId: string;
    folder: string;
    project: string;
    type: string;
  }[] = [];

  for (const project of projectImages) {
    for (const image of project.images) {
      uploadBatch.push({
        localPath: image.fullPath,
        cloudinaryPublicId: generateCloudinaryPublicId(
          image.project,
          image.filename
        ),
        folder: project.cloudinaryFolder,
        project: image.project,
        type: image.type,
      });
    }
  }

  return uploadBatch;
}

/**
 * Generate a summary of images to be uploaded
 */
export async function generateUploadSummary(
  projectsDir: string = 'public/images/projects'
): Promise<{
  totalProjects: number;
  totalImages: number;
  totalSize: number;
  byProject: {
    project: string;
    imageCount: number;
    totalSize: number;
    images: string[];
  }[];
}> {
  const projectImages = await getLocalProjectImages(projectsDir);

  let totalImages = 0;
  let totalSize = 0;

  const byProject = projectImages.map((project) => {
    const projectSize = project.images.reduce((sum, img) => sum + img.size, 0);
    totalImages += project.images.length;
    totalSize += projectSize;

    return {
      project: project.project,
      imageCount: project.images.length,
      totalSize: projectSize,
      images: project.images.map((img) => img.filename),
    };
  });

  return {
    totalProjects: projectImages.length,
    totalImages,
    totalSize,
    byProject,
  };
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Log upload summary to console
 */
export async function logUploadSummary(
  projectsDir: string = 'public/images/projects'
): Promise<void> {
  const summary = await generateUploadSummary(projectsDir);

  console.log('\n=== Cloudinary Upload Summary ===\n');
  console.log(`Total Projects: ${summary.totalProjects}`);
  console.log(`Total Images: ${summary.totalImages}`);
  console.log(`Total Size: ${formatBytes(summary.totalSize)}\n`);

  console.log('Projects:');
  for (const project of summary.byProject) {
    console.log(`\n  ${project.project}:`);
    console.log(`    Images: ${project.imageCount}`);
    console.log(`    Size: ${formatBytes(project.totalSize)}`);
    console.log(`    Files: ${project.images.join(', ')}`);
  }
  console.log('\n================================\n');
}

// CLI execution
if (require.main === module) {
  logUploadSummary().catch(console.error);
}
