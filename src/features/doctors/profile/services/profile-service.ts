import { UpdateAvatarResponse, UserProfile } from "../types/profile";

// src/features/doctors/profile/services/profile-service.ts
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

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Get user profile
  async getMyProfile(token: string): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me', {}, token);
  }

  // Get doctor profile (for description)
  async getMyDoctorProfile(token: string): Promise<any> {
    return this.request<any>('/doctors/me', {}, token);
  }

  // Update doctor description
  async updateDoctorDescription(description: string, token: string): Promise<void> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,

    };

    return this.request('/doctors/me/description', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description }),
    }, token);
  }

  // Update avatar
  async updateAvatar(file: File, token: string): Promise<UpdateAvatarResponse> {
    const formData = new FormData();
    formData.append('File', file);

    console.log('Uploading avatar with field name: File');

    return this.request<UpdateAvatarResponse>('/users/me/avatar', {
      method: 'PUT',
      body: formData,
    }, token);
  }

  // Get full avatar URL - USE THE AVATAR FROM PROFILE RESPONSE
  getAvatarUrl(avatarPath: string): string {
    if (!avatarPath) return '';
    
    // If it's already a full URL, use it directly
    if (avatarPath.startsWith('http')) return avatarPath;
    
    // If it's a relative path, prepend the base URL
    return `${BASE_URL}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
  }
}

export const profileService = new ProfileService();