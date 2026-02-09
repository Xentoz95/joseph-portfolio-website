'use server';

/**
 * Admin Contact Server Actions
 *
 * Server actions for the admin contact page
 * These allow client components to interact with the database
 */

import {
  getContacts,
  markContactAsRead,
  markContactAsUnread,
  deleteContact,
} from '@/lib/supabase/contacts';
import type { Contact } from '@/types/database';

/**
 * Get all contact submissions
 */
export async function adminGetContacts(options: {
  unreadOnly?: boolean;
} = {}): Promise<Contact[]> {
  return await getContacts(options);
}

/**
 * Mark a contact as read
 */
export async function adminMarkAsRead(id: string): Promise<Contact | null> {
  return await markContactAsRead(id);
}

/**
 * Mark a contact as unread
 */
export async function adminMarkAsUnread(id: string): Promise<Contact | null> {
  return await markContactAsUnread(id);
}

/**
 * Delete a contact
 */
export async function adminDeleteContact(id: string): Promise<boolean> {
  return await deleteContact(id);
}
