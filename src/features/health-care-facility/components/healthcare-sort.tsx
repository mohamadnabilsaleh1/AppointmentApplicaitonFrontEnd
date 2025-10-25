// src/components/healthcare-sort.tsx
'use client';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HealthcareSortProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  // { value: 'city', label: 'City (A-Z)' },
  // { value: 'city_desc', label: 'City (Z-A)' },
  // { value: 'type', label: 'Type' },
];

export function HealthcareSort({
  sortBy,
  onSortChange,
}: HealthcareSortProps) {
  const currentSort = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort: {currentSort.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={sortBy === option.value ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}