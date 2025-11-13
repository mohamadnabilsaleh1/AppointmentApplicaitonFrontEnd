// src/features/phones/lib/validations.ts
import { z } from 'zod';

export const phoneFormSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
  label: z.string().min(1, 'Label is required'),
  isPrimary: z.boolean(),
});

export type PhoneFormData = z.infer<typeof phoneFormSchema>;