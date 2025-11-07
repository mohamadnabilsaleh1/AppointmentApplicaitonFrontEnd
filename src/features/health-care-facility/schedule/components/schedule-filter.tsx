// src/features/schedules/components/schedule-filter.tsx
'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dayOfWeekOptions } from '@/features/department/constants/schedule-constants';

interface ScheduleFilterProps {
  dayOfWeek?: number;
  onDayOfWeekChange: (dayOfWeek: number | undefined) => void;
  onClear: () => void;
}

export function ScheduleFilter({
  dayOfWeek,
  onDayOfWeekChange,
  onClear,
}: ScheduleFilterProps) {
  const currentDay = dayOfWeekOptions.find(option => option.value === dayOfWeek);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {currentDay ? currentDay.label : 'Day of Week'}
          {dayOfWeek !== undefined && (
            <X 
              className="h-4 w-4 ml-2" 
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dayOfWeekOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onDayOfWeekChange(option.value)}
            className={dayOfWeek === option.value ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}