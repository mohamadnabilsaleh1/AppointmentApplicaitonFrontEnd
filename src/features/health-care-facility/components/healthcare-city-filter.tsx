// src/components/healthcare-city-filter.tsx
'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface HealthcareCityFilterProps {
  city: string;
  onCityChange: (city: string) => void;
  onClear: () => void;
}

export function HealthcareCityFilter({
  city,
  onCityChange,
  onClear,
}: HealthcareCityFilterProps) {
  const hasActiveFilter = city !== '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {hasActiveFilter && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              !
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}