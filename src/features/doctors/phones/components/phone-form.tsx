// src/features/phones/components/phone-form.tsx
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
  phoneFormSchema,
  type PhoneFormData,
} from "../lib/validations";
import { CreatePhoneRequest, Phone } from "../types/phone";
import { phoneLabelOptions } from "../constants/phone-constants";

interface PhoneFormProps {
  phone?: Phone;
  onSubmit: (data: CreatePhoneRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PhoneForm({
  phone,
  onSubmit,
  onCancel,
  isLoading = false,
}: PhoneFormProps) {
  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phoneNumber: "",
      label: "mobile",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (phone) {
      form.reset({
        phoneNumber: phone.phoneNumber,
        label: phone.label,
        isPrimary: phone.isPrimary,
      });
    }
  }, [phone, form]);

  const handleSubmit = (data: PhoneFormData) => {
    console.log('Submitting phone data:', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {phone ? "Edit Phone" : "Phone Information"}
            </CardTitle>
            <CardDescription>
              {phone
                ? "Update the phone details below."
                : "Enter the phone details below."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number (e.g., +1234567890)"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Include country code if applicable
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phoneLabelOptions.map((label) => (
                        <SelectItem key={label.value} value={label.value}>
                          {label.label}
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
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Primary Phone
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Set this as your primary contact number
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
              : phone
              ? "Update Phone"
              : "Create Phone"}
          </Button>
        </div>
      </form>
    </Form>
  );
}