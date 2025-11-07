// components/uploads/uploads-list.tsx
"use client";

import { Upload } from "../types/upload";
import { UploadCard } from "./upload-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText } from "lucide-react";

interface UploadsListProps {
  uploads: Upload[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  isRefetching?: boolean;
  onRefresh?: () => void;
}

export function UploadsList({
  uploads,
  onUpdate,
  onDelete,
  isLoading,
  isRefetching,
  onRefresh,
}: UploadsListProps) {
  if (uploads.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No files uploaded</h3>
        <p className="text-muted-foreground">
          Get started by uploading your first file.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Uploaded Files ({uploads.length})</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uploads.data.map((upload) => (
          <UploadCard
            key={upload.id}
            upload={upload}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}