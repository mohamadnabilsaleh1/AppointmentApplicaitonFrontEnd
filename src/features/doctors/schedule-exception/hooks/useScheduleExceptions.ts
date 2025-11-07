// src/features/schedule-exceptions/hooks/useScheduleExceptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateScheduleExceptionRequest, ScheduleExceptionsQueryParams } from '../types/schedule-exception';
import { scheduleExceptionService } from '../services/schedule-exception-service';

export const scheduleExceptionKeys = {
  all: ['doctors-schedule-exceptions'] as const,
  lists: () => [...scheduleExceptionKeys.all, 'list'] as const,
  list: (params: ScheduleExceptionsQueryParams) => [...scheduleExceptionKeys.lists(), params] as const,
  details: () => [...scheduleExceptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleExceptionKeys.details(), id] as const,
};

export const useScheduleExceptions = (params: ScheduleExceptionsQueryParams, token: string) => {
  return useQuery({
    queryKey: scheduleExceptionKeys.list(params),
    queryFn: () => scheduleExceptionService.getMyScheduleExceptions(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useScheduleException = (id: string, token: string) => {
  return useQuery({
    queryKey: scheduleExceptionKeys.detail(id),
    queryFn: () => scheduleExceptionService.getScheduleExceptionById(id, token),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateScheduleException = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleExceptionRequest) =>
      scheduleExceptionService.createScheduleException(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleExceptionKeys.lists() });
    },
  });
};

export const useUpdateScheduleException = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateScheduleExceptionRequest }) =>
      scheduleExceptionService.updateScheduleException(id, data, token),
    onSuccess: (updatedException, variables) => {
      queryClient.setQueryData(scheduleExceptionKeys.detail(variables.id), updatedException);
      queryClient.invalidateQueries({ queryKey: scheduleExceptionKeys.lists() });
    },
  });
};

export const useDeleteScheduleException = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleExceptionService.deleteScheduleException(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleExceptionKeys.lists() });
    },
  });
};