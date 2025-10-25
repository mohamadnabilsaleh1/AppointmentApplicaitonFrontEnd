import { MedicalReport, ChartData, AggregatedData } from '../types/medical'

export const filterData = (data: MedicalReport[], filters: {
  city: string;
  ageGroup: string;
  disease: string;
  specialization: string;
  dateRange: string;
  severity: string;
  gender: string;
}): MedicalReport[] => {
  return data.filter(item => {
    return (
      (filters.city === 'all' || item.city === filters.city) &&
      (filters.ageGroup === 'all' || item.ageGroup === filters.ageGroup) &&
      (filters.disease === 'all' || item.disease === filters.disease) &&
      (filters.specialization === 'all' || item.specialization === filters.specialization) &&
      (filters.dateRange === 'all' || item.date === filters.dateRange) &&
      (filters.severity === 'all' || item.severity === filters.severity) &&
      (filters.gender === 'all' || item.gender === filters.gender)
    )
  })
}

export const aggregateData = (data: MedicalReport[]): AggregatedData => {
  const cityData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.city] = (acc[item.city] || 0) + item.count
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const diseaseData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.disease] = (acc[item.disease] || 0) + item.count
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const specializationData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.specialization] = (acc[item.specialization] || 0) + item.count
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const ageGroupData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.ageGroup] = (acc[item.ageGroup] || 0) + item.count
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const severityData = Object.entries(
    data.reduce((acc, item) => {
      if (item.severity) {
        acc[item.severity] = (acc[item.severity] || 0) + item.count
      }
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const genderData = Object.entries(
    data.reduce((acc, item) => {
      if (item.gender) {
        acc[item.gender] = (acc[item.gender] || 0) + item.count
      }
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const totalCases = data.reduce((sum, item) => sum + item.count, 0)
  
  // Calculate percentages for all data
  const dataWithPercentages = (dataArray: ChartData[]) => 
    dataArray.map(item => ({
      ...item,
      percentage: totalCases > 0 ? (item.value / totalCases) * 100 : 0
    }))

  return {
    cityData: dataWithPercentages(cityData),
    diseaseData: dataWithPercentages(diseaseData),
    specializationData: dataWithPercentages(specializationData),
    ageGroupData: dataWithPercentages(ageGroupData),
    severityData: dataWithPercentages(severityData),
    genderData: dataWithPercentages(genderData),
    totalCases,
    uniqueCities: new Set(data.map(item => item.city)).size,
    uniqueDiseases: new Set(data.map(item => item.disease)).size,
    uniqueSpecializations: new Set(data.map(item => item.specialization)).size,
  }
}

// Additional utility functions for enhanced data analysis
export const getTopItems = (data: ChartData[], limit: number = 5): ChartData[] => {
  return [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

export const getDistributionByMonth = (data: MedicalReport[]): ChartData[] => {
  const monthlyData = data.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + item.count
    return acc
  }, {} as Record<string, number>)

  return Object.entries(monthlyData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const getAgeGroupDistribution = (data: MedicalReport[]): ChartData[] => {
  const ageGroups = ['0-17', '18-25', '26-35', '36-45', '46-55', '56+']
  const distribution = ageGroups.map(ageGroup => {
    const count = data
      .filter(item => item.ageGroup === ageGroup)
      .reduce((sum, item) => sum + item.count, 0)
    return { name: ageGroup, value: count }
  })
  return distribution.filter(item => item.value > 0)
}

export const getSpecializationStats = (data: MedicalReport[]) => {
  const stats = data.reduce((acc, item) => {
    if (!acc[item.specialization]) {
      acc[item.specialization] = {
        totalCases: 0,
        cities: new Set(),
        diseases: new Set(),
        ageGroups: new Set()
      }
    }
    acc[item.specialization].totalCases += item.count
    acc[item.specialization].cities.add(item.city)
    acc[item.specialization].diseases.add(item.disease)
    acc[item.specialization].ageGroups.add(item.ageGroup)
    return acc
  }, {} as Record<string, { totalCases: number; cities: Set<string>; diseases: Set<string>; ageGroups: Set<string> }>)

  return Object.entries(stats).map(([specialization, stats]) => ({
    specialization,
    totalCases: stats.totalCases,
    uniqueCities: stats.cities.size,
    uniqueDiseases: stats.diseases.size,
    uniqueAgeGroups: stats.ageGroups.size
  }))
}