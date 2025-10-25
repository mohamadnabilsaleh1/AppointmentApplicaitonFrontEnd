// src/components/create-facility-dialog.tsx
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
import { HealthcareFacilityForm } from "./healthcare-facility-form";
import { CreateHealthcareFacilityRequest } from "../types/healthcare-facility";

interface CreateFacilityDialogProps {
  onSave: (data: CreateHealthcareFacilityRequest) => void;
  isLoading?: boolean;
}

export function CreateFacilityDialog({
  onSave,
  isLoading,
}: CreateFacilityDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateHealthcareFacilityRequest) => {
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
          Create Facility
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Healthcare Facility</DialogTitle>
          <DialogDescription>
            Add a new healthcare facility to the system. Fill in all the
            required information below.
          </DialogDescription>
        </DialogHeader>
        
        <HealthcareFacilityForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={false} // or omit this prop
        />
      </DialogContent>
    </Dialog>
  );
}
