// src/hooks/use-healthcare-facilities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateHealthcareFacilityRequest, HealthcareFacilitiesQueryParams } from '../types/healthcare-facility';
import { healthcareFacilityService } from '../services/healthcare-facility-service';


export const healthcareFacilityKeys = {
  all: ['healthcare-facilities'] as const,
  lists: () => [...healthcareFacilityKeys.all, 'list'] as const,
  list: (params: HealthcareFacilitiesQueryParams) => [...healthcareFacilityKeys.lists(), params] as const,
  details: () => [...healthcareFacilityKeys.all, 'detail'] as const,
  detail: (id: string) => [...healthcareFacilityKeys.details(), id] as const,
};

export const useHealthcareFacilities = (params: HealthcareFacilitiesQueryParams, token?: string) => {
  return useQuery({
    queryKey: healthcareFacilityKeys.list(params),
    queryFn: () => healthcareFacilityService.getHealthcareFacilities(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    // keepPreviousData: true,
  });
};

export const useHealthcareFacility = (id: string, token?: string) => {
  return useQuery({
    queryKey: healthcareFacilityKeys.detail(id),
    queryFn: () => healthcareFacilityService.getHealthcareFacilityById(id, token),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateHealthcareFacility = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHealthcareFacilityRequest) =>
      healthcareFacilityService.createHealthcareFacility(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthcareFacilityKeys.lists() });
    },
  });
};

export const useUpdateHealthcareFacility = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateHealthcareFacilityRequest }) =>
      healthcareFacilityService.updateHealthcareFacility(id, data, token),
    onSuccess: (updatedFacility, variables) => {
      queryClient.setQueryData(healthcareFacilityKeys.detail(variables.id), updatedFacility);
      queryClient.invalidateQueries({ queryKey: healthcareFacilityKeys.lists() });
    },
  });
};

export const useToggleFacilityStatus = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate
        ? healthcareFacilityService.activateHealthcareFacility(id, token)
        : healthcareFacilityService.deactivateHealthcareFacility(id, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthcareFacilityKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: healthcareFacilityKeys.lists() });
    },
  });
};