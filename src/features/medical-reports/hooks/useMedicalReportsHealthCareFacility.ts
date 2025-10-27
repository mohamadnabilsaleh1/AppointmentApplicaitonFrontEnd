import { useMemo } from 'react'
import { HEALTH_CARE_FACILITY_MEDICAL_DATA } from '../constants/data'
import { filterData, aggregateData, getSpecializationStats } from '../utils/dataTransformations'
import { useFilters } from './useFilters'

export const useHealthCareFacilityMedicalReports = () => {
  const { filters, updateFilter } = useFilters()

  const { filteredData, aggregatedData, specializationStats } = useMemo(() => {
    const filtered = filterData(HEALTH_CARE_FACILITY_MEDICAL_DATA, filters)
    const aggregated = aggregateData(filtered)
    const stats = getSpecializationStats(filtered)
    
    return {
      filteredData: filtered,
      aggregatedData: aggregated,
      specializationStats: stats
    }
  }, [filters])

  return {
    filters,
    updateFilter,
    filteredData,
    aggregatedData,
    specializationStats
  }
}