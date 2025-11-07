// src/features/schedules/components/schedule-form.tsx
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
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  scheduleFormSchema,
  type ScheduleFormData,
} from "../lib/validations";
import { CreateScheduleRequest, Schedule } from "../types/schedule";
import { dayOfWeekOptions, statusOptions } from "../constants/schedule-constants";

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: CreateScheduleRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ScheduleForm({
  schedule,
  onSubmit,
  onCancel,
  isLoading = false,
}: ScheduleFormProps) {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: "",
      endTime: "",
      status: 1, // Default to Active (1) as per your API
      isAvailable: true,
      note: "",
    },
  });

  useEffect(() => {
    if (schedule) {
      form.reset({
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime?.substring(0, 5) || "", // Convert HH:mm:ss to HH:mm for input
        endTime: schedule.endTime?.substring(0, 5) || "", // Convert HH:mm:ss to HH:mm for input
        status: schedule.status,
        isAvailable: schedule.isAvailable,
        note: schedule.note || "",
      });
    }
  }, [schedule, form]);

  const handleSubmit = (data: ScheduleFormData) => {
    // Convert times to proper format before submitting
    const submitData: CreateScheduleRequest = {
      ...data,
      startTime: data.startTime, // Service will format this to HH:mm:ss
      endTime: data.endTime, // Service will format this to HH:mm:ss
    };
    
    console.log('Submitting schedule data:', submitData);
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {schedule ? "Edit Schedule" : "Schedule Information"}
            </CardTitle>
            <CardDescription>
              {schedule
                ? "Update the schedule details below."
                : "Enter the schedule details below."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Available
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Whether this schedule is currently available for appointments
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional notes..." 
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
              : schedule
              ? "Update Schedule"
              : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Form>
  );
}