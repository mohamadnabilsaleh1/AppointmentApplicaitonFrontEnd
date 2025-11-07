// src/features/appointments/types/appointment.ts

// Appointment Status Enum (matches backend AppointmentStatus enum)
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';

// Base Appointment DTO (simplified version from backend)
export interface Appointment {
  id: string;
  scheduledDate: string; // DateOnly from backend (ISO date string)
  scheduledTime: string; // TimeSpan from backend (HH:mm:ss format)
  durationMinutes: number;
  status: AppointmentStatus;
  bookingDate: string; // DateTime from backend
  notes: string;
  cancellationReason?: string | null;
  
  // Simplified nested objects
  patient: PatientInfoDto;
  doctor: DoctorInfoDto;
  facility: FacilityInfoDto;
}



// Patient Info DTO (simplified)
export interface PatientInfoDto {
  id: string;
  fullName: string;
  nationalID?: string | null;
}

// Doctor Info DTO (simplified)
export interface DoctorInfoDto {
  id: string;
  fullName: string;
  specialization: string;
}

// Facility Info DTO (simplified)
export interface FacilityInfoDto {
  id: string;
  name: string;
  address: string;
}

// Appointment Details DTO (full version with all details)
export interface AppointmentDetailsDto {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  bookingDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  notes?: string | null;
  cancellationReason?: string | null;
  
  // Detailed nested objects
  patient: PatientDetailsDto;
  doctor: DoctorDetailsDto;
  facility: FacilityDetailsDto;
  
  // Optional details for completed appointments
  billing?: BillingDetailsDto | null;
  prescriptions?: PrescriptionDetailsDto[] | null;
}
export interface AppointmentDetails{
  data:AppointmentDetailsDto
}

// Patient Details DTO
export interface PatientDetailsDto {
  id: string;
  fullName: string;
  nationalID: string;
  gender: string;
  age: number;
}

// Doctor Details DTO
export interface DoctorDetailsDto {
  id: string;
  fullName: string;
  gender: string;
  age: number;
  licenseNumber: string;
  specialization: string;
}

// Facility Details DTO
export interface FacilityDetailsDto {
  id: string;
  name: string;
  type: string;
  address: AddressDto;
  gpsLatitude: number;
  gpsLongitude: number;
}

// Address DTO
export interface AddressDto {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Billing Details DTO
export interface BillingDetailsDto {
  id: string;
  totalAmount: number;
  status: string;
  dateIssued: string;
  paymentDate?: string | null;
  paidAmount?: number | null;
}

// Prescription Details DTO
export interface PrescriptionDetailsDto {
  id: string;
  dateIssued: string;
  medicationList: string;
  dosageInstructions: string;
}

// Appointment Completion Response DTO
export interface AppointmentCompletionDto {
  appointmentId: string;
  status: string;
  medicalRecordId: string;
  prescriptionId: string;
  billingPaid: boolean;
}

// Query Parameters for doctor appointments
export interface AppointmentsQueryParams {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  startdate?: string;
  enddate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

// Appointments Response with pagination
export interface AppointmentsResponse {
  data: Appointment[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
