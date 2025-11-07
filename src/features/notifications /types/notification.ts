// src/types/notification.ts
export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    appointmentId?: string;
    patientName?: string;
    doctorName?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    timestamp: string;
    isRead: boolean;
  }
  
  export interface NotificationsResponse {
    data: Notification[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  }