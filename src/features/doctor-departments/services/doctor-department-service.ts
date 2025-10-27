// src/features/doctor-departments/services/doctor-department-service.ts
import { DoctorsResponse } from '@/features/doctors/types/doctor';
import {
    DoctorDepartment,
    DoctorDepartmentResponse,
    AssignDoctorToDepartmentRequest,
    DoctorDepartmentQueryParams,
  } from '../types/doctor-department';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class DoctorDepartmentService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${BASE_URL}/api/${endpoint}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
  
      const config: RequestInit = {
        headers,
        ...options,
      };
  
      const response = await fetch(url, config);
  
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.title || errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
  
        throw new Error(errorMessage);
      }
  
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || response.status === 204) {
        return {} as T;
      }
  
      return response.json() as Promise<T>;
    }
  
    async assignDoctorToDepartment(
      data: AssignDoctorToDepartmentRequest,
      token: string,
    ): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(
        `health-care-facilities/me/departments/${data.departmentId}/doctors/${data.doctorId}`,
        {
          method: 'POST',
          headers,
        },
      );
    }
  
    async removeDoctorFromDepartment(
      departmentId: string,
      doctorId: string,
      token: string,
    ): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(
        `health-care-facilities/me/departments/${departmentId}/doctors/${doctorId}`,
        {
          method: 'DELETE',
          headers,
        },
      );
    }
  
    async getDepartmentDoctors(
      departmentId: string,
      params: { page: number; pageSize: number },
      token: string,
    ): Promise<DoctorsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      return this.request<DoctorsResponse>(
        `health-care-facilities/me/departments/${departmentId}/doctors?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async getDoctorDepartments(
      doctorId: string,
      params: { page: number; pageSize: number },
      token: string,
    ): Promise<DoctorDepartmentResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      return this.request<DoctorDepartmentResponse>(
        `doctors/${doctorId}/departments?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async getAllDoctorDepartments(
      params: DoctorDepartmentQueryParams,
      token: string,
    ): Promise<DoctorDepartmentResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.departmentId) {
        searchParams.append('departmentId', params.departmentId);
      }
      if (params.doctorId) {
        searchParams.append('doctorId', params.doctorId);
      }
  
      return this.request<DoctorDepartmentResponse>(
        `health-care-facilities/me/departments?${searchParams.toString()}`,
        { headers },
      );
    }
  }
  
  export const doctorDepartmentService = new DoctorDepartmentService();