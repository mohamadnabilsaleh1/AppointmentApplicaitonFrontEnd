// src/features/schedules/services/schedule-service.ts
import {
    Schedule,
    SchedulesResponse,
    CreateScheduleRequest,
    SchedulesQueryParams,
  } from '../types/schedule';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class ScheduleService {
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
  
    async getMySchedules(
      params: SchedulesQueryParams,
      token: string,
    ): Promise<SchedulesResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      searchParams.append('page', params.page.toString());
      searchParams.append('pageSize', params.pageSize.toString());
  
      if (params.dayOfWeek) {
        searchParams.append('dayOfWeek', params.dayOfWeek.toString());
      }
  
      return this.request<SchedulesResponse>(
        `health-care-facilities/me/schedules?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async getScheduleById(id: string, token: string): Promise<Schedule> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      return this.request<Schedule>(`health-care-facilities/me/schedules/${id}`, { headers });
    }
  
    async createSchedule(
      data: CreateScheduleRequest,
      token: string,
    ): Promise<Schedule> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Schedule>('health-care-facilities/me/schedules', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateSchedule(
      id: string,
      data: CreateScheduleRequest,
      token: string,
    ): Promise<Schedule> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Schedule>(`health-care-facilities/me/schedules/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deleteSchedule(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`health-care-facilities/me/schedules/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const scheduleService = new ScheduleService();