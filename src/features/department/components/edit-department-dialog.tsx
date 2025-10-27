// src/features/departments/components/edit-department-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateDepartmentRequest, Department } from '../types/department';
import { DepartmentForm } from './department-form';

interface EditDepartmentDialogProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateDepartmentRequest) => void;
  isLoading?: boolean;
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditDepartmentDialogProps) {
  const handleSubmit = (data: CreateDepartmentRequest) => {
    onSave(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>Update the department information below.</DialogDescription>
        </DialogHeader>
        <DepartmentForm
          department={department}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}