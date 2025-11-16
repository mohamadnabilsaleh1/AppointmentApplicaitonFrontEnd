// src/features/profile/types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

export interface HealthCareFacilityProfile {
  id: string;
  name: string;
  type: number;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
    fullAddress: string;
  };
  gpsLatitude: number;
  gpsLongitude: number;
  email: string;
  description: string;
  departments: any[];
  schedules: any[];
  scheduleExceptions: any[];
}

export interface HealthCareFacilityResponse {
  data: HealthCareFacilityProfile;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface UpdateDescriptionRequest {
  description: string;
}

export interface UpdateAvatarResponse {
  avatar: string;
}