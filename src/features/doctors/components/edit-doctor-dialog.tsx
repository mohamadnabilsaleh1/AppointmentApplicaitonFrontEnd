'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DoctorForm } from './doctor-form';
import { CreateDoctorRequest, Doctor } from '../types/doctor';

interface EditDoctorDialogProps {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateDoctorRequest) => void;
  isLoading?: boolean;
}

export function EditDoctorDialog({
  doctor,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditDoctorDialogProps) {
  const handleSubmit = (data: CreateDoctorRequest) => {
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
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>Update the doctor&apos;s information below.</DialogDescription>
        </DialogHeader>
        <DoctorForm
          doctor={doctor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}