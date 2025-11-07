// src/components/notifications-list.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar, User, Clock, Check, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMarkAsRead, useNotifications } from "../hooks/use-notifications";

interface NotificationsListProps {
  onClose: () => void;
}

export function NotificationsList({ onClose }: NotificationsListProps) {
  const { data: notificationsResponse, isLoading } = useNotifications(1, 10);
  const markAsRead = useMarkAsRead();

  const notifications = notificationsResponse?.data || [];

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      // This will optimistically update the UI immediately
      await markAsRead.mutateAsync(notificationId);
    }
    // Close immediately - don't wait for the mutation to complete
    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_CREATED":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "APPOINTMENT_CONFIRMED":
        return <Check className="h-4 w-4 text-green-500" />;
      case "APPOINTMENT_CANCELLED":
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="p-2">
        {notifications.map((notification) => (
          <Button
            key={notification.id}
            variant="ghost"
            className={cn(
              "w-full justify-start p-3 h-auto mb-1",
              "text-left normal-case font-normal",
              !notification.isRead && "bg-blue-50 hover:bg-blue-100"
            )}
            onClick={() =>
              handleNotificationClick(notification.id, notification.isRead)
            }
            disabled={markAsRead.isPending} // Optional: disable during mutation
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-wrap text-muted-foreground mt-1">
                  {notification.message}
                </p>
                {notification.scheduledDate && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(
                        notification.scheduledDate
                      ).toLocaleDateString()}{" "}
                      at {notification.scheduledTime}
                    </span>
                  </div>
                )}
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}