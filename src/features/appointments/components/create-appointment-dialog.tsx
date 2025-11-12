// src/features/appointments/components/create-appointment-dialog.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Clock, Users, AlertCircle } from "lucide-react";
import { format, parse, addMinutes, isBefore, isAfter, startOfDay, isEqual } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useCreateAppointment, useAppointments } from "../hooks/useAppointments";
import { useSchedules } from "@/features/doctors/schedule/hooks/useSchedules";

interface CreateAppointmentDialogProps {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface DoctorCapacity {
  maxPatientsPerDay: number;
  sessionDurationMinutes: number;
  isActive: boolean;
}

interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  note?: string;
}

export function CreateAppointmentDialog({
  patientId,
  patientName,
  open,
  onOpenChange,
  onSuccess,
}: CreateAppointmentDialogProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [notes, setNotes] = useState("");
  const [doctorCapacity, setDoctorCapacity] = useState<DoctorCapacity | null>(null);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  const createAppointmentMutation = useCreateAppointment(token || "");

  // Fetch doctor schedules
  const { data: schedulesResponse, isLoading: schedulesLoading } = useSchedules(
    { page: 1, pageSize: 50 },
    token || ""
  );

  // Fetch existing appointments for the selected date
  const { data: appointmentsResponse } = useAppointments(
    { 
      page: 1, 
      pageSize: 100,
      startdate: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : undefined,
      enddate: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : undefined
    }, 
    token || ""
  );

  useEffect(() => {
    if (appointmentsResponse?.data) {
      setExistingAppointments(appointmentsResponse.data);
    }
  }, [appointmentsResponse]);

  const schedules = schedulesResponse?.data || [];

  // Fetch doctor capacity
  useEffect(() => {
    const fetchDoctorCapacity = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(
          `http://localhost:5001/api/doctors/me/treatment-capacity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.ok) {
          const capacityData = await response.json();
          setDoctorCapacity(capacityData.data);
        }
      } catch (error) {
        console.error('Failed to fetch doctor capacity:', error);
      }
    };

    if (open) {
      fetchDoctorCapacity();
    }
  }, [open, token]);

  // Check for time conflicts
  const hasTimeConflict = useMemo(() => {
    if (!scheduledDate || !scheduledTime || !existingAppointments.length) return false;

    const selectedDateTime = parse(scheduledTime, 'HH:mm', scheduledDate);
    const selectedEndTime = addMinutes(selectedDateTime, parseInt(durationMinutes));

    return existingAppointments.some(appointment => {
      if (appointment.status === 'Cancelled') return false;

      const appointmentTime = parse(appointment.scheduledTime, 'HH:mm:ss', scheduledDate);
      const appointmentEndTime = addMinutes(appointmentTime, appointment.durationMinutes);

      // Check if time ranges overlap
      return (
        (isEqual(selectedDateTime, appointmentTime) || 
         isAfter(selectedDateTime, appointmentTime) && isBefore(selectedDateTime, appointmentEndTime)) ||
        (isEqual(selectedEndTime, appointmentEndTime) || 
         isAfter(selectedEndTime, appointmentTime) && isBefore(selectedEndTime, appointmentEndTime)) ||
        (isBefore(selectedDateTime, appointmentTime) && isAfter(selectedEndTime, appointmentEndTime))
      );
    });
  }, [scheduledDate, scheduledTime, durationMinutes, existingAppointments]);

  // Get conflicting appointment info
  const conflictingAppointment = useMemo(() => {
    if (!scheduledDate || !scheduledTime || !existingAppointments.length || !hasTimeConflict) return null;

    const selectedDateTime = parse(scheduledTime, 'HH:mm', scheduledDate);
    const selectedEndTime = addMinutes(selectedDateTime, parseInt(durationMinutes));

    return existingAppointments.find(appointment => {
      if (appointment.status === 'Cancelled') return false;

      const appointmentTime = parse(appointment.scheduledTime, 'HH:mm:ss', scheduledDate);
      const appointmentEndTime = addMinutes(appointmentTime, appointment.durationMinutes);

      return (
        (isEqual(selectedDateTime, appointmentTime) || 
         isAfter(selectedDateTime, appointmentTime) && isBefore(selectedDateTime, appointmentEndTime)) ||
        (isEqual(selectedEndTime, appointmentEndTime) || 
         isAfter(selectedEndTime, appointmentTime) && isBefore(selectedEndTime, appointmentEndTime)) ||
        (isBefore(selectedDateTime, appointmentTime) && isAfter(selectedEndTime, appointmentEndTime))
      );
    });
  }, [scheduledDate, scheduledTime, durationMinutes, existingAppointments, hasTimeConflict]);

  // Get available time slots based on schedule, capacity, and existing appointments
  const availableTimeSlots = useMemo(() => {
    if (!scheduledDate || !schedules.length || !doctorCapacity) return [];

    const dayOfWeek = format(scheduledDate, 'EEEE');
    const daySchedule = schedules.find(schedule => 
      schedule.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!daySchedule) return [];

    const slots: string[] = [];
    const startTime = parse(daySchedule.startTime, 'HH:mm:ss', new Date());
    const endTime = parse(daySchedule.endTime, 'HH:mm:ss', new Date());
    
    let currentTime = startTime;
    const sessionDuration = doctorCapacity.sessionDurationMinutes || 30;

    while (isBefore(currentTime, endTime)) {
      const slotEndTime = addMinutes(currentTime, sessionDuration);
      
      if (isAfter(slotEndTime, endTime)) break;

      const timeString = format(currentTime, 'HH:mm');
      
      // Check if this time slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(appointment => {
        if (appointment.status === 'Cancelled') return false;

        const appointmentTime = parse(appointment.scheduledTime, 'HH:mm:ss', scheduledDate);
        const appointmentEndTime = addMinutes(appointmentTime, appointment.durationMinutes);

        return (
          (isEqual(currentTime, appointmentTime) || 
           isAfter(currentTime, appointmentTime) && isBefore(currentTime, appointmentEndTime)) ||
          (isEqual(slotEndTime, appointmentEndTime) || 
           isAfter(slotEndTime, appointmentTime) && isBefore(slotEndTime, appointmentEndTime)) ||
          (isBefore(currentTime, appointmentTime) && isAfter(slotEndTime, appointmentEndTime))
        );
      });

      if (!hasConflict) {
        slots.push(timeString);
      }
      
      currentTime = slotEndTime;
    }

    return slots;
  }, [scheduledDate, schedules, doctorCapacity, existingAppointments]);

  // Check if selected date has available slots
  const hasAvailableSlots = useMemo(() => {
    if (!scheduledDate || !schedules.length) return false;
    
    const dayOfWeek = format(scheduledDate, 'EEEE');
    return schedules.some(schedule => 
      schedule.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );
  }, [scheduledDate, schedules]);

  // Get the schedule for the selected date
  const selectedDateSchedule = useMemo(() => {
    if (!scheduledDate || !schedules.length) return null;
    
    const dayOfWeek = format(scheduledDate, 'EEEE');
    return schedules.find(schedule => 
      schedule.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    ) || null;
  }, [scheduledDate, schedules]);

  const handleSubmit = async () => {
    if (!scheduledDate || !scheduledTime || !token) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the appointment.",
        variant: "destructive",
      });
      return;
    }

    // Validate against schedule
    if (selectedDateSchedule) {
      const selectedTime = parse(scheduledTime, 'HH:mm', new Date());
      const scheduleStart = parse(selectedDateSchedule.startTime, 'HH:mm:ss', new Date());
      const scheduleEnd = parse(selectedDateSchedule.endTime, 'HH:mm:ss', new Date());
      const appointmentEnd = addMinutes(selectedTime, parseInt(durationMinutes));

      if (isBefore(selectedTime, scheduleStart) || isAfter(appointmentEnd, scheduleEnd)) {
        toast({
          title: "Invalid Time",
          description: "Selected time is outside of doctor's working hours.",
          variant: "destructive",
        });
        return;
      }
    }

    // Check for time conflicts
    if (hasTimeConflict) {
      toast({
        title: "Time Conflict",
        description: "This time slot conflicts with an existing appointment. Please choose a different time.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAppointmentMutation.mutateAsync({
        patientId,
        scheduledDate: format(scheduledDate, "yyyy-MM-dd"),
        scheduledTime: `${scheduledTime}:00`,
        durationMinutes: parseInt(durationMinutes),
        notes: notes || undefined,
      });

      toast({
        title: "Appointment Created",
        description: `New appointment scheduled for ${patientName}`,
      });

      // Reset form
      setScheduledDate(undefined);
      setScheduledTime("");
      setDurationMinutes("30");
      setNotes("");
      
      // Close dialog and call success callback
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Appointment creation error:', error);
      
      // Check if it's a time conflict error from the backend
      const errorMessage = error?.message || '';
      
      if (errorMessage.toLowerCase().includes('conflict') || 
          errorMessage.toLowerCase().includes('time') ||
          errorMessage.toLowerCase().includes('overlap') ||
          errorMessage.toLowerCase().includes('busy')) {
        toast({
          title: "Time Conflict Detected",
          description: "This time slot is no longer available. Please choose a different time.",
          variant: "destructive",
        });
        
        // Refresh available time slots
        setScheduledTime("");
      } else {
        toast({
          title: "Error",
          description: errorMessage || "Failed to create appointment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && createAppointmentMutation.isPending) {
      return; // Prevent closing while submitting
    }
    
    if (!newOpen) {
      // Reset form when closing
      setScheduledDate(undefined);
      setScheduledTime("");
      setDurationMinutes("30");
      setNotes("");
      setExistingAppointments([]);
    }
    
    onOpenChange(newOpen);
  };

  const isFormValid = scheduledDate && scheduledTime;

  // Get day name for display
  const selectedDayName = scheduledDate ? format(scheduledDate, 'EEEE') : '';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule a new appointment for {patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Doctor Capacity Info */}
          {doctorCapacity && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Capacity:</span>
                    <span>{doctorCapacity.maxPatientsPerDay} patients/day</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Session:</span>
                    <span>{doctorCapacity.sessionDurationMinutes} min</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doctorCapacity.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doctorCapacity.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <Label htmlFor="date">Appointment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !scheduledDate && "text-muted-foreground"
                  )}
                  disabled={createAppointmentMutation.isPending || schedulesLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  disabled={(date) => {
                    // Disable dates in the past
                    if (date < startOfDay(new Date())) return true;
                    
                    // Disable dates without schedules
                    const dayOfWeek = format(date, 'EEEE');
                    return !schedules.some(schedule => 
                      schedule.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
            
            {/* Schedule Info for Selected Date */}
            {scheduledDate && selectedDateSchedule && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {selectedDayName}: {selectedDateSchedule.startTime.split(':').slice(0, 2).join(':')} - {selectedDateSchedule.endTime.split(':').slice(0, 2).join(':')}
                  </span>
                  {selectedDateSchedule.note && (
                    <span className="text-muted-foreground">({selectedDateSchedule.note})</span>
                  )}
                </div>
              </div>
            )}
            
            {scheduledDate && !selectedDateSchedule && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                No working hours scheduled for {selectedDayName}
              </div>
            )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Appointment Time *</Label>
              <Select 
                value={scheduledTime} 
                onValueChange={setScheduledTime}
                disabled={createAppointmentMutation.isPending || !hasAvailableSlots}
              >
                <SelectTrigger className={cn(
                  "mt-1",
                  hasTimeConflict && "border-red-500 bg-red-50"
                )}>
                  <SelectValue placeholder={
                    !hasAvailableSlots && scheduledDate 
                      ? "No available slots" 
                      : "Select time"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Time slot info */}
              {scheduledDate && hasAvailableSlots && (
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {availableTimeSlots.length} available time slots
                  </p>
                  
                  {/* Time conflict warning */}
                  {hasTimeConflict && conflictingAppointment && (
                    <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        Conflicts with {conflictingAppointment.patient.fullName}'s appointment
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Appointment Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any notes for this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 min-h-[100px]"
              disabled={createAppointmentMutation.isPending}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createAppointmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || createAppointmentMutation.isPending || !hasAvailableSlots || hasTimeConflict}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createAppointmentMutation.isPending ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}