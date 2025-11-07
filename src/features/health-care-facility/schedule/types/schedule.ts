// src/features/schedules/types/schedule.ts
export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: number;
  isActive: boolean;
  note: string;
  healthCareFacilityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulesResponse {
  data: Schedule[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Match the exact API format from your HTTP file
export interface CreateScheduleRequest {
  dayOfWeek: number;
  startTime: string; // Should be in "HH:mm:ss" format
  endTime: string;   // Should be in "HH:mm:ss" format
  status: number;
  isActive: boolean;
  note: string;
}

export interface SchedulesQueryParams {
  page: number;
  pageSize: number;
  dayOfWeek?: number;
}