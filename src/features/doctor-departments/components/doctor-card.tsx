// src/features/doctor-departments/components/doctor-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doctor } from "@/features/doctors/types/doctor";
import {
  User,
  Stethoscope,
  Calendar,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useRemoveDoctorFromDepartment } from "../hooks/useDoctorDepartments";
import { useToast } from "@/hooks/use-toast";

interface DoctorCardProps {
  doctor: Doctor;
  departmentId: string;
  token: string;
}

export function DoctorCard({ doctor, departmentId, token }: DoctorCardProps) {
  const { toast } = useToast();
  const removeMutation = useRemoveDoctorFromDepartment(token);

  const handleRemoveFromDepartment = async () => {
    try {
      await removeMutation.mutateAsync({
        departmentId,
        doctorId: doctor.id,
      });
      toast({
        title: "Success",
        description: "Doctor removed from department successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove doctor from department",
        variant: "destructive",
      });
    }
  };

  const isActive = doctor.isActive !== false;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <User className="h-4 w-4" />
              {doctor.firstName} {doctor.lastName}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRemoveFromDepartment}
                  className="text-destructive"
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  {removeMutation.isPending
                    ? "Removing..."
                    : "Remove from Department"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Specialization */}
        <div className="flex items-start gap-2">
          <Stethoscope className="h-3 w-3 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs font-medium">Specialization</p>
            <p className="text-sm">{doctor.specialization}</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="flex items-start gap-2">
          <User className="h-3 w-3 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs font-medium">Details</p>
            <p className="text-sm">
              {doctor.gender} • {doctor.age} years
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          DOB: {doctor.age}
        </div>

      </CardContent>
    </Card>
  );
}
