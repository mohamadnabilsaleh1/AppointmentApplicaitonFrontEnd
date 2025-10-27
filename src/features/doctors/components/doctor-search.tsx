"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DoctorSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function DoctorSearch({
  searchTerm,
  onSearchChange,
  placeholder = "Search doctors by name..."
}: DoctorSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full md:w-80"
      />
    </div>
  );
}


import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { specializationOptions } from '../constants/doctors';

interface DoctorSpecializationFilterProps {
  specialization: string;
  onSpecializationChange: (specialization: string) => void;
  onClear: () => void;
}

export function DoctorSpecializationFilter({
  specialization,
  onSpecializationChange,
  onClear,
}: DoctorSpecializationFilterProps) {
  const currentSpecialization = specializationOptions.find(option => option.value.toString() === specialization);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {currentSpecialization ? currentSpecialization.label : 'Specialization'}
          {specialization && (
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
        {specializationOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSpecializationChange(option.value.toString())}
            className={specialization === option.value.toString() ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}