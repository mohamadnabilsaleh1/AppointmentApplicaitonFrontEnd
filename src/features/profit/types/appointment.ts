export interface AppointmentRecord {
  id: string
  doctorName: string
  specialization: string
  hospital: string
  city: string
  appointmentDate: string
  appointmentTime: string
  patientAge: string
  patientGender: string
  status: 'مكتمل' | 'ملغي' | 'مؤجل' | 'قيد الانتظار'
  fee: number
  duration: number // in minutes
  paymentStatus: 'مدفوع' | 'غير مدفوع' | 'جزئي'
  appointmentType: 'كشف جديد' | 'متابعة' | 'طوارئ' | 'استشارة'
  patientName?: string
  phoneNumber?: string
  notes?: string
}

export interface FilterState {
  doctorName: string
  specialization: string
  hospital: string
  city: string
  status: string
  paymentStatus: string
  appointmentType: string
  dateRange: string
  patientGender: string
}

export interface ChartData {
  name: string
  value: number
  percentage?: number
  revenue?: number
}

export interface AggregatedData {
  specializationData: ChartData[]
  hospitalData: ChartData[]
  cityData: ChartData[]
  statusData: ChartData[]
  paymentData: ChartData[]
  appointmentTypeData: ChartData[]
  doctorData: ChartData[]
  genderData: ChartData[]
  totalAppointments: number
  totalRevenue: number
  completedAppointments: number
  cancelledAppointments: number
  pendingAppointments: number
  averageFee: number
  uniqueDoctors: number
  uniqueHospitals: number
  uniqueSpecializations: number
}

export interface DoctorStats {
  doctorName: string
  specialization: string
  hospital: string
  totalAppointments: number
  completedAppointments: number
  totalRevenue: number
  averageFee: number
  cancellationRate: number
  completionRate: number
  averageDuration: number
}

export interface SpecializationStats {
  specialization: string
  totalAppointments: number
  totalRevenue: number
  averageFee: number
  uniqueDoctors: number
  completionRate: number
}