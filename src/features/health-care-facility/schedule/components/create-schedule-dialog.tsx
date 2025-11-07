// src/features/schedules/components/create-schedule-dialog.tsx
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
import { CreateScheduleRequest } from "../types/schedule";
import { ScheduleForm } from "./schedule-form";

interface CreateScheduleDialogProps {
  onSave: (data: CreateScheduleRequest) => void;
  isLoading?: boolean;
}

export function CreateScheduleDialog({
  onSave,
  isLoading,
}: CreateScheduleDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateScheduleRequest) => {
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
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Add a new schedule for your facility. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <ScheduleForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}