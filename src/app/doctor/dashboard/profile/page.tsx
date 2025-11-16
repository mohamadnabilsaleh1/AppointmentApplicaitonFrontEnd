// src/app/dashboard/profile/page.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import {
  useMyProfile,
  useMyDoctorProfile,
  useUpdateDoctorDescription,
  useUpdateAvatar,
} from "@/features/doctors/profile/hooks/useProfile";
import { DescriptionForm } from "@/features/doctors/profile/components/description-form";
import { AvatarUpload } from "@/features/doctors/profile/components/avatar-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Stethoscope } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { toast } = useToast();
  const { token } = useAuth();

  const { data: profile, isLoading: profileLoading } = useMyProfile(token!);
  const { data: doctordata, isLoading: doctorLoading } = useMyDoctorProfile(token!);
  const  doctor = doctorLoading ? [] : doctordata.data;
  const updateDescriptionMutation = useUpdateDoctorDescription(token!);
  const updateAvatarMutation = useUpdateAvatar(token!);

  const handleUpdateDescription = async (description: string) => {
    try {
      await updateDescriptionMutation.mutateAsync(description);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update description",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      await updateAvatarMutation.mutateAsync(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">
              Authentication required
            </h3>
            <div className="mt-1 text-sm text-muted-foreground">
              Please log in to view your profile.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (!profile) return "U";
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(
      0
    )}`.toUpperCase();
  };
  console.log("avatar ===>",profile?.avatar);
  const avatarUlr = `http://localhost:5001/api/users/${profile?.id}/avatar`

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Doctor Profile</h1>
          <div className="mt-2 text-muted-foreground">
            Manage your professional profile and information
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {/* Use the avatar URL directly from profile response */}
                  <AvatarImage
                    src={avatarUlr}
                    alt={`${profile?.firstName} ${profile?.lastName}`}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                {profile && (
                  <AvatarUpload
                    userId={profile.id}
                    currentAvatar={avatarUlr}
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    onUpload={handleUpdateAvatar}
                    isLoading={updateAvatarMutation.isPending}
                  />
                )}
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {profileLoading ? (
                        <Skeleton className="h-4 w-32" />
                      ) : (
                        profile?.email
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Name</div>
                    <div className="text-sm text-muted-foreground">
                      {profileLoading ? (
                        <Skeleton className="h-4 w-40" />
                      ) : (
                        `${profile?.firstName} ${profile?.lastName}`
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Role</div>
                    <Badge variant="secondary" className="mt-1">
                      {profileLoading ? (
                        <Skeleton className="h-4 w-20" />
                      ) : (
                        profile?.role
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Professional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your doctor profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : doctor ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">Doctor ID</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.id}
                      </div>
                    </div>
                  </div>

                  {doctor.specialization && (
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">Specialization</div>
                        <Badge variant="outline" className="mt-1">
                          {doctor.specialization}
                        </Badge>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No doctor information available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description Form - For Doctors */}
        <DescriptionForm
          initialDescription={doctor?.description || ""}
          onSave={handleUpdateDescription}
          isLoading={updateDescriptionMutation.isPending}
        />
      </div>
    </div>
  );
}