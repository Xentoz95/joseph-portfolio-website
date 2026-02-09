# Database Setup Guide

This guide explains how to set up the Supabase database for the Portfolio CMS project.

## Prerequisites

- Supabase project URL and keys (already configured in `.env.local`)
- Access to the Supabase dashboard

## Quick Setup

### Step 1: Apply Database Migration

1. Go to your Supabase project dashboard: https://njcggtsozmjhvladuznw.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy the contents of `scripts/setup-database.sql`
5. Paste it into the SQL Editor
6. Click "Run" to execute the migration

This will create:
- `projects` table with RLS policies
- `posts` table with RLS policies
- `contacts` table with RLS policies
- Indexes for performance
- Triggers for automatic timestamp updates

### Step 2: Run Project Migration

After the database tables are created, migrate the project data and images:

```bash
npx tsx lib/migrate-projects.ts
```

This will:
- Upload all 16 project images to Cloudinary
- Insert 6 projects into the database:
  - ecommerce-dashboard (featured: true)
  - hr-management-system
  - corporate-landing-page
  - inventory-tracking-system
  - fintech-ui-system (featured: true)
  - access-control-system

### Step 3: Verify Migration

Check the database to verify the migration was successful:

```bash
npx tsx lib/check-db.ts
```

## Database Schema

### Projects Table

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tags TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '{"thumbnail": null, "hero": null, "gallery": [], "alt": ""}'::jsonb,
  demo_url TEXT,
  repo_url TEXT,
  featured BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);
```

### RLS Policies

- **Public Access**: Anyone can read published projects
- **Service Role**: Full access to all tables

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://njcggtsozmjhvladuznw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dszboz3se
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Troubleshooting

### Table Not Found Error

If you see "Could not find the table 'public.projects'", the database migration hasn't been applied yet. Follow Step 1 above.

### Permission Denied

If you see permission errors, ensure RLS policies are correctly set up. Run the migration SQL again to recreate policies.

### Cloudinary Upload Failed

If image uploads fail, verify:
- Cloudinary credentials are correct in `.env.local`
- You have sufficient quota on your Cloudinary account
- The local images exist in `public/images/projects/`

## Data Layer Functions

After setup, use these functions to interact with the database:

```typescript
import {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectsByTag,
  searchProjects,
} from '@/lib/supabase/projects';

// Get all projects
const projects = await getProjects();

// Get featured projects
const featured = await getFeaturedProjects(6);

// Get single project
const project = await getProjectBySlug('ecommerce-dashboard');

// Filter by tag
const reactProjects = await getProjectsByTag('React');

// Search projects
const results = await searchProjects('dashboard');
```

## Next Steps

After database setup is complete:

1. Visit `/projects` to see the projects listing page
2. Visit `/projects/[slug]` to see individual project pages
3. The homepage will display featured projects

## Files Reference

- `supabase/migrations/001_initial_schema.sql` - Database schema
- `scripts/setup-database.sql` - Complete setup script with instructions
- `lib/migrate-projects.ts` - Project data migration script
- `lib/supabase/projects.ts` - Data layer functions
- `types/database.ts` - TypeScript types
