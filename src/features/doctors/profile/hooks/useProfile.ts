// src/features/doctors/profile/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile-service';
import { UpdateAvatarResponse } from '../types/profile';

export const profileKeys = {
  all: ['profile'] as const,
  myProfile: () => [...profileKeys.all, 'me'] as const,
  myDoctor: () => [...profileKeys.all, 'doctor'] as const,
};

// Get user profile
export const useMyProfile = (token: string) => {
  return useQuery({
    queryKey: profileKeys.myProfile(),
    queryFn: () => profileService.getMyProfile(token),
    enabled: !!token,
  });
};

// Get doctor profile (for description)
export const useMyDoctorProfile = (token: string) => {
  return useQuery({
    queryKey: profileKeys.myDoctor(),
    queryFn: () => profileService.getMyDoctorProfile(token),
    enabled: !!token,
  });
};

// Update doctor description
export const useUpdateDoctorDescription = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (description: string) => 
      profileService.updateDoctorDescription(description, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myDoctor() });
    },
  });
};

// Update avatar
export const useUpdateAvatar = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
      queryClient.invalidateQueries({ queryKey: profileKeys.myDoctor() });
    },
  });
};