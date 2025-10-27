// src/features/schedules/lib/validations.ts
import { z } from 'zod';

export const scheduleFormSchema = z.object({
  dayOfWeek: z.number().min(0).max(6, 'Day of week must be between 0 and 6'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.number().min(0),
  isAvailable: z.boolean(),
  note: z.string().optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;