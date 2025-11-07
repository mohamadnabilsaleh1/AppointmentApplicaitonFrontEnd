// lib/validations/upload.ts
import { z } from 'zod';

export const createUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  visibility: z.number().min(0).max(1),
  file: z.instanceof(File).refine((file) => file.size > 0, "File is required")
});

export const updateUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  visibility: z.number().min(0).max(1).optional(),
});

export type CreateUploadFormData = z.infer<typeof createUploadSchema>;
export type UpdateUploadFormData = z.infer<typeof updateUploadSchema>;