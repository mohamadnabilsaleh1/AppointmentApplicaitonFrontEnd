// src/app/dashboard/schedules/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from '@/components/Pagination';
import { CreateScheduleRequest, Schedule, SchedulesQueryParams } from '@/features/schedule/types/schedule';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useCreateSchedule, useDeleteSchedule, useSchedules, useUpdateSchedule } from '@/features/schedule/hooks/useSchedules';
import { CreateScheduleDialog } from '@/features/schedule/components/create-schedule-dialog';
import { getDayOfWeekLabel } from '@/features/department/constants/schedule-constants';
import { SchedulesSkeleton } from '@/features/schedule/components/schedules-skeleton';
import { ScheduleCard } from '@/features/schedule/components/schedule-card';
import { EditScheduleDialog } from '@/features/schedule/components/edit-schedule-dialog';


export default function SchedulesPage() {
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<SchedulesQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<number | undefined>();
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Get token from your auth context
  const { token } = useAuth(); // Replace with your token retrieval

  // Update query params when filters change
  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      dayOfWeek: dayOfWeekFilter,
      page: 1
    }));
  }, [dayOfWeekFilter]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useSchedules(queryParams, token!);

  const createMutation = useCreateSchedule(token!);
  const updateMutation = useUpdateSchedule(token!);
  const deleteMutation = useDeleteSchedule(token!);

  const handleDayOfWeekChange = useCallback((dayOfWeek: number | undefined) => {
    setDayOfWeekFilter(dayOfWeek);
  }, []);

  const handleClearFilters = useCallback(() => {
    setDayOfWeekFilter(undefined);
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

  const handleCreateSchedule = async (data: CreateScheduleRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });
    } catch(error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      });
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSchedule = async (data: CreateScheduleRequest) => {
    if (!editingSchedule) return;

    try {
      await updateMutation.mutateAsync({
        id: editingSchedule.id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingSchedule(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSchedule = async (schedule: Schedule) => {
    try {
      await deleteMutation.mutateAsync(schedule.id);
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete schedule',
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
              Please log in to view schedules.
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
            <h3 className="mt-2 text-sm font-medium">Failed to load schedules</h3>
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
              <h1 className="text-3xl font-bold">Schedules</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || 0} schedule
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

              <CreateScheduleDialog
                onSave={handleCreateSchedule}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>



          {/* Active Filters Display */}
          {dayOfWeekFilter !== undefined && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="px-3 py-1">
                Day: {getDayOfWeekLabel(dayOfWeekFilter)}
              </Badge>
            </div>
          )}
        </div>

        {isLoading ? (
          <SchedulesSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((schedule: Schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No schedules found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {dayOfWeekFilter !== undefined 
                ? 'Try adjusting your filters' 
                : 'Get started by creating a new schedule.'
              }
            </p>
            {dayOfWeekFilter !== undefined && (
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

        {editingSchedule && (
          <EditScheduleDialog
            schedule={editingSchedule}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateSchedule}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}