import { HealthCareFacilityResponse, UpdateAvatarResponse, UserProfile } from "../types/profile";

// src/features/profile/services/profile-service.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

class ProfileService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token: string
  ): Promise<T> {
    const url = `${BASE_URL}/api${endpoint}`;

    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const config: RequestInit = {
      headers,
      ...options,
    };

    console.log('Making request to:', url);

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        errorMessage = errorData.title || errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Get user profile
  async getMyProfile(token: string): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me', {}, token);
  }

  // Get healthcare facility profile (for description)
  async getMyFacilityProfile(token: string): Promise<HealthCareFacilityResponse> {
    return this.request<HealthCareFacilityResponse>('/health-care-facilities/me', {}, token);
  }

  // Update facility description
  async updateFacilityDescription(description: string, token: string): Promise<void> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,

    };

    return this.request('/health-care-facilities/me/description', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description }),
    }, token);
  }

  // Update avatar - FIXED: Using direct file parameter
  async updateAvatar(file: File, token: string): Promise<UpdateAvatarResponse> {
    const formData = new FormData();
    formData.append('File', file); // Capital F to match backend

    console.log('Uploading avatar with field name: File');

    return this.request<UpdateAvatarResponse>('/users/me/avatar', {
      method: 'PUT',
      body: formData,
    }, token);
  }

  // Get avatar image
  async getAvatar(userId: string, token: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/avatar`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const profileService = new ProfileService();