// src/features/appointments/services/medical-records-service.ts
import { PatientMedicalRecords } from '../hooks/useMedicalRecords';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export class MedicalRecordsService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}/api/${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.title || errorData.detail || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get comprehensive medical records for a specific patient
   * @param patientId The ID of the patient
   * @param token Authentication token
   * @returns Patient's complete medical history including allergies, chronic diseases, and medical records
   */
  async getPatientMedicalRecords(
    patientId: string,
    token: string,
  ): Promise<PatientMedicalRecords> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    return this.request<PatientMedicalRecords>(
      `doctors/me/patients/${patientId}/medical-records`,
      { headers },
    );
  }

  /**
   * Get patient medical records with date range filtering
   * @param patientId The ID of the patient
   * @param startDate Start date for filtering records (optional)
   * @param endDate End date for filtering records (optional)
   * @param token Authentication token
   * @returns Filtered patient medical records
   */
  async getPatientMedicalRecordsByDateRange(
    patientId: string,
    startDate?: string,
    endDate?: string,
    token?: string,
  ): Promise<PatientMedicalRecords> {
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const searchParams = new URLSearchParams();
    if (startDate) {
      searchParams.append('startDate', startDate);
    }
    if (endDate) {
      searchParams.append('endDate', endDate);
    }

    const queryString = searchParams.toString();
    const endpoint = `doctors/me/patients/${patientId}/medical-records${queryString ? `?${queryString}` : ''}`;

    return this.request<PatientMedicalRecords>(endpoint, { headers });
  }

  /**
   * Get only the latest medical record for a patient
   * @param patientId The ID of the patient
   * @param token Authentication token
   * @returns The most recent medical record
   */
  async getLatestMedicalRecord(
    patientId: string,
    token: string,
  ): Promise<PatientMedicalRecords> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const records = await this.request<PatientMedicalRecords>(
      `doctors/me/patients/${patientId}/medical-records`,
      { headers },
    );

    // Sort records by date and return only the latest one
    if (records.data.medicalRecords && records.data.medicalRecords.length > 0) {
      const sortedRecords = [...records.data.medicalRecords].sort(
        (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
      );
      
      return {
        ...records,
        data: {
          ...records.data,
          medicalRecords: [sortedRecords[0]], // Return only the latest record
        },
      };
    }

    return records;
  }

  /**
   * Search medical records by diagnosis keyword
   * @param patientId The ID of the patient
   * @param searchTerm Search term for diagnosis
   * @param token Authentication token
   * @returns Filtered medical records matching the search term
   */
  async searchMedicalRecordsByDiagnosis(
    patientId: string,
    searchTerm: string,
    token: string,
  ): Promise<PatientMedicalRecords> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const allRecords = await this.getPatientMedicalRecords(patientId, token);
    
    if (allRecords.data.medicalRecords) {
      const filteredRecords = allRecords.data.medicalRecords.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        ...allRecords,
        data: {
          ...allRecords.data,
          medicalRecords: filteredRecords,
        },
      };
    }

    return allRecords;
  }

  /**
   * Get medical records for multiple patients (batch request)
   * @param patientIds Array of patient IDs
   * @param token Authentication token
   * @returns Array of medical records for each patient
   */
  async getMedicalRecordsForMultiplePatients(
    patientIds: string[],
    token: string,
  ): Promise<PatientMedicalRecords[]> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const promises = patientIds.map(patientId =>
      this.getPatientMedicalRecords(patientId, token).catch(error => {
        console.error(`Failed to fetch medical records for patient ${patientId}:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    return results.filter((result): result is PatientMedicalRecords => result !== null);
  }

  /**
   * Export medical records to PDF (placeholder for future implementation)
   * @param patientId The ID of the patient
   * @param token Authentication token
   * @returns Blob containing PDF data
   */
  async exportMedicalRecordsToPDF(
    patientId: string,
    token: string,
  ): Promise<Blob> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${BASE_URL}/api/doctors/me/patients/${patientId}/medical-records/export`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('Failed to export medical records');
    }

    return response.blob();
  }

  /**
   * Get statistics about patient's medical history
   * @param patientId The ID of the patient
   * @param token Authentication token
   * @returns Statistics object
   */
  async getMedicalRecordsStatistics(
    patientId: string,
    token: string,
  ): Promise<{
    totalRecords: number;
    totalPrescriptions: number;
    commonDiagnoses: string[];
    visitFrequency: { month: string; count: number }[];
  }> {
    const records = await this.getPatientMedicalRecords(patientId, token);
    
    const totalRecords = records.data.medicalRecords?.length || 0;
    const totalPrescriptions = records.data.medicalRecords?.reduce(
      (acc, record) => acc + (record.prescriptions?.length || 0), 0
    ) || 0;

    // Extract common diagnoses
    const diagnoses = records.data.medicalRecords?.map(record => record.diagnosis) || [];
    const commonDiagnoses = [...new Set(diagnoses)].slice(0, 5);

    // Calculate visit frequency by month
    const visitFrequency = records.data.medicalRecords?.reduce((acc, record) => {
      const month = new Date(record.recordDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ month, count: 1 });
      }
      return acc;
    }, [] as { month: string; count: number }[]) || [];

    return {
      totalRecords,
      totalPrescriptions,
      commonDiagnoses,
      visitFrequency: visitFrequency.sort((a, b) => 
        new Date(a.month).getTime() - new Date(b.month).getTime()
      ),
    };
  }
}

export const medicalRecordsService = new MedicalRecordsService();