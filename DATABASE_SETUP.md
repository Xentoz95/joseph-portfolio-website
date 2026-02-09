# Database Setup Guide for Portfolio CMS

This guide will help you set up the Supabase database for your portfolio website.

## Prerequisites

- Supabase account (project ID: `njcggtsozmjhvladuznw`)
- Supabase project URL and anon key
- Access to Supabase SQL Editor

## Step 1: Access Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (`njcggtsozmjhvladuznw`)

## Step 2: Run the Migrations

Open the Supabase SQL Editor and run each migration in order:

### Migration 1: Initial Schema

Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
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

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);
-- Create index on featured for filtering
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(featured);
-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS projects_category_idx ON public.projects(category);
-- Create index on published_at for ordering
CREATE INDEX IF NOT EXISTS projects_published_at_idx ON public.projects(published_at DESC NULLS LAST);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);
-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(published);
-- Create index on published_at for ordering
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts(published_at DESC NULLS LAST);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  read BOOLEAN DEFAULT false
);

-- Create index on read status for filtering
CREATE INDEX IF NOT EXISTS contacts_read_idx ON public.contacts(read);
-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON public.contacts(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Projects policies
-- Allow public read access for published projects
CREATE POLICY "Allow public read access for published projects"
ON public.projects
FOR SELECT
USING (published_at IS NOT NULL);

-- Allow service role full access to projects
CREATE POLICY "Allow service role full access to projects"
ON public.projects
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Posts policies
-- Allow public read access for published posts
CREATE POLICY "Allow public read access for published posts"
ON public.posts
FOR SELECT
USING (published = true AND published_at IS NOT NULL);

-- Allow service role full access to posts
CREATE POLICY "Allow service role full access to posts"
ON public.posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Contacts policies
-- Allow public insert access (contact form submissions)
CREATE POLICY "Allow public insert access to contacts"
ON public.contacts
FOR INSERT
WITH CHECK (true);

-- Allow service role full access to contacts
CREATE POLICY "Allow service role full access to contacts"
ON public.contacts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage on sequences for UUID generation
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;
```

### Migration 2: Enable Realtime

Copy and paste the contents of `supabase/migrations/002_enable_realtime.sql`:

```sql
-- ============================================
-- ENABLE REALTIME FOR PROJECTS AND POSTS
-- ============================================

-- Enable realtime on projects table
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- Enable realtime on posts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- ============================================
-- REALTIME POLICIES
-- ============================================

-- Allow public to subscribe to published projects changes
ALTER TABLE public.projects REPLICA IDENTITY FULL;

-- Allow public to subscribe to published posts changes
ALTER TABLE public.posts REPLICA IDENTITY FULL;
```

## Step 3: Verify Environment Variables

Make sure your `.env.local` file contains the correct Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://njcggtsozmjhvladuznw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these values in your Supabase project under:
- Settings → API → Project URL
- Settings → API → anon/public key

## Step 4: Test the Connection

Restart your development server and check the browser console for any remaining database errors:

```bash
pnpm run dev
```

Visit http://localhost:3002 and check:
1. Homepage loads without database errors
2. Projects page loads (even if empty)
3. Blog page loads (even if empty)
4. Contact form submits successfully

## Database Schema Overview

### Projects Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Project title |
| description | TEXT | Project description |
| slug | TEXT | URL-friendly identifier (unique) |
| tags | TEXT[] | Array of tags |
| images | JSONB | Image URLs (thumbnail, hero, gallery) |
| demo_url | TEXT | Live demo URL |
| repo_url | TEXT | Repository URL |
| featured | BOOLEAN | Whether to feature on homepage |
| category | TEXT | Project category |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| published_at | TIMESTAMPTZ | Publication date (null = draft) |

### Posts Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT | URL-friendly identifier (unique) |
| content | TEXT | Markdown content |
| excerpt | TEXT | Short excerpt |
| cover_image | TEXT | Cover image URL |
| tags | TEXT[] | Array of tags |
| published | BOOLEAN | Published status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| published_at | TIMESTAMPTZ | Publication date (null = draft) |

### Contacts Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Sender name |
| email | TEXT | Sender email |
| message | TEXT | Message content |
| created_at | TIMESTAMPTZ | Submission timestamp |
| read | BOOLEAN | Read status |

## Troubleshooting

### Error: "Could not find the table 'public.projects' in the schema cache"

**Solution:** Run the migration scripts above in the Supabase SQL Editor.

### Error: "connect timeout" when accessing Supabase

**Solution:** Check your network connection and verify your Supabase project is active.

### Error: "permission denied" on table operations

**Solution:** Verify RLS policies are correctly set up. Run the migration scripts again if needed.

## Next Steps

After setting up the database:

1. **Add sample data** using the admin panel at `/admin`
2. **Test image uploads** to Cloudinary
3. **Verify real-time updates** work correctly
4. **Check SEO metadata** is generated correctly

## Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Cloudinary**: Check [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)
