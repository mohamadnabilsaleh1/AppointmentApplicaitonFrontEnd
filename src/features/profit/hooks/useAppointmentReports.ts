import { useMemo } from 'react'
import { APPOINTMENT_DATA } from '../constants/appointment'
import { filterData, aggregateData, getDoctorStats, getSpecializationStats } from '../utils/appointmentTransformations'
import { useFilters } from './useFilters'

export const useAppointmentReports = () => {
  const { filters, updateFilter } = useFilters()

  const { filteredData, aggregatedData, doctorStats, specializationStats } = useMemo(() => {
    const filtered = filterData(APPOINTMENT_DATA, filters)
    const aggregated = aggregateData(filtered)
    const doctorStatsData = getDoctorStats(filtered)
    const specializationStatsData = getSpecializationStats(filtered)
    
    return {
      filteredData: filtered,
      aggregatedData: aggregated,
      doctorStats: doctorStatsData,
      specializationStats: specializationStatsData
    }
  }, [filters])

  return {
    filters,
    updateFilter,
    filteredData,
    aggregatedData,
    doctorStats,
    specializationStats
  }
}