"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download, MoreVertical, Edit, Trash2, Calendar, Image as ImageIcon, Upload, ZoomIn } from "lucide-react";
import { Upload } from "../types/upload";
import { UpdateUploadFormData } from "../lib/upload-validation";
import Image from "next/image";

interface UploadCardProps {
  upload: Upload;
  onUpdate: (id: string, data: UpdateUploadFormData) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function UploadCard({ upload, onUpdate, onDelete, isLoading }: UploadCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [title, setTitle] = useState(upload.title);
  const [description, setDescription] = useState(upload.description || "");
  const [visibility, setVisibility] = useState(upload.visibility);

  // ✅ Use env variable or fallback for localhost
  const getImageUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
    return `http://localhost:5001/api/health-care-facilities/${upload.facilityId}/uploads/${upload.id}`;
  };

  const handleDownload = () => {
    window.open(upload.fileURL || getImageUrl(), "_blank");
  };

  const handleViewImage = () => {
    setShowImageDialog(true);
  };
    
  const handleUpdate = () => {
    onUpdate(upload.id, {
      title,
      description: description || undefined,
      visibility,
    });
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(upload.id);
    setShowDeleteDialog(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("video")) return "🎥";
    if (fileType.includes("audio")) return "🎵";
    return "📎";
  };

  const isImageFile = upload.fileType.includes("image");
  const imageUrl = getImageUrl();
  const isLocalhostImage = imageUrl.includes("localhost");

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="relative flex-shrink-0">
                  <div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center overflow-hidden border border-blue-100 dark:border-blue-800/30 ${
                      isImageFile ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
                    }`}
                    onClick={isImageFile ? handleViewImage : undefined}
                  >
                    {isImageFile ? (
                      isLocalhostImage ? (
                        // ✅ Bypass Next.js image optimization for localhost
                        <img
                          src={imageUrl}
                          alt={upload.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = "/images/default-file.png";
                          }}
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={upload.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/images/default-file.png";
                          }}
                        />
                      )
                    ) : (
                      <div className="text-2xl">{getFileIcon(upload.fileType)}</div>
                    )}
                  </div>
                  {isImageFile && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <ImageIcon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {upload.title}
                  </h3>
                  {/* <CardDescription className="flex items-center gap-3 text-sm mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                      {formatFileSize(upload.fileSize)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(upload.uploadedAt).toLocaleDateString()}
                    </span>
                  </CardDescription> */}
                </div>
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isImageFile && (
                    <DropdownMenuItem onClick={handleViewImage} className="cursor-pointer">
                      <ZoomIn className="mr-2 h-4 w-4" />
                      View Image
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {upload.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
              {upload.description}
            </p>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {upload.fileType.split("/")[1]?.toUpperCase() || upload.fileType.toUpperCase()}
              </Badge>
              {isImageFile && (
                <Badge variant="secondary" className="text-xs">
                  Image
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isImageFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewImage}
                  className="flex items-center gap-2"
                >
                  <ZoomIn className="h-3 w-3" />
                  View
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image View Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ZoomIn className="h-5 w-5" />
              {upload.title}
            </DialogTitle>
            <DialogDescription>
              {upload.description || "Viewing uploaded image"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-[70vh] overflow-auto">
            {isLocalhostImage ? (
              <img
                src={imageUrl}
                alt={upload.title}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-file.png";
                }}
              />
            ) : (
              <Image
                src={imageUrl}
                alt={upload.title}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = "/images/default-file.png";
                }}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              <p>File size: {formatFileSize(upload.fileSize)}</p>
              <p>Uploaded: {new Date(upload.uploadedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Close
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit File
            </DialogTitle>
            <DialogDescription>
              Update the details for <strong>{upload.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter file title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter file description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Updating..." : "Update File"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete File
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{upload.title}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete File"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}