// src/features/schedule-exceptions/components/create-schedule-exception-dialog.tsx
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
import { CreateScheduleExceptionRequest } from "../types/schedule-exception";
import { ScheduleExceptionForm } from "./schedule-exception-form";

interface CreateScheduleExceptionDialogProps {
  onSave: (data: CreateScheduleExceptionRequest) => void;
  isLoading?: boolean;
}

export function CreateScheduleExceptionDialog({
  onSave,
  isLoading,
}: CreateScheduleExceptionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateScheduleExceptionRequest) => {
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
          Create Exception
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Schedule Exception</DialogTitle>
          <DialogDescription>
            Add a new schedule exception for special dates. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <ScheduleExceptionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}