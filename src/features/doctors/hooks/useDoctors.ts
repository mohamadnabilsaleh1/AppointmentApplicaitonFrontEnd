// src/hooks/use-doctors.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateDoctorRequest, DoctorsQueryParams } from '../types/doctor';
import { doctorService } from '../services/doctor-service';

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: DoctorsQueryParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
};

export const useDoctors = (params: DoctorsQueryParams, token: string) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getDoctors(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllDoctors = (params: DoctorsQueryParams, token: string) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getAllDoctors(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctor = (id: string, token: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorService.getDoctorById(id, token),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDoctor = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorRequest) =>
      doctorService.createDoctor(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
  });
};

export const useUpdateDoctor = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorRequest> }) =>
      doctorService.updateDoctor(id, data, token),
    onSuccess: (updatedDoctor, variables) => {
      queryClient.setQueryData(doctorKeys.detail(variables.id), updatedDoctor);
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
  });
};

export const useToggleDoctorStatus = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate
        ? doctorService.activateDoctor(id, token)
        : doctorService.deactivateDoctor(id, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
  });
};