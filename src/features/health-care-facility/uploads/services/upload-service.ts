// services/upload-service.ts
import { Upload, CreateUploadRequest, UpdateUploadRequest } from '../types/upload';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class UploadService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/health-care-facilities`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Authorization':"Bearer " +  token,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Create upload with file
  async createUpload(data: CreateUploadRequest, token: string): Promise<Upload> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('visibility', data.visibility.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }

    return this.request<Upload>('/me/uploads', {
      method: 'POST',
      body: formData,
    }, token);
  }

  // Get all uploads
  async getUploads(token: string): Promise<Upload[]> {

    return await this.request<Upload[]>('/me/uploads', {}, token);
  }

  // Get upload by ID
  async getUploadById(id: string, token: string): Promise<Upload> {
    return this.request<Upload>(`/me/uploads/${id}`, {}, token);
  }

  // Update upload
  async updateUpload(id: string, data: UpdateUploadRequest, token: string): Promise<Upload> {
    return this.request<Upload>(`/me/uploads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }, token);
  }

  // Delete upload
  async deleteUpload(id: string, token: string): Promise<void> {
    await this.request(`/me/uploads/${id}`, {
      method: 'DELETE',
    }, token);
  }

  // Get facility uploads (for admin)
  async getFacilityUploads(facilityId: string, token: string): Promise<Upload[]> {
    return this.request<Upload[]>(`/${facilityId}/uploads`, {}, token);
  }

  // Get facility upload by ID (for admin)
  async getFacilityUploadById(facilityId: string, uploadId: string, token: string): Promise<Upload> {
    return this.request<Upload>(`/${facilityId}/uploads/${uploadId}`, {}, token);
  }
}

export const uploadService = new UploadService();