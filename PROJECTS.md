# Portfolio Website - Project Management Guide

## Overview
This portfolio website now uses a centralized data structure, making it easy to add new projects without editing component logic.

## Project Structure

```
├── data/
│   ├── index.ts         # Central exports
│   ├── projects.ts      # Project data
│   ├── skills.ts        # Skills data
│   ├── services.ts      # Services data
│   ├── about.ts         # About & contact info
│   └── metadata.ts      # Site metadata
├── types/
│   └── index.ts         # TypeScript type definitions
├── components/
│   └── project/
│       ├── ProjectCard.tsx   # Reusable project card
│       └── ProjectGrid.tsx   # Grid with category filtering
└── public/
    └── images/
        └── projects/    # Organized by project slug
            ├── ecommerce-dashboard/
            ├── hr-management-system/
            └── ...
```

## How to Add a New Project

### 1. Add Images
Create a folder for your project images:
```
public/images/projects/[project-slug]/
├── thumb.jpg   (400x300 recommended for thumbnail)
├── hero.jpg    (1200x800 recommended for hero)
└── 1.jpg, 2.jpg... (gallery images, optional)
```

### 2. Add Project Entry
Edit `data/projects.ts` and add a new entry to the `projects` array:

```typescript
{
  id: 'unique-id',
  slug: 'project-slug',          // Must match folder name
  title: 'Project Title',
  description: 'Short description (1-2 sentences)',
  longDescription: 'Optional longer description',
  category: 'web',               // web | system | dashboard | design | mobile
  tags: ['React', 'Next.js', 'TypeScript'],
  images: {
    thumbnail: '/images/projects/project-slug/thumb.jpg',
    hero: '/images/projects/project-slug/hero.jpg',
    gallery: ['/images/projects/project-slug/1.jpg'], // optional
    alt: 'Accessible description',
  },
  links: {
    liveDemo: 'https://example.com',    // optional
    github: 'https://github.com/...',    // optional
    caseStudy: '/blog/project-slug',     // optional
  },
  client: 'Client Name',           // optional
  year: 2024,                      // optional
  featured: true,                  // optional - highlights project
},
```

### 3. Validate
Run the validation script to ensure all images exist:
```bash
pnpm run validate-data
```

### 4. Deploy
Commit and deploy your changes. No component editing needed!

## Available Categories

- `web` - Web applications and websites
- `system` - Business systems and databases
- `dashboard` - Analytics dashboards
- `design` - UI/UX design work
- `mobile` - Mobile applications

## Project Colors
Each category has its own color scheme:
- **Web**: Blue
- **System**: Purple
- **Dashboard**: Green
- **Design**: Pink
- **Mobile**: Orange

## Helper Functions

The project data exports several helper functions:

```typescript
import { getProjectsByCategory, getFeaturedProjects, getProjectBySlug } from '@/data';

// Get all projects
import { projects } from '@/data';

// Filter by category
const webProjects = getProjectsByCategory('web');

// Get featured projects only
const featured = getFeaturedProjects();

// Find project by slug
const project = getProjectBySlug('ecommerce-dashboard');
```

## Validation Script

The `pnpm run validate-data` command checks:
- Project image folders exist
- Thumbnail images are present
- Hero images are present (if specified)
- Gallery images are present (if specified)

Run this before deploying to catch missing assets.

## Image Optimization

Next.js automatically optimizes images in WebP and AVIF formats. Just use the `<Image />` component from `next/image` and Next.js handles the rest.

## Performance Tips

1. **Image sizes**: Keep thumbnails under 100KB, hero images under 500KB
2. **Formats**: Use JPG for photos, PNG for graphics with transparency
3. **Lazy loading**: Next.js Image component handles this automatically
4. **Alt text**: Always provide descriptive alt text for accessibility
