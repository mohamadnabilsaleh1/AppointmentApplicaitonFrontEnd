// src/features/schedules/components/schedule-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Schedule } from "../types/schedule";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: ScheduleCardProps) {
  const isAvailable = schedule.isAvailable;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              {schedule.dayOfWeek}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {schedule.startTime} - {schedule.endTime}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className="text-xs"
            >
              {isAvailable ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(schedule)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(schedule)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant="outline" className="text-xs">
            {schedule.status}
          </Badge>
        </div>

        {schedule.note && (
          <div>
            <p className="text-sm font-medium mb-1">Note</p>
            <p className="text-sm text-muted-foreground">
              {schedule.note}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            ID: {schedule.id.slice(0, 8)}...
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}