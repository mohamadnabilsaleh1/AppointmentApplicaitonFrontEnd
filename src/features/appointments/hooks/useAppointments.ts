// src/features/appointments/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentsQueryParams } from '../types/appointment';
import {
  CreateAppointmentRequest,
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
  patientAppointments: (patientId: string) => [...appointmentKeys.all, 'patient', patientId] as const,
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

export const useCreateAppointment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createAppointment(data, token),
    onSuccess: (newAppointment) => {
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      
      // Invalidate patient-specific appointments if patientId exists
      if (newAppointment.patient?.id) {
        queryClient.invalidateQueries({ 
          queryKey: appointmentKeys.patientAppointments(newAppointment.patient.id) 
        });
      }
      
      // Optimistically add to current lists if needed
      queryClient.setQueriesData(
        { queryKey: appointmentKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: [newAppointment, ...old.data],
          };
        }
      );
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
    },
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
    queryKey: appointmentKeys.detail(appointmentId || ''),
    queryFn: () => appointmentService.getAppointmentDetails(appointmentId!, token),
    enabled: !!token && !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};