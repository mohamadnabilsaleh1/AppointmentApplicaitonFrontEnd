// src/services/notification-service.ts
import { NotificationsResponse } from "../types/notification";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

class NotificationService {
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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Handle 204 No Content and other empty responses
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return {} as T;
    }

    try {
      return await response.json() as T;
    } catch (jsonError) {
      // If JSON parsing fails but response was successful, return empty object
      if (response.ok) {
        return {} as T;
      }
      throw jsonError;
    }
  }

  async getNotifications(token: string, page: number = 1, pageSize: number = 10): Promise<NotificationsResponse> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());

    return this.request<NotificationsResponse>(
      `notifications?${searchParams.toString()}`,
      { headers }
    );
  }

  async markAsRead(notificationId: string, token: string): Promise<void> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // This endpoint returns 204 No Content, so we don't expect a response body
    await this.request(`notifications/${notificationId}/read`, {
      method: 'PUT',
      headers,
    });
  }

  async markAllAsRead(token: string): Promise<void> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // This endpoint returns 204 No Content, so we don't expect a response body
    await this.request('notifications/read-all', {
      method: 'PUT',
      headers,
    });
  }

  async getUnreadCount(token: string): Promise<number> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await this.request<{ data: { count: number } }>(
      'notifications/unread/count',
      { headers }
    );
    return response.data.count;
  }
}

export const notificationService = new NotificationService();