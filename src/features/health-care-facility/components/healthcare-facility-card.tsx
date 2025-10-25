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
import { HealthcareFacility } from "@/features/health-care-facility/types/healthcare-facility";
import {
  MapPin,
  Clock,
  Building,
  Users,
  MoreVertical,
  Edit,
  Power,
} from "lucide-react";
import { healthcareTypes } from "../constants/healthcareTypes";
// import {healthcareTypes}

interface HealthcareFacilityCardProps {
  facility: HealthcareFacility;
  onEdit: (facility: HealthcareFacility) => void;
  onToggleStatus: (facility: HealthcareFacility) => void;
}
const getHealthcareTypeLabel = (typeValue:number) => {
  const type = healthcareTypes.find(t => t.value == typeValue);
  console.log(typeValue)
  return type ? type.label : 'Unknown';
};
export function HealthcareFacilityCard({
  facility,
  onEdit,
  onToggleStatus,
}: HealthcareFacilityCardProps) {
  const isActive = facility.isActive !== false;
  console.log(facility);
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 transform group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
              <Building className="h-6 w-6 " />
              <p className=" text-sm">{facility.Name}</p>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5" />
              {facility.Address.fullAddress}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs font-medium py-1 px-2"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={facility.Type === 1 ? "default" : "secondary"}
              className="text-xs font-medium py-1 px-2"
            >
              {getHealthcareTypeLabel(facility.Type)}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(facility)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleStatus(facility)}>
                  <Power className="mr-2 h-4 w-4" />
                  {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Departments</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {facility.Departments.length > 0 ? (
                facility.Departments.slice(0, 3).map((dept) => (
                  <Badge key={dept.id} variant="outline" className="text-xs">
                    {dept.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No departments
                </span>
              )}
              {facility.Departments.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{facility.Departments.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Operating Hours</p>
            <div className="space-y-1 mt-2">
              {facility.Schedules.length > 0 ? (
                facility.Schedules.slice(0, 2).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex justify-between text-xs text-muted-foreground"
                  >
                    <span>{schedule.dayOfWeek}</span>
                    <span>
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No schedules
                </span>
              )}
              {facility.Schedules.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{facility.Schedules.length - 2} more days
                </Badge>
              )}
            </div>
          </div>
        </div>

        {facility.ScheduleExceptions.length > 0 && (
          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Special Schedules</p>
              <div className="space-y-1 mt-2">
                {facility.ScheduleExceptions.slice(0, 2).map(
                  (exception: any) => (
                    <div key={exception.id} className="text-xs">
                      <span>{exception.date}</span>
                      <span className="text-muted-foreground ml-2">
                        ({exception.startTime} - {exception.endTime})
                      </span>
                    </div>
                  )
                )}
                {facility.ScheduleExceptions.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{facility.ScheduleExceptions.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            Lat: {facility.GPSLatitude}, Lng: {facility.GPSLongitude}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
