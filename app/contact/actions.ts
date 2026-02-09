'use server';

/**
 * Contact Form Server Actions
 *
 * Server actions for handling contact form submissions
 * Includes rate limiting, validation, and CSRF protection
 */

import { revalidatePath } from 'next/cache';
import { createContact } from '@/lib/supabase/contacts';
import { contactFormSchema, type ContactFormInput } from '@/lib/validations/contact';
import { checkRateLimit, getTimeUntilReset } from '@/lib/rate-limit';
import type { ContactInsert } from '@/types/database';

/**
 * Result type for contact form submission
 */
export type ContactFormResult = {
  success: boolean;
  message: string;
  error?: string;
  resetTime?: number;
};

/**
 * Submit contact form
 *
 * @param formData - The form data
 * @returns Result object with success status and message
 */
export async function submitContactForm(
  formData: ContactFormInput
): Promise<ContactFormResult> {
  try {
    // Validate input using Zod schema
    const validatedData = contactFormSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your input.',
        error: validatedData.error.errors.map(e => e.message).join(', '),
      };
    }

    const { name, email, message } = validatedData.data;

    // Check rate limit based on email
    const rateLimitResult = checkRateLimit(`contact:${email}`);

    if (!rateLimitResult.allowed) {
      const timeUntilReset = getTimeUntilReset(rateLimitResult.resetTime);
      return {
        success: false,
        message: `You've reached the submission limit. Please try again in ${timeUntilReset}.`,
        resetTime: rateLimitResult.resetTime,
      };
    }

    // Create contact submission
    const contactData: ContactInsert = {
      name: name as string,
      email: email as string,
      message: message as string,
    } as ContactInsert;

    const result = await createContact(contactData);

    if (!result) {
      return {
        success: false,
        message: 'Failed to submit contact form. Please try again.',
        error: 'Database error',
      };
    }

    // Revalidate admin pages
    revalidatePath('/admin/contact');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get remaining submissions for an email
 *
 * @param email - The email to check
 * @returns Number of remaining submissions
 */
export async function getRemainingSubmissions(email: string): Promise<number> {
  const result = checkRateLimit(`contact:${email.toLowerCase()}`);
  return result.remaining;
}
