// src/features/doctor-departments/components/doctor-department-card.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Building,
  Users,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { useDepartmentDoctors } from "../hooks/useDoctorDepartments";
import { AddDoctorToDepartmentDialog } from "./add-doctor-to-department-dialog";
import { DoctorCard } from "./doctor-card";
import { Department } from "@/features/department/types/department";

interface DoctorDepartmentCardProps {
  department: Department;
  token: string;
}

export function DoctorDepartmentCard({
  department,
  token,
}: DoctorDepartmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch doctors for this department
  const { 
    data: doctorsResponse, 
    isLoading, 
    error,
    refetch 
  } = useDepartmentDoctors(
    department.id, 
    { page: 1, pageSize: 100 }, 
    token
  );

  const doctors = doctorsResponse?.data || [];
  const totalDoctors = doctors.length;

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div 
            className="space-y-1 flex-1 cursor-pointer" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Building className="h-5 w-5" />
              {department.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {department.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {totalDoctors} doctors
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsExpanded(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Show Doctors
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRefresh}>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Refresh Doctors
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="border-t pt-4 space-y-4">
          {/* Header with actions */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Doctors in {department.name}
              </h4>
              {isLoading && (
                <p className="text-xs text-muted-foreground">Loading doctors...</p>
              )}
              {error && (
                <p className="text-xs text-destructive">Error loading doctors</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <AddDoctorToDepartmentDialog 
                department={department} 
                token={token} 
              />
            </div>
          </div>

          {/* Doctors List */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Error loading doctors</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid gap-4 md:grid-row-2 lg:grid-row-3">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  departmentId={department.id}
                  token={token}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No doctors in this department</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add doctors to see them here
              </p>
              <AddDoctorToDepartmentDialog 
                department={department} 
                token={token} 
              />
            </div>
          )}

          {/* Department Info Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Department ID: {department.id.slice(0, 8)}...</span>
            </div>
            
            {doctors.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}