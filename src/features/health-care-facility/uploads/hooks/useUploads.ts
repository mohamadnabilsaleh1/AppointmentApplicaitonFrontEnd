
// hooks/useUploads.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '../services/upload-service';
import { Upload, CreateUploadRequest, UpdateUploadRequest } from '../types/upload';
import { useToast } from '@/hooks/use-toast';

export const useUploads = (token: string) => {
  return useQuery({
    queryKey: ['uploads'],
    queryFn: () => uploadService.getUploads(token),
    enabled: !!token,
  });
};

export const useUpload = (id: string, token: string) => {
  return useQuery({
    queryKey: ['upload', id],
    queryFn: () => uploadService.getUploadById(id, token),
    enabled: !!token && !!id,
  });
};

export const useCreateUpload = (token: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUploadRequest) => uploadService.createUpload(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to upload file: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUpload = (token: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUploadRequest }) =>
      uploadService.updateUpload(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['upload', variables.id] });
      toast({
        title: 'Success',
        description: 'File updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update file: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteUpload = (token: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => uploadService.deleteUpload(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete file: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};