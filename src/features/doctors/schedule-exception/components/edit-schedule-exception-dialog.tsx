// src/features/schedule-exceptions/components/edit-schedule-exception-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateScheduleExceptionRequest, ScheduleException } from '../types/schedule-exception';
import { ScheduleExceptionForm } from './schedule-exception-form';

interface EditScheduleExceptionDialogProps {
  exception: ScheduleException;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateScheduleExceptionRequest) => void;
  isLoading?: boolean;
}

export function EditScheduleExceptionDialog({
  exception,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditScheduleExceptionDialogProps) {
  const handleSubmit = (data: CreateScheduleExceptionRequest) => {
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
          <DialogTitle>Edit Schedule Exception</DialogTitle>
          <DialogDescription>Update the schedule exception information below.</DialogDescription>
        </DialogHeader>
        <ScheduleExceptionForm
          exception={exception}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}