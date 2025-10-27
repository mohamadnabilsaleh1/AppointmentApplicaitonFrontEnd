// src/features/departments/components/create-department-dialog.tsx
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
import { CreateDepartmentRequest } from "../types/department";
import { DepartmentForm } from "./department-form";

interface CreateDepartmentDialogProps {
  onSave: (data: CreateDepartmentRequest) => void;
  isLoading?: boolean;
}

export function CreateDepartmentDialog({
  onSave,
  isLoading,
}: CreateDepartmentDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateDepartmentRequest) => {
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
          Create Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Department</DialogTitle>
          <DialogDescription>
            Add a new department to your facility. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <DepartmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}