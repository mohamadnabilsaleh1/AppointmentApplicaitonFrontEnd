// src/features/emails/components/edit-email-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateEmailRequest, Email } from '../types/email';
import { EmailForm } from './email-form';

interface EditEmailDialogProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateEmailRequest) => void;
  isLoading?: boolean;
}

export function EditEmailDialog({
  email,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditEmailDialogProps) {
  const handleSubmit = (data: CreateEmailRequest) => {
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
          <DialogTitle>Edit Email</DialogTitle>
          <DialogDescription>Update the email information below.</DialogDescription>
        </DialogHeader>
        <EmailForm
          email={email}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}