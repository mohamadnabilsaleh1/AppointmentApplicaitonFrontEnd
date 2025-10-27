// src/features/departments/lib/validations.ts
import { z } from 'zod';

export const departmentFormSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;