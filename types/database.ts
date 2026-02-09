/**
 * Database type definitions for Supabase
 * These types match the database schema defined in migrations/001_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// DATABASE TYPE DEFINITIONS
// ============================================

export type ProjectCategory = 'web' | 'system' | 'dashboard' | 'design' | 'mobile';

export interface ProjectImages {
  thumbnail: string | null
  hero: string | null
  gallery: string[]
  alt: string
}

// Define base types inline to avoid circular references
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          slug: string
          tags: string[]
          images: ProjectImages
          demo_url: string | null
          repo_url: string | null
          featured: boolean
          category: ProjectCategory
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          slug: string
          tags?: string[]
          images?: ProjectImages
          demo_url?: string | null
          repo_url?: string | null
          featured?: boolean
          category: ProjectCategory
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          slug?: string
          tags?: string[]
          images?: ProjectImages
          demo_url?: string | null
          repo_url?: string | null
          featured?: boolean
          category?: ProjectCategory
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image: string | null
          tags: string[]
          published: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image?: string | null
          tags?: string[]
          published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image?: string | null
          tags?: string[]
          published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ============================================
// CONVENIENCE TYPE EXPORTS
// ============================================

// Project types - using inline definitions to avoid circular references
export interface Project {
  id: string
  title: string
  description: string
  slug: string
  tags: string[]
  images: ProjectImages
  demo_url: string | null
  repo_url: string | null
  featured: boolean
  category: ProjectCategory
  created_at: string
  updated_at: string
  published_at: string | null
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type ProjectUpdate = Partial<ProjectInsert>

// Post types - using inline definitions to avoid circular references
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
  published_at: string | null
}

export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type PostUpdate = Partial<PostInsert>

// Contact types - using inline definitions to avoid circular references
export interface Contact {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export type ContactInsert = Omit<Contact, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type ContactUpdate = Partial<Pick<Contact, 'read'>>

// ============================================
// HELPER TYPES
// ============================================

/**
 * Helper type for Supabase query results
 * Extracts the Row type from a table
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

/**
 * Helper type for Supabase insert operations
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

/**
 * Helper type for Supabase update operations
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Check if a value is a valid ProjectImages object
 */
export function isProjectImages(value: unknown): value is ProjectImages {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    (typeof v.thumbnail === 'string' || v.thumbnail === null) &&
    (typeof v.hero === 'string' || v.hero === null) &&
    Array.isArray(v.gallery) &&
    v.gallery.every((item: unknown) => typeof item === 'string') &&
    typeof v.alt === 'string'
  )
}

/**
 * Check if a project is published
 */
export function isProjectPublished(project: Project): boolean {
  return project.published_at !== null
}

/**
 * Check if a post is published
 */
export function isPostPublished(post: Post): boolean {
  return post.published && post.published_at !== null
}

// ============================================
// REALTIME TYPES
// ============================================

/**
 * Supabase realtime payload type
 * Used for real-time subscription callbacks
 */
export type RealtimePayload<T extends keyof Database['public']['Tables']> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  old: Database['public']['Tables'][T]['Row'] | null;
  new: Database['public']['Tables'][T]['Row'] | null;
  errors: unknown[] | null;
}
