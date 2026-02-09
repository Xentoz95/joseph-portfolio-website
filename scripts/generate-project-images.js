/**
 * Generate Project Preview Images
 *
 * This script creates professional placeholder images for projects
 * using HTML Canvas and saves them as PNG files.
 */

const fs = require('fs');
const path = require('path');

const projects = [
  { slug: 'corporate-landing-page', title: 'Corporate Landing Page', category: 'web', color: '#3B82F6' },
  { slug: 'ecommerce-dashboard', title: 'E-commerce Dashboard', category: 'dashboard', color: '#10B981' },
  { slug: 'fintech-ui-system', title: 'Fintech UI System', category: 'design', color: '#EC4899' },
  { slug: 'access-control-system', title: 'Access Control System', category: 'web', color: '#3B82F6' },
  { slug: 'hr-management-system', title: 'HR Management System', category: 'system', color: '#8B5CF6' },
  { slug: 'inventory-tracking-system', title: 'Inventory Tracking System', category: 'system', color: '#8B5CF6' },
];

// Create a simple SVG for each project
function createProjectSVG(project, type = 'thumb') {
  const widths = { thumb: 400, hero: 1200, gallery: 800 };
  const heights = { thumb: 300, hero: 630, gallery: 600 };
  const width = widths[type] || widths.thumb;
  const height = heights[type] || heights.thumb;

  const fontSize = type === 'hero' ? 48 : type === 'gallery' ? 36 : 24;
  const categorySize = type === 'hero' ? 28 : type === 'gallery' ? 20 : 14;
  const padding = type === 'hero' ? 80 : type === 'gallery' ? 60 : 40;

  // Gradient background
  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${project.color};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${project.color};stop-opacity:0.6" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${gradientId})"/>

  <!-- Pattern overlay -->
  <rect width="${width}" height="${height}" fill="rgba(255,255,255,0.05)"/>
  <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.3}" fill="rgba(255,255,255,0.1)"/>
  <circle cx="${width * 0.1}" cy="${height * 0.8}" r="${Math.min(width, height) * 0.2}" fill="rgba(255,255,255,0.08)"/>

  <!-- Project title -->
  <text x="50%" y="${padding + fontSize}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">
    ${project.title}
  </text>

  <!-- Category badge -->
  <rect x="${width/2 - 60}" y="${padding + fontSize + 20}" width="120" height="${categorySize + 16}" rx="20" fill="rgba(255,255,255,0.3)"/>
  <text x="50%" y="${padding + fontSize + 20 + categorySize + 4}" font-family="Arial, sans-serif" font-size="${categorySize}" font-weight="600" fill="white" text-anchor="middle">
    ${project.category.toUpperCase()}
  </text>

  <!-- Decorative elements -->
  <rect x="${padding}" y="${height - padding - 4}" width="${width - padding * 2}" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
  <rect x="${padding}" y="${height - padding - 4}" width="${(width - padding * 2) * 0.7}" height="4" rx="2" fill="white"/>
</svg>`;
}

// Generate images for each project
const baseDir = path.join(__dirname, '..', 'public', 'images', 'projects');

projects.forEach(project => {
  const projectDir = path.join(baseDir, project.slug);

  // Create directory if it doesn't exist
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Generate thumbnail
  const thumbSvg = createProjectSVG(project, 'thumb');
  fs.writeFileSync(path.join(projectDir, 'thumb.svg'), thumbSvg);

  // Generate hero
  const heroSvg = createProjectSVG(project, 'hero');
  fs.writeFileSync(path.join(projectDir, 'hero.svg'), heroSvg);

  // Generate gallery images
  const gallery1Svg = createProjectSVG(project, 'gallery');
  fs.writeFileSync(path.join(projectDir, '1.svg'), gallery1Svg);

  // Some projects have a second gallery image
  if (['ecommerce-dashboard', 'fintech-ui-system'].includes(project.slug)) {
    fs.writeFileSync(path.join(projectDir, '2.svg'), gallery1Svg);
  }

  console.log(`Generated images for: ${project.title}`);
});

console.log('Done! Project preview images have been generated.');
