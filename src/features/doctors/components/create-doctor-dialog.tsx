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
import { DoctorForm } from "./doctor-form";
import { CreateDoctorRequest } from "../types/doctor";

interface CreateDoctorDialogProps {
  onSave: (data: CreateDoctorRequest) => void;
  isLoading?: boolean;
}

export function CreateDoctorDialog({
  onSave,
  isLoading,
}: CreateDoctorDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateDoctorRequest) => {
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
          Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Add a new doctor to your facility. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <DoctorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={false}
        />
      </DialogContent>
    </Dialog>
  );
}