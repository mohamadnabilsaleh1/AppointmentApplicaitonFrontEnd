// src/features/emails/lib/validations.ts
import { z } from 'zod';

export const emailFormSchema = z.object({
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email address format'),
  label: z.string().min(1, 'Label is required'),
  isPrimary: z.boolean(),
});

export type EmailFormData = z.infer<typeof emailFormSchema>;