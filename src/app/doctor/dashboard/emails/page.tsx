// src/app/dashboard/emails/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail } from 'lucide-react';
import { CreateEmailRequest, Email as EmailType } from '@/features/doctors/emails/types/email';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useCreateEmail, useDeleteEmail, useEmails, useUpdateEmail } from '@/features/doctors/emails/hooks/useEmails';
import { EmailsSkeleton } from '@/features/doctors/emails/components/emails-skeleton';
import { CreateEmailDialog } from '@/features/doctors/emails/components/create-email-dialog';
import { EmailCard } from '@/features/doctors/emails/components/email-card';
import { EditEmailDialog } from '@/features/doctors/emails/components/edit-email-dialog';


export default function EmailsPage() {
  const { toast } = useToast();
  const [editingEmail, setEditingEmail] = useState<EmailType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { token } = useAuth();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useEmails({}, token!);

  const createMutation = useCreateEmail(token!);
  const updateMutation = useUpdateEmail(token!);
  const deleteMutation = useDeleteEmail(token!);

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateEmail = async (data: CreateEmailRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Email address added successfully',
      });
    } catch(error: any) {
      console.log('Create email error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add email address',
        variant: 'destructive',
      });
    }
  };

  const handleEditEmail = (email: EmailType) => {
    setEditingEmail(email);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmail = async (data: CreateEmailRequest) => {
    if (!editingEmail) return;

    try {
      await updateMutation.mutateAsync({
        id: editingEmail.id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Email address updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingEmail(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update email address',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmail = async (email: EmailType) => {
    try {
      await deleteMutation.mutateAsync(email.id);
      toast({
        title: 'Success',
        description: 'Email address deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete email address',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view email addresses.
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
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load email addresses</h3>
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
              <h1 className="text-3xl font-bold">Email Addresses</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.data?.length || 0} email
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

              <CreateEmailDialog
                onSave={handleCreateEmail}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <EmailsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.data.map((email: EmailType) => (
              <EmailCard
                key={email.id}
                email={email}
                onEdit={handleEditEmail}
                onDelete={handleDeleteEmail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No email addresses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first email address.
            </p>
          </div>
        )}

        {editingEmail && (
          <EditEmailDialog
            email={editingEmail}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateEmail}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}