// types/upload.ts
export interface Upload {
    id: string;
    title: string;
    description?: string;
    fileURL: string;
    fileType: string;
    fileSize: number;
    localPath:string;
    visibility: UploadVisibility;
    uploadedAt: string;
    updatedAt?: string;
  }
  
  export enum UploadVisibility {
    Private = 0,
    Public = 1
  }
  
  export interface CreateUploadRequest {
    title: string;
    description?: string;
    visibility: UploadVisibility;
    file: File;
  }
  
  export interface UpdateUploadRequest {
    title?: string;
    description?: string;
    visibility?: UploadVisibility;
  }