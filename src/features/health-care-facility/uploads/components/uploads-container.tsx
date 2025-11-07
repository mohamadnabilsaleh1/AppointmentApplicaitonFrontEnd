// components/uploads/uploads-container.tsx
"use client";

import { useUploads, useCreateUpload, useUpdateUpload, useDeleteUpload } from "../hooks/useUploads";
import { CreateUploadFormData } from "../lib/upload-validation";
import { CreateUploadDialog } from "./create-upload-dialog";
import { UploadsList } from "./uploads-list";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadsContainerProps {
  token: string;
}

export function UploadsContainer({ token }: UploadsContainerProps) {
  const {
    data: uploads = [],
    isLoading: isLoadingUploads,
    isError,
    error,
    refetch,
    isRefetching,
  } = useUploads(token);
  console.log(uploads)
  const createMutation = useCreateUpload(token);
  const updateMutation = useUpdateUpload(token);
  const deleteMutation = useDeleteUpload(token);
  const handleCreateUpload = async (data: CreateUploadFormData) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateUpload = async (id: string, data: any) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteUpload = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isError) {
    return (
      <div className="text-center py-12">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Failed to load files</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">File Management</h2>
          <p className="text-muted-foreground">
            Upload and manage files for your healthcare facility
          </p>
        </div>
        <CreateUploadDialog
          onUpload={handleCreateUpload}
          isLoading={createMutation.isPending}
        />
      </div>

      {isLoadingUploads ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <UploadsList
          uploads={uploads}
          onUpdate={handleUpdateUpload}
          onDelete={handleDeleteUpload}
          isLoading={updateMutation.isPending || deleteMutation.isPending}
          isRefetching={isRefetching}
          onRefresh={() => refetch()}
        />
      )}
    </div>
  );
}