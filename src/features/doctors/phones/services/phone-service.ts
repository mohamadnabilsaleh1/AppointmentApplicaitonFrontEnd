// src/features/phones/services/phone-service.ts
import {
    Phone,
    PhonesResponse,
    CreatePhoneRequest,
    UpdatePhoneRequest,
    PhonesQueryParams,
  } from '../types/phone';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class PhoneService {
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
  
    async getMyPhones(
      params: PhonesQueryParams,
      token: string,
    ): Promise<PhonesResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  
      return this.request<PhonesResponse>(
        `users/me/phones?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async createPhone(
      data: CreatePhoneRequest,
      token: string,
    ): Promise<Phone> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Phone>('users/me/phones', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updatePhone(
      id: string,
      data: UpdatePhoneRequest,
      token: string,
    ): Promise<Phone> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Phone>(`users/me/phones/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deletePhone(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`users/me/phones/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const phoneService = new PhoneService();