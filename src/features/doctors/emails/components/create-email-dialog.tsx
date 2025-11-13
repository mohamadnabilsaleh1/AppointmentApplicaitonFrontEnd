// src/features/emails/components/create-email-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateEmailRequest } from "../types/email";
import { EmailForm } from "./email-form";

interface CreateEmailDialogProps {
  onSave: (data: CreateEmailRequest) => void;
  isLoading?: boolean;
}

export function CreateEmailDialog({
  onSave,
  isLoading,
}: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateEmailRequest) => {
    onSave(data);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Email</DialogTitle>
          <DialogDescription>
            Add a new email address to your profile. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <EmailForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}