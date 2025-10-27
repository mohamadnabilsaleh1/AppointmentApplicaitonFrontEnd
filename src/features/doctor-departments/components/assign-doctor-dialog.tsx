// src/features/doctor-departments/components/assign-doctor-dialog.tsx
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useAssignDoctorToDepartment } from "../hooks/useDoctorDepartments";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { Doctor } from "@/features/doctors/types/doctor";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import { Department } from "@/features/department/types/department";

interface AssignDoctorDialogProps {
  token: string;
}

export function AssignDoctorDialog({ token }: AssignDoctorDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const assignMutation = useAssignDoctorToDepartment(token);

  // Fetch departments and doctors
  const { data: departmentsResponse } = useDepartments(
    { page: 1, pageSize: 100 },
    token
  );
  const { data: doctorsResponse } = useDoctors(
    { page: 1, pageSize: 100 },
    token
  );

  const departments = departmentsResponse?.data || [];
  const doctors = doctorsResponse?.data || [];

  const handleAssign = async () => {
    if (!selectedDoctor || !selectedDepartment) {
      toast({
        title: 'Error',
        description: 'Please select both a doctor and a department',
        variant: 'destructive',
      });
      return;
    }

    try {
      await assignMutation.mutateAsync({
        doctorId: selectedDoctor,
        departmentId: selectedDepartment,
      });
      
      toast({
        title: 'Success',
        description: 'Doctor assigned to department successfully',
      });
      
      setSelectedDoctor("");
      setSelectedDepartment("");
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign doctor to department',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setSelectedDoctor("");
    setSelectedDepartment("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Assign Doctor to Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Doctor to Department</DialogTitle>
          <DialogDescription>
            Select a doctor and department to create an assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor: Doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Select Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department: Department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={assignMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={assignMutation.isPending || !selectedDoctor || !selectedDepartment}
            >
              {assignMutation.isPending ? "Assigning..." : "Assign Doctor"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}