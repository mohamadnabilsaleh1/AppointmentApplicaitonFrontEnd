"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters } from "@/features/healthcare-revenue/components/Filters";
import { OverviewTab } from "@/features/healthcare-revenue/components/OverviewTab";
import { DepartmentsTab } from "@/features/healthcare-revenue/components/DepartmentsTab";
import { ServicesTab } from "@/features/healthcare-revenue/components/ServicesTab";
import { TimeTab } from "@/features/healthcare-revenue/components/TimeTab";
import { DetailsTab } from "@/features/healthcare-revenue/components/DetailsTab";
import { InsuranceTab } from "@/features/healthcare-revenue/components/InsuranceTab";
import { useHealthcareRevenue } from "@/features/healthcare-revenue/hooks/useHealthcareRevenue";

export default function HealthcareRevenuePage() {
  const {
    filters,
    updateFilter,
    filteredData,
    aggregatedData,
    departmentStats,
  } = useHealthcareRevenue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100/50 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-l from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                إدارة الإيرادات - المستشفى التخصصي
              </h1>
              <p className="text-gray-600 text-lg">
                تحليل شامل للإيرادات والأداء المالي للمؤسسة الصحية
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="text-green-800 text-sm font-medium">الفترة المالية</div>
              <div className="text-green-900 font-bold text-xl">ربع سنوي 2024</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100/50 p-6">
          <Filters filters={filters} onFilterChange={updateFilter} />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100/50 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-gray-100">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-7 gap-1 p-4 bg-transparent">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  📊 نظرة عامة
                </TabsTrigger>
                <TabsTrigger 
                  value="departments"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  🏥 الأقسام
                </TabsTrigger>
                <TabsTrigger 
                  value="services"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  💼 الخدمات
                </TabsTrigger>
                <TabsTrigger 
                  value="insurance"
                  className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  🛡️ التأمين
                </TabsTrigger>
                <TabsTrigger 
                  value="time"
                  className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  ⏰ الوقت
                </TabsTrigger>
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700 data-[state=active]:border-gray-200 border border-transparent rounded-lg px-4 py-2 transition-all"
                >
                  📋 التفاصيل
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="m-0">
                <OverviewTab aggregatedData={aggregatedData} />
              </TabsContent>

              <TabsContent value="departments" className="m-0">
                <DepartmentsTab
                  departmentData={aggregatedData.departmentData}
                  departmentStats={departmentStats}
                />
              </TabsContent>

              <TabsContent value="services" className="m-0">
                <ServicesTab serviceData={aggregatedData.serviceData} />
              </TabsContent>

              <TabsContent value="insurance" className="m-0">
                <InsuranceTab insuranceData={aggregatedData.insuranceData} />
              </TabsContent>

              <TabsContent value="time" className="m-0">
                <TimeTab timeData={aggregatedData.timeData} />
              </TabsContent>

              <TabsContent value="details" className="m-0">
                <DetailsTab data={filteredData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}