import { useState } from 'react'
import { FilterState } from '../types/appointment'

export const useFilters = (initialState: FilterState = {
  doctorName: 'all',
  specialization: 'all',
  hospital: 'all',
  city: 'all',
  status: 'all',
  paymentStatus: 'all',
  appointmentType: 'all',
  dateRange: 'all',
  patientGender: 'all'
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