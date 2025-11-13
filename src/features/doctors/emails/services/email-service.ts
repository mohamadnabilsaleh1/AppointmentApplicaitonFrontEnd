// src/features/emails/services/email-service.ts
import {
    Email,
    EmailsResponse,
    CreateEmailRequest,
    UpdateEmailRequest,
    EmailsQueryParams,
  } from '../types/email';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  
  class EmailService {
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
  
    async getMyEmails(
      params: EmailsQueryParams,
      token: string,
    ): Promise<EmailsResponse> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  
      return this.request<EmailsResponse>(
        `users/me/emails?${searchParams.toString()}`,
        { headers },
      );
    }
  
    async createEmail(
      data: CreateEmailRequest,
      token: string,
    ): Promise<Email> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Email>('users/me/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async updateEmail(
      id: string,
      data: UpdateEmailRequest,
      token: string,
    ): Promise<Email> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      return this.request<Email>(`users/me/emails/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  
    async deleteEmail(id: string, token: string): Promise<void> {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      await this.request(`users/me/emails/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  }
  
  export const emailService = new EmailService();