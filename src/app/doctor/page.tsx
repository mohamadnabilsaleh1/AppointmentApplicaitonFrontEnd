"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters } from "@/features/medical-reports/components/Filters";
import { OverviewTab } from "@/features/medical-reports/components/OverviewTab";
import { CitiesTab } from "@/features/medical-reports/components/CitiesTab";
import { DiseasesTab } from "@/features/medical-reports/components/DiseasesTab";
import { AgeTab } from "@/features/medical-reports/components/AgeTab";
import { DetailsTab } from "@/features/medical-reports/components/DetailsTab";
import { SpecializationsTab } from "@/features/medical-reports/components/SpecializationsTab";
import { useHealthCareFacilityMedicalReports } from "@/features/medical-reports/hooks/useMedicalReportsHealthCareFacility";

export default function MedicalReportsPage() {
  const {
    filters,
    updateFilter,
    filteredData,
    aggregatedData,
    specializationStats,
  } = useHealthCareFacilityMedicalReports();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          التقارير الطبية - سوريا
        </h1>
      </div>

      <Filters filters={filters} onFilterChange={updateFilter} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="specializations">حسب التخصص</TabsTrigger>
          <TabsTrigger value="cities">حسب المدينة</TabsTrigger>
          <TabsTrigger value="diseases">حسب المرض</TabsTrigger>
          <TabsTrigger value="age">حسب العمر</TabsTrigger>
          <TabsTrigger value="details">تفاصيل كاملة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab aggregatedData={aggregatedData} />
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

        <TabsContent value="diseases">
          <DiseasesTab diseaseData={aggregatedData.diseaseData} />
        </TabsContent>

        <TabsContent value="age">
          <AgeTab ageGroupData={aggregatedData.ageGroupData} />
        </TabsContent>

        <TabsContent value="details">
          <DetailsTab data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
