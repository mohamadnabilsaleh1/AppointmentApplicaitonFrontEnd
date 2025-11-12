// src/features/appointments/hooks/useMedicalRecords.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalRecordsService } from '../services/medical-records-service';

export interface Allergy {
  id: string;
  name: string;
  allergyType: string;
}

export interface ChronicDisease {
  id: string;
  name: string;
  chronicDiseaseType: string;
}

export interface Prescription {
  id: string;
  dateIssued: string;
  medicationList: string;
  dosageInstructions: string;
}

export interface MedicalRecord {
  recordDate: string;
  diagnosis: string;
  treatmentNotes?: string;
  followUpInstructions?: string;
  prescriptions: Prescription[];
  appointment: {
    id: string;
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    notes: string;
  };
  facility: {
    id: string;
    name: string;
    address: string;
  };
}

export interface PatientMedicalRecords {
  data: {
    id: string;
    patientFullName: string;
    patientNationalId: string;
    patientGender: string;
    patientAge: number;
    allergies: Allergy[];
    chronicDiseases: ChronicDisease[];
    medicalRecords: MedicalRecord[];
  };
}

export interface MedicalRecordsStatistics {
  totalRecords: number;
  totalPrescriptions: number;
  commonDiagnoses: string[];
  visitFrequency: { month: string; count: number }[];
}

export const medicalRecordsKeys = {
  all: ['medicalRecords'] as const,
  patient: (patientId: string) => [...medicalRecordsKeys.all, patientId] as const,
  patientWithDates: (patientId: string, startDate?: string, endDate?: string) => 
    [...medicalRecordsKeys.patient(patientId), 'dateRange', { startDate, endDate }] as const,
  latest: (patientId: string) => [...medicalRecordsKeys.patient(patientId), 'latest'] as const,
  search: (patientId: string, searchTerm: string) => 
    [...medicalRecordsKeys.patient(patientId), 'search', searchTerm] as const,
  statistics: (patientId: string) => [...medicalRecordsKeys.patient(patientId), 'statistics'] as const,
  multiple: (patientIds: string[]) => [...medicalRecordsKeys.all, 'multiple', ...patientIds] as const,
};

export const usePatientMedicalRecords = (patientId: string, token: string) => {
  return useQuery({
    queryKey: medicalRecordsKeys.patient(patientId),
    queryFn: () => medicalRecordsService.getPatientMedicalRecords(patientId, token),
    enabled: !!token && !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePatientMedicalRecordsByDateRange = (
  patientId: string,
  startDate?: string,
  endDate?: string,
  token?: string,
) => {
  return useQuery({
    queryKey: medicalRecordsKeys.patientWithDates(patientId, startDate, endDate),
    queryFn: () => medicalRecordsService.getPatientMedicalRecordsByDateRange(patientId, startDate, endDate, token),
    enabled: !!token && !!patientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLatestMedicalRecord = (patientId: string, token: string) => {
  return useQuery({
    queryKey: medicalRecordsKeys.latest(patientId),
    queryFn: () => medicalRecordsService.getLatestMedicalRecord(patientId, token),
    enabled: !!token && !!patientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchMedicalRecords = (patientId: string, searchTerm: string, token: string) => {
  return useQuery({
    queryKey: medicalRecordsKeys.search(patientId, searchTerm),
    queryFn: () => medicalRecordsService.searchMedicalRecordsByDiagnosis(patientId, searchTerm, token),
    enabled: !!token && !!patientId && searchTerm.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedicalRecordsStatistics = (patientId: string, token: string) => {
  return useQuery({
    queryKey: medicalRecordsKeys.statistics(patientId),
    queryFn: () => medicalRecordsService.getMedicalRecordsStatistics(patientId, token),
    enabled: !!token && !!patientId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMultiplePatientsMedicalRecords = (patientIds: string[], token: string) => {
  return useQuery({
    queryKey: medicalRecordsKeys.multiple(patientIds),
    queryFn: () => medicalRecordsService.getMedicalRecordsForMultiplePatients(patientIds, token),
    enabled: !!token && patientIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExportMedicalRecords = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, token }: { patientId: string; token: string }) =>
      medicalRecordsService.exportMedicalRecordsToPDF(patientId, token),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: medicalRecordsKeys.patient(variables.patientId) });
    },
  });
};

// Hook for prefetching medical records
export const usePrefetchMedicalRecords = (patientId: string, token: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: medicalRecordsKeys.patient(patientId),
      queryFn: () => medicalRecordsService.getPatientMedicalRecords(patientId, token),
    });
  };
};