// src/features/treatment-capacity/components/create-treatment-capacity-dialog.tsx
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
import { CreateTreatmentCapacityRequest } from "../types/treatment-capacity";
import { TreatmentCapacityForm } from "./treatment-capacity-form";

interface CreateTreatmentCapacityDialogProps {
  onSave: (data: CreateTreatmentCapacityRequest) => void;
  isLoading?: boolean;
}

export function CreateTreatmentCapacityDialog({
  onSave,
  isLoading,
}: CreateTreatmentCapacityDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateTreatmentCapacityRequest) => {
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
          Set Capacity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Treatment Capacity</DialogTitle>
          <DialogDescription>
            Configure your daily patient capacity and session duration.
          </DialogDescription>
        </DialogHeader>
        
        <TreatmentCapacityForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}