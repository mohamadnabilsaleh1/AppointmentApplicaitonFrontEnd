// src/features/doctor-departments/components/doctor-departments-management.tsx
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
import { Building, Plus, X } from "lucide-react";
import { Doctor } from "@/features/doctors/types/doctor";
import { useDoctorDepartments, useAssignDoctorToDepartment, useRemoveDoctorFromDepartment } from "../hooks/useDoctorDepartments";
import { useDepartments } from "@/features/department/hooks/useDepartments";

interface DoctorDepartmentsManagementProps {
  doctor: Doctor;
  token: string;
}

export function DoctorDepartmentsManagement({
  doctor,
  token,
}: DoctorDepartmentsManagementProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: doctorDepartmentsResponse, refetch: refetchDoctorDepartments } = useDoctorDepartments(
    doctor.id,
    { page, pageSize },
    token
  );

  const { data: allDepartmentsResponse } = useDepartments(
    { page: 1, pageSize: 100 },
    token
  );

  const assignMutation = useAssignDoctorToDepartment(token);
  const removeMutation = useRemoveDoctorFromDepartment(token);

  const doctorDepartments = doctorDepartmentsResponse?.data || [];
  const allDepartments = allDepartmentsResponse?.data || [];

  // Filter out departments the doctor is already in
  const availableDepartments = allDepartments.filter(
    department => !doctorDepartments.some(docDept => docDept.department?.id === department.id)
  );

  const handleAddDepartment = async (departmentId: string) => {
    try {
      await assignMutation.mutateAsync({
        doctorId: doctor.id,
        departmentId,
      });
      toast({
        title: 'Success',
        description: 'Doctor added to department successfully',
      });
      refetchDoctorDepartments();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add doctor to department',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveDepartment = async (departmentId: string) => {
    try {
      await removeMutation.mutateAsync({
        departmentId,
        doctorId: doctor.id,
      });
      toast({
        title: 'Success',
        description: 'Doctor removed from department successfully',
      });
      refetchDoctorDepartments();
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
          <Building className="h-4 w-4 mr-2" />
          Manage Departments ({doctorDepartments.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage Departments - {doctor.firstName} {doctor.lastName}
          </DialogTitle>
          <DialogDescription>
            Add or remove departments for this doctor. {doctorDepartments.length} departments currently assigned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Doctor Departments */}
          <div>
            <h4 className="font-medium mb-3">Current Departments</h4>
            {doctorDepartments.length > 0 ? (
              <div className="space-y-3">
                {doctorDepartments.map((doctorDept) => (
                  <div
                    key={doctorDept.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {doctorDept.department?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctorDept.department?.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Assigned: {new Date(doctorDept.assignedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDepartment(doctorDept.departmentId)}
                      disabled={removeMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No departments assigned to this doctor</p>
              </div>
            )}
          </div>

          {/* Available Departments */}
          <div>
            <h4 className="font-medium mb-3">Available Departments</h4>
            {availableDepartments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableDepartments.map((department) => (
                  <div
                    key={department.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {department.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {department.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddDepartment(department.id)}
                      disabled={assignMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No available departments</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}