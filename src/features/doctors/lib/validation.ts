// src/lib/doctor-validations.ts
import { z } from 'zod';

export const doctorFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.number().min(0).max(2),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  specialization: z.number().min(0),
  licenseNumber: z.string().min(1, 'License number is required'),
});

export const updateDoctorFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.number().min(0).max(2),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  specialization: z.number().min(0),
  licenseNumber: z.string().min(1, 'License number is required'),
});

export type DoctorFormData = z.infer<typeof doctorFormSchema>;
export type UpdateDoctorFormData = z.infer<typeof updateDoctorFormSchema>;