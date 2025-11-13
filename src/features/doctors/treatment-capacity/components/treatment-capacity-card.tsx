// src/features/treatment-capacity/components/treatment-capacity-card.tsx
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
import { TreatmentCapacity } from "../types/treatment-capacity";
import { Users, Clock, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

interface TreatmentCapacityCardProps {
  treatmentCapacity: TreatmentCapacity;
  onEdit: (treatmentCapacity: TreatmentCapacity) => void;
  onDelete: (treatmentCapacity: TreatmentCapacity) => void;
}

export function TreatmentCapacityCard({
  treatmentCapacity,
  onEdit,
  onDelete,
}: TreatmentCapacityCardProps) {
  const isActive = treatmentCapacity.isActive;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              Treatment Capacity
            </CardTitle>
            <CardDescription>
              Your daily patient scheduling configuration
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {isActive ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
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
                <DropdownMenuItem onClick={() => onEdit(treatmentCapacity)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(treatmentCapacity)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Max Patients/Day</span>
          </div>
          <Badge variant="outline" className="text-sm">
            {treatmentCapacity.maxPatientsPerDay}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Session Duration</span>
          </div>
          <Badge variant="outline" className="text-sm">
            {treatmentCapacity.sessionDurationMinutes} min
          </Badge>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Daily capacity: {treatmentCapacity.maxPatientsPerDay} patients × {treatmentCapacity.sessionDurationMinutes} min
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total daily time: {treatmentCapacity.maxPatientsPerDay * treatmentCapacity.sessionDurationMinutes} minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}