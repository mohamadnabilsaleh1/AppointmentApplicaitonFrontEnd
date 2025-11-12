// src/types/doctor.ts
export interface Doctor {
    id: string;
    healthCareFacilityId: string;
    firstName: string;
    lastName: string;
    gender: string;
    specialization: string;
    age: number;
    isActive?:boolean
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

  export interface DoctorForDoctor {
    Id: string;
    FirstName: string;
    LastName: string;
    Gender: string;
    Specialization: string;
    Age: number;
    PrimaryEmail: string;
    PrimaryPhone: string;
    Emails: Array<{
      id: string;
      emailAddress: string;
      label: string;
      isPrimary: boolean;
    }>;
    Phones: Array<{
      id: string;
      phoneNumber: string;
      label: string;
      isPrimary: boolean;
    }>;
  }


  export interface DoctorsResponseForDoctor {
    data: DoctorForDoctor[];
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