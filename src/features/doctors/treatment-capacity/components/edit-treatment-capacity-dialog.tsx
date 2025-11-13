// src/features/treatment-capacity/components/edit-treatment-capacity-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateTreatmentCapacityRequest, TreatmentCapacity } from '../types/treatment-capacity';
import { TreatmentCapacityForm } from './treatment-capacity-form';

interface EditTreatmentCapacityDialogProps {
  treatmentCapacity: TreatmentCapacity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateTreatmentCapacityRequest) => void;
  isLoading?: boolean;
}

export function EditTreatmentCapacityDialog({
  treatmentCapacity,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditTreatmentCapacityDialogProps) {
  const handleSubmit = (data: CreateTreatmentCapacityRequest) => {
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
          <DialogTitle>Edit Treatment Capacity</DialogTitle>
          <DialogDescription>Update your treatment capacity settings.</DialogDescription>
        </DialogHeader>
        <TreatmentCapacityForm
          treatmentCapacity={treatmentCapacity}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}