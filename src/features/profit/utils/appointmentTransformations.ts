import { AppointmentRecord, ChartData, AggregatedData, DoctorStats, SpecializationStats } from '../types/appointment'

export const filterData = (data: AppointmentRecord[], filters: any): AppointmentRecord[] => {
  return data.filter(item => {
    return (
      (filters.doctorName === 'all' || item.doctorName === filters.doctorName) &&
      (filters.specialization === 'all' || item.specialization === filters.specialization) &&
      (filters.hospital === 'all' || item.hospital === filters.hospital) &&
      (filters.city === 'all' || item.city === filters.city) &&
      (filters.status === 'all' || item.status === filters.status) &&
      (filters.paymentStatus === 'all' || item.paymentStatus === filters.paymentStatus) &&
      (filters.appointmentType === 'all' || item.appointmentType === filters.appointmentType) &&
      (filters.patientGender === 'all' || item.patientGender === filters.patientGender) &&
      (filters.dateRange === 'all' || item.appointmentDate.startsWith(filters.dateRange))
    )
  })
}

export const aggregateData = (data: AppointmentRecord[]): AggregatedData => {
  const specializationData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.specialization] = (acc[item.specialization] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const hospitalData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.hospital] = (acc[item.hospital] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const cityData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.city] = (acc[item.city] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const statusData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const paymentData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.paymentStatus] = (acc[item.paymentStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const appointmentTypeData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.appointmentType] = (acc[item.appointmentType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const doctorData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.doctorName] = (acc[item.doctorName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const genderData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.patientGender] = (acc[item.patientGender] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const totalAppointments = data.length
  const totalRevenue = data
    .filter(item => item.paymentStatus === 'مدفوع')
    .reduce((sum, item) => sum + item.fee, 0)
  const completedAppointments = data.filter(item => item.status === 'مكتمل').length
  const cancelledAppointments = data.filter(item => item.status === 'ملغي').length
  const pendingAppointments = data.filter(item => item.status === 'قيد الانتظار').length
  const averageFee = totalAppointments > 0 ? data.reduce((sum, item) => sum + item.fee, 0) / totalAppointments : 0

  return {
    specializationData,
    hospitalData,
    cityData,
    statusData,
    paymentData,
    appointmentTypeData,
    doctorData,
    genderData,
    totalAppointments,
    totalRevenue,
    completedAppointments,
    cancelledAppointments,
    pendingAppointments,
    averageFee,
    uniqueDoctors: new Set(data.map(item => item.doctorName)).size,
    uniqueHospitals: new Set(data.map(item => item.hospital)).size,
    uniqueSpecializations: new Set(data.map(item => item.specialization)).size,
  }
}

export const getDoctorStats = (data: AppointmentRecord[]): DoctorStats[] => {
  const stats = data.reduce((acc, item) => {
    if (!acc[item.doctorName]) {
      acc[item.doctorName] = {
        specialization: item.specialization,
        hospital: item.hospital,
        totalAppointments: 0,
        completedAppointments: 0,
        totalRevenue: 0,
        cancelledAppointments: 0,
        totalDuration: 0
      }
    }
    acc[item.doctorName].totalAppointments += 1
    if (item.status === 'مكتمل') {
      acc[item.doctorName].completedAppointments += 1
    }
    if (item.status === 'ملغي') {
      acc[item.doctorName].cancelledAppointments += 1
    }
    if (item.paymentStatus === 'مدفوع') {
      acc[item.doctorName].totalRevenue += item.fee
    }
    acc[item.doctorName].totalDuration += item.duration
    return acc
  }, {} as Record<string, { 
    specialization: string; 
    hospital: string;
    totalAppointments: number; 
    completedAppointments: number; 
    totalRevenue: number; 
    cancelledAppointments: number;
    totalDuration: number;
  }>)

  return Object.entries(stats).map(([doctorName, stats]) => ({
    doctorName,
    specialization: stats.specialization,
    hospital: stats.hospital,
    totalAppointments: stats.totalAppointments,
    completedAppointments: stats.completedAppointments,
    totalRevenue: stats.totalRevenue,
    averageFee: stats.totalAppointments > 0 ? stats.totalRevenue / stats.totalAppointments : 0,
    cancellationRate: stats.totalAppointments > 0 ? (stats.cancelledAppointments / stats.totalAppointments) * 100 : 0,
    completionRate: stats.totalAppointments > 0 ? (stats.completedAppointments / stats.totalAppointments) * 100 : 0,
    averageDuration: stats.totalAppointments > 0 ? stats.totalDuration / stats.totalAppointments : 0
  }))
}

export const getSpecializationStats = (data: AppointmentRecord[]): SpecializationStats[] => {
  const stats = data.reduce((acc, item) => {
    if (!acc[item.specialization]) {
      acc[item.specialization] = {
        totalAppointments: 0,
        completedAppointments: 0,
        totalRevenue: 0,
        doctors: new Set()
      }
    }
    acc[item.specialization].totalAppointments += 1
    if (item.status === 'مكتمل') {
      acc[item.specialization].completedAppointments += 1
    }
    if (item.paymentStatus === 'مدفوع') {
      acc[item.specialization].totalRevenue += item.fee
    }
    acc[item.specialization].doctors.add(item.doctorName)
    return acc
  }, {} as Record<string, { 
    totalAppointments: number; 
    completedAppointments: number; 
    totalRevenue: number;
    doctors: Set<string>;
  }>)

  return Object.entries(stats).map(([specialization, stats]) => ({
    specialization,
    totalAppointments: stats.totalAppointments,
    totalRevenue: stats.totalRevenue,
    averageFee: stats.totalAppointments > 0 ? stats.totalRevenue / stats.totalAppointments : 0,
    uniqueDoctors: stats.doctors.size,
    completionRate: stats.totalAppointments > 0 ? (stats.completedAppointments / stats.totalAppointments) * 100 : 0
  }))
}