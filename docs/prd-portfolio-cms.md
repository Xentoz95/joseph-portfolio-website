---
project: Portfolio CMS
branchName: flow/portfolio-cms
description: Full-featured portfolio website with Supabase backend, Cloudinary media hosting, and Firebase analytics
availableMCPs:
  - supabase
  - chrome-devtools
  - web-search-prime
---

# Portfolio CMS

## Overview

A comprehensive portfolio website with a headless CMS backend powered by Supabase, media hosting via Cloudinary, and visitor analytics through Firebase. This system allows dynamic management of projects, blog posts, and contact form submissions while providing professional presentation of work with optimized media delivery.

## Technical Approach

**Stack:**
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend/Database:** Supabase (PostgreSQL with real-time subscriptions)
- **Auth:** Supabase Auth (optional admin authentication)
- **Media:** Cloudinary (image optimization, transformations, delivery)
- **Analytics:** Firebase Analytics (G-7JKKPGB41D)
- **State:** React Server Components + Client Components
- **Forms:** React Hook Form + Zod validation

**Architecture:**
- Server-side rendering with Next.js App Router
- Supabase client for data fetching (RSC pattern)
- Cloudinary upload widget for media management
- Optimistic UI updates with real-time subscriptions
- SEO-optimized with dynamic metadata

## Context from Existing Features

**Initial Project Structure:**
- This is a fresh Next.js project with shadcn/ui components
- Existing structure includes app/, components/, data/, hooks/, lib/, types/
- Radix UI components already configured
- Tailwind CSS v4 with custom animations

### Lessons Learned (From Initial Setup)
- Project uses pnpm as package manager
- Vercel Analytics already integrated
- @react-three/fiber suggests potential for 3D elements in portfolio

## Related Features

**No existing PRDs found - this is the initial feature.**

Future potential features that may depend on this:
- **admin-dashboard**: For content management (depends on portfolio-cms)
- **blog-system**: Extended blogging functionality (depends on portfolio-cms)
- **comments-system**: User engagement (depends on portfolio-cms)

## User Stories

### US-001: Supabase Database Schema & Client Setup

**Priority:** 1
**Maven Steps:** [1, 2, 7]
**MCP Tools:** `{ step2: ["supabase"], step7: ["supabase"] }`

**Description:**
As a developer, I want to set up the Supabase database schema and client configuration so that the portfolio can store and retrieve dynamic content.

**Acceptance Criteria:**
- Create `.env.local` file with Supabase credentials (project ID: njcggtsozmjhvladuznw)
- Set up Supabase client in `lib/supabase/client.ts` for client components
- Set up Supabase server client in `lib/supabase/server.ts` for RSC
- Create database tables:
  - `projects` (id, title, description, slug, tags, images, demo_url, repo_url, featured, created_at, updated_at, published_at)
  - `posts` (id, title, slug, content, excerpt, cover_image, tags, published, created_at, updated_at, published_at)
  - `contacts` (id, name, email, message, created_at, read)
- Enable Row Level Security (RLS) policies
- Create TypeScript types from database schema

---

### US-002: Cloudinary Media Integration

**Priority:** 2
**Maven Steps:** [1, 2, 9]
**MCP Tools:** `{}`

**Description:**
As a content creator, I want to upload and manage images through Cloudinary so that media is optimized and delivered efficiently.

**Acceptance Criteria:**
- Add Cloudinary credentials to `.env.local` (cloud_name: dszboz3se, api_key: 293868987781493)
- Install `next-cloudinary` package
- Configure Cloudinary in `lib/cloudinary.ts`
- Create `components/media-upload.tsx` with Cloudinary upload widget
- Implement image optimization component `components/optimized-image.tsx`
- Add helper functions for image transformations (resize, crop, format)
- Test image upload and delivery

---

### US-003: Dynamic Projects Display

**Priority:** 3
**Maven Steps:** [1, 3, 5, 7]
**MCP Tools:** `{ step7: ["supabase"] }`

**Description:**
As a visitor, I want to browse projects dynamically loaded from the database so that new projects can be added without code changes.

**Acceptance Criteria:**
- Create `app/projects/page.tsx` listing all projects
- Create `app/projects/[slug]/page.tsx` for individual project pages
- Fetch projects from Supabase in server components
- Implement filtering by tags
- Add search functionality
- Display project images from Cloudinary
- Implement pagination or infinite scroll for many projects
- Add "featured" section on homepage
- SEO metadata for each project page

---

### US-004: Blog System with Markdown Support

**Priority:** 4
**Maven Steps:** [1, 3, 5, 7]
**MCP Tools:** `{ step7: ["supabase"] }`

**Description:**
As a visitor, I want to read blog posts stored in the database so that content can be managed dynamically.

**Acceptance Criteria:**
- Create `app/blog/page.tsx` listing all published posts
- Create `app/blog/[slug]/page.tsx` for individual posts
- Store post content as Markdown in Supabase
- Implement Markdown rendering with syntax highlighting
- Add reading time calculation
- Display cover images from Cloudinary
- Implement tag filtering
- Add related posts section
- SEO metadata for blog posts
- RSS feed generation

---

### US-005: Contact Form with Database Storage

**Priority:** 5
**Maven Steps:** [1, 3, 5, 7, 10]
**MCP Tools:** `{ step7: ["supabase"] }`

**Description:**
As a visitor, I want to submit a contact form so that I can reach out to the portfolio owner.

**Acceptance Criteria:**
- Create contact form component with validation (Zod schema)
- Store submissions in Supabase `contacts` table
- Implement rate limiting to prevent spam
- Add success/error feedback with toast notifications
- Create admin view to read contact submissions (optional authentication)
- Email notification for new submissions (optional)
- CSRF protection
- Sanitize input to prevent XSS

---

### US-006: Firebase Analytics Integration

**Priority:** 6
**Maven Steps:** [1, 2, 9]
**MCP Tools:** `{}`

**Description:**
As a site owner, I want to track visitor behavior through Firebase Analytics so that I can understand user engagement.

**Acceptance Criteria:**
- Install Firebase SDK (`firebase`, `@firebase/analytics`)
- Add Firebase config to `.env.local` (measurementId: G-7JKKPGB41D)
- Initialize Firebase in `lib/firebase.ts`
- Add page view tracking
- Track custom events:
  - Project clicks
  - Blog post views
  - Contact form submissions
  - External link clicks
- Track search queries
- Implement consent banner for GDPR compliance

---

### US-007: Real-time Content Updates

**Priority:** 7
**Maven Steps:** [1, 7, 9]
**MCP Tools:** `{ step7: ["supabase"] }`

**Description:**
As a content manager, I want to see content updates immediately without refreshing so that I can preview changes in real-time.

**Acceptance Criteria:**
- Enable Supabase real-time on `projects` and `posts` tables
- Implement real-time subscriptions for project list
- Implement real-time subscriptions for blog list
- Add optimistic UI updates
- Show "content updated" indicator
- Handle connection states
- Debounce rapid updates

---

### US-008: SEO Optimization & Metadata

**Priority:** 8
**Maven Steps:** [1, 3]
**MCP Tools:** `{}`

**Description:**
As a site owner, I want proper SEO so that the portfolio ranks well in search engines.

**Acceptance Criteria:**
- Dynamic metadata for all pages
- Open Graph tags for social sharing
- Twitter Card meta tags
- Structured data (JSON-LD) for:
  - Project pages
  - Blog posts
  - Profile/schema.org
- Generate dynamic sitemap
- Generate robots.txt
- Add canonical URLs
- Implement breadcrumb navigation

---

### US-009: Content Management Interface (Optional Admin)

**Priority:** 9
**Maven Steps:** [1, 3, 5, 7, 8]
**MCP Tools:** `{ step7: ["supabase"], step8: ["supabase"] }`

**Description:**
As an admin, I want a simple interface to manage content so that I don't need to use the Supabase dashboard directly.

**Acceptance Criteria:**
- Create admin layout at `app/admin/layout.tsx`
- Implement password protection (environment variable)
- Create project CRUD interface
- Create post CRUD interface with Markdown editor
- Add image upload integration with Cloudinary
- Implement draft/published status
- Add bulk actions (delete, publish)
- Content preview mode

---

## Implementation Notes

**Environment Variables Required:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://njcggtsozmjhvladuznw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dszboz3se
NEXT_PUBLIC_CLOUDINARY_API_KEY=293868987781493
CLOUDINARY_API_SECRET=yR2CRM9kzXh75wXWRrWyhskOsMg

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA_lTfgWeEAEgsHm2mgikLn11F4o00IlXk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-portfolio-df483.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-portfolio-df483
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7JKKPGB41D

# Admin (optional)
ADMIN_PASSWORD_HASH=...
```

**Migration Strategy:**
- Start with database schema setup
- Add static content with schema matching final structure
- Incrementally add dynamic features
- Implement features in priority order

**Performance Considerations:**
- Use Next.js Image component with Cloudinary
- Implement proper caching headers
- Use Supabase edge functions for complex queries if needed
- Lazy load images and components
