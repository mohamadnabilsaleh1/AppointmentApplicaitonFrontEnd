import { useState } from 'react'
import { FilterState } from '../types/medical'

export const useFilters = (initialState: FilterState = {
  city: 'all',
  ageGroup: 'all',
  disease: 'all',
  specialization: 'all',
  dateRange: 'all',
  severity: 'all',
  gender: 'all'
}) => {
  const [filters, setFilters] = useState<FilterState>(initialState)

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialState)
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  }
}