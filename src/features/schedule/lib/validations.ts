// src/features/schedules/lib/validations.ts
import { z } from 'zod';

export const scheduleFormSchema = z.object({
  dayOfWeek: z.number().min(0).max(6, 'Day of week must be between 0 and 6'),
  startTime: z.string().min(1, 'Start time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid time format'),
  endTime: z.string().min(1, 'End time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid time format'),
  status: z.number().min(0).max(1),
  isAvailable: z.boolean(),
  note: z.string().optional(),
}).refine((data) => {
  // Ensure end time is after start time
  const start = new Date(`2000-01-01T${data.startTime}`);
  const end = new Date(`2000-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;