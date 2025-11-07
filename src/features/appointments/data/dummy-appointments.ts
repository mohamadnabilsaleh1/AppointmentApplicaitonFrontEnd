// src/features/appointments/data/dummy-appointments.ts
import { Appointment, Patient, Billing, BillingPayment, Prescription, MedicalRecord, MedicalRecordAttachment } from '../types/appointment';

export const dummyPatients: Patient[] = [
  {
    id: '1',
    nationalId: '1234567890',
    firstName: 'John',
    lastName: 'Smith',
    gender: 'Male',
    dateOfBirth: '1985-03-15',
    phoneNumber: '+1-555-0101',
    email: 'john.smith@email.com',
    address: '123 Main St, New York, NY'
  },
  {
    id: '2',
    nationalId: '2345678901',
    firstName: 'Sarah',
    lastName: 'Johnson',
    gender: 'Female',
    dateOfBirth: '1990-07-22',
    phoneNumber: '+1-555-0102',
    email: 'sarah.j@email.com',
    address: '456 Oak Ave, Los Angeles, CA'
  },
  {
    id: '3',
    nationalId: '3456789012',
    firstName: 'Michael',
    lastName: 'Brown',
    gender: 'Male',
    dateOfBirth: '1978-11-30',
    phoneNumber: '+1-555-0103',
    email: 'm.brown@email.com',
    address: '789 Pine Rd, Chicago, IL'
  },
  {
    id: '4',
    nationalId: '4567890123',
    firstName: 'Emily',
    lastName: 'Davis',
    gender: 'Female',
    dateOfBirth: '1995-05-18',
    phoneNumber: '+1-555-0104',
    email: 'emily.davis@email.com',
    address: '321 Elm St, Houston, TX'
  }
];

export const dummyBillingPayments: BillingPayment[] = [
  {
    id: '1',
    billingId: '1',
    paymentMethod: 'Cash',
    paidAmount: 150.00,
    paymentDate: '2024-01-15T10:30:00Z',
    transactionReference: 'CASH-001',
    paymentStatus: 'Completed'
  },
  {
    id: '2',
    billingId: '2',
    paymentMethod: 'CreditCard',
    paidAmount: 200.00,
    paymentDate: '2024-01-15T11:15:00Z',
    transactionReference: 'CC-20240115-001',
    paymentStatus: 'Completed'
  }
];

export const dummyBillings: Billing[] = [
  {
    id: '1',
    appointmentId: '1',
    billingPaymentId: '1',
    patientId: '1',
    doctorId: 'doc1',
    dateIssued: '2024-01-15',
    totalAmount: 150.00,
    status: 'Paid',
    notes: 'Routine checkup consultation',
    billingPayment: dummyBillingPayments[0]
  },
  {
    id: '2',
    appointmentId: '2',
    billingPaymentId: '2',
    patientId: '2',
    doctorId: 'doc2',
    dateIssued: '2024-01-15',
    totalAmount: 200.00,
    status: 'Paid',
    notes: 'Specialist consultation',
    billingPayment: dummyBillingPayments[1]
  },
  {
    id: '3',
    appointmentId: '3',
    patientId: '3',
    doctorId: 'doc1',
    dateIssued: '2024-01-15',
    totalAmount: 120.00,
    status: 'Pending',
    notes: 'Follow-up appointment'
  }
];

export const dummyPrescriptions: Prescription[] = [
  {
    id: '1',
    appointmentId: '1',
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    instructions: 'Take after meals',
    prescribedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    appointmentId: '1',
    medicationName: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed for pain',
    duration: '5 days',
    instructions: 'Take with food',
    prescribedDate: '2024-01-15',
    status: 'Active'
  }
];

export const dummyMedicalRecordAttachments: MedicalRecordAttachment[] = [
  {
    id: '1',
    medicalRecordId: '1',
    uploadedById: 'doc1',
    fileType: 'PDF',
    fileURL: '/documents/lab-report-001.pdf',
    title: 'Blood Test Results',
    description: 'Complete blood count and lipid panel',
    visibility: 'Private',
    isActive: true,
    uploadedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    medicalRecordId: '1',
    uploadedById: 'doc1',
    fileType: 'JPEG',
    fileURL: '/images/xray-chest-001.jpg',
    title: 'Chest X-Ray',
    description: 'Anterior-posterior view',
    visibility: 'Private',
    isActive: true,
    uploadedAt: '2024-01-15T09:15:00Z'
  }
];

export const dummyMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    facilityId: 'facility1',
    doctorId: 'doc1',
    appointmentId: '1',
    recordType: 'Consultation',
    dateCreated: '2024-01-15',
    status: 'Finalized',
    details: 'Patient presented with fever and cough. Diagnosed with upper respiratory infection.',
    notes: 'Patient advised to rest and hydrate. Follow up in 3 days if symptoms persist.',
    attachments: dummyMedicalRecordAttachments
  }
];

export const dummyAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: 'doc1',
    facilityId: 'facility1',
    scheduledDate: '2024-01-15',
    scheduledTime: '09:00:00',
    durationMinutes: 30,
    status: 'Completed',
    bookingDate: '2024-01-10',
    checkOutTime: '2024-01-15T09:25:00Z',
    notes: 'Routine checkup - patient complained of cough and fever',
    patient: dummyPatients[0],
    billing: dummyBillings[0],
    prescriptions: dummyPrescriptions,
    medicalRecord: dummyMedicalRecords[0]
  },
  {
    id: '2',
    patientId: '2',
    doctorId: 'doc2',
    facilityId: 'facility1',
    scheduledDate: '2024-01-15',
    scheduledTime: '10:00:00',
    durationMinutes: 45,
    status: 'Completed',
    bookingDate: '2024-01-08',
    checkOutTime: '2024-01-15T10:40:00Z',
    notes: 'Specialist consultation for chronic condition',
    patient: dummyPatients[1],
    billing: dummyBillings[1]
  },
  {
    id: '3',
    patientId: '3',
    doctorId: 'doc1',
    facilityId: 'facility1',
    scheduledDate: '2024-01-15',
    scheduledTime: '11:00:00',
    durationMinutes: 30,
    status: 'Confirmed',
    bookingDate: '2024-01-12',
    notes: 'Follow-up appointment for medication review',
    patient: dummyPatients[2],
    billing: dummyBillings[2]
  },
  {
    id: '4',
    patientId: '4',
    doctorId: 'doc3',
    facilityId: 'facility1',
    scheduledDate: '2024-01-15',
    scheduledTime: '14:00:00',
    durationMinutes: 60,
    status: 'Pending',
    bookingDate: '2024-01-14',
    notes: 'New patient consultation',
    patient: dummyPatients[3]
  },
  {
    id: '5',
    patientId: '1',
    doctorId: 'doc2',
    facilityId: 'facility1',
    scheduledDate: '2024-01-15',
    scheduledTime: '15:30:00',
    durationMinutes: 30,
    status: 'Cancelled',
    bookingDate: '2024-01-05',
    cancelledReason: 'Patient rescheduled',
    notes:"New patient consultation",
    patient: dummyPatients[4]
  },
];