// src/app/dashboard/profile/page.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import {
  useMyProfile,
  useMyFacilityProfile, // ADDED THIS
  useUpdateFacilityDescription,
  useUpdateAvatar,
} from "@/features/health-care-facility/profile/hooks/useProfile";
import { DescriptionForm } from "@/features/health-care-facility/profile/components/description-form";
import { AvatarUpload } from "@/features/health-care-facility/profile/components/avatar-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Building, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { toast } = useToast();
  const { token } = useAuth();

  const { data: profile, isLoading: profileLoading } = useMyProfile(token!);
  const { data: facility, isLoading: facilityLoading } = useMyFacilityProfile(
    token!
  ); // ADDED THIS
  const updateDescriptionMutation = useUpdateFacilityDescription(token!);
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

  // Handle empty avatar string
  console.log(profile)
  
  const avatarUrl = `http://localhost:5001/api/users/${profile?.id}/avatar`;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <div className="mt-2 text-muted-foreground">
            Manage your profile information and facility details
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {/* Use direct URL in src */}
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${profile?.firstName} ${profile?.lastName}`}
                  />
                  <AvatarFallback>
                    {profile
                      ? `${profile.firstName.charAt(
                          0
                        )}${profile.lastName.charAt(0)}`.toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                {profile && (
                  <AvatarUpload
                    currentAvatar={avatarUrl}
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
                  <div className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
                  <Badge variant="secondary">
                    {profileLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      profile?.role
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facility Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Information</CardTitle>
              <CardDescription>
                Your healthcare facility details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {facilityLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : facility ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">Facility Name</div>
                      <div className="text-sm text-muted-foreground">
                        {facility.data.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">
                        {facility.data.address.fullAddress}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Type</div>
                    <Badge variant="outline">
                      {facility.data.type === 0 ? "Hospital" : "Clinic"}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No facility information available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description Form - Only for Healthcare Facilities */}
        {profile?.role === "HealthCareFacility" && (
          <DescriptionForm
            initialDescription={facility?.data.description || ""} // GET DESCRIPTION FROM FACILITY
            onSave={handleUpdateDescription}
            isLoading={updateDescriptionMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
