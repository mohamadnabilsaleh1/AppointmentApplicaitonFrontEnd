// src/features/schedule-exceptions/components/schedule-exception-filter.tsx
'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScheduleExceptionFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (dateFrom: string) => void;
  onDateToChange: (dateTo: string) => void;
  onClear: () => void;
}

export function ScheduleExceptionFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: ScheduleExceptionFilterProps) {
  const hasFilters = dateFrom || dateTo;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="date"
          placeholder="From date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-full sm:w-auto"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="date"
          placeholder="To date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>
      
      {hasFilters && (
        <Button variant="outline" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}