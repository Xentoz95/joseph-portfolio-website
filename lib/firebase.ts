import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

export function initFirebase(): { app: FirebaseApp | undefined; analytics: Analytics | undefined } {
  if (typeof window === 'undefined') {
    return { app: undefined, analytics: undefined };
  }

  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }

  return { app, analytics };
}

export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAnalytics(): Analytics | undefined {
  if (typeof window === 'undefined') return undefined;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;

  if (!analytics) {
    try {
      analytics = getAnalytics(firebaseApp);
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error);
    }
  }

  return analytics;
}

export function logEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const analyticsInstance = getFirebaseAnalytics();
  if (!analyticsInstance) {
    console.warn('Firebase Analytics not initialized. Event not logged:', eventName);
    return;
  }

  try {
    firebaseLogEvent(analyticsInstance, eventName, eventParams);
  } catch (error) {
    console.error('Failed to log event:', eventName, error);
  }
}

export function logPageView(pagePath: string, pageTitle: string): void {
  logEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
  });
}

export function logProjectClick(projectId: string, projectTitle: string): void {
  logEvent('project_click', {
    project_id: projectId,
    project_title: projectTitle,
    timestamp: Date.now(),
  });
}

export function logBlogPostView(postId: string, postTitle: string): void {
  logEvent('blog_post_view', {
    post_id: postId,
    post_title: postTitle,
    timestamp: Date.now(),
  });
}

export function logContactFormSubmission(formData: { name: string; email: string }): void {
  logEvent('contact_form_submission', {
    form_type: 'contact',
    timestamp: Date.now(),
  });
}

export function logExternalLinkClick(url: string, linkType: string): void {
  // Map 'repo' to 'project' for consistent analytics
  const analyticsLinkType = linkType === 'repo' ? 'project' : linkType;
  logEvent('external_link_click', {
    link_type: analyticsLinkType,
    link_url: url,
    timestamp: Date.now(),
  });
}

export function logSearchQuery(query: string, resultCount: number, searchType: 'projects' | 'blog'): void {
  logEvent('search', {
    search_term: query,
    search_type: searchType,
    result_count: resultCount,
    timestamp: Date.now(),
  });
}
