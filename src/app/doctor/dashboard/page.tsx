// src/app/dashboard/appointments/today/page.tsx
"use client";
import React, { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { AppointmentCard } from '@/features/appointments/components/appointment-card';
import { Appointment } from '@/features/appointments/types/appointment';
import { useAppointments, useCancelAppointment, useCompleteAppointment, useConfirmAppointment } from '@/features/appointments/hooks/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from "@/features/authentication/hooks/useAuth";

export default function TodayAppointmentsPage() {
  const { toast } = useToast();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date().toISOString().split('T')[0];
  const { data, isLoading, isError, error } = useAppointments({
    startdate: today,
    enddate: today,
    page: 1,
    pageSize: 50,
    sort: 'timeAsc',
  }, token || '');

  const confirmMutation = useConfirmAppointment(token || '');
  const cancelMutation = useCancelAppointment(token || '');
  const completeMutation = useCompleteAppointment(token || '');

  const appointments = data?.data || [];

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(apt => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const name = apt.patient.fullName.toLowerCase();
    const nationalId = (apt.patient.nationalID || '').toLowerCase();
    return name.includes(q) || nationalId.includes(q);
  });

  // Group appointments by status
  const pendingAppointments = filteredAppointments.filter(apt => apt.status === 'Pending');
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'Confirmed');
  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'Completed');
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'Cancelled');

  const handleCompleteAppointment = async (
    appointment: Appointment,
    data: { diagnosis: string; treatmentNotes?: string; followUpInstructions?: string; medicationList?: string; dosageInstructions?: string }
  ) => {
    try {
      await completeMutation.mutateAsync({ appointmentId: appointment.id, data });
      toast({
        title: "Appointment Completed",
        description: `Appointment with ${appointment.patient.fullName} has been marked as completed.`,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to complete appointment';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleCancelAppointment = async (appointment: Appointment, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ appointmentId: appointment.id, data: { cancellationreason: reason } });
      toast({
        title: "Appointment Cancelled",
        description: `Appointment with ${appointment.patient.fullName} has been cancelled.`,
        variant: "destructive",
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to cancel appointment';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  // Rescheduling not implemented yet

  const handleCheckInAppointment = async (appointment: Appointment) => {
    try {
      await confirmMutation.mutateAsync(appointment.id);
      toast({
        title: "Patient Checked In",
        description: `${appointment.patient.fullName} has been checked in successfully.`,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to check in';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const totalAppointments = appointments.length;
  const completedCount = completedAppointments.length;
  const pendingCount = pendingAppointments.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today&apos;s Appointments</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            Total: {totalAppointments}
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed: {completedCount}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Pending: {pendingCount}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Loading / Error states */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
      {isError && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-lg font-semibold">Failed to load appointments</h3>
          <p className="text-muted-foreground">{(error as Error)?.message || 'Please try again later.'}</p>
        </div>
      )}

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

        <TabsContent value="all" className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No appointments scheduled for today"}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleCheckInAppointment}
                onAddPayment={() => toast({ title: 'Payment', description: 'Payment processing not implemented yet.' })}
                onAddRecord={async (_apt, record) => {
                  try {
                    await completeMutation.mutateAsync({ appointmentId: appointment.id, data: { diagnosis: record.diagnosis, treatmentNotes: record.notes, medicationList: record.prescription } });
                    toast({ title: 'Medical record saved', description: 'Appointment completed successfully.' });
                  } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to save record';
                    toast({ title: 'Error', description: message, variant: 'destructive' });
                  }
                }}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
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
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleCheckInAppointment}
                onAddPayment={() => toast({ title: 'Payment', description: 'Payment processing not implemented yet.' })}
                onAddRecord={async (_apt, record) => {
                  try {
                    await completeMutation.mutateAsync({ appointmentId: appointment.id, data: { diagnosis: record.diagnosis, treatmentNotes: record.notes, medicationList: record.prescription } });
                    toast({ title: 'Medical record saved', description: 'Appointment completed successfully.' });
                  } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to save record';
                    toast({ title: 'Error', description: message, variant: 'destructive' });
                  }
                }}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No confirmed appointments</h3>
              <p className="text-muted-foreground">No patients checked in yet</p>
            </div>
          ) : (
            confirmedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleCheckInAppointment}
                onAddPayment={() => toast({ title: 'Payment', description: 'Payment processing not implemented yet.' })}
                onAddRecord={async (_apt, record) => {
                  try {
                    await completeMutation.mutateAsync({ appointmentId: appointment.id, data: { diagnosis: record.diagnosis, treatmentNotes: record.notes, medicationList: record.prescription } });
                    toast({ title: 'Medical record saved', description: 'Appointment completed successfully.' });
                  } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to save record';
                    toast({ title: 'Error', description: message, variant: 'destructive' });
                  }
                }}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
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
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleCheckInAppointment}
                onAddPayment={() => toast({ title: 'Payment', description: 'Payment processing not implemented yet.' })}
                onAddRecord={async (_apt, record) => {
                  try {
                    await completeMutation.mutateAsync({ appointmentId: appointment.id, data: { diagnosis: record.diagnosis, treatmentNotes: record.notes, medicationList: record.prescription } });
                    toast({ title: 'Medical record saved', description: 'Appointment completed successfully.' });
                  } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to save record';
                    toast({ title: 'Error', description: message, variant: 'destructive' });
                  }
                }}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No cancelled appointments</h3>
              <p className="text-muted-foreground">No appointments have been cancelled today</p>
            </div>
          ) : (
            cancelledAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleCheckInAppointment}
                onAddPayment={() => toast({ title: 'Payment', description: 'Payment processing not implemented yet.' })}
                onAddRecord={async (_apt, record) => {
                  try {
                    await completeMutation.mutateAsync({ appointmentId: appointment.id, data: { diagnosis: record.diagnosis, treatmentNotes: record.notes, medicationList: record.prescription } });
                    toast({ title: 'Medical record saved', description: 'Appointment completed successfully.' });
                  } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to save record';
                    toast({ title: 'Error', description: message, variant: 'destructive' });
                  }
                }}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}