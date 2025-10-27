// src/features/schedule-exceptions/lib/validations.ts
import { z } from 'zod';

export const scheduleExceptionFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  dayOfWeek: z.number().min(0).max(6, 'Day of week must be between 0 and 6'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.number().min(0),
  reason: z.string().min(1, 'Reason is required'),
});

export type ScheduleExceptionFormData = z.infer<typeof scheduleExceptionFormSchema>;