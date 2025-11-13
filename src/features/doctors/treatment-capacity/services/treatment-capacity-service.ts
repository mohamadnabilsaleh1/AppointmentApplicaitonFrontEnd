// src/features/treatment-capacity/services/treatment-capacity-service.ts
import {
    TreatmentCapacity,
    TreatmentCapacityResponse,
    CreateTreatmentCapacityRequest,
    UpdateTreatmentCapacityRequest,
  } from '../types/treatment-capacity';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class TreatmentCapacityService {
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
          errorMessage = errorData.title || errorData.detail || errorData.message || errorMessage;
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
  
    async getMyTreatmentCapacity(token: string): Promise<TreatmentCapacityResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      return this.request<TreatmentCapacityResponse>(
        'doctors/me/treatment-capacity',
        { headers },
      );
    }
  
    async createTreatmentCapacity(
      data: CreateTreatmentCapacityRequest,
      token: string,
    ): Promise<TreatmentCapacityResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<TreatmentCapacityResponse>('doctors/me/treatment-capacity', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateTreatmentCapacity(
      data: UpdateTreatmentCapacityRequest,
      token: string,
    ): Promise<TreatmentCapacityResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<TreatmentCapacityResponse>('doctors/me/treatment-capacity', {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deleteTreatmentCapacity(token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request('doctors/me/treatment-capacity', {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const treatmentCapacityService = new TreatmentCapacityService();