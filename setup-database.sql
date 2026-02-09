-- ============================================
-- COMPLETE DATABASE SETUP FOR PORTFOLIO CMS
-- Run this in your Supabase SQL Editor
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

-- Create indexes
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(featured);
CREATE INDEX IF NOT EXISTS projects_category_idx ON public.projects(category);
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

-- Create indexes
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(published);
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

-- Create indexes
CREATE INDEX IF NOT EXISTS contacts_read_idx ON public.contacts(read);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON public.contacts(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access for published projects" ON public.projects;
DROP POLICY IF EXISTS "Allow service role full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access for published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow service role full access to posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public insert access to contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow service role full access to contacts" ON public.contacts;

-- Create policies
CREATE POLICY "Allow public read access for published projects"
ON public.projects FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Allow service role full access to projects"
ON public.projects FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access for published posts"
ON public.posts FOR SELECT USING (published = true AND published_at IS NOT NULL);

CREATE POLICY "Allow service role full access to posts"
ON public.posts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert access to contacts"
ON public.contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role full access to contacts"
ON public.contacts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- Create triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANTS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- INSERT SAMPLE PROJECTS
-- ============================================
-- Clear existing data first
TRUNCATE TABLE public.projects CASCADE;

INSERT INTO public.projects (title, description, slug, tags, images, demo_url, repo_url, featured, category, published_at) VALUES
(
  'Access Control System',
  'A comprehensive access control and security management system with role-based permissions, user authentication, and audit logging capabilities.',
  'access-control-system',
  ARRAY['Security', 'Authentication', 'React', 'TypeScript'],
  '{"thumbnail": "/images/projects/access-control-system/thumb.jpg", "hero": "/images/projects/access-control-system/hero.jpg", "gallery": ["/images/projects/access-control-system/1.jpg"], "alt": "Access Control System interface showing user permissions and security settings"}'::jsonb,
  NULL,
  NULL,
  false,
  'web',
  now()
),
(
  'Corporate Landing Page',
  'Modern, responsive corporate landing page with smooth animations, contact forms, and conversion-optimized design.',
  'corporate-landing-page',
  ARRAY['Landing Page', 'Responsive', 'Next.js', 'Tailwind CSS'],
  '{"thumbnail": "/images/projects/corporate-landing-page/thumb.jpg", "hero": "/images/projects/corporate-landing-page/hero.jpg", "gallery": ["/images/projects/corporate-landing-page/1.jpg"], "alt": "Corporate landing page hero section with call-to-action"}'::jsonb,
  NULL,
  NULL,
  true,
  'web',
  now()
),
(
  'E-commerce Dashboard',
  'Full-featured e-commerce admin dashboard with inventory management, sales analytics, order tracking, and customer insights.',
  'ecommerce-dashboard',
  ARRAY['Dashboard', 'E-commerce', 'Analytics', 'Charts'],
  '{"thumbnail": "/images/projects/ecommerce-dashboard/thumb.jpg", "hero": "/images/projects/ecommerce-dashboard/hero.jpg", "gallery": ["/images/projects/ecommerce-dashboard/1.jpg", "/images/projects/ecommerce-dashboard/2.jpg"], "alt": "E-commerce dashboard showing sales charts and inventory metrics"}'::jsonb,
  NULL,
  NULL,
  true,
  'dashboard',
  now()
),
(
  'Fintech UI System',
  'Comprehensive fintech user interface system with reusable components, dark mode support, and banking-grade security features.',
  'fintech-ui-system',
  ARRAY['Fintech', 'UI Components', 'Design System', 'TypeScript'],
  '{"thumbnail": "/images/projects/fintech-ui-system/thumb.jpg", "hero": "/images/projects/fintech-ui-system/hero.jpg", "gallery": ["/images/projects/fintech-ui-system/1.jpg", "/images/projects/fintech-ui-system/2.jpg"], "alt": "Fintech UI system showing dashboard and transaction components"}'::jsonb,
  NULL,
  NULL,
  true,
  'design',
  now()
),
(
  'HR Management System',
  'Human resources management platform with employee records, leave management, payroll processing, and performance tracking.',
  'hr-management-system',
  ARRAY['HR', 'Management', 'Payroll', 'Analytics'],
  '{"thumbnail": "/images/projects/hr-management-system/thumb.jpg", "hero": "/images/projects/hr-management-system/hero.jpg", "gallery": ["/images/projects/hr-management-system/1.jpg"], "alt": "HR management system showing employee dashboard and records"}'::jsonb,
  NULL,
  NULL,
  false,
  'system',
  now()
),
(
  'Inventory Tracking System',
  'Real-time inventory tracking system with barcode scanning, stock alerts, supplier management, and warehouse optimization.',
  'inventory-tracking-system',
  ARRAY['Inventory', 'Tracking', 'Management', 'Real-time'],
  '{"thumbnail": "/images/projects/inventory-tracking-system/thumb.jpg", "hero": "/images/projects/inventory-tracking-system/hero.jpg", "gallery": ["/images/projects/inventory-tracking-system/1.jpg"], "alt": "Inventory tracking system showing stock levels and product details"}'::jsonb,
  NULL,
  NULL,
  false,
  'system',
  now()
);

-- ============================================
-- INSERT SAMPLE BLOG POST
-- ============================================
TRUNCATE TABLE public.posts CASCADE;

INSERT INTO public.posts (title, slug, content, excerpt, cover_image, tags, published, published_at) VALUES
(
  'Getting Started with Modern Web Development',
  'getting-started-with-modern-web-development',
  '# Introduction

Web development has evolved significantly over the years. Today, we have access to powerful tools and frameworks that make building modern web applications easier than ever.

## The Modern Stack

When starting a new project, choosing the right stack is crucial. Here are some considerations:

- **React** for component-based UI
- **Next.js** for server-side rendering and routing
- **TypeScript** for type safety
- **Tailwind CSS** for rapid styling
- **Supabase** for backend and database

## Getting Started

First, create a new Next.js project:

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## Conclusion

This is just the beginning of your web development journey. Keep learning and building!',
  'Learn about the modern web development stack including React, Next.js, TypeScript, and more. This guide covers everything you need to get started.',
  '/images/projects/fintech-ui-system/hero.jpg',
  ARRAY['Web Development', 'React', 'Next.js', 'Tutorial'],
  true,
  now()
);

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.posts REPLICA IDENTITY FULL;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check that everything was created
SELECT 'Projects created:' as status, COUNT(*) as count FROM public.projects;
SELECT 'Posts created:' as status, COUNT(*) as count FROM public.posts;
SELECT 'Featured projects:' as status, COUNT(*) as count FROM public.projects WHERE featured = true;
