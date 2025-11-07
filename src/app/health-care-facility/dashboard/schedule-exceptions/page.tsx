// src/app/dashboard/schedule-exceptions/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from '@/components/Pagination';

import { useAuth } from '@/features/authentication/hooks/useAuth';
import { CreateScheduleExceptionRequest, ScheduleException, ScheduleExceptionsQueryParams } from '@/features/health-care-facility/schedule-exception/types/schedule-exception';
import { ScheduleExceptionsSkeleton } from '@/features/health-care-facility/schedule-exception/components/schedule-exceptions-skeleton';
import { ScheduleExceptionCard } from '@/features/health-care-facility/schedule-exception/components/schedule-exception-card';
import { EditScheduleExceptionDialog } from '@/features/health-care-facility/schedule-exception/components/edit-schedule-exception-dialog';
import { useCreateScheduleException, useDeleteScheduleException, useScheduleExceptions, useUpdateScheduleException } from '@/features/health-care-facility/schedule-exception/hooks/useScheduleExceptions';
import { CreateScheduleExceptionDialog } from '@/features/health-care-facility/schedule-exception/components/create-schedule-exception-dialog';

export default function ScheduleExceptionsPage() {
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<ScheduleExceptionsQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');
  const [editingException, setEditingException] = useState<ScheduleException | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { token } = useAuth();

  // Update query params when filters change
  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      dateFrom: dateFromFilter || undefined,
      dateTo: dateToFilter || undefined,
      page: 1
    }));
  }, [dateFromFilter, dateToFilter]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useScheduleExceptions(queryParams, token!);

  const createMutation = useCreateScheduleException(token!);
  const updateMutation = useUpdateScheduleException(token!);
  const deleteMutation = useDeleteScheduleException(token!);

  const handleDateFromChange = useCallback((dateFrom: string) => {
    setDateFromFilter(dateFrom);
  }, []);

  const handleDateToChange = useCallback((dateTo: string) => {
    setDateToFilter(dateTo);
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateFromFilter('');
    setDateToFilter('');
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

  const handleCreateScheduleException = async (data: CreateScheduleExceptionRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Schedule exception created successfully',
      });
    } catch(error: any) {
      console.log('Error creating schedule exception:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create schedule exception',
        variant: 'destructive',
      });
    }
  };

  const handleEditScheduleException = (exception: ScheduleException) => {
    setEditingException(exception);
    setIsEditDialogOpen(true);
  };

  const handleUpdateScheduleException = async (data: CreateScheduleExceptionRequest) => {
    if (!editingException) return;

    try {
      await updateMutation.mutateAsync({
        id: editingException.id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Schedule exception updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingException(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update schedule exception',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteScheduleException = async (exception: ScheduleException) => {
    try {
      await deleteMutation.mutateAsync(exception.id);
      toast({
        title: 'Success',
        description: 'Schedule exception deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete schedule exception',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view schedule exceptions.
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
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load schedule exceptions</h3>
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
              <h1 className="text-3xl font-bold">Schedule Exceptions</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || 0} exception
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

              <CreateScheduleExceptionDialog
                onSave={handleCreateScheduleException}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>

          {/* Filter Control */}
          {/* <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <ScheduleExceptionFilter
              dateFrom={dateFromFilter}
              dateTo={dateToFilter}
              onDateFromChange={handleDateFromChange}
              onDateToChange={handleDateToChange}
              onClear={handleClearFilters}
            />
          </div> */}

          {/* Active Filters Display */}
          {(dateFromFilter || dateToFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {dateFromFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  From: {dateFromFilter}
                </Badge>
              )}
              {dateToFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  To: {dateToFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <ScheduleExceptionsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((exception: ScheduleException) => (
              <ScheduleExceptionCard
                key={exception.id}
                exception={exception}
                onEdit={handleEditScheduleException}
                onDelete={handleDeleteScheduleException}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No schedule exceptions found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {(dateFromFilter || dateToFilter) 
                ? 'Try adjusting your filters' 
                : 'Get started by creating a new schedule exception.'
              }
            </p>
            {(dateFromFilter || dateToFilter) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear filters
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

        {editingException && (
          <EditScheduleExceptionDialog
            exception={editingException}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateScheduleException}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}