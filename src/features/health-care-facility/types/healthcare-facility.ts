// src/types/healthcare-facility.ts
export interface Address {
  street: string;
  city: string;
  country: string;
  zipCode: string;
  fullAddress: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  note: string;
}

export interface ScheduleException {
  id: string;
  healthcareFacilityId: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}


export interface CreateHealthcareFacilityRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  name: string;
  type: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  gpsLatitude: number;
  gpsLongitude: number;
}

export interface HealthcareFacility {
  Id: string;
  Name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  GPSLatitude: number;
  GPSLongitude: number;
  Type: number;
  Address: Address;
  Departments: Department[];
  Schedules: Schedule[];
  ScheduleExceptions: ScheduleException[];
  isActive?: boolean;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface HealthcareFacilitiesResponse {
  data: HealthcareFacility[];
  pagination: PaginationInfo;
  links: Link[];
}

export interface HealthcareFacilitiesQueryParams {
  page: number;
  pageSize: number;
  q?: string; // Search term
  sort?: string; // Sort parameter
  city?: string; // City filter
}

export interface FilterState {
  city: string;
}