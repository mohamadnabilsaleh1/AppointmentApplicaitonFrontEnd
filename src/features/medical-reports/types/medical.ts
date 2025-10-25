export interface MedicalReport {
  id: string
  city: string
  ageGroup: string
  disease: string
  specialization: string
  count: number
  date: string
  severity?: 'منخفض' | 'متوسط' | 'عالي'
  gender?: 'ذكر' | 'أنثى'
  treatmentType?: 'دوائي' | 'جراحة' | 'علاج طبيعي' | 'مراقبة'
}

export interface FilterState {
  city: string
  ageGroup: string
  disease: string
  specialization: string
  dateRange: string
  severity: string
  gender: string
}

export interface ChartData {
  name: string
  value: number
  percentage?: number
}

export interface AggregatedData {
  cityData: ChartData[]
  diseaseData: ChartData[]
  specializationData: ChartData[]
  ageGroupData: ChartData[]
  severityData: ChartData[]
  genderData: ChartData[]
  totalCases: number
  uniqueCities: number
  uniqueDiseases: number
  uniqueSpecializations: number
}

export interface SpecializationStats {
  specialization: string
  totalCases: number
  uniqueCities: number
  uniqueDiseases: number
  uniqueAgeGroups: number
}