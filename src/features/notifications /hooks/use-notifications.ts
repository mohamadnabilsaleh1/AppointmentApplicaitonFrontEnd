// src/hooks/use-notifications.ts
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: any) => [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

export const useNotifications = (page: number = 1, pageSize: number = 10) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: notificationKeys.list({ page, pageSize }),
    queryFn: () => notificationService.getNotifications(token!, page, pageSize),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUnreadCount = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(token!),
    enabled: !!token,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.markAsRead(notificationId, token!),
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(notificationKeys.all);
      const previousUnreadCount = queryClient.getQueryData(notificationKeys.unreadCount());

      // Optimistically update the notifications list
      queryClient.setQueriesData(
        { queryKey: notificationKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;
          
          return {
            ...old,
            data: old.data.map((notification: any) =>
              notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification
            ),
          };
        }
      );

      // Optimistically update the unread count
      queryClient.setQueryData(
        notificationKeys.unreadCount(),
        (old: number) => Math.max(0, (old || 0) - 1)
      );

      return { previousNotifications, previousUnreadCount };
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.all, context.previousNotifications);
      }
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousUnreadCount);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(token!),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(notificationKeys.all);
      const previousUnreadCount = queryClient.getQueryData(notificationKeys.unreadCount());

      // Optimistically update all notifications to read
      queryClient.setQueriesData(
        { queryKey: notificationKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;
          
          return {
            ...old,
            data: old.data.map((notification: any) => ({
              ...notification,
              isRead: true,
            })),
          };
        }
      );

      // Optimistically set unread count to 0
      queryClient.setQueryData(notificationKeys.unreadCount(), 0);

      return { previousNotifications, previousUnreadCount };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.all, context.previousNotifications);
      }
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousUnreadCount);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};