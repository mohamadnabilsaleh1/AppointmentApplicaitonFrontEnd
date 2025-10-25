"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CITIES, 
  AGE_GROUPS, 
  DISEASES, 
  DATE_RANGES, 
  SEVERITY_LEVELS, 
  SPECIALIZATIONS, 
  GENDERS 
} from "../constants/data";
import { FilterState } from "../types/medical";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>فلاتر البحث</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange("city", value)}
          >
            <SelectTrigger>
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
            value={filters.ageGroup}
            onValueChange={(value) => onFilterChange("ageGroup", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="الفئة العمرية" />
            </SelectTrigger>
            <SelectContent>
              {AGE_GROUPS.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.disease}
            onValueChange={(value) => onFilterChange("disease", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="المرض" />
            </SelectTrigger>
            <SelectContent>
              {DISEASES.map((disease) => (
                <SelectItem key={disease.value} value={disease.value}>
                  {disease.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.specialization}
            onValueChange={(value) => onFilterChange("specialization", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="التخصص الطبي" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem key={spec.value} value={spec.value}>
                  {spec.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.severity}
            onValueChange={(value) => onFilterChange("severity", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="شدة الحالة" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_LEVELS.map((severity) => (
                <SelectItem key={severity.value} value={severity.value}>
                  {severity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.gender}
            onValueChange={(value) => onFilterChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="الجنس" />
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
            <SelectTrigger>
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
  );
};