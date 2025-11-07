// src/hooks/use-signalr.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './use-notifications';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { signalRService } from '../services/signalr-service';

export const useSignalR = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const connectionStarted = useRef(false);
  const [connectionState, setConnectionState] = useState<'Disconnected' | 'Connecting' | 'Connected'>('Disconnected');

  const handleNewNotification = useCallback((notification: any) => {
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: 'default',
    });

    // Invalidate notifications query to refetch
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  }, [toast, queryClient]);

  useEffect(() => {
    if (!token || !user?.id) {
      return;
    }

    const initializeConnection = async () => {
      if (connectionStarted.current) {
        return;
      }

      try {
        setConnectionState('Connecting');
        await signalRService.startConnection(token);
        
        // Add small delay to ensure connection is established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await signalRService.joinUserGroup(user.id);
        signalRService.onReceiveNotification(handleNewNotification);
        
        connectionStarted.current = true;
        setConnectionState('Connected');
        
        console.log('SignalR connection initialized successfully');
      } catch (error) {
        console.error('Failed to initialize SignalR connection:', error);
        setConnectionState('Disconnected');
        connectionStarted.current = false;
        
        // Retry connection after 5 seconds
        setTimeout(() => {
          if (token && user?.id) {
            initializeConnection();
          }
        }, 5000);
      }
    };

    initializeConnection();

    return () => {
      if (connectionStarted.current) {
        signalRService.offReceiveNotification(handleNewNotification);
        if (user?.id) {
          signalRService.leaveUserGroup(user.id);
        }
        // Don't stop connection completely, just remove handlers
        // signalRService.stopConnection();
        connectionStarted.current = false;
        setConnectionState('Disconnected');
      }
    };
  }, [token, user?.id, handleNewNotification]);

  return { connectionState };
};