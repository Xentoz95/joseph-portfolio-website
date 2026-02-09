'use client';

import { useCallback } from 'react';
import {
  logEvent,
  logProjectClick,
  logBlogPostView,
  logContactFormSubmission,
  logExternalLinkClick,
  logSearchQuery,
} from '@/lib/firebase';
import { useAnalytics } from '@/components/analytics-provider';

export function useAnalyticsTracking() {
  const { isReady } = useAnalytics();

  const trackEvent = useCallback(
    (eventName: string, eventParams?: Record<string, unknown>) => {
      if (isReady) {
        logEvent(eventName, eventParams);
      }
    },
    [isReady]
  );

  const trackProjectClick = useCallback(
    (projectId: string, projectTitle: string) => {
      if (isReady) {
        logProjectClick(projectId, projectTitle);
      }
    },
    [isReady]
  );

  const trackBlogPostView = useCallback(
    (postId: string, postTitle: string) => {
      if (isReady) {
        logBlogPostView(postId, postTitle);
      }
    },
    [isReady]
  );

  const trackContactFormSubmission = useCallback(
    (formData: { name: string; email: string }) => {
      if (isReady) {
        logContactFormSubmission(formData);
      }
    },
    [isReady]
  );

  const trackExternalLinkClick = useCallback(
    (url: string, linkType: 'social' | 'project' | 'blog' | 'other' | 'repo') => {
      if (isReady) {
        // Map 'repo' to 'project' for analytics
        const analyticsLinkType: 'social' | 'project' | 'blog' | 'other' =
          linkType === 'repo' ? 'project' : linkType;
        logExternalLinkClick(url, analyticsLinkType);
      }
    },
    [isReady]
  );

  const trackSearchQuery = useCallback(
    (query: string, resultCount: number, searchType: 'projects' | 'blog') => {
      if (isReady) {
        logSearchQuery(query, resultCount, searchType);
      }
    },
    [isReady]
  );

  return {
    isReady,
    trackEvent,
    trackProjectClick,
    trackBlogPostView,
    trackContactFormSubmission,
    trackExternalLinkClick,
    trackSearchQuery,
  };
}

export function usePageView() {
  const { isReady } = useAnalytics();

  return {
    canTrack: isReady,
  };
}
