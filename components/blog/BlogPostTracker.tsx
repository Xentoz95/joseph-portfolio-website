'use client';

import { useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface BlogPostTrackerProps {
  postId: string;
  postTitle: string;
}

export function BlogPostTracker({ postId, postTitle }: BlogPostTrackerProps) {
  const { trackBlogPostView } = useAnalyticsTracking();

  useEffect(() => {
    trackBlogPostView(postId, postTitle);
  }, [postId, postTitle, trackBlogPostView]);

  return null;
}
