// src/features/appointments/services/appointment-service.ts
import { Appointment, AppointmentDetailsDto, AppointmentCompletionDto, AppointmentsQueryParams, AppointmentsResponse, AppointmentStatus, AppointmentDetails } from '../types/appointment';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';


export interface CancelAppointmentRequest {
  cancellationreason: string;
}

export interface CompleteAppointmentRequest {
  diagnosis: string;
  treatmentNotes?: string;
  followUpInstructions?: string;
  medicationList?: string;
  dosageInstructions?: string;
}

class AppointmentService {
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
        } catch {
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

  // Transform PascalCase to camelCase
  private transformAppointment(apt: Record<string, unknown>): Appointment {
    // Handle both PascalCase (from backend) and camelCase (already transformed)
    const getString = (pascalKey: string, camelKey: string, defaultValue = ''): string => {
      return String(apt[pascalKey] ?? apt[camelKey] ?? defaultValue);
    };

    const getNumber = (pascalKey: string, camelKey: string, defaultValue = 0): number => {
      const value = apt[pascalKey] ?? apt[camelKey] ?? defaultValue;
      return typeof value === 'number' ? value : Number(value) || defaultValue;
    };

    const getStatus = (): AppointmentStatus => {
      const status = apt['Status'] ?? apt['status'] ?? 'Pending';
      return String(status) as AppointmentStatus;
    };

    const getNestedString = (obj: Record<string, unknown> | undefined, pascalKey: string, camelKey: string, defaultValue = ''): string => {
      if (!obj) return defaultValue;
      return String(obj[pascalKey] ?? obj[camelKey] ?? defaultValue);
    };

    const getNestedStringOrNull = (obj: Record<string, unknown> | undefined, pascalKey: string, camelKey: string): string | null => {
      if (!obj) return null;
      const value = obj[pascalKey] ?? obj[camelKey];
      return value ? String(value) : null;
    };

    const patientObj = (apt.Patient || apt.patient) as Record<string, unknown> | undefined;
    const doctorObj = (apt.Doctor || apt.doctor) as Record<string, unknown> | undefined;
    const facilityObj = (apt.Facility || apt.facility) as Record<string, unknown> | undefined;

    return {
      id: getString('Id', 'id', ''),
      scheduledDate: getString('ScheduledDate', 'scheduledDate', ''),
      scheduledTime: getString('ScheduledTime', 'scheduledTime', ''),
      durationMinutes: getNumber('DurationMinutes', 'durationMinutes', 0),
      status: getStatus(),
      bookingDate: getString('BookingDate', 'bookingDate', ''),
      notes: getString('Notes', 'notes', ''),
      cancellationReason: getNestedStringOrNull(apt as Record<string, unknown>, 'CancellationReason', 'cancellationReason'),
      patient: {
        id: getNestedString(patientObj, 'Id', 'id', ''),
        fullName: getNestedString(patientObj, 'FullName', 'fullName', ''),
        nationalID: getNestedStringOrNull(patientObj, 'NationalID', 'nationalID'),
      },
      doctor: {
        id: getNestedString(doctorObj, 'Id', 'id', ''),
        fullName: getNestedString(doctorObj, 'FullName', 'fullName', ''),
        specialization: getNestedString(doctorObj, 'Specialization', 'specialization', ''),
      },
      facility: {
        id: getNestedString(facilityObj, 'Id', 'id', ''),
        name: getNestedString(facilityObj, 'Name', 'name', ''),
        address: getNestedString(facilityObj, 'Address', 'address', ''),
      },
    };
  }

  async getAppointments(
    params: AppointmentsQueryParams,
    token: string,
  ): Promise<AppointmentsResponse> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const searchParams = new URLSearchParams();
    
    if (params.status) {
      searchParams.append('status', params.status);
    }
    if (params.startdate) {
      searchParams.append('startdate', params.startdate);
    }
    if (params.enddate) {
      searchParams.append('enddate', params.enddate);
    }
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    const queryString = searchParams.toString();
    const endpoint = `doctors/me/appointments${queryString ? `?${queryString}` : ''}`;

    interface RawResponse {
      data: unknown[];
      pagination?: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
      links?: Array<{ href: string; rel: string; method: string }>;
    }

    const response = await this.request<RawResponse>(endpoint, { headers });
    
    // Transform the response data from PascalCase to camelCase
    const transformedData = Array.isArray(response.data)
      ? response.data.map((apt: unknown) => this.transformAppointment(apt as Record<string, unknown>))
      : [];

    return {
      data: transformedData,
      pagination: response.pagination || {
        page: 1,
        pageSize: 10,
        totalCount: transformedData.length,
        totalPages: 1,
      },
      links: response.links || [],
    };
  }

  async getAppointmentDetails(
    appointmentId: string,
    token: string,
  ): Promise<AppointmentDetails> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    return this.request<AppointmentDetails>(
      `doctors/me/appointments/${appointmentId}`,
      { headers },
    );
  }

  async confirmAppointment(
    appointmentId: string,
    token: string,
  ): Promise<Appointment> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    return this.request<Appointment>(
      `doctors/me/appointments/${appointmentId}/confirm`,
      {
        method: 'PUT',
        headers,
      },
    );
  }

  async cancelAppointment(
    appointmentId: string,
    data: CancelAppointmentRequest,
    token: string,
  ): Promise<Appointment> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return this.request<Appointment>(
      `doctors/me/appointments/${appointmentId}/cancel`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      },
    );
  }

  async completeAppointment(
    appointmentId: string,
    data: CompleteAppointmentRequest,
    token: string,
  ): Promise<AppointmentCompletionDto> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return this.request<AppointmentCompletionDto>(
      `doctors/me/appointments/${appointmentId}/complete`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      },
    );
  }
}

export const appointmentService = new AppointmentService();

