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
import { Input } from "@/components/ui/input";
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
  History,
  Plus,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { PatientMedicalRecordsDialog } from "./patient-medical-records-dialog";
import { CreateAppointmentDialog } from "./create-appointment-dialog";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

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
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(
    null
  );
  const [showCardForm, setShowCardForm] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [medicationList, setMedicationList] = useState("");
  const [dosageInstructions, setDosageInstructions] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // Card payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const handleViewDetails = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowDetailsDialog(true);
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
    const timeParts = time.split(":");
    const hours = timeParts[0].padStart(2, "0");
    const minutes = timeParts[1] || "00";
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

  const handlePaymentMethodSelect = (method: "cash" | "card") => {
    setPaymentMethod(method);
    if (method === "card") {
      setShowCardForm(true);
    } else {
      // For cash payment, proceed directly to completion
      handleComplete();
      setShowPaymentDialog(false);
      setPaymentMethod(null);
    }
  };

  const handleCardPaymentSubmit = () => {
    // Here you would normally process the card payment
    // For now, we'll just show a success message and complete the appointment
    handleComplete();
    setShowCardForm(false);
    setShowPaymentDialog(false);
    setPaymentMethod(null);
    // Reset card form
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");
  };

  const getDropdownMenuItems = () => {
    const commonItems = [
      <DropdownMenuItem
        key="medical-records"
        onClick={() => setShowMedicalRecords(true)}
      >
        <History className="mr-2 h-4 w-4" />
        View Medical Records
      </DropdownMenuItem>,
      <DropdownMenuItem
        key="create-appointment"
        onClick={() => setShowCreateAppointment(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create New Appointment
      </DropdownMenuItem>,
    ];

    const viewDetailsItem = (
      <DropdownMenuItem
        key="view-details"
        onClick={() => handleViewDetails(appointment.id)}
      >
        <FileText className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>
    );

    switch (appointment.status) {
      case "Pending":
        return [
          ...commonItems,
          <DropdownMenuSeparator key="sep1" />,
          <DropdownMenuItem
            key="confirm"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="cancel"
            onClick={() => setShowCancelDialog(true)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </DropdownMenuItem>,
        ];

      case "Confirmed":
        return [
          ...commonItems,
          <DropdownMenuSeparator key="sep1" />,
          <DropdownMenuItem
            key="complete"
            onClick={() => setShowCompleteDialog(true)}
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Complete Appointment
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="cancel"
            onClick={() => setShowCancelDialog(true)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </DropdownMenuItem>,
        ];

      case "Completed":
        return [
          ...commonItems,
          <DropdownMenuSeparator key="sep1" />,
          viewDetailsItem,
        ];

      case "Cancelled":
        return [
          ...commonItems,
          <DropdownMenuSeparator key="sep1" />,
          viewDetailsItem,
        ];

      default:
        return commonItems;
    }
  };

  const getQuickActions = () => {
    const commonActions = [
      <Button
        key="medical-records"
        variant="outline"
        size="sm"
        onClick={() => setShowMedicalRecords(true)}
      >
        <History className="h-3 w-3 mr-1" />
        Medical Records
      </Button>,
      <Button
        key="create-appointment"
        variant="outline"
        size="sm"
        onClick={() => setShowCreateAppointment(true)}
      >
        <Plus className="h-3 w-3 mr-1" />
        New Appointment
      </Button>,
    ];

    switch (appointment.status) {
      case "Pending":
        return [
          ...commonActions,
          <Button
            key="confirm"
            variant="default"
            size="sm"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Check className="h-3 w-3 mr-1" />
            Confirm
          </Button>,
        ];

      case "Confirmed":
        return [
          ...commonActions,
          <Button
            key="complete"
            variant="default"
            size="sm"
            onClick={() => setShowCompleteDialog(true)}
          >
            <Stethoscope className="h-3 w-3 mr-1" />
            Complete
          </Button>,
        ];

      case "Completed":
        return [
          ...commonActions,
          <Button key="view-details" variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            View Details
          </Button>,
        ];

      case "Cancelled":
        return [
          ...commonActions,
          <Button key="view-details" variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            View Details
          </Button>,
        ];

      default:
        return commonActions;
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
                  {getDropdownMenuItems()}
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

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">{getQuickActions()}</div>

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
          {appointment.status === "Cancelled" &&
            appointment.cancellationReason && (
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

      {/* Medical Records Dialog */}
      <PatientMedicalRecordsDialog
        patientId={appointment.patient.id}
        patientName={appointment.patient.fullName}
        open={showMedicalRecords}
        onOpenChange={setShowMedicalRecords}
      />
      <AppointmentDetailsDialog
        appointmentId={selectedAppointmentId}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      {/* Create Appointment Dialog */}
      <CreateAppointmentDialog
        patientId={appointment.patient.id}
        patientName={appointment.patient.fullName}
        open={showCreateAppointment}
        onOpenChange={setShowCreateAppointment}
      />

      {/* Confirm Appointment Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Confirm that {appointment.patient.fullName} has arrived for their
              appointment on{" "}
              {new Date(appointment.scheduledDate).toLocaleDateString()} at{" "}
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
              Complete the appointment with {appointment.patient.fullName} and
              add medical information.
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
              <Label htmlFor="followUpInstructions">
                Follow-up Instructions
              </Label>
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
              <Button
                onClick={() => {
                  setShowCompleteDialog(false);
                  setShowPaymentDialog(true);
                }}
                disabled={!diagnosis.trim()}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how {appointment.patient.fullName} will pay for this
              appointment.
            </DialogDescription>
          </DialogHeader>

          {!showCardForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handlePaymentMethodSelect("cash")}
                >
                  <DollarSign className="h-8 w-8" />
                  <span>Cash Payment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handlePaymentMethodSelect("card")}
                >
                  <CreditCard className="h-8 w-8" />
                  <span>Credit Card</span>
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Enter Card Details</DialogTitle>
                <DialogDescription>
                  Please enter the credit card information for payment.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCardForm(false);
                    setPaymentMethod(null);
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCardPaymentSubmit}
                  disabled={!cardNumber || !cardHolder || !expiryDate || !cvv}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Process Payment
                </Button>
              </div>
            </div>
          )}
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
