// src/app/dashboard/appointments/today/page.tsx
"use client";
import React, { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, CheckCircle, CreditCard, FileText } from "lucide-react";
import { AppointmentCard } from '@/features/appointments/components/appointment-card';
import { dummyAppointments } from '@/features/appointments/data/dummy-appointments';
import { Appointment } from '@/features/appointments/types/appointment';

export default function TodayAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = dummyAppointments.filter(apt => apt.scheduledDate === today);

  // Group appointments by status
  const pendingAppointments = dummyAppointments.filter(apt => apt.status === 'Pending');
  const confirmedAppointments = dummyAppointments.filter(apt => apt.status === 'Confirmed');
  const completedAppointments = dummyAppointments.filter(apt => apt.status === 'Completed');
  const cancelledAppointments = dummyAppointments.filter(apt => apt.status === 'Cancelled');

  // Move from Pending to Confirmed (Check-in)
  const handleConfirmAppointment = (appointment: Appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'Confirmed' as const,
            checkInTime: new Date().toISOString()
          }
        : apt
    ));
    
    toast({
      title: "Appointment Confirmed",
      description: `${appointment.patient.firstName} ${appointment.patient.lastName} has been checked in.`,
    });
  };

  // Add payment to confirmed appointment
  const handleAddPayment = (appointment: Appointment, amount: number, method: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            billing: {
              amount,
              method,
              status: 'Paid' as const,
              paidAt: new Date().toISOString()
            }
          }
        : apt
    ));
    
    toast({
      title: "Payment Added",
      description: `Payment of $${amount} processed for ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
    });
  };

  // Add medical record (optional)
  const handleAddRecord = (appointment: Appointment, record: {
    diagnosis: string;
    prescription?: string;
    notes?: string;
  }) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            medicalRecord: record
          }
        : apt
    ));
    
    toast({
      title: "Record Added",
      description: `Medical record added for ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
    });
  };

  // Move from Confirmed to Completed (after payment and optional record)
  const handleCompleteAppointment = (appointment: Appointment) => {
    // Check if payment has been made
    if (!appointment.billing || appointment.billing.status !== 'Paid') {
      toast({
        title: "Payment Required",
        description: "Please process payment before completing the appointment.",
        variant: "destructive",
      });
      return;
    }

    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            status: 'Completed' as const,
            checkOutTime: new Date().toISOString()
          }
        : apt
    ));
    
    toast({
      title: "Appointment Completed",
      description: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} has been completed.`,
    });
  };

  const handleCancelAppointment = (appointment: Appointment, reason: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: 'Cancelled' as const, cancelledReason: reason }
        : apt
    ));
    
    toast({
      title: "Appointment Cancelled",
      description: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} has been cancelled.`,
      variant: "destructive",
    });
  };

  const handleRescheduleAppointment = (appointment: Appointment, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { 
            ...apt, 
            scheduledDate: newDate,
            scheduledTime: newTime,
            status: 'Pending' as const // Reset to pending when rescheduled
          }
        : apt
    ));
    
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} has been rescheduled to ${newDate} at ${newTime}.`,
    });
  };

  const totalAppointments = todayAppointments.length;
  const completedCount = completedAppointments.length;
  const pendingCount = pendingAppointments.length;
  const confirmedCount = confirmedAppointments.length;

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
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Pending: {pendingCount}
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            Confirmed: {confirmedCount}
          </Badge>
          <Badge variant="default" className="px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed: {completedCount}
          </Badge>
        </div>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {todayAppointments.length}
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
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
              <p className="text-muted-foreground">No appointments scheduled for today</p>
            </div>
          ) : (
            todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleConfirmAppointment}
                onAddPayment={handleAddPayment}
                onAddRecord={handleAddRecord}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
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
                onConfirm={handleConfirmAppointment}
                onAddPayment={handleAddPayment}
                onAddRecord={handleAddRecord}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
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
                onConfirm={handleConfirmAppointment}
                onAddPayment={handleAddPayment}
                onAddRecord={handleAddRecord}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
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
                onConfirm={handleConfirmAppointment}
                onAddPayment={handleAddPayment}
                onAddRecord={handleAddRecord}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
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
                onConfirm={handleConfirmAppointment}
                onAddPayment={handleAddPayment}
                onAddRecord={handleAddRecord}
                onComplete={handleCompleteAppointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}