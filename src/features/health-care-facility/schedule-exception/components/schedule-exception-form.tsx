// src/features/schedule-exceptions/components/schedule-exception-form.tsx
"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  scheduleExceptionFormSchema,
  type ScheduleExceptionFormData,
} from "../lib/validations";
import { CreateScheduleExceptionRequest, ScheduleException } from "../types/schedule-exception";
import { dayOfWeekOptions, statusOptions } from "../constants/schedule-exception-constants";

interface ScheduleExceptionFormProps {
  exception?: ScheduleException;
  onSubmit: (data: CreateScheduleExceptionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ScheduleExceptionForm({
  exception,
  onSubmit,
  onCancel,
  isLoading = false,
}: ScheduleExceptionFormProps) {
  const form = useForm<ScheduleExceptionFormData>({
    resolver: zodResolver(scheduleExceptionFormSchema),
    defaultValues: {
      date: "",
      dayOfWeek: undefined,
      startTime: "",
      endTime: "",
      status: 1, // Default to Active (1) as per your API
      reason: "",
    },
  });

  useEffect(() => {
    if (exception) {
      form.reset({
        date: exception.date,
        dayOfWeek: exception.dayOfWeek,
        startTime: exception.startTime?.substring(0, 5) || "", // Convert HH:mm:ss to HH:mm for input
        endTime: exception.endTime?.substring(0, 5) || "", // Convert HH:mm:ss to HH:mm for input
        status: exception.status,
        reason: exception.reason,
      });
    }
  }, [exception, form]);

  const handleSubmit = (data: ScheduleExceptionFormData) => {
    // Convert times to proper format before submitting
    const submitData: CreateScheduleExceptionRequest = {
      ...data,
      startTime: data.startTime, // Service will format this to HH:mm:ss
      endTime: data.endTime, // Service will format this to HH:mm:ss
    };
    
    console.log('Submitting schedule exception data:', submitData);
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {exception ? "Edit Schedule Exception" : "Schedule Exception Information"}
            </CardTitle>
            <CardDescription>
              {exception
                ? "Update the schedule exception details below."
                : "Enter the schedule exception details for special dates."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dayOfWeekOptions.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value.toString()}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        step="1" // Allows seconds if needed
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: HH:mm (e.g., 08:00, 14:30)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        step="1" // Allows seconds if needed
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: HH:mm (e.g., 12:00, 17:45)
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the reason for this exception..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
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
              : exception
              ? "Update Exception"
              : "Create Exception"}
          </Button>
        </div>
      </form>
    </Form>
  );
}