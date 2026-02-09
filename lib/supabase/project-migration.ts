/**
 * Project Migration Helper
 *
 * This file documents the existing project structure for migration to Supabase.
 * The current projects are stored in public/images/projects/ with the following structure:
 *
 * Existing Projects:
 * 1. access-control-system
 *    - thumb.jpg (thumbnail)
 *    - hero.jpg (hero image)
 *    - 1.jpg (gallery image)
 *
 * 2. corporate-landing-page
 *    - thumb.jpg
 *    - hero.jpg
 *    - 1.jpg
 *
 * 3. ecommerce-dashboard
 *    - thumb.jpg
 *    - hero.jpg
 *    - 1.jpg
 *    - 2.jpg
 *
 * 4. fintech-ui-system
 *    - thumb.jpg
 *    - hero.jpg
 *    - 1.jpg
 *    - 2.jpg
 *
 * 5. hr-management-system
 *    - thumb.jpg
 *    - hero.jpg
 *    - 1.jpg
 *
 * 6. inventory-tracking-system
 *    - thumb.jpg
 *    - hero.jpg
 *    - 1.jpg
 *
 * Migration Plan (US-002 - Cloudinary Integration):
 * 1. Upload these images to Cloudinary
 * 2. Update database records with Cloudinary URLs
 * 3. Replace local paths with Cloudinary URLs
 *
 * Database images structure:
 * {
 *   thumbnail: "cloudinary_url or /local/path",
 *   hero: "cloudinary_url or /local/path",
 *   gallery: ["cloudinary_url1", "cloudinary_url2", ...],
 *   alt: "Project description for accessibility"
 * }
 */

import { ProjectInsert, ProjectCategory } from '@/types/database'

export interface LocalProjectData {
  slug: string
  title: string
  description: string
  category: string | ProjectCategory
  tags: string[]
  images: {
    thumbnail: string | null
    hero: string | null
    gallery: string[]
    alt: string
  }
  demo_url?: string
  repo_url?: string
  featured?: boolean
}

/**
 * Existing projects ready for database insertion
 * These will be migrated to use Cloudinary URLs in US-002
 */
export const existingProjects: Omit<ProjectInsert, 'published_at'>[] = [
  {
    title: 'Access Control System',
    description: 'A comprehensive access control and security management system with role-based permissions, user authentication, and audit logging capabilities.',
    slug: 'access-control-system',
    tags: ['Security', 'Authentication', 'React', 'TypeScript'],
    images: {
      thumbnail: '/images/projects/access-control-system/thumb.jpg',
      hero: '/images/projects/access-control-system/hero.jpg',
      gallery: ['/images/projects/access-control-system/1.jpg'],
      alt: 'Access Control System interface showing user permissions and security settings'
    },
    category: 'web' as ProjectCategory,
    featured: false,
    demo_url: null,
    repo_url: null
  },
  {
    title: 'Corporate Landing Page',
    description: 'Modern, responsive corporate landing page with smooth animations, contact forms, and conversion-optimized design.',
    slug: 'corporate-landing-page',
    tags: ['Landing Page', 'Responsive', 'Next.js', 'Tailwind CSS'],
    images: {
      thumbnail: '/images/projects/corporate-landing-page/thumb.jpg',
      hero: '/images/projects/corporate-landing-page/hero.jpg',
      gallery: ['/images/projects/corporate-landing-page/1.jpg'],
      alt: 'Corporate landing page hero section with call-to-action'
    },
    category: 'web' as ProjectCategory,
    featured: true,
    demo_url: null,
    repo_url: null
  },
  {
    title: 'E-commerce Dashboard',
    description: 'Full-featured e-commerce admin dashboard with inventory management, sales analytics, order tracking, and customer insights.',
    slug: 'ecommerce-dashboard',
    tags: ['Dashboard', 'E-commerce', 'Analytics', 'Charts'],
    images: {
      thumbnail: '/images/projects/ecommerce-dashboard/thumb.jpg',
      hero: '/images/projects/ecommerce-dashboard/hero.jpg',
      gallery: [
        '/images/projects/ecommerce-dashboard/1.jpg',
        '/images/projects/ecommerce-dashboard/2.jpg'
      ],
      alt: 'E-commerce dashboard showing sales charts and inventory metrics'
    },
    category: 'dashboard' as ProjectCategory,
    featured: true,
    demo_url: null,
    repo_url: null
  },
  {
    title: 'Fintech UI System',
    description: 'Comprehensive fintech user interface system with reusable components, dark mode support, and banking-grade security features.',
    slug: 'fintech-ui-system',
    tags: ['Fintech', 'UI Components', 'Design System', 'TypeScript'],
    images: {
      thumbnail: '/images/projects/fintech-ui-system/thumb.jpg',
      hero: '/images/projects/fintech-ui-system/hero.jpg',
      gallery: [
        '/images/projects/fintech-ui-system/1.jpg',
        '/images/projects/fintech-ui-system/2.jpg'
      ],
      alt: 'Fintech UI system showing dashboard and transaction components'
    },
    category: 'design' as ProjectCategory,
    featured: true,
    demo_url: null,
    repo_url: null
  },
  {
    title: 'HR Management System',
    description: 'Human resources management platform with employee records, leave management, payroll processing, and performance tracking.',
    slug: 'hr-management-system',
    tags: ['HR', 'Management', 'Payroll', 'Analytics'],
    images: {
      thumbnail: '/images/projects/hr-management-system/thumb.jpg',
      hero: '/images/projects/hr-management-system/hero.jpg',
      gallery: ['/images/projects/hr-management-system/1.jpg'],
      alt: 'HR management system showing employee dashboard and records'
    },
    category: 'system' as ProjectCategory,
    featured: false,
    demo_url: null,
    repo_url: null
  },
  {
    title: 'Inventory Tracking System',
    description: 'Real-time inventory tracking system with barcode scanning, stock alerts, supplier management, and warehouse optimization.',
    slug: 'inventory-tracking-system',
    tags: ['Inventory', 'Tracking', 'Management', 'Real-time'],
    images: {
      thumbnail: '/images/projects/inventory-tracking-system/thumb.jpg',
      hero: '/images/projects/inventory-tracking-system/hero.jpg',
      gallery: ['/images/projects/inventory-tracking-system/1.jpg'],
      alt: 'Inventory tracking system showing stock levels and product details'
    },
    category: 'system' as ProjectCategory,
    featured: false,
    demo_url: null,
    repo_url: null
  }
]

/**
 * Helper function to get local image paths for a project
 * This will be replaced with Cloudinary URLs in US-002
 */
export function getLocalProjectImages(slug: string): {
  thumbnail: string | null
  hero: string | null
  gallery: string[]
  alt: string
} | null {
  const project = existingProjects.find(p => p.slug === slug)
  return project ? project.images : null
}

/**
 * Helper to generate the images object for database insertion
 * Currently uses local paths, will be updated for Cloudinary
 */
export function generateProjectImages(
  slug: string,
  thumbnail: string,
  hero: string,
  gallery: string[],
  alt: string
) {
  return {
    thumbnail: `/images/projects/${slug}/${thumbnail}` as string | null,
    hero: `/images/projects/${slug}/${hero}` as string | null,
    gallery: gallery.map(img => `/images/projects/${slug}/${img}`),
    alt
  }
}
