// src/features/treatment-capacity/lib/validations.ts
import { z } from 'zod';

export const treatmentCapacityFormSchema = z.object({
  maxPatientsPerDay: z.number()
    .min(1, 'Must be at least 1 patient per day')
    .max(100, 'Cannot exceed 100 patients per day'),
  sessionDurationMinutes: z.number()
    .min(5, 'Session must be at least 5 minutes')
    .max(120, 'Session cannot exceed 120 minutes'),
});

export type TreatmentCapacityFormData = z.infer<typeof treatmentCapacityFormSchema>;