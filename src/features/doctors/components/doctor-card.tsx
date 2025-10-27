"use client";

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
import { Doctor } from "../types/doctor";
import {
  User,
  Stethoscope,
  MoreVertical,
  Edit,
  Power,
} from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void;
}

export function DoctorCard({
  doctor,
  onEdit,
  onToggleStatus,
}: DoctorCardProps) {
  const isActive = doctor.isActive !== false;
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300" key={doctor.id}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5" />
              {doctor.firstName} {doctor.lastName}
            </CardTitle>
            
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleStatus(doctor)}>
                  <Power className="mr-2 h-4 w-4" />
                  {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Specialization</p>
            <p className="text-sm text-muted-foreground">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Gender & Age</p>
            <p className="text-sm text-muted-foreground">
              {doctor.gender} • {doctor.age} years
            </p>
          </div>
        </div>

        
      </CardContent>
    </Card>
  );
}