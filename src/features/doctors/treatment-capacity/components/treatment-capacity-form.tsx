// src/features/treatment-capacity/components/treatment-capacity-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  treatmentCapacityFormSchema,
  type TreatmentCapacityFormData,
} from "../lib/validations";
import { TreatmentCapacity } from "../types/treatment-capacity";

interface TreatmentCapacityFormProps {
  treatmentCapacity?: TreatmentCapacity;
  onSubmit: (data: TreatmentCapacityFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TreatmentCapacityForm({
  treatmentCapacity,
  onSubmit,
  onCancel,
  isLoading = false,
}: TreatmentCapacityFormProps) {
  const form = useForm<TreatmentCapacityFormData>({
    resolver: zodResolver(treatmentCapacityFormSchema),
    defaultValues: {
      maxPatientsPerDay: 20,
      sessionDurationMinutes: 30,
    },
  });

  useEffect(() => {
    if (treatmentCapacity) {
      form.reset({
        maxPatientsPerDay: treatmentCapacity.maxPatientsPerDay,
        sessionDurationMinutes: treatmentCapacity.sessionDurationMinutes,
      });
    }
  }, [treatmentCapacity, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {treatmentCapacity ? "Edit Treatment Capacity" : "Set Treatment Capacity"}
            </CardTitle>
            <CardDescription>
              {treatmentCapacity
                ? "Update your daily patient capacity and session duration."
                : "Configure how many patients you can see per day and session length."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="maxPatientsPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Patients Per Day *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum number of patients you can accommodate in a single day.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Duration (Minutes) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      step="5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Duration of each patient session in minutes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              : treatmentCapacity
              ? "Update Capacity"
              : "Set Capacity"}
          </Button>
        </div>
      </form>
    </Form>
  );
}