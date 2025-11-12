// services/doctor-service.ts
import {
    Doctor,
    DoctorsResponse,
    CreateDoctorRequest,
    DoctorsQueryParams,
    DoctorsResponseForDoctor,
  } from '../types/doctor';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class DoctorService {
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
  
    async getDoctors(
      params: DoctorsQueryParams,
      token: string,
    ): Promise<DoctorsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.q) {
        searchParams.append('q', params.q);
      }
      if (params.specialization) {
        searchParams.append('specialization', params.specialization);
      }
      if (params.sort) {
        searchParams.append('sort', params.sort);
      }
      
      const data =this.request<DoctorsResponse>(
        `health-care-facilities/me/doctors?${searchParams.toString()}`,
        { headers },
      );
      console.log(await data)
      return await data;
    }
    async getAllDoctors(
      params: DoctorsQueryParams,
      token: string,
    ): Promise<DoctorsResponseForDoctor> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.q) {
        searchParams.append('q', params.q);
      }
      if (params.specialization) {
        searchParams.append('specialization', params.specialization);
      }
      if (params.sort) {
        searchParams.append('sort', params.sort);
      }
      
      const data =this.request<DoctorsResponseForDoctor>(
        `doctors?${searchParams.toString()}`,
        { headers },
      );
      console.log(await data)
      return await data;
    }
  
    async getDoctorById(id: string, token: string): Promise<Doctor> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      return this.request<Doctor>(`doctors/${id}`, { headers });
    }
  
    async createDoctor(
      data: CreateDoctorRequest,
      token: string,
    ): Promise<Doctor> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
  
      return this.request<Doctor>('health-care-facilities/me/doctors', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateDoctor(
      id: string,
      data: Partial<CreateDoctorRequest>,
      token: string,
    ): Promise<Doctor> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
  
      return this.request<Doctor>(`doctors/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async activateDoctor(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`doctors/${id}/activate`, {
        method: 'PATCH',
        headers,
      });
    }
  
    async deactivateDoctor(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`doctors/${id}/deactivate`, {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const doctorService = new DoctorService();