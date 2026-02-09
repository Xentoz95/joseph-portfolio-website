'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initFirebase, logPageView, getFirebaseAnalytics } from '@/lib/firebase';

interface AnalyticsContextType {
  consent: boolean;
  setConsent: (consent: boolean) => void;
  isInitialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'analytics_consent';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent !== null) {
      const parsedConsent = storedConsent === 'true';
      setConsentState(parsedConsent);
      if (parsedConsent) {
        initializeAnalytics();
      }
    }
  }, []);

  const initializeAnalytics = () => {
    try {
      const { analytics } = initFirebase();
      if (analytics) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error);
    }
  };

  const setConsent = (granted: boolean) => {
    setConsentState(granted);
    localStorage.setItem(CONSENT_STORAGE_KEY, String(granted));

    if (granted && !isInitialized) {
      initializeAnalytics();
    }
  };

  useEffect(() => {
    if (!consent || !isInitialized) return;

    const pageTitle = document.title;
    const fullUrl = pathname + (typeof window !== 'undefined' ? window.location.search : '');
    logPageView(fullUrl, pageTitle);
  }, [pathname, consent, isInitialized]);

  return (
    <AnalyticsContext.Provider value={{ consent, setConsent, isInitialized }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

export function useAnalytics() {
  const { consent, isInitialized } = useAnalyticsContext();

  return {
    isReady: consent && isInitialized,
    hasConsent: consent,
  };
}
