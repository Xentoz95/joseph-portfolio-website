import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for use in Client Components
 * This creates a client that can be used in browser components
 *
 * Note: We don't use the Database generic parameter because it causes
 * type inference issues with our custom type definitions. The client
 * still works correctly at runtime, and we use our custom types
 * (Project, Post, Contact, etc.) for type safety in application code.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
