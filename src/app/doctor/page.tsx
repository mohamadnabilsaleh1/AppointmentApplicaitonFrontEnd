"use client";

import React, { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, Calendar as CalendarIcon, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { DoctorAppointmentCard } from "@/features/appointments/components/doctor-appointment-card";
import { Appointment, AppointmentsQueryParams } from "@/features/appointments/types/appointment";
import { useAppointments, useConfirmAppointment, useCancelAppointment, useCompleteAppointment } from "@/features/appointments/hooks/useAppointments";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DoctorAppointmentsPage() {
  const { toast } = useToast();
  const { token } = useAuth();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Query params for API
  const queryParams = useMemo(() => {
    const params: AppointmentsQueryParams = {};
    
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    
    if (startDate) {
      params.startdate = format(startDate, "yyyy-MM-dd");
    }
    
    if (endDate) {
      params.enddate = format(endDate, "yyyy-MM-dd");
    }
    
    return params;
  }, [statusFilter, startDate, endDate]);

  // Fetch appointments
  const { data: appointments = [], isLoading, error } = useAppointments(
    queryParams,
    token || ""
  );

  // Mutations
  const confirmMutation = useConfirmAppointment(token || "");
  const cancelMutation = useCancelAppointment(token || "");
  const completeMutation = useCompleteAppointment(token || "");

  // Filter today's appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = useMemo(() => {
    return appointments.filter(
      (apt) => apt.scheduledDate === today || !startDate
    );
  }, [appointments, today, startDate]);

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    let filtered = todayAppointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patient.nationalID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [todayAppointments, searchTerm]);

  // Group appointments by status
  const pendingAppointments = useMemo(
    () => filteredAppointments.filter((apt) => apt.status === "Pending"),
    [filteredAppointments]
  );
  const confirmedAppointments = useMemo(
    () => filteredAppointments.filter((apt) => apt.status === "Confirmed"),
    [filteredAppointments]
  );
  const completedAppointments = useMemo(
    () => filteredAppointments.filter((apt) => apt.status === "Completed"),
    [filteredAppointments]
  );
  const cancelledAppointments = useMemo(
    () => filteredAppointments.filter((apt) => apt.status === "Cancelled"),
    [filteredAppointments]
  );

  // Handlers
  const handleConfirm = async (appointment: Appointment) => {
    try {
      await confirmMutation.mutateAsync(appointment.id);
      toast({
        title: "Appointment Confirmed",
        description: `Appointment with ${appointment.patient.fullName} has been confirmed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to confirm appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (appointment: Appointment, reason: string) => {
    try {
      await cancelMutation.mutateAsync({
        appointmentId: appointment.id,
        data: { cancellationreason: reason },
      });
      toast({
        title: "Appointment Cancelled",
        description: `Appointment with ${appointment.patient.fullName} has been cancelled.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (
    appointment: Appointment,
    data: {
      diagnosis: string;
      treatmentNotes?: string;
      followUpInstructions?: string;
      medicationList?: string;
      dosageInstructions?: string;
    }
  ) => {
    try {
      await completeMutation.mutateAsync({
        appointmentId: appointment.id,
        data: {
          diagnosis: data.diagnosis,
          treatmentNotes: data.treatmentNotes,
          followUpInstructions: data.followUpInstructions,
          medicationList: data.medicationList,
          dosageInstructions: data.dosageInstructions,
        },
      });
      toast({
        title: "Appointment Completed",
        description: `Appointment with ${appointment.patient.fullName} has been completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete appointment",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate(new Date());
    setEndDate(undefined);
    setSearchTerm("");
  };

  // Statistics
  const totalAppointments = filteredAppointments.length;
  const completedCount = completedAppointments.length;
  const pendingCount = pendingAppointments.length;
  const confirmedCount = confirmedAppointments.length;
  const cancelledCount = cancelledAppointments.length;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Error Loading Appointments</h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Today&apos;s Appointments
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            Total: {totalAppointments}
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed: {completedCount}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Confirmed: {confirmedCount}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Pending: {pendingCount}
          </Badge>
          {cancelledCount > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              <XCircle className="w-4 h-4 mr-1" />
              Cancelled: {cancelledCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date Picker */}
          <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setShowStartDatePicker(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date Picker */}
          <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setShowEndDatePicker(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {(statusFilter !== "all" || endDate || searchTerm) && (
            <Button variant="outline" onClick={clearFilters} className="shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filteredAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {pendingAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {confirmedAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {completedAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {cancelledAppointments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
            <h3 className="mt-4 text-lg font-semibold">Loading appointments...</h3>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No appointments scheduled for the selected date range"}
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No pending appointments</h3>
                  <p className="text-muted-foreground">All appointments are processed</p>
                </div>
              ) : (
                pendingAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              {confirmedAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No confirmed appointments</h3>
                  <p className="text-muted-foreground">No confirmed appointments found</p>
                </div>
              ) : (
                confirmedAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No completed appointments</h3>
                  <p className="text-muted-foreground">Completed appointments will appear here</p>
                </div>
              ) : (
                completedAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No cancelled appointments</h3>
                  <p className="text-muted-foreground">No appointments have been cancelled</p>
                </div>
              ) : (
                cancelledAppointments.map((appointment) => (
                  <DoctorAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
