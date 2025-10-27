// src/types/doctor.ts
export interface Doctor {
    Id: string;
    HealthCareFacilityId: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Gender: string;
    Specialization: string;
    Age: number;
    LicenseNumber: string;
    DateOfBirth: string;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
  }
  
  export interface DoctorsResponse {
    data: Doctor[];
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
  
  export interface CreateDoctorRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: number;
    dateOfBirth: string;
    specialization: number;
    licenseNumber: string;
  }
  
  export interface DoctorsQueryParams {
    page: number;
    pageSize: number;
    q?: string;
    specialization?: string;
    sort?: string;
  }
  
  export interface GenderOption {
    value: number;
    label: string;
  }
  
  export interface SpecializationOption {
    value: number;
    label: string;
  }