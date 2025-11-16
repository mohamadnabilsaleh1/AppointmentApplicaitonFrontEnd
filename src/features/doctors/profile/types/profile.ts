// src/features/doctors/profile/types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  specialization: string;
  // Add other doctor fields as needed
}

export interface UpdateDescriptionRequest {
  description: string;
}

export interface UpdateAvatarResponse {
  avatar: string;
}