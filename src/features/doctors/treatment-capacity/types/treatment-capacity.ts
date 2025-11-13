// src/features/treatment-capacity/types/treatment-capacity.ts
export interface TreatmentCapacity {
    doctorId: string;
    maxPatientsPerDay: number;
    sessionDurationMinutes: number;
    isActive: boolean;
  }
  
  export interface TreatmentCapacityResponse {
    data: TreatmentCapacity;
    links: Link[];
  }
  
  export interface CreateTreatmentCapacityRequest {
    maxPatientsPerDay: number;
    sessionDurationMinutes: number;
  }
  
  export interface UpdateTreatmentCapacityRequest {
    maxPatientsPerDay?: number;
    sessionDurationMinutes?: number;
    isActive?: boolean;
  }
  
  export interface Link {
    href: string;
    rel: string;
    method: string;
  }