/**
 * Contact Form Validation Schema
 *
 * Zod schema for validating contact form submissions
 * Includes input sanitization to prevent XSS attacks
 */

import { z } from 'zod';

/**
 * Sanitize string input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Zod schema for contact form validation
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .transform(sanitizeString),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email must not exceed 255 characters')
    .email('Invalid email address')
    .transform((val) => sanitizeString(val).toLowerCase()),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .transform(sanitizeString),
});

/**
 * Type for contact form input
 */
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Type for contact form errors
 */
export type ContactFormErrors = z.ZodError<ContactFormInput>;
