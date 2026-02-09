'use client';

import { useState } from 'react';
import { useAnalyticsTracking } from '@/hooks/use-analytics';

interface SearchFormWithAnalyticsProps {
  currentSearch?: string;
  action: string;
  placeholder: string;
  resultCount: number;
  searchType: 'projects' | 'blog';
}

export function SearchFormWithAnalytics({
  currentSearch,
  action,
  placeholder,
  resultCount,
  searchType,
}: SearchFormWithAnalyticsProps) {
  const { trackSearchQuery } = useAnalyticsTracking();
  const [hasTracked, setHasTracked] = useState(!currentSearch);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;

    if (searchValue && searchValue !== currentSearch) {
      trackSearchQuery(searchValue, resultCount, searchType);
    }
  };

  return (
    <form className="relative max-w-md" action={action} method="get" onSubmit={handleSubmit}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        name="search"
        placeholder={placeholder}
        defaultValue={currentSearch}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </form>
  );
}
