// src/features/profile/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile-service';
import { UpdateAvatarResponse, HealthCareFacilityResponse } from '../types/profile';

export const profileKeys = {
  all: ['profile'] as const,
  myProfile: () => [...profileKeys.all, 'me'] as const,
  myFacility: () => [...profileKeys.all, 'facility'] as const,
  avatar: (userId: string) => [...profileKeys.all, 'avatar', userId] as const,
};

// Get user profile
export const useMyProfile = (token: string) => {
  return useQuery({
    queryKey: profileKeys.myProfile(),
    queryFn: () => profileService.getMyProfile(token),
    enabled: !!token,
  });
};

// Get healthcare facility profile (for description) - ADDED THIS
export const useMyFacilityProfile = (token: string) => {
  return useQuery({
    queryKey: profileKeys.myFacility(),
    queryFn: () => profileService.getMyFacilityProfile(token),
    enabled: !!token,
  });
};

// Update facility description
export const useUpdateFacilityDescription = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (description: string) => 
      profileService.updateFacilityDescription(description, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myFacility() });
    },
  });
};

// Update avatar - FIXED: Using file directly
export const useUpdateAvatar = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

// Get avatar image
export const useAvatar = (userId: string, token: string) => {
  return useQuery({
    queryKey: profileKeys.avatar(userId),
    queryFn: () => profileService.getAvatar(userId, token),
    enabled: !!userId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};