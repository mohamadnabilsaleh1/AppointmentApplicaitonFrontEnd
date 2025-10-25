// services/healthcare-facility-service.ts
import {
  HealthcareFacility,
  HealthcareFacilitiesResponse,
  CreateHealthcareFacilityRequest,
  HealthcareFacilitiesQueryParams,
} from '../types/healthcare-facility';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

class HealthcareFacilityService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}/api/${endpoint}`;

    // Ensure Content-Type is always set for requests with body
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
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.title || errorData.detail || errorMessage;
        console.error('Error response data:', errorData);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Check if response has content before parsing
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // services/healthcare-facility-service.ts

  async getHealthcareFacilities(
    params: HealthcareFacilitiesQueryParams,
    token?: string,
  ): Promise<HealthcareFacilitiesResponse> {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const searchParams = new URLSearchParams();
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());

    // Add optional parameters if they exist
    if (params.q) {
      searchParams.append('q', params.q);
    }
    if (params.city) {
      searchParams.append('city', params.city);
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    console.log('Fetching facilities with params:', Object.fromEntries(searchParams));

    return this.request<HealthcareFacilitiesResponse>(
      `health-care-facilities?${searchParams.toString()}`,
      { headers },
    );
  }

  async getHealthcareFacilityById(id: string, token?: string): Promise<HealthcareFacility> {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<HealthcareFacility>(`health-care-facilities/${id}`, { headers });
  }

  async createHealthcareFacility(
    data: CreateHealthcareFacilityRequest,
    token: string,
  ): Promise<HealthcareFacility> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    console.log('Creating healthcare facility with data:', data);

    return this.request<HealthcareFacility>('health-care-facilities', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async updateHealthcareFacility(
    id: string,
    data: CreateHealthcareFacilityRequest,
    token: string,
  ): Promise<HealthcareFacility> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    return this.request<HealthcareFacility>(`health-care-facilities/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  async updateMyHealthcareFacility(
    data: CreateHealthcareFacilityRequest,
    token: string,
  ): Promise<HealthcareFacility> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    return this.request<HealthcareFacility>('health-care-facilities/me', {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  async activateHealthcareFacility(id: string, token: string): Promise<void> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    await this.request(`health-care-facilities/${id}/activate`, {
      method: 'PATCH',
      headers,
    });
  }

  async deactivateHealthcareFacility(id: string, token: string): Promise<void> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    await this.request(`health-care-facilities/${id}/deactivate`, {
      method: 'PATCH',
      headers,
    });
  }
}

export const healthcareFacilityService = new HealthcareFacilityService();