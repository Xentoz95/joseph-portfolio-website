'use client';

import React from 'react';
import { useAnalyticsContext } from '@/components/analytics-provider';

export function ConsentBanner() {
  const { consent, setConsent } = useAnalyticsContext();

  if (consent !== null && consent !== false) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold">Analytics Consent:</span> We use Firebase Analytics to understand
            how visitors use our website. This helps us improve your experience. By clicking &quot;Accept&quot;,
            you consent to our use of analytics.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setConsent(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            aria-label="Accept analytics tracking"
          >
            Accept
          </button>
          <button
            onClick={() => setConsent(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            aria-label="Decline analytics tracking"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
