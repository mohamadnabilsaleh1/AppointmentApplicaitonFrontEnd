// src/features/schedule-exceptions/components/schedule-exception-card.tsx
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
import { ScheduleException } from "../types/schedule-exception";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { getDayOfWeekLabel, getStatusLabel } from "../constants/schedule-exception-constants";

interface ScheduleExceptionCardProps {
  exception: ScheduleException;
  onEdit: (exception: ScheduleException) => void;
  onDelete: (exception: ScheduleException) => void;
}

export function ScheduleExceptionCard({
  exception,
  onEdit,
  onDelete,
}: ScheduleExceptionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-orange-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Exception: {new Date(exception.date).toLocaleDateString()}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {exception.dayOfWeek} • {exception.startTime} - {exception.endTime}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(exception)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(exception)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant="outline" className="text-xs">
            {getStatusLabel(exception.status)}
          </Badge>
        </div> */}

        <div>
          <p className="text-sm font-medium mb-1">Reason</p>
          <p className="text-sm text-muted-foreground">
            {exception.reason}
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-muted-foreground">
              {exception.startTime} - {exception.endTime}
            </p>
          </div>
        </div> */}

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            ID: {exception.id.slice(0, 8)}...
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}