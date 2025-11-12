"use client"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filters } from "@/features/profit/components/Filters"
import { OverviewTab } from "@/features/profit/components/OverviewTab"
import { DoctorsTab } from "@/features/profit/components/DoctorsTab"
import { SpecializationsTab } from "@/features/profit/components/SpecializationsTab"
import { CitiesTab } from "@/features/profit/components/CitiesTab"
import { StatusTab } from "@/features/profit/components/StatusTab"
import { DetailsTab } from "@/features/profit/components/DetailsTab"

import { useAppointmentReports } from "@/features/profit/hooks/useAppointmentReports"

export default function AppointmentDashboardPage() {
  const {
    filters,
    updateFilter,
    filteredData,
    aggregatedData,
    doctorStats,
    specializationStats,
  } = useAppointmentReports()

  const handleResetFilters = () => {
    const resetFilters = {
      doctorName: 'all',
      specialization: 'all',
      hospital: 'all',
      city: 'all',
      status: 'all',
      paymentStatus: 'all',
      appointmentType: 'all',
      dateRange: 'all',
      patientGender: 'all'
    }
    Object.keys(resetFilters).forEach(key => {
      updateFilter(key as keyof typeof resetFilters, resetFilters[key as keyof typeof resetFilters])
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              لوحة تحليل حجوزات العيادات
            </h1>
            <p className="text-gray-600 mt-2">تحليل شامل لأداء العيادات والأطباء والإيرادات</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-500">آخر تحديث</div>
            <div className="font-semibold">{new Date().toLocaleDateString('ar-SY')}</div>
          </div>
        </div>

        <Filters 
          filters={filters} 
          onFilterChange={updateFilter}
          onResetFilters={handleResetFilters}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-white p-1 rounded-lg shadow-sm border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="doctors" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              الأطباء
            </TabsTrigger>
            <TabsTrigger value="specializations" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              التخصصات
            </TabsTrigger>
            {/* <TabsTrigger value="hospitals" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              المستشفيات
            </TabsTrigger> */}
            <TabsTrigger value="cities" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              المدن
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              الحالات
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
              التفاصيل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab aggregatedData={aggregatedData} />
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorsTab
              doctorData={aggregatedData.doctorData}
              doctorStats={doctorStats}
            />
          </TabsContent>

          <TabsContent value="specializations">
            <SpecializationsTab
              specializationData={aggregatedData.specializationData}
              specializationStats={specializationStats}
            />
          </TabsContent>


          <TabsContent value="cities">
            <CitiesTab cityData={aggregatedData.cityData} />
          </TabsContent>

          <TabsContent value="status">
            <StatusTab 
              statusData={aggregatedData.statusData}
              paymentData={aggregatedData.paymentData}
              appointmentTypeData={aggregatedData.appointmentTypeData}
            />
          </TabsContent>

          <TabsContent value="details">
            <DetailsTab data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}