// src/features/appointments/components/appointment-details-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  CreditCard,
  Pill,
  FileText,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";
import { useAppointmentDetails } from "../hooks/useAppointments";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentDetailsDialogProps {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({
  appointmentId,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
  const { token } = useAuth();
  const { data: appointment, isLoading, error } = useAppointmentDetails(
    appointmentId,
    token || ""
  );
  

  const formatTime = (time: string | undefined | null) => {
    // Handle undefined, null, or empty time
    if (!time) {
      return "00:00";
    }
    
    try {
      const timeParts = time.split(":");
      const hours = timeParts[0]?.padStart(2, "0") || "00";
      const minutes = timeParts[1]?.substring(0, 2) || "00"; // Handle seconds if present
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date time:", error);
      return "Invalid Date";
    }
  };

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
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "Pending":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  if (!open || !appointmentId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this appointment
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load appointment details"}
            </p>
          </div>
        ) : appointment ? (
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge
                  variant={getStatusVariant(appointment.data.status)}
                  className="flex items-center gap-1 w-fit"
                >
                  {getStatusIcon(appointment.data.status)}
                  {appointment.data.status}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(appointment.data.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {appointment.data.scheduledTime ? formatTime(appointment.data.scheduledTime) : "N/A"}
                  </span>
                  <span>Duration: {appointment.data.durationMinutes} min</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Patient Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base">{appointment.data.patient?.fullName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    National ID
                  </p>
                  <p className="text-base">{appointment.data.patient?.nationalID || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{appointment.data.patient?.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{appointment.data.patient?.age || "N/A"} years</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base">{appointment.data.doctor?.fullName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Specialization
                  </p>
                  <p className="text-base">
                    {appointment.data.doctor?.specialization || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    License Number
                  </p>
                  <p className="text-base">
                    {appointment.data.doctor?.licenseNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{appointment.data.doctor?.gender || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Facility Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Facility Information
              </h3>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-base">{appointment.data.facility?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <p className="text-base">{appointment.data.facility?.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </p>
                  <p className="text-base">
                    {appointment.data.facility?.address ? (
                      <>
                        {appointment.data.facility.address.street},{" "}
                        {appointment.data.facility.address.city},{" "}
                        {appointment.data.facility.address.state},{" "}
                        {appointment.data.facility.address.country}{" "}
                        {appointment.data.facility.address.zipCode}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Timeline */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </h3>
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Booking Date</span>
                  <span className="text-sm">
                    {appointment.data.bookingDate ? formatDateTime(appointment.data.bookingDate) : "N/A"}
                  </span>
                </div>
                {appointment.data.checkInTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Check-In Time</span>
                    <span className="text-sm">
                      {formatDateTime(appointment.data.checkInTime)}
                    </span>
                  </div>
                )}
                {appointment.data.checkOutTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Check-Out Time</span>
                    <span className="text-sm">
                      {formatDateTime(appointment.data.checkOutTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {appointment.data.notes && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Notes</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {appointment.data.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Cancellation Reason */}
            {appointment.data.cancellationReason && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-destructive">
                  Cancellation Reason
                </h3>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive whitespace-pre-wrap">
                    {appointment.data.cancellationReason}
                  </p>
                </div>
              </div>
            )}

            {/* Billing Information */}
            {appointment.data.billing && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-base font-semibold">
                        ${appointment.data.billing.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        variant={
                          appointment.data.billing.status === "Paid"
                            ? "default"
                            : "outline"
                        }
                        className="mt-1"
                      >
                        {appointment.data.billing.status || "Unknown"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date Issued
                      </p>
                      <p className="text-base">
                        {appointment.data.billing.dateIssued ? formatDate(appointment.data.billing.dateIssued) : "N/A"}
                      </p>
                    </div>
                    {appointment.data.billing.paymentDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Payment Date
                        </p>
                        <p className="text-base">
                          {formatDate(appointment.data.billing.paymentDate)}
                        </p>
                      </div>
                    )}
                    {appointment.data.billing.paidAmount && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Paid Amount
                        </p>
                        <p className="text-base font-semibold">
                          ${appointment.data.billing.paidAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Prescriptions */}
            {appointment.data.prescriptions &&
              appointment.data.prescriptions.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Prescriptions ({appointment.data.prescriptions.length})
                    </h3>
                    <div className="space-y-4">
                      {appointment.data.prescriptions.map((prescription, index) => (
                        <div
                          key={prescription.id}
                          className="p-4 bg-muted rounded-lg space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">
                              Prescription #{index + 1}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {prescription.dateIssued ? formatDate(prescription.dateIssued) : "N/A"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Medication List
                            </p>
                            <p className="text-sm whitespace-pre-wrap">
                              {prescription.medicationList || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Dosage Instructions
                            </p>
                            <p className="text-sm whitespace-pre-wrap">
                              {prescription.dosageInstructions || "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
