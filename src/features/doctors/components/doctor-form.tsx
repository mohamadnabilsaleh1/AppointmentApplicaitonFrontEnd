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
import {
  doctorFormSchema,
  updateDoctorFormSchema,
  type DoctorFormData,
  type UpdateDoctorFormData,
} from "../lib/validation";
import { CreateDoctorRequest, Doctor } from "../types/doctor";
import { genderOptions, specializationOptions } from "../constants/doctors";

interface DoctorFormProps {
  doctor?: Doctor;
  onSubmit: (data: CreateDoctorRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  resetForm?: boolean; // Add this prop to trigger reset from parent
}

export function DoctorForm({
  doctor,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
  resetForm = false, // New prop to control reset from parent
}: DoctorFormProps) {
  // Define default values separately for reusability
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "12er56ui90MO@",
    gender: undefined,
    dateOfBirth: "",
    specialization: undefined,
    licenseNumber: "",
  };

  const form = useForm<DoctorFormData | UpdateDoctorFormData>({
    resolver: zodResolver(isEdit ? updateDoctorFormSchema : doctorFormSchema),
    defaultValues,
  });

  // Reset form when doctor changes or when resetForm prop changes
  useEffect(() => {
    if (doctor && isEdit) {
      form.reset({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        gender: parseInt(doctor.gender) || undefined,
        specialization: parseInt(doctor.specialization) || undefined,

        // Don't include password in edit mode
      });
    }
  }, [doctor, isEdit, form]);

  // Reset form when resetForm prop is true (for successful creation)
  useEffect(() => {
    if (resetForm && !isEdit) {
      form.reset(defaultValues);
    }
  }, [resetForm, isEdit, form, defaultValues]);

  const handleSubmit = (data: DoctorFormData | UpdateDoctorFormData) => {
    onSubmit(data as CreateDoctorRequest);

    // Reset form after successful submission for create mode
    if (!isEdit) {
      form.reset(defaultValues);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Doctor" : "Create New Doctor"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Update the doctor's information below."
                : "Add a new doctor to your facility. Fill in all the required information."}
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
              {!isEdit && (
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
              )}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((gender) => (
                          <SelectItem
                            key={gender.value}
                            value={gender.value.toString()}
                          >
                            {gender.label}
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
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specializationOptions.map((spec) => (
                          <SelectItem
                            key={spec.value}
                            value={spec.value.toString()}
                          >
                            {spec.label}
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
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
              ? "Update Doctor"
              : "Create Doctor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
