// src/app/dashboard/treatment-capacity/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { CreateTreatmentCapacityRequest, TreatmentCapacity } from '@/features/doctors/treatment-capacity/types/treatment-capacity';
import { useCreateTreatmentCapacity, useDeleteTreatmentCapacity, useTreatmentCapacity, useUpdateTreatmentCapacity } from '@/features/doctors/treatment-capacity/hooks/useTreatmentCapacity';
import { CreateTreatmentCapacityDialog } from '@/features/doctors/treatment-capacity/components/create-treatment-capacity-dialog';
import { TreatmentCapacityCard } from '@/features/doctors/treatment-capacity/components/treatment-capacity-card';
import { EditTreatmentCapacityDialog } from '@/features/doctors/treatment-capacity/components/edit-treatment-capacity-dialog';

export default function TreatmentCapacityPage() {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTreatmentCapacity, setEditingTreatmentCapacity] = useState<TreatmentCapacity | null>(null);
  
  const { token } = useAuth();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTreatmentCapacity(token!);

  const createMutation = useCreateTreatmentCapacity(token!);
  const updateMutation = useUpdateTreatmentCapacity(token!);
  const deleteMutation = useDeleteTreatmentCapacity(token!);

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateTreatmentCapacity = async (data: CreateTreatmentCapacityRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Treatment capacity set successfully',
      });
    } catch(error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to set treatment capacity',
        variant: 'destructive',
      });
    }
  };

  const handleEditTreatmentCapacity = (treatmentCapacity: TreatmentCapacity) => {
    setEditingTreatmentCapacity(treatmentCapacity);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTreatmentCapacity = async (data: CreateTreatmentCapacityRequest) => {
    if (!editingTreatmentCapacity) return;

    try {
      await updateMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Treatment capacity updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingTreatmentCapacity(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update treatment capacity',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTreatmentCapacity = async (treatmentCapacity: TreatmentCapacity) => {
    try {
      await deleteMutation.mutateAsync();
      toast({
        title: 'Success',
        description: 'Treatment capacity deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete treatment capacity',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view treatment capacity.
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
            <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load treatment capacity</h3>
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

  const treatmentCapacity = response?.data;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Treatment Capacity</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your daily patient capacity and session settings
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

              {!treatmentCapacity && (
                <CreateTreatmentCapacityDialog
                  onSave={handleCreateTreatmentCapacity}
                  isLoading={createMutation.isPending}
                />
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        ) : treatmentCapacity ? (
          <div className="max-w-2xl">
            <TreatmentCapacityCard
              treatmentCapacity={treatmentCapacity}
              onEdit={handleEditTreatmentCapacity}
              onDelete={handleDeleteTreatmentCapacity}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No treatment capacity set</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure your daily patient capacity to get started.
            </p>
            <div className="mt-6">
              <CreateTreatmentCapacityDialog
                onSave={handleCreateTreatmentCapacity}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>
        )}

        {editingTreatmentCapacity && (
          <EditTreatmentCapacityDialog
            treatmentCapacity={editingTreatmentCapacity}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateTreatmentCapacity}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}