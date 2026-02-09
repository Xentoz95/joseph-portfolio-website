-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- Run this SQL script in your Supabase SQL Editor
-- Navigate to: https://njcggtsozmjhvladuznw.supabase.co
-- Click on "SQL Editor" in the left sidebar
-- Create a new query and paste this entire file
-- Then click "Run" to execute
-- ============================================

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
DROP POLICY IF EXISTS "Allow public read access for published projects" ON public.projects;
CREATE POLICY "Allow public read access for published projects"
ON public.projects
FOR SELECT
USING (published_at IS NOT NULL);

-- Allow service role full access to projects
DROP POLICY IF EXISTS "Allow service role full access to projects" ON public.projects;
CREATE POLICY "Allow service role full access to projects"
ON public.projects
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Posts policies
-- Allow public read access for published posts
DROP POLICY IF EXISTS "Allow public read access for published posts" ON public.posts;
CREATE POLICY "Allow public read access for published posts"
ON public.posts
FOR SELECT
USING (published = true AND published_at IS NOT NULL);

-- Allow service role full access to posts
DROP POLICY IF EXISTS "Allow service role full access to posts" ON public.posts;
CREATE POLICY "Allow service role full access to posts"
ON public.posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Contacts policies
-- Allow public insert access (contact form submissions)
DROP POLICY IF EXISTS "Allow public insert access to contacts" ON public.contacts;
CREATE POLICY "Allow public insert access to contacts"
ON public.contacts
FOR INSERT
WITH CHECK (true);

-- Allow service role full access to contacts
DROP POLICY IF EXISTS "Allow service role full access to contacts" ON public.contacts;
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
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
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

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify the setup:
SELECT 'projects' as table_name, COUNT(*) as count FROM public.projects
UNION ALL
SELECT 'posts' as table_name, COUNT(*) as count FROM public.posts
UNION ALL
SELECT 'contacts' as table_name, COUNT(*) as count FROM public.contacts;
