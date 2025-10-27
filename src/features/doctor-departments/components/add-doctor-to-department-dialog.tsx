// src/features/doctor-departments/components/add-doctor-to-department-dialog.tsx
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
import { Plus, Users, Search } from "lucide-react";
import { useAssignDoctorToDepartment } from "../hooks/useDoctorDepartments";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { useDepartmentDoctors } from "../hooks/useDoctorDepartments";
import { Input } from "@/components/ui/input";
import { Department } from "@/features/department/types/department";

interface AddDoctorToDepartmentDialogProps {
  department: Department;
  token: string;
}

export function AddDoctorToDepartmentDialog({
  department,
  token,
}: AddDoctorToDepartmentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const assignMutation = useAssignDoctorToDepartment(token);

  // Fetch all doctors
  const { data: allDoctorsResponse } = useDoctors(
    { page: 1, pageSize: 100, q: searchTerm },
    token
  );

  // Fetch current department doctors to filter them out
  const { data: departmentDoctorsResponse } = useDepartmentDoctors(
    department.id,
    { page: 1, pageSize: 100 },
    token
  );

  const allDoctors = allDoctorsResponse?.data || [];
  const currentDepartmentDoctors = departmentDoctorsResponse?.data || [];

  // Filter out doctors already in the department
  const availableDoctors = allDoctors.filter(
    doctor => !currentDepartmentDoctors.some(deptDoctor => deptDoctor.id === doctor.id)
  );

  const handleAssign = async () => {
    if (!selectedDoctor) {
      toast({
        title: 'Error',
        description: 'Please select a doctor',
        variant: 'destructive',
      });
      return;
    }

    try {
      await assignMutation.mutateAsync({
        doctorId: selectedDoctor,
        departmentId: department.id,
      });
      
      toast({
        title: 'Success',
        description: 'Doctor added to department successfully',
      });
      
      setSelectedDoctor("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add doctor to department',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setSelectedDoctor("");
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Doctor to {department.name}</DialogTitle>
          <DialogDescription>
            Select a doctor to add to this department. {availableDoctors.length} doctors available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Doctors</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor *</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {availableDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {doctor.firstName} {doctor.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doctor.specialization} 
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Empty State */}
          {availableDoctors.length === 0 && (
            <div className="text-center py-4 border rounded-lg">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No doctors found matching your search' : 'No available doctors'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchTerm ? 'Try a different search term' : 'All doctors are already in this department'}
              </p>
            </div>
          )}

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
              disabled={assignMutation.isPending || !selectedDoctor || availableDoctors.length === 0}
            >
              {assignMutation.isPending ? "Adding..." : "Add to Department"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}