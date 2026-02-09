#!/usr/bin/env node

/**
 * Validation script to check for missing project images
 * Run with: npx tsx scripts/validate-data.ts
 */

import { projects } from '../data/projects';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const errors: string[] = [];
const warnings: string[] = [];

console.log('🔍 Validating project data...\n');

// Check if project image folders exist
projects.forEach((project) => {
  const projectDir = join(publicDir, 'images', 'projects', project.slug);

  if (!existsSync(projectDir)) {
    errors.push(`❌ Missing folder: /images/projects/${project.slug}`);
    return;
  }

  // Check for thumbnail
  const thumbnailPath = join(publicDir, project.images.thumbnail);
  if (!existsSync(thumbnailPath)) {
    errors.push(`❌ Missing thumbnail for ${project.title}: ${project.images.thumbnail}`);
  }

  // Check for hero if specified
  if (project.images.hero) {
    const heroPath = join(publicDir, project.images.hero);
    if (!existsSync(heroPath)) {
      warnings.push(`⚠️  Missing hero for ${project.title}: ${project.images.hero}`);
    }
  }

  // Check gallery images
  if (project.images.gallery) {
    project.images.gallery.forEach((img, idx) => {
      const galleryPath = join(publicDir, img);
      if (!existsSync(galleryPath)) {
        warnings.push(`⚠️  Missing gallery image ${idx + 1} for ${project.title}: ${img}`);
      }
    });
  }
});

// Print results
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validation checks passed!\n');
  console.log(`📊 Found ${projects.length} projects with valid image references.`);
} else {
  console.log('\n📋 Validation Results:\n');

  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach((err) => console.log(`  ${err}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach((warn) => console.log(`  ${warn}`));
  }

  console.log('\n💡 To add images for a project:');
  console.log('   1. Create folder: public/images/projects/[project-slug]/');
  console.log('   2. Add images: thumb.jpg, hero.jpg, 1.jpg, 2.jpg...');
  console.log('   3. Update data/projects.ts with correct paths\n');
}
