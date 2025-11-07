// src/features/schedules/components/edit-schedule-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateScheduleRequest, Schedule } from '../types/schedule';
import { ScheduleForm } from './schedule-form';

interface EditScheduleDialogProps {
  schedule: Schedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateScheduleRequest) => void;
  isLoading?: boolean;
}

export function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditScheduleDialogProps) {
  const handleSubmit = (data: CreateScheduleRequest) => {
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
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>Update the schedule information below.</DialogDescription>
        </DialogHeader>
        <ScheduleForm
          schedule={schedule}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}