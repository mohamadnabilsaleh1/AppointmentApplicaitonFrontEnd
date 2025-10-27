// src/features/departments/components/department-search.tsx
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DepartmentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function DepartmentSearch({
  searchTerm,
  onSearchChange,
  placeholder = "Search departments by name..."
}: DepartmentSearchProps) {
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