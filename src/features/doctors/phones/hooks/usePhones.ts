// src/features/phones/hooks/usePhones.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePhoneRequest, UpdatePhoneRequest, PhonesQueryParams } from '../types/phone';
import { phoneService } from '../services/phone-service';

export const phoneKeys = {
  all: ['user-phones'] as const,
  lists: () => [...phoneKeys.all, 'list'] as const,
  list: (params: PhonesQueryParams) => [...phoneKeys.lists(), params] as const,
  details: () => [...phoneKeys.all, 'detail'] as const,
  detail: (id: string) => [...phoneKeys.details(), id] as const,
};

export const usePhones = (params: PhonesQueryParams, token: string) => {
  return useQuery({
    queryKey: phoneKeys.list(params),
    queryFn: () => phoneService.getMyPhones(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePhone = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePhoneRequest) =>
      phoneService.createPhone(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phoneKeys.lists() });
    },
  });
};

export const useUpdatePhone = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePhoneRequest }) =>
      phoneService.updatePhone(id, data, token),
    onSuccess: (updatedPhone, variables) => {
      queryClient.setQueryData(phoneKeys.detail(variables.id), updatedPhone);
      queryClient.invalidateQueries({ queryKey: phoneKeys.lists() });
    },
  });
};

export const useDeletePhone = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => phoneService.deletePhone(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phoneKeys.lists() });
    },
  });
};