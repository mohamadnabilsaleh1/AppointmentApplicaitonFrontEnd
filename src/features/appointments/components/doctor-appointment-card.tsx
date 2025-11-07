// src/features/appointments/components/doctor-appointment-card.tsx
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Appointment } from "../types/appointment";
import {
  User,
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock4,
  FileText,
  Check,
  Stethoscope,
} from "lucide-react";

interface DoctorAppointmentCardProps {
  appointment: Appointment;
  onConfirm: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment, reason: string) => void;
  onComplete: (
    appointment: Appointment,
    data: {
      diagnosis: string;
      treatmentNotes?: string;
      followUpInstructions?: string;
      medicationList?: string;
      dosageInstructions?: string;
    }
  ) => void;
}

export function DoctorAppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
}: DoctorAppointmentCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [medicationList, setMedicationList] = useState("");
  const [dosageInstructions, setDosageInstructions] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Confirmed":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      case "NoShow":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "Confirmed":
        return <Check className="h-3 w-3 mr-1" />;
      case "Pending":
        return <Clock4 className="h-3 w-3 mr-1" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "NoShow":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock4 className="h-3 w-3 mr-1" />;
    }
  };

  const formatTime = (time: string) => {
    // Handle both HH:mm:ss and HH:mm formats
    const timeParts = time.split(':');
    const hours = timeParts[0].padStart(2, '0');
    const minutes = timeParts[1] || '00';
    return `${hours}:${minutes}`;
  };

  const handleConfirm = () => {
    onConfirm(appointment);
    setShowConfirmDialog(false);
  };

  const handleComplete = () => {
    if (diagnosis.trim()) {
      onComplete(appointment, {
        diagnosis: diagnosis.trim(),
        treatmentNotes: treatmentNotes.trim() || undefined,
        followUpInstructions: followUpInstructions.trim() || undefined,
        medicationList: medicationList.trim() || undefined,
        dosageInstructions: dosageInstructions.trim() || undefined,
      });
      setShowCompleteDialog(false);
      // Reset form
      setDiagnosis("");
      setTreatmentNotes("");
      setFollowUpInstructions("");
      setMedicationList("");
      setDosageInstructions("");
    }
  };

  const handleCancel = () => {
    if (cancelReason.trim()) {
      onCancel(appointment, cancelReason);
      setShowCancelDialog(false);
      setCancelReason("");
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5" />
                {appointment.patient.fullName}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(appointment.scheduledDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(appointment.scheduledTime)}
                </span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusVariant(appointment.status)}
                className="flex items-center gap-1"
              >
                {getStatusIcon(appointment.status)}
                {appointment.status}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Pending Appointments */}
                  {appointment.status === "Pending" && (
                    <>
                      <DropdownMenuItem onClick={() => setShowConfirmDialog(true)}>
                        <Check className="mr-2 h-4 w-4" />
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Confirmed Appointments */}
                  {appointment.status === "Confirmed" && (
                    <>
                      <DropdownMenuItem onClick={() => setShowCompleteDialog(true)}>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Complete Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Patient Info</p>
              <div className="space-y-1">
                <p className="text-sm">{appointment.patient.fullName}</p>
                {appointment.patient.nationalID && (
                  <p className="text-xs text-muted-foreground">
                    ID: {appointment.patient.nationalID}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Facility</p>
              <div className="space-y-1">
                <p className="text-sm">{appointment.facility.name}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.facility.address}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          {appointment.notes && (
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Appointment Notes
              </p>
              <p className="text-sm bg-muted p-3 rounded-lg">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === "Cancelled" && appointment.cancellationReason && (
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Cancellation Reason
              </p>
              <p className="text-sm bg-destructive/10 text-destructive p-3 rounded-lg">
                {appointment.cancellationReason}
              </p>
            </div>
          )}

          {/* Booking Info */}
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
            <span>
              Booked: {new Date(appointment.bookingDate).toLocaleDateString()}
            </span>
            <span>Duration: {appointment.durationMinutes} min</span>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Appointment Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Confirm that {appointment.patient.fullName} has arrived for their appointment
              on {new Date(appointment.scheduledDate).toLocaleDateString()} at{" "}
              {formatTime(appointment.scheduledTime)}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Appointment Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>
              Complete the appointment with {appointment.patient.fullName} and add medical information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosis">
                Diagnosis <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div>
              <Label htmlFor="treatmentNotes">Treatment Notes</Label>
              <Textarea
                id="treatmentNotes"
                placeholder="Enter treatment notes (optional)..."
                value={treatmentNotes}
                onChange={(e) => setTreatmentNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
              <Textarea
                id="followUpInstructions"
                placeholder="Enter follow-up instructions (optional)..."
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="medicationList">Medication List</Label>
              <Textarea
                id="medicationList"
                placeholder="Enter medication list (optional)..."
                value={medicationList}
                onChange={(e) => setMedicationList(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="dosageInstructions">Dosage Instructions</Label>
              <Textarea
                id="dosageInstructions"
                placeholder="Enter dosage instructions (optional)..."
                value={dosageInstructions}
                onChange={(e) => setDosageInstructions(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCompleteDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleComplete} disabled={!diagnosis.trim()}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this appointment with{" "}
              {appointment.patient.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!cancelReason.trim()}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

