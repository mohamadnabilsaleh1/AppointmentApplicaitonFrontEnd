// src/app/dashboard/doctor-departments/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, Building, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from "@/components/Pagination";
import { useRemoveDoctorFromDepartment } from "@/features/doctor-departments/hooks/useDoctorDepartments";
import {
  DoctorDepartment,
  DoctorDepartmentQueryParams,
} from "@/features/doctor-departments/types/doctor-department";
import { AssignDoctorDialog } from "@/features/doctor-departments/components/assign-doctor-dialog";
import { DoctorDepartmentCard } from "@/features/doctor-departments/components/doctor-department-card";
import { DoctorDepartmentsSkeleton } from "@/features/doctor-departments/components/doctor-departments-skeleton";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import { DepartmentCard } from "@/features/department/components/department-card";
import { Department } from "@/features/department/types/department";

export default function DoctorDepartmentsPage() {
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<DoctorDepartmentQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  // Get token from your auth context
  const { token } = useAuth(); // Replace with your token retrieval

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({
        ...prev,
        q: searchTerm || undefined,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDepartments(queryParams, token!);

  const removeMutation = useRemoveDoctorFromDepartment(token!);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleDepartmentFilterChange = useCallback((departmentId: string) => {
    setDepartmentFilter(departmentId);
    setQueryParams((prev) => ({
      ...prev,
      departmentId: departmentId || undefined,
      page: 1,
    }));
  }, []);

  const handleDoctorFilterChange = useCallback((doctorId: string) => {
    setDoctorFilter(doctorId);
    setQueryParams((prev) => ({
      ...prev,
      doctorId: doctorId || undefined,
      page: 1,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDepartmentFilter("");
    setDoctorFilter("");
    setQueryParams({
      page: 1,
      pageSize: 9,
    });
  }, []);

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleRemoveAssignment = async (doctorDepartment: DoctorDepartment) => {
    try {
      await removeMutation.mutateAsync({
        departmentId: doctorDepartment.departmentId,
        doctorId: doctorDepartment.doctorId,
      });
      toast({
        title: "Success",
        description: "Doctor removed from department successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove doctor from department",
        variant: "destructive",
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">
              Authentication required
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view doctor-department assignments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">
              Failed to load assignments
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <div className="mt-6">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Doctor-Department Assignments
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || response?.data.length} assignment
                {(response?.pagination?.totalCount || response?.data.length) !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefetching}
                variant="outline"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>

              <AssignDoctorDialog token={token} />
            </div>
          </div>

          {/* Search and Filter Controls */}

          {/* Active Filters Display */}
          {(searchTerm || departmentFilter || doctorFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: &quot;{searchTerm}&quot;
                </Badge>
              )}
              {departmentFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  Department Filter
                </Badge>
              )}
              {doctorFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  Doctor Filter
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <DoctorDepartmentsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((department: Department) => (
              <DoctorDepartmentCard
                key={department.id}
                department={department}
                token={token}
                // onRemove={handleRemoveAssignment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No assignments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || departmentFilter || doctorFilter
                ? "Try adjusting your search or filters"
                : "Get started by assigning a doctor to a department."}
            </p>
            {(searchTerm || departmentFilter || doctorFilter) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {response?.pagination && response.pagination.totalPages > 1 && (
          <DynamicPagination
            pagination={response.pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}
