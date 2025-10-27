// src/features/doctor-departments/components/department-doctors-management.tsx
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
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, X } from "lucide-react";
import { Doctor } from "@/features/doctors/types/doctor";
import { useDepartmentDoctors, useAssignDoctorToDepartment, useRemoveDoctorFromDepartment } from "../hooks/useDoctorDepartments";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { Department } from "@/features/department/types/department";

interface DepartmentDoctorsManagementProps {
  department: Department;
  token: string;
}

export function DepartmentDoctorsManagement({
  department,
  token,
}: DepartmentDoctorsManagementProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: departmentDoctorsResponse, refetch: refetchDepartmentDoctors } = useDepartmentDoctors(
    department.id,
    { page, pageSize },
    token
  );

  const { data: allDoctorsResponse } = useDoctors(
    { page: 1, pageSize: 100, q: searchTerm },
    token
  );

  const assignMutation = useAssignDoctorToDepartment(token);
  const removeMutation = useRemoveDoctorFromDepartment(token);

  const departmentDoctors = departmentDoctorsResponse?.data || [];
  const allDoctors = allDoctorsResponse?.data || [];

  // Filter out doctors already in the department
  const availableDoctors = allDoctors.filter(
    doctor => !departmentDoctors.some(deptDoctor => deptDoctor.doctor?.id === doctor.id)
  );

  const handleAddDoctor = async (doctorId: string) => {
    try {
      await assignMutation.mutateAsync({
        doctorId,
        departmentId: department.id,
      });
      toast({
        title: 'Success',
        description: 'Doctor added to department successfully',
      });
      refetchDepartmentDoctors();
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
      await removeMutation.mutateAsync({
        departmentId: department.id,
        doctorId,
      });
      toast({
        title: 'Success',
        description: 'Doctor removed from department successfully',
      });
      refetchDepartmentDoctors();
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
          Manage Doctors ({departmentDoctors.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Doctors - {department.name}</DialogTitle>
          <DialogDescription>
            Add or remove doctors from this department. {departmentDoctors.length} doctors currently assigned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Department Doctors */}
          <div>
            <h4 className="font-medium mb-3">Current Department Doctors</h4>
            {departmentDoctors.length > 0 ? (
              <div className="space-y-3">
                {departmentDoctors.map((doctorDept) => (
                  <div
                    key={doctorDept.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">
                            {doctorDept.doctor?.firstName} {doctorDept.doctor?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doctorDept.doctor?.specialization}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Assigned: {new Date(doctorDept.assignedAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDoctor(doctorDept.doctorId)}
                      disabled={removeMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No doctors in this department</p>
              </div>
            )}
          </div>

          {/* Available Doctors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Available Doctors</h4>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
              </div>
            </div>
            
            {availableDoctors.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization} 
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {doctor.gender}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Age: {doctor.age}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddDoctor(doctor.id)}
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
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No doctors found matching your search' : 'No available doctors'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}