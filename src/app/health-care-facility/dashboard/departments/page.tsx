// src/app/dashboard/departments/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Building, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from '@/components/Pagination';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useCreateDepartment, useDeleteDepartment, useDepartments, useUpdateDepartment } from '@/features/department/hooks/useDepartments';
import { CreateDepartmentRequest, Department, DepartmentsQueryParams } from '@/features/department/types/department';
import { CreateDepartmentDialog } from '@/features/department/components/create-department-dialog';
import { DepartmentSearch } from '@/features/department/components/department-search';
import { DepartmentsSkeleton } from '@/features/department/components/departments-skeleton';
import { DepartmentCard } from '@/features/department/components/department-card';
import { EditDepartmentDialog } from '@/features/department/components/edit-department-dialog';


export default function DepartmentsPage() {
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<DepartmentsQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Get token from your auth context
  const { token } = useAuth(); // Replace with your token retrieval

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

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useDepartments(queryParams, token);

  const createMutation = useCreateDepartment(token);
  const updateMutation = useUpdateDepartment(token);
  const deleteMutation = useDeleteDepartment(token);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
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

  const handleCreateDepartment = async (data: CreateDepartmentRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
    } catch(error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = async (data: CreateDepartmentRequest) => {
    if (!editingDepartment) return;

    try {
      await updateMutation.mutateAsync({
        id: editingDepartment.id,
        data,
      });
      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async (department: Department) => {
    try {
      await deleteMutation.mutateAsync(department.id);
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Authentication required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view departments.
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
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load departments</h3>
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
              <h1 className="text-3xl font-bold">Departments</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || response?.data.length} department
                {(response?.pagination?.totalCount ||response?.data.length) !== 1 ? 's' : ''} found
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

              <CreateDepartmentDialog
                onSave={handleCreateDepartment}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>


        </div>

        {isLoading ? (
          <DepartmentsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((department: Department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No departments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search' 
                : 'Get started by creating a new department.'
              }
            </p>
          </div>
        )}

        {response?.pagination && response.pagination.totalPages > 1 && (
          <DynamicPagination
            pagination={response.pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {editingDepartment && (
          <EditDepartmentDialog
            department={editingDepartment}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleUpdateDepartment}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}