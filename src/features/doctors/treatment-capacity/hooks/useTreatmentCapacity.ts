// src/features/treatment-capacity/hooks/useTreatmentCapacity.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateTreatmentCapacityRequest,
  UpdateTreatmentCapacityRequest,
} from '../types/treatment-capacity';
import { treatmentCapacityService } from '../services/treatment-capacity-service';

export const treatmentCapacityKeys = {
  all: ['treatment-capacity'] as const,
  detail: () => [...treatmentCapacityKeys.all, 'detail'] as const,
};

export const useTreatmentCapacity = (token: string) => {
  return useQuery({
    queryKey: treatmentCapacityKeys.detail(),
    queryFn: () => treatmentCapacityService.getMyTreatmentCapacity(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTreatmentCapacity = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreatmentCapacityRequest) =>
      treatmentCapacityService.createTreatmentCapacity(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentCapacityKeys.all });
    },
  });
};

export const useUpdateTreatmentCapacity = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTreatmentCapacityRequest) =>
      treatmentCapacityService.updateTreatmentCapacity(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentCapacityKeys.all });
    },
  });
};

export const useDeleteTreatmentCapacity = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => treatmentCapacityService.deleteTreatmentCapacity(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentCapacityKeys.all });
    },
  });
};