// src/components/edit-facility-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HealthcareFacilityForm } from './healthcare-facility-form';
import { CreateHealthcareFacilityRequest, HealthcareFacility } from '../types/healthcare-facility';

interface EditFacilityDialogProps {
  facility: HealthcareFacility;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateHealthcareFacilityRequest) => void;
  isLoading?: boolean;
}

export function EditFacilityDialog({
  facility,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditFacilityDialogProps) {
  const handleSubmit = (data: CreateHealthcareFacilityRequest) => {
    onSave(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Healthcare Facility</DialogTitle>
          <DialogDescription>Update the healthcare facility information below.</DialogDescription>
        </DialogHeader>
        <HealthcareFacilityForm
          facility={facility}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}