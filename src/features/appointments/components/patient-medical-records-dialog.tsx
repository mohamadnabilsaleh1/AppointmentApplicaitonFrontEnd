// src/features/appointments/components/patient-medical-records-dialog.tsx
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Calendar,
  FileText,
  Pill,
  AlertTriangle,
  Heart,
  Building2,
} from "lucide-react";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { usePatientMedicalRecords } from "../hooks/useMedicalRecords";

interface PatientMedicalRecordsDialogProps {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientMedicalRecordsDialog({
  patientId,
  patientName,
  open,
  onOpenChange,
}: PatientMedicalRecordsDialogProps) {
  const { token } = useAuth();
  const { data: medicalRecords, isLoading, error } = usePatientMedicalRecords(
    patientId,
    token || ""
  );

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
      return "Invalid Date";
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Records - {patientName}
          </DialogTitle>
          <DialogDescription>
            Complete medical history and records for the patient
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
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load medical records"}
            </p>
          </div>
        ) : medicalRecords ? (
          <div className="space-y-6">
            {/* Patient Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base font-semibold">
                    {medicalRecords.data.patientFullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    National ID
                  </p>
                  <p className="text-base">{medicalRecords.data.patientNationalId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{medicalRecords.data.patientGender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{medicalRecords.data.patientAge} years</p>
                </div>
              </div>
            </div>

            {/* Allergies */}
            {medicalRecords.data.allergies && medicalRecords.data.allergies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Allergies ({medicalRecords.data.allergies.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {medicalRecords.data.allergies.map((allergy) => (
                    <Badge key={allergy.id} variant="destructive" className="text-sm">
                      {allergy.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chronic Diseases */}
            {medicalRecords.data.chronicDiseases && medicalRecords.data.chronicDiseases.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Chronic Conditions ({medicalRecords.data.chronicDiseases.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {medicalRecords.data.chronicDiseases.map((disease) => (
                    <Badge key={disease.id} variant="outline" className="text-sm">
                      {disease.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Medical Records */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Medical History ({medicalRecords.data.medicalRecords?.length || 0})
              </h3>
              
              {medicalRecords.data.medicalRecords && medicalRecords.data.medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.data.medicalRecords.map((record, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      {/* Record Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Visit on {formatDateTime(record.recordDate)}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {record.facility.name}
                            </span>
                            <Badge variant={
                              record.appointment.status === "Completed" ? "default" : "outline"
                            }>
                              {record.appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Diagnosis
                        </p>
                        <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                          {record.diagnosis}
                        </p>
                      </div>

                      {/* Treatment Notes */}
                      {record.treatmentNotes && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Treatment Notes
                          </p>
                          <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                            {record.treatmentNotes}
                          </p>
                        </div>
                      )}

                      {/* Follow-up Instructions */}
                      {record.followUpInstructions && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Follow-up Instructions
                          </p>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1 border border-blue-200">
                            {record.followUpInstructions}
                          </p>
                        </div>
                      )}

                      {/* Prescriptions */}
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Pill className="h-4 w-4" />
                            Prescriptions ({record.prescriptions.length})
                          </p>
                          <div className="space-y-2 mt-2">
                            {record.prescriptions.map((prescription, idx) => (
                              <div key={prescription.id} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium">
                                    Prescription #{idx + 1}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(prescription.dateIssued).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="font-medium">Medications:</span>
                                    <p className="mt-1">{prescription.medicationList}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Dosage:</span>
                                    <p className="mt-1">{prescription.dosageInstructions}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>No medical records found for this patient.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}