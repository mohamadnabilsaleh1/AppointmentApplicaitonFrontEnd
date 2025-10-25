// src/components/healthcare-facilities-container.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HealthcareFacilityCard } from './healthcare-facility-card';
import { HealthcareFacilitiesSkeleton } from './healthcare-facilities-skeleton';
import { CreateFacilityDialog } from './create-facility-dialog';
import { EditFacilityDialog } from './edit-facility-dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, Building2 } from 'lucide-react';
import { HealthcareSearch } from './healthcare-search';
import { HealthcareCityFilter } from './healthcare-city-filter';
import { HealthcareSort } from './healthcare-sort';
import {Badge} from "@/components/ui/badge"
import { HealthcarePagination } from './healthcare-pagination';
import { useCreateHealthcareFacility, useHealthcareFacilities, useToggleFacilityStatus, useUpdateHealthcareFacility } from '../hooks/useHealthcareFacilities';
import { CreateHealthcareFacilityRequest, HealthcareFacilitiesQueryParams, HealthcareFacility } from '../types/healthcare-facility';
import { DynamicPagination } from '@/components/Pagination';

interface HealthcareFacilitiesContainerProps {
  token: string;
}

export function HealthcareFacilitiesContainer({
  token,
}: HealthcareFacilitiesContainerProps) {
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<HealthcareFacilitiesQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [editingFacility, setEditingFacility] = useState<HealthcareFacility | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        q: searchTerm || undefined,
        page: 1 // Reset to first page when searching
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update query params when filters change
  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      city: cityFilter || undefined,
      page: 1 // Reset to first page when filtering
    }));
  }, [cityFilter]);

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
  } = useHealthcareFacilities(queryParams, token);

  const createMutation = useCreateHealthcareFacility(token);
  const updateMutation = useUpdateHealthcareFacility(token);
  const toggleStatusMutation = useToggleFacilityStatus(token);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setCityFilter(city);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCityFilter('');
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

  const handleCreateFacility = async (data: CreateHealthcareFacilityRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Healthcare facility created successfully',
      });
    } catch(error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to create healthcare facility',
        variant: 'destructive',
      });
    }
  };

  const handleEditFacility = (facility: HealthcareFacility) => {
    setEditingFacility(facility);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFacility = async (data: CreateHealthcareFacilityRequest) => {
    if (!editingFacility) return;

    try {
      await updateMutation.mutateAsync({
        id: editingFacility.Id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Healthcare facility updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingFacility(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update healthcare facility',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (facility: HealthcareFacility) => {
    const isCurrentlyActive = facility.isActive !== false;

    try {
      await toggleStatusMutation.mutateAsync({
        id: facility.Id,
        activate: !isCurrentlyActive,
      });
      toast({
        title: 'Success',
        description: `Healthcare facility ${!isCurrentlyActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${!isCurrentlyActive ? 'activate' : 'deactivate'} healthcare facility`,
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view healthcare facilities.
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
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load facilities</h3>
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
              <h1 className="text-3xl font-bold">Healthcare Facilities</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || 0} facility
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

              <CreateFacilityDialog
                onSave={handleCreateFacility}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>

          {/* Search, Filter, and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <HealthcareSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
            
            <div className="flex gap-2">
              <HealthcareCityFilter
                city={cityFilter}
                onCityChange={handleCityChange}
                onClear={handleClearFilters}
              />
              
              <HealthcareSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || cityFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: &quot;{searchTerm}&quot;
                </Badge>
              )}
              {cityFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  City: {cityFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <HealthcareFacilitiesSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((facility: any) => (
              <HealthcareFacilityCard
                key={facility.Id}
                facility={facility}
                onEdit={handleEditFacility}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No facilities found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || cityFilter 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating a new healthcare facility.'
              }
            </p>
            {(searchTerm || cityFilter) && (
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

        {editingFacility && (
          <EditFacilityDialog
            facility={editingFacility}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateFacility}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}