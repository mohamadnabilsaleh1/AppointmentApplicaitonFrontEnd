"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  DOCTORS, 
  SPECIALIZATIONS, 
  HOSPITALS, 
  CITIES, 
  STATUS_TYPES, 
  PAYMENT_STATUS,
  APPOINTMENT_TYPES,
  DATE_RANGES,
  GENDERS
} from "../constants/appointment"
import { FilterState } from "../types/appointment"
import { RefreshCw } from 'lucide-react'

interface FiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onResetFilters: () => void
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <span>فلاتر حجوزات العيادات</span>
          </CardTitle>
          <Button 
            onClick={onResetFilters}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة تعيين
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={filters.doctorName}
            onValueChange={(value) => onFilterChange("doctorName", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="الطبيب" />
            </SelectTrigger>
            <SelectContent>
              {DOCTORS.map((doctor) => (
                <SelectItem key={doctor.value} value={doctor.value}>
                  {doctor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.specialization}
            onValueChange={(value) => onFilterChange("specialization", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="التخصص" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((specialization) => (
                <SelectItem key={specialization.value} value={specialization.value}>
                  {specialization.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select
            value={filters.hospital}
            onValueChange={(value) => onFilterChange("hospital", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="المستشفى" />
            </SelectTrigger>
            <SelectContent>
              {HOSPITALS.map((hospital) => (
                <SelectItem key={hospital.value} value={hospital.value}>
                  {hospital.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange("city", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="المدينة" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="حالة الموعد" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_TYPES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus}
            onValueChange={(value) => onFilterChange("paymentStatus", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="حالة الدفع" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS.map((payment) => (
                <SelectItem key={payment.value} value={payment.value}>
                  {payment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.appointmentType}
            onValueChange={(value) => onFilterChange("appointmentType", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="نوع الموعد" />
            </SelectTrigger>
            <SelectContent>
              {APPOINTMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.patientGender}
            onValueChange={(value) => onFilterChange("patientGender", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="جنس المريض" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => onFilterChange("dateRange", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}