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

    console.log('Making request to:', url);
    console.log('Request config:', {
      method: config.method,
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined,
    });

    const response = await fetch(url, config);

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
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

    // Ensure time format is correct (HH:mm:ss)
    const formattedData = {
      ...data,
      startTime: this.formatTime(data.startTime),
      endTime: this.formatTime(data.endTime),
    };

    console.log('Creating schedule exception with data:', formattedData);

    return this.request<ScheduleException>('health-care-facilities/me/schedule-exceptions', {
      method: 'POST',
      headers,
      body: JSON.stringify(formattedData),
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

    // Ensure time format is correct (HH:mm:ss)
    const formattedData = {
      ...data,
      startTime: this.formatTime(data.startTime),
      endTime: this.formatTime(data.endTime),
    };

    console.log('Updating schedule exception with data:', formattedData);

    return this.request<ScheduleException>(`health-care-facilities/me/schedule-exceptions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(formattedData),
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

  // Helper method to format time to HH:mm:ss
  private formatTime(time: string): string {
    // If time is already in HH:mm:ss format, return as is
    if (time.includes(':')) {
      const parts = time.split(':');
      if (parts.length === 2) {
        // Convert HH:mm to HH:mm:ss
        return `${time}:00`;
      }
      return time;
    }
    return time;
  }
}

export const scheduleExceptionService = new ScheduleExceptionService();