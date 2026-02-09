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
