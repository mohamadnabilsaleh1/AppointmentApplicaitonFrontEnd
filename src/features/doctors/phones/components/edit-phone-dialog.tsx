// src/features/phones/components/edit-phone-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreatePhoneRequest, Phone } from '../types/phone';
import { PhoneForm } from './phone-form';

interface EditPhoneDialogProps {
  phone: Phone;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreatePhoneRequest) => void;
  isLoading?: boolean;
}

export function EditPhoneDialog({
  phone,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditPhoneDialogProps) {
  const handleSubmit = (data: CreatePhoneRequest) => {
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
          <DialogTitle>Edit Phone</DialogTitle>
          <DialogDescription>Update the phone information below.</DialogDescription>
        </DialogHeader>
        <PhoneForm
          phone={phone}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}