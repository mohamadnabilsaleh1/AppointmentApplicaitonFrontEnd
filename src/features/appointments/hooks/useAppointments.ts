// src/features/appointments/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentsQueryParams } from '../types/appointment';
import {
  CancelAppointmentRequest,
  CompleteAppointmentRequest,
} from '../services/appointment-service';
import { appointmentService } from '../services/appointment-service';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: AppointmentsQueryParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

export const useAppointments = (params: AppointmentsQueryParams, token: string) => {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentService.getAppointments(params, token),
    enabled: !!token,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
};

export const useConfirmAppointment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.confirmAppointment(appointmentId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

export const useCancelAppointment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: CancelAppointmentRequest;
    }) => appointmentService.cancelAppointment(appointmentId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

export const useCompleteAppointment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: CompleteAppointmentRequest;
    }) => appointmentService.completeAppointment(appointmentId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

export const useAppointmentDetails = (appointmentId: string | null, token: string) => {
  return useQuery({
    queryKey: [...appointmentKeys.detail(appointmentId || ''), 'details'],
    queryFn: () => appointmentService.getAppointmentDetails(appointmentId!, token),
    enabled: !!token && !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

