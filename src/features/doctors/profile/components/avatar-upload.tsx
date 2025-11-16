// src/features/doctors/profile/components/avatar-upload.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AvatarUploadProps {
  userId: string;
  currentAvatar?: string;
  firstName: string;
  lastName: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function AvatarUpload({
  userId,
  currentAvatar,
  firstName,
  lastName,
  onUpload,
  isLoading = false,
}: AvatarUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      await onUpload(file);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
      // Clear preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Use the avatar URL from the profile response directly
  const avatarUrl = previewUrl || currentAvatar;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Avatar</CardTitle>
        <CardDescription>
          Update your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          {/* Use the avatar URL directly from profile response */}
          <AvatarImage 
            src={avatarUrl} 
            alt={`${firstName} ${lastName}`} 
          />
          <AvatarFallback className="text-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        <Button
          onClick={handleButtonClick}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Uploading..." : "Change Avatar"}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Supported formats: JPG, PNG, GIF
          <br />
          Max size: 5MB
        </div>
      </CardContent>
    </Card>
  );
}