// src/features/schedules/types/schedule.ts
export interface Schedule {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    status: number;
    isAvailable: boolean;
    note: string;
    healthCareFacilityId: string;
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
  
  export interface CreateScheduleRequest {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    status: number;
    isAvailable: boolean;
    note: string;
  }
  
  export interface SchedulesQueryParams {
    page: number;
    pageSize: number;
    dayOfWeek?: number;
  }