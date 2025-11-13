// src/app/dashboard/phones/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Phone } from 'lucide-react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useCreatePhone, useDeletePhone, usePhones, useUpdatePhone } from '@/features/doctors/phones/hooks/usePhones';
import { CreatePhoneRequest, Phone as PhoneType } from '@/features/doctors/phones/types/phone';
import { CreatePhoneDialog } from '@/features/doctors/phones/components/create-phone-dialog';
import { PhonesSkeleton } from '@/features/doctors/phones/components/phones-skeleton';
import { PhoneCard } from '@/features/doctors/phones/components/phone-card';
import { EditPhoneDialog } from '@/features/doctors/phones/components/edit-phone-dialog';


export default function PhonesPage() {
  const { toast } = useToast();
  const [editingPhone, setEditingPhone] = useState<PhoneType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { token } = useAuth();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = usePhones({}, token!);

  const createMutation = useCreatePhone(token!);
  const updateMutation = useUpdatePhone(token!);
  const deleteMutation = useDeletePhone(token!);

  const handleRefresh = () => {
    refetch();
  };

  const handleCreatePhone = async (data: CreatePhoneRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Phone number added successfully',
      });
    } catch(error: any) {
      console.log('Create phone error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add phone number',
        variant: 'destructive',
      });
    }
  };

  const handleEditPhone = (phone: PhoneType) => {
    setEditingPhone(phone);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePhone = async (data: CreatePhoneRequest) => {
    if (!editingPhone) return;

    try {
      await updateMutation.mutateAsync({
        id: editingPhone.id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Phone number updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingPhone(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update phone number',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePhone = async (phone: PhoneType) => {
    try {
      await deleteMutation.mutateAsync(phone.id);
      toast({
        title: 'Success',
        description: 'Phone number deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete phone number',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view phone numbers.
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
            <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load phone numbers</h3>
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
              <h1 className="text-3xl font-bold">Phone Numbers</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.data?.length || 0} phone
                {(response?.data?.length || 0) !== 1 ? 's' : ''} found
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

              <CreatePhoneDialog
                onSave={handleCreatePhone}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <PhonesSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.data.map((phone: PhoneType) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                onEdit={handleEditPhone}
                onDelete={handleDeletePhone}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No phone numbers found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first phone number.
            </p>
          </div>
        )}

        {editingPhone && (
          <EditPhoneDialog
            phone={editingPhone}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdatePhone}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}