// src/lib/validations.ts
import { z } from 'zod';

// Schema for creating a new facility (with account fields)
export const facilityFormSchema = z.object({
  // User account fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  // Facility fields
  name: z.string().min(1, 'Facility name is required'),
  type: z.number().min(0).max(9),
  
  // Address fields
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  
  // Location fields
  gpsLatitude: z.number(),
  gpsLongitude: z.number(),
});

// Schema for updating a facility (only facility fields)
export const updateFacilityFormSchema = z.object({
  // Facility fields only
  name: z.string().min(1, 'Facility name is required'),
  type: z.number().min(0).max(1),
  
  // Address fields
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  
  // Location fields
  gpsLatitude: z.number(),
  gpsLongitude: z.number(),
});

export type FacilityFormData = z.infer<typeof facilityFormSchema>;
export type UpdateFacilityFormData = z.infer<typeof updateFacilityFormSchema>;