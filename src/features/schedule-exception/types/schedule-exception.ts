// src/features/schedule-exceptions/types/schedule-exception.ts
export interface ScheduleException {
    id: string;
    date: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    status: number;
    reason: string;
    healthCareFacilityId: string;

  }
  
  export interface ScheduleExceptionsResponse {
    data: ScheduleException[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  }
  
  export interface CreateScheduleExceptionRequest {
    date: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    status: number;
    reason: string;
  }
  
  export interface ScheduleExceptionsQueryParams {
    page: number;
    pageSize: number;
    dateFrom?: string;
    dateTo?: string;
  }