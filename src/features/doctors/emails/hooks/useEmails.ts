// src/features/emails/hooks/useEmails.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEmailRequest, UpdateEmailRequest, EmailsQueryParams } from '../types/email';
import { emailService } from '../services/email-service';

export const emailKeys = {
  all: ['user-emails'] as const,
  lists: () => [...emailKeys.all, 'list'] as const,
  list: (params: EmailsQueryParams) => [...emailKeys.lists(), params] as const,
  details: () => [...emailKeys.all, 'detail'] as const,
  detail: (id: string) => [...emailKeys.details(), id] as const,
};

export const useEmails = (params: EmailsQueryParams, token: string) => {
  return useQuery({
    queryKey: emailKeys.list(params),
    queryFn: () => emailService.getMyEmails(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateEmail = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmailRequest) =>
      emailService.createEmail(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
};

export const useUpdateEmail = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmailRequest }) =>
      emailService.updateEmail(id, data, token),
    onSuccess: (updatedEmail, variables) => {
      queryClient.setQueryData(emailKeys.detail(variables.id), updatedEmail);
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
};

export const useDeleteEmail = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emailService.deleteEmail(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
};