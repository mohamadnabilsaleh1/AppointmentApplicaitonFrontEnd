"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleLocationMap } from "@/components/simple-location-map";
import {
  facilityFormSchema,
  updateFacilityFormSchema,
  type FacilityFormData,
  type UpdateFacilityFormData,
} from "../lib/validations";
import {
  CreateHealthcareFacilityRequest,
  HealthcareFacility,
} from "../types/healthcare-facility";
import { MapCoordinates } from "@/types/MapCoordinates";

interface HealthcareFacilityFormClientProps {
  facility?: HealthcareFacility;
  onSubmit: (data: CreateHealthcareFacilityRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const healthcareTypes = [
  { value: "1", label: "Hospital" },
  { value: "2", label: "Clinic" },
  { value: "3", label: "Pharmacy" },
  { value: "4", label: "Diagnostic Center" },
  { value: "5", label: "Rehabilitation Center" },
  { value: "6", label: "Nursing Home" },
  { value: "7", label: "Laboratory" },
  { value: "8", label: "Urgent Care" },
  { value: "9", label: "Specialized Center" },
];

export function HealthcareFacilityForm({
  facility,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: HealthcareFacilityFormClientProps) {
  const [selectedCoords, setSelectedCoords] = useState<MapCoordinates>({
    lat: facility?.GPSLatitude || 33.5138,
    lng: facility?.GPSLongitude || 36.2765,
  });

  const form = useForm<FacilityFormData | UpdateFacilityFormData>({
    resolver: zodResolver(
      isEdit ? updateFacilityFormSchema : facilityFormSchema
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "12er56ui90MO@",
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      gpsLatitude: 33.5138,
      gpsLongitude: 36.2765,
      type: undefined, // ✅ FIXED: was 0
    },
  });

  useEffect(() => {
    if (facility && isEdit) {
      form.reset({
        name: facility.Name || "",
        street: facility.street || "",
        city: facility.city || "",
        state: facility.state || "",
        country: facility.country || "",
        zipCode: facility.zipCode || "",
        gpsLatitude: facility.GPSLatitude || 33.5138,
        gpsLongitude: facility.GPSLongitude || 36.2765,
        type: facility.Type || undefined, // ✅ FIXED: was 0
      });
    }
  }, [facility, isEdit, form]);

  useEffect(() => {
    if (isEdit && facility) {
      const newCoords = {
        lat: facility.GPSLatitude || 33.5138,
        lng: facility.GPSLongitude || 36.2765,
      };
      setTimeout(() => {
        setSelectedCoords((prev) =>
          prev.lat !== newCoords.lat || prev.lng !== newCoords.lng
            ? newCoords
            : prev
        );
      }, 0);
    }
  }, [isEdit, facility]);

  useEffect(() => {
    form.setValue("gpsLatitude", selectedCoords.lat);
    form.setValue("gpsLongitude", selectedCoords.lng);
  }, [selectedCoords, form]);

  const handleLocationSelect = (coords: MapCoordinates) => {
    setSelectedCoords(coords);
  };

  const handleSubmit = (data: FacilityFormData | UpdateFacilityFormData) => {
    onSubmit(data as CreateHealthcareFacilityRequest);
  };

  const tabsConfig = isEdit
    ? {
        tabs: [
          { value: "facility", label: "Facility Information" },
          { value: "location", label: "Location" },
        ],
        defaultTab: "facility",
      }
    : {
        tabs: [
          { value: "account", label: "Account" },
          { value: "facility", label: "Facility Information" },
          { value: "location", label: "Location" },
        ],
        defaultTab: "account",
      };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue={tabsConfig.defaultTab} className="w-full">
          <TabsList className="flex w-full justify-start overflow-x-auto whitespace-nowrap no-scrollbar border-b rounded-none">
            {tabsConfig.tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {!isEdit && (
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Create the administrator account for this facility.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : isEdit
                    ? "Update Facility"
                    : "Create Facility"}
                </Button>
              </div>
            </TabsContent>
          )}

          <TabsContent value="facility">
            <Card>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
                <CardDescription>
                  {isEdit
                    ? "Update the details of the healthcare facility."
                    : "Enter the details of the healthcare facility."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter facility name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Type *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select facility type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {healthcareTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter state/province"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEdit
                  ? "Update Facility"
                  : "Create Facility"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location Selection</CardTitle>
                <CardDescription>
                  Select the facility location on the map or search for an
                  address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Map Component */}
                <SimpleLocationMap
                  onLocationSelect={handleLocationSelect}
                  initialPosition={selectedCoords}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Buttons (Outside of Map, below all Tabs) */}
        </Tabs>
      </form>
    </Form>
  );
}
