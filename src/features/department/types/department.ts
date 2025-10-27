import { Doctor } from "@/features/doctors/types/doctor";

// src/features/departments/types/department.ts
export interface Department {
    id: string;
    name: string;
    description: string;
    healthCareFacilityId: string;
  }
  
  export interface DepartmentsResponse {
    data: Department[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  }
  
  export interface CreateDepartmentRequest {
    name: string;
    description: string;
  }
  
  export interface DepartmentsQueryParams {
    page: number;
    pageSize: number;
    q?: string;
  }
  
  export interface DepartmentDoctorsResponse {
    data: Doctor[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  }