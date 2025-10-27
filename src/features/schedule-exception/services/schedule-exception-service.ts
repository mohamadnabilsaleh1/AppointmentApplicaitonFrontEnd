// src/features/schedule-exceptions/services/schedule-exception-service.ts
import {
    ScheduleException,
    ScheduleExceptionsResponse,
    CreateScheduleExceptionRequest,
    ScheduleExceptionsQueryParams,
  } from '../types/schedule-exception';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class ScheduleExceptionService {
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
  
    async getMyScheduleExceptions(
      params: ScheduleExceptionsQueryParams,
      token: string,
    ): Promise<ScheduleExceptionsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.dateFrom) {
        searchParams.append('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        searchParams.append('dateTo', params.dateTo);
      }
  
      return this.request<ScheduleExceptionsResponse>(
        `health-care-facilities/me/schedule-exceptions?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async getScheduleExceptionById(id: string, token: string): Promise<ScheduleException> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      return this.request<ScheduleException>(`health-care-facilities/me/schedule-exceptions/${id}`, { headers });
    }
  
    async createScheduleException(
      data: CreateScheduleExceptionRequest,
      token: string,
    ): Promise<ScheduleException> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<ScheduleException>('health-care-facilities/me/schedule-exceptions', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateScheduleException(
      id: string,
      data: CreateScheduleExceptionRequest,
      token: string,
    ): Promise<ScheduleException> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<ScheduleException>(`health-care-facilities/me/schedule-exceptions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deleteScheduleException(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`health-care-facilities/me/schedule-exceptions/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const scheduleExceptionService = new ScheduleExceptionService();