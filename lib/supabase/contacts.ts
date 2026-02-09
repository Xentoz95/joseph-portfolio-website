/**
 * Contacts Data Layer
 *
 * Server-side functions for fetching and managing contact submissions from Supabase.
 * These functions are designed for use in Server Components and Server Actions.
 */

import { createClient } from './server';
import type { Contact, ContactInsert, ContactUpdate } from '@/types/database';

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

/**
 * Get all contact submissions
 *
 * @param options - Query options
 * @param options.limit - Maximum number of contacts to return
 * @param options.offset - Number of contacts to skip
 * @param options.unreadOnly - Only return unread contacts
 * @returns Array of contacts
 */
export async function getContacts(options: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
} = {}): Promise<Contact[]> {
  const supabase = await createClient();

  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.unreadOnly) {
    query = query.eq('read', false);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  return (data || []) as Contact[];
}

/**
 * Get a single contact by ID
 *
 * @param id - The contact ID
 * @returns Contact or null if not found
 */
export async function getContactById(id: string): Promise<Contact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching contact with id "${id}":`, error);
    return null;
  }

  return data as Contact | null;
}

/**
 * Get unread contact count
 *
 * @returns Number of unread contacts
 */
export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Create a new contact submission
 *
 * @param contact - The contact data to insert
 * @returns Created contact or null
 */
export async function createContact(
  contact: ContactInsert
): Promise<Contact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    .insert(contact as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    return null;
  }

  return data as Contact | null;
}

/**
 * Mark a contact as read
 *
 * @param id - The contact ID
 * @returns Updated contact or null
 */
export async function markContactAsRead(id: string): Promise<Contact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    // @ts-ignore - Supabase type generation issue with update method
    .update({ read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error marking contact "${id}" as read:`, error);
    return null;
  }

  return data as Contact | null;
}

/**
 * Mark a contact as unread
 *
 * @param id - The contact ID
 * @returns Updated contact or null
 */
export async function markContactAsUnread(id: string): Promise<Contact | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    // @ts-ignore - Supabase type generation issue with update method
    .update({ read: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error marking contact "${id}" as unread:`, error);
    return null;
  }

  return data as Contact | null;
}

/**
 * Delete a contact
 *
 * @param id - The contact ID
 * @returns True if successful, false otherwise
 */
export async function deleteContact(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting contact "${id}":`, error);
    return false;
  }

  return true;
}

/**
 * Search contacts by query string
 *
 * Searches in name, email, and message
 *
 * @param query - The search query
 * @returns Array of matching contacts
 */
export async function searchContacts(query: string): Promise<Contact[]> {
  const supabase = await createClient();

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},message.ilike.${searchTerm}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error searching contacts for "${query}":`, error);
    return [];
  }

  return (data || []) as Contact[];
}
