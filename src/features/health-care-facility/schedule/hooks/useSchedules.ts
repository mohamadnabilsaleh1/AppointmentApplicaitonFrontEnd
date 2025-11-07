// src/features/schedules/hooks/useSchedules.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateScheduleRequest, SchedulesQueryParams } from '../types/schedule';
import { scheduleService } from '../services/schedule-service';

export const scheduleKeys = {
  all: ['health-care-facility-schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (params: SchedulesQueryParams) => [...scheduleKeys.lists(), params] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
};

export const useSchedules = (params: SchedulesQueryParams, token: string) => {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => scheduleService.getMySchedules(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSchedule = (id: string, token: string) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleService.getScheduleById(id, token),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSchedule = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) =>
      scheduleService.createSchedule(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

export const useUpdateSchedule = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateScheduleRequest }) =>
      scheduleService.updateSchedule(id, data, token),
    onSuccess: (updatedSchedule, variables) => {
      queryClient.setQueryData(scheduleKeys.detail(variables.id), updatedSchedule);
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

export const useDeleteSchedule = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.deleteSchedule(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};