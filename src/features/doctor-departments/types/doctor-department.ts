import { Department } from "@/features/department/types/department";
import { Doctor } from "@/features/doctors/types/doctor";

// src/features/doctor-departments/types/doctor-department.ts
export interface DoctorDepartment {
    id: string;
    doctorId: string;
    departmentId: string;
    assignedAt: string;
    doctor?: Doctor;
    department?: Department;
  }
  
  export interface AssignDoctorToDepartmentRequest {
    doctorId: string;
    departmentId: string;
  }
  
  export interface DoctorDepartmentQueryParams {
    page: number;
    pageSize: number;
    departmentId?: string;
    doctorId?: string;
  }
  
  export interface DoctorDepartmentResponse {
    data: DoctorDepartment[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  }