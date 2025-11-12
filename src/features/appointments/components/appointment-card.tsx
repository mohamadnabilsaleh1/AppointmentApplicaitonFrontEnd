// src/features/appointments/components/appointment-card.tsx
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
import { Input } from "@/components/ui/input";
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
  CreditCard,
  Stethoscope,
  Check,
  ArrowRight,
  Eye,
} from "lucide-react";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm: (appointment: Appointment) => void;
  onAddPayment: (appointment: Appointment, amount: number, method: string) => void;
  onAddRecord?: (appointment: Appointment, record: { diagnosis: string; prescription?: string; notes?: string }) => void;
  onComplete: (appointment: Appointment, data: { diagnosis: string; treatmentNotes?: string; followUpInstructions?: string; medicationList?: string; dosageInstructions?: string }) => void;
  onCancel: (appointment: Appointment, reason: string) => void;
  onReschedule?: (appointment: Appointment, newDate: string, newTime: string) => void;
  onViewDetails?: (appointmentId: string) => void; // Add this prop
}

export function AppointmentCard({
  appointment,
  onConfirm,
  onAddPayment,
  onComplete,
  onCancel,
  onViewDetails,
}: AppointmentCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [recordNotes, setRecordNotes] = useState("");

  // Completion form fields
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [medicationList, setMedicationList] = useState("");
  const [dosageInstructions, setDosageInstructions] = useState("");
  
  const [cancelReason, setCancelReason] = useState("");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Confirmed': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      case 'NoShow': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'Confirmed': return <Check className="h-3 w-3 mr-1" />;
      case 'Pending': return <Clock4 className="h-3 w-3 mr-1" />;
      case 'Cancelled': return <XCircle className="h-3 w-3 mr-1" />;
      case 'NoShow': return <XCircle className="h-3 w-3 mr-1" />;
      default: return <Clock4 className="h-3 w-3 mr-1" />;
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

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      onAddPayment(appointment, amount, paymentMethod);
      setShowPaymentDialog(false);
      setPaymentAmount("");
      setPaymentMethod("cash");
    }
  };

  const handleAddRecord = () => {
    if (!onAddRecord) return;
    if (diagnosis.trim()) {
      onAddRecord(appointment, {
        diagnosis,
        prescription: prescription.trim() || undefined,
        notes: recordNotes.trim() || undefined,
      });
      setShowRecordDialog(false);
      setDiagnosis("");
      setPrescription("");
      setRecordNotes("");
    }
  };

  const handleComplete = () => {
    if (!diagnosis.trim()) return;
    onComplete(appointment, {
      diagnosis: diagnosis.trim(),
      treatmentNotes: treatmentNotes.trim() || undefined,
      followUpInstructions: followUpInstructions.trim() || undefined,
      medicationList: medicationList.trim() || undefined,
      dosageInstructions: dosageInstructions.trim() || undefined,
    });
    setShowCompleteDialog(false);
    // clear fields
    setTreatmentNotes("");
    setFollowUpInstructions("");
    setMedicationList("");
    setDosageInstructions("");
  };

  const handleCancel = () => {
    if (cancelReason.trim()) {
      onCancel(appointment, cancelReason);
      setShowCancelDialog(false);
      setCancelReason("");
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(appointment.id);
    } else {
      setShowDetailsDialog(true);
    }
  };

  // Only allow complete when confirmed
  const canComplete = appointment.status === 'Confirmed';

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
              <Badge variant={getStatusVariant(appointment.status)} className="flex items-center gap-1">
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
                  {appointment.status === 'Pending' && (
                    <>
                      <DropdownMenuItem onClick={() => setShowConfirmDialog(true)}>
                        <Check className="mr-2 h-4 w-4" />
                        Check In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Confirmed Appointments */}
                  {appointment.status === 'Confirmed' && (
                    <>
                      <DropdownMenuItem onClick={() => setShowPaymentDialog(true)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowRecordDialog(true)}>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Add Medical Record
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setShowCompleteDialog(true)}
                        disabled={!canComplete}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Completed & Cancelled Appointments */}
                  {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
                    <DropdownMenuItem onClick={handleViewDetails}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  
                  {/* View Details for all appointment types */}
                  <DropdownMenuItem onClick={handleViewDetails}>
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Patient Info</p>
              <p className="text-sm">{appointment.patient.fullName}</p>
              {appointment.patient.nationalID && (
                <p className="text-xs text-muted-foreground">
                  ID: {appointment.patient.nationalID}
                </p>
              )}
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Facility</p>
              <p className="text-sm">{appointment.facility.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {appointment.facility.address}
              </p>
            </div>
          </div>

          {/* Workflow Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                appointment.status === 'Pending' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                1
              </div>
              <span className="text-sm">Check In</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                appointment.status === 'Confirmed' || appointment.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                appointment.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm">Complete</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewDetails}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {appointment.durationMinutes} min
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Stethoscope className="h-3 w-3" />
              {appointment.doctor.specialization}
            </Badge>
          </div>

          {/* Appointment Details */}
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">Appointment Notes</p>
            <p className="text-sm">{appointment.notes || "No notes provided"}</p>
          </div>

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
            <DialogTitle>Check In Patient</DialogTitle>
            <DialogDescription>
              Confirm that {appointment.patient.fullName}  has arrived for their appointment?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <Check className="mr-2 h-4 w-4" />
              Check In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Process payment for {appointment.patient.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <select
                id="method"
                title="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="insurance">Insurance</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment} disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Medical Record Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
            <DialogDescription>
              Create medical record for {appointment.patient.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                placeholder="Enter prescription details (optional)..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter additional notes (optional)..."
                value={recordNotes}
                onChange={(e) => setRecordNotes(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowRecordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRecord} disabled={!diagnosis.trim()}>
                <Stethoscope className="mr-2 h-4 w-4" />
                Save Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Appointment Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>
              Enter visit details to finalize completion for {appointment.patient.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosis-complete">Diagnosis *</Label>
              <Textarea
                id="diagnosis-complete"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="treatmentNotes">Treatment Notes</Label>
              <Textarea
                id="treatmentNotes"
                placeholder="Notes on treatment provided"
                value={treatmentNotes}
                onChange={(e) => setTreatmentNotes(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="followUp">Follow-up Instructions</Label>
              <Textarea
                id="followUp"
                placeholder="Follow-up instructions for the patient"
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="medications">Medication List</Label>
              <Textarea
                id="medications"
                placeholder="List medications prescribed"
                value={medicationList}
                onChange={(e) => setMedicationList(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage Instructions</Label>
              <Textarea
                id="dosage"
                placeholder="Provide dosage instructions"
                value={dosageInstructions}
                onChange={(e) => setDosageInstructions(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleComplete} disabled={!canComplete || !diagnosis.trim()}>
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
              Please provide a reason for cancelling this appointment.
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
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason.trim()}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointmentId={appointment.id}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </>
  );
}
