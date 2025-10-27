// src/features/departments/services/department-service.ts
import {
    Department,
    DepartmentsResponse,
    CreateDepartmentRequest,
    DepartmentsQueryParams,
    DepartmentDoctorsResponse,
  } from '../types/department';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class DepartmentService {
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
  
    async getMyDepartments(
      params: DepartmentsQueryParams,
      token: string,
    ): Promise<DepartmentsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.q) {
        searchParams.append('q', params.q);
      }
  
      return this.request<DepartmentsResponse>(
        `health-care-facilities/me/departments?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async getDepartmentById(id: string, token: string): Promise<Department> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      return this.request<Department>(`health-care-facilities/me/departments/${id}`, { headers });
    }
  
    async createDepartment(
      data: CreateDepartmentRequest,
      token: string,
    ): Promise<Department> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Department>('health-care-facilities/me/departments', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateDepartment(
      id: string,
      data: CreateDepartmentRequest,
      token: string,
    ): Promise<Department> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Department>(`health-care-facilities/me/departments/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deleteDepartment(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`health-care-facilities/me/departments/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  
    async getDepartmentDoctors(
      departmentId: string,
      params: { page: number; pageSize: number },
      token: string,
    ): Promise<DepartmentDoctorsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      return this.request<DepartmentDoctorsResponse>(
        `health-care-facilities/me/departments/${departmentId}/doctors?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async addDoctorToDepartment(
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
  }
  
  export const departmentService = new DepartmentService();