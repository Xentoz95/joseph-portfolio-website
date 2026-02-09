# Project Images Inventory

This document catalogs all existing project images stored in `public/images/projects/` that will be migrated to Cloudinary.

## Overview

- **Total Projects**: 6
- **Total Images**: 22
- **Destination Cloudinary Folder**: `portfolio/projects`

## Project Categories

### 1. Access Control System
- **Path**: `public/images/projects/access-control-system/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - Additional project screenshot
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/access-control-system/hero`
  - `portfolio/projects/access-control-system/thumb`
  - `portfolio/projects/access-control-system/1`

### 2. Corporate Landing Page
- **Path**: `public/images/projects/corporate-landing-page/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - Additional project screenshot
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/corporate-landing-page/hero`
  - `portfolio/projects/corporate-landing-page/thumb`
  - `portfolio/projects/corporate-landing-page/1`

### 3. E-commerce Dashboard
- **Path**: `public/images/projects/ecommerce-dashboard/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - Dashboard screenshot 1
  - `2.jpg` - Dashboard screenshot 2
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/ecommerce-dashboard/hero`
  - `portfolio/projects/ecommerce-dashboard/thumb`
  - `portfolio/projects/ecommerce-dashboard/1`
  - `portfolio/projects/ecommerce-dashboard/2`

### 4. Fintech UI System
- **Path**: `public/images/projects/fintech-ui-system/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - UI component screenshot
  - `2.jpg` - UI component screenshot
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/fintech-ui-system/hero`
  - `portfolio/projects/fintech-ui-system/thumb`
  - `portfolio/projects/fintech-ui-system/1`
  - `portfolio/projects/fintech-ui-system/2`

### 5. HR Management System
- **Path**: `public/images/projects/hr-management-system/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - Additional project screenshot
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/hr-management-system/hero`
  - `portfolio/projects/hr-management-system/thumb`
  - `portfolio/projects/hr-management-system/1`

### 6. Inventory Tracking System
- **Path**: `public/images/projects/inventory-tracking-system/`
- **Images**:
  - `hero.jpg` - Project hero/featured image
  - `thumb.jpg` - Thumbnail for gallery view
  - `1.jpg` - Additional project screenshot
- **Proposed Cloudinary Public IDs**:
  - `portfolio/projects/inventory-tracking-system/hero`
  - `portfolio/projects/inventory-tracking-system/thumb`
  - `portfolio/projects/inventory-tracking-system/1`

## Image Type Classification

### Hero Images (6)
Used for project detail pages and Open Graph sharing.
- Recommended transformation: 1200x630, quality 90
- Format: auto (WebP/AVIF with fallback)

### Thumbnail Images (6)
Used for project gallery cards and previews.
- Recommended transformation: 400x300, quality 80
- Format: auto (WebP/AVIF with fallback)

### Detail Screenshots (10)
Additional screenshots showing project details.
- Recommended transformation: 800x600, quality 85
- Format: auto (WebP/AVIF with fallback)

## Migration Strategy

### Phase 1: Upload to Cloudinary
- Use the upload helper script (`lib/upload-local-images.ts`)
- Upload all images to `portfolio/projects/` folder
- Organize by project category

### Phase 2: Update Database References
- Update project records in Supabase
- Replace local paths with Cloudinary public IDs
- Store both `heroImage` and `galleryImages` as arrays

### Phase 3: Remove Local Files
- After verifying Cloudinary delivery
- Keep backup for 30 days
- Remove from `public/images/projects/`

## Cloudinary Folder Structure

```
portfolio/
└── projects/
    ├── access-control-system/
    │   ├── hero
    │   ├── thumb
    │   └── 1
    ├── corporate-landing-page/
    │   ├── hero
    │   ├── thumb
    │   └── 1
    ├── ecommerce-dashboard/
    │   ├── hero
    │   ├── thumb
    │   ├── 1
    │   └── 2
    ├── fintech-ui-system/
    │   ├── hero
    │   ├── thumb
    │   ├── 1
    │   └── 2
    ├── hr-management-system/
    │   ├── hero
    │   ├── thumb
    │   └── 1
    └── inventory-tracking-system/
        ├── hero
        ├── thumb
        └── 1
```

## Notes

- All images are in JPG format
- Local images should be kept until migration is complete
- Cloudinary will automatically create WebP and AVIF versions
- Use `CldImage` component from `next-cloudinary` for optimal delivery
- Set up responsive breakpoints for different screen sizes

## Next Steps

1. Upload images using the helper script (US-003)
2. Update project data structure in Supabase
3. Replace local image references with Cloudinary components
4. Test image delivery and optimization
5. Remove local files after verification
