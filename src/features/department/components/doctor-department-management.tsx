// src/features/departments/components/doctor-department-management.tsx
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
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X } from "lucide-react";
import { Department } from "../types/department";
import { Doctor } from "@/features/doctors/types/doctor";
import { useDepartmentDoctors, useAddDoctorToDepartment, useRemoveDoctorFromDepartment } from "../hooks/useDepartments";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";

interface DoctorDepartmentManagementProps {
  department: Department;
  token: string;
}

export function DoctorDepartmentManagement({
  department,
  token,
}: DoctorDepartmentManagementProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: departmentDoctorsResponse } = useDepartmentDoctors(
    department.id,
    { page, pageSize },
    token
  );

  const { data: allDoctorsResponse } = useDoctors(
    { page: 1, pageSize: 100 },
    token
  );

  const addDoctorMutation = useAddDoctorToDepartment(token);
  const removeDoctorMutation = useRemoveDoctorFromDepartment(token);

  const departmentDoctors = departmentDoctorsResponse?.data || [];
  const allDoctors = allDoctorsResponse?.data || [];

  // Doctors not in the department
  const availableDoctors = allDoctors.filter(
    doctor => !departmentDoctors.some(deptDoctor => deptDoctor.id === doctor.id)
  );

  const handleAddDoctor = async (doctorId: string) => {
    try {
      await addDoctorMutation.mutateAsync({
        departmentId: department.id,
        doctorId,
      });
      toast({
        title: 'Success',
        description: 'Doctor added to department successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add doctor to department',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveDoctor = async (doctorId: string) => {
    try {
      await removeDoctorMutation.mutateAsync({
        departmentId: department.id,
        doctorId,
      });
      toast({
        title: 'Success',
        description: 'Doctor removed from department successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove doctor from department',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Manage Doctors
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Doctors - {department.name}</DialogTitle>
          <DialogDescription>
            Add or remove doctors from this department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Department Doctors */}
          <div>
            <h4 className="font-medium mb-3">Current Doctors ({departmentDoctors.length})</h4>
            <div className="space-y-2">
              {departmentDoctors.length > 0 ? (
                departmentDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      disabled={removeDoctorMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No doctors in this department
                </p>
              )}
            </div>
          </div>

          {/* Available Doctors */}
          <div>
            <h4 className="font-medium mb-3">Available Doctors</h4>
            <div className="space-y-2">
              {availableDoctors.length > 0 ? (
                availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization} 
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddDoctor(doctor.id)}
                      disabled={addDoctorMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No available doctors
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}