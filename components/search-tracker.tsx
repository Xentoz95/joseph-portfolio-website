'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface SearchTrackerProps {
  resultCount: number;
  searchType: 'projects' | 'blog';
}

function SearchTrackerInner({ resultCount, searchType }: SearchTrackerProps) {
  const searchParams = useSearchParams();
  const { trackSearchQuery } = useAnalyticsTracking();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    if (searchQuery) {
      trackSearchQuery(searchQuery, resultCount, searchType);
    }
  }, [searchQuery, resultCount, searchType, trackSearchQuery]);

  return null;
}

export function SearchTracker(props: SearchTrackerProps) {
  return (
    <Suspense fallback={null}>
      <SearchTrackerInner {...props} />
    </Suspense>
  );
}
