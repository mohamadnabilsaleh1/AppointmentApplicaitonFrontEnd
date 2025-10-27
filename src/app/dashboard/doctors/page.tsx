// src/components/doctors-container.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { RefreshCw, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { DynamicPagination } from '@/components/Pagination';
import { useCreateDoctor, useDoctors, useToggleDoctorStatus, useUpdateDoctor } from '@/features/doctors/hooks/useDoctors';
import { CreateDoctorRequest, Doctor, DoctorsQueryParams } from '@/features/doctors/types/doctor';
import { CreateDoctorDialog } from '@/features/doctors/components/create-doctor-dialog';
import { DoctorSearch, DoctorSpecializationFilter } from '@/features/doctors/components/doctor-search';
import { DoctorSort } from '@/features/doctors/components/doctor-sort';
import { DoctorsSkeleton } from '@/features/doctors/components/doctors-skeleton';
import { DoctorCard } from '@/features/doctors/components/doctor-card';
import { EditDoctorDialog } from '@/features/doctors/components/edit-doctor-dialog';
import { useAuth } from '@/features/authentication/hooks/useAuth';





export default function Page() {
  const {token,isAuthenticated} = useAuth();
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<DoctorsQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        q: searchTerm || undefined,
        page: 1
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update query params when filters change
  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      specialization: specializationFilter || undefined,
      page: 1
    }));
  }, [specializationFilter]);

  // Update query params when sort changes
  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      sort: sortBy
    }));
  }, [sortBy]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDoctors(queryParams, token);

  const createMutation = useCreateDoctor(token);
  const updateMutation = useUpdateDoctor(token);
  const toggleStatusMutation = useToggleDoctorStatus(token);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSpecializationChange = useCallback((specialization: string) => {
    setSpecializationFilter(specialization);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSpecializationFilter('');
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
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

  const handleCreateDoctor = async (data: CreateDoctorRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Doctor added successfully',
      });
    } catch(error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to add doctor',
        variant: 'destructive',
      });
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDoctor = async (data: CreateDoctorRequest) => {
    if (!editingDoctor) return;

    try {
      await updateMutation.mutateAsync({
        id: editingDoctor.Id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Doctor updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingDoctor(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update doctor',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (doctor: Doctor) => {
    const isCurrentlyActive = doctor.IsActive !== false;

    try {
      await toggleStatusMutation.mutateAsync({
        id: doctor.Id,
        activate: !isCurrentlyActive,
      });
      toast({
        title: 'Success',
        description: `Doctor ${!isCurrentlyActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${!isCurrentlyActive ? 'activate' : 'deactivate'} doctor`,
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view doctors.
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
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load doctors</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An error occurred'}
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
              <h1 className="text-3xl font-bold">Doctors</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || 0} doctor
                {(response?.pagination?.totalCount || 0) !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefetching}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <CreateDoctorDialog
                onSave={handleCreateDoctor}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>

          {/* Search, Filter, and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <DoctorSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            
            <div className="flex gap-2">
              <DoctorSpecializationFilter
                specialization={specializationFilter}
                onSpecializationChange={handleSpecializationChange}
                onClear={handleClearFilters}
              />
              
              <DoctorSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || specializationFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: &quot;{searchTerm}&quot;
                </Badge>
              )}
              {specializationFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  Specialization: {specializationFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <DoctorsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((doctor: Doctor) => (
              <DoctorCard
                key={doctor.Id}
                doctor={doctor}
                onEdit={handleEditDoctor}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No doctors found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || specializationFilter 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding a new doctor to your facility.'
              }
            </p>
            {(searchTerm || specializationFilter) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  handleClearFilters();
                }}
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

        {editingDoctor && (
          <EditDoctorDialog
            doctor={editingDoctor}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateDoctor}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}