// src/features/phones/components/create-phone-dialog.tsx
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
import { CreatePhoneRequest } from "../types/phone";
import { PhoneForm } from "./phone-form";

interface CreatePhoneDialogProps {
  onSave: (data: CreatePhoneRequest) => void;
  isLoading?: boolean;
}

export function CreatePhoneDialog({
  onSave,
  isLoading,
}: CreatePhoneDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreatePhoneRequest) => {
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
          Add Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Phone</DialogTitle>
          <DialogDescription>
            Add a new phone number to your profile. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <PhoneForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}