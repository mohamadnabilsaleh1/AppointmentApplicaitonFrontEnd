// src/features/emails/components/email-form.tsx
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
  emailFormSchema,
  type EmailFormData,
} from "../lib/validations";
import { CreateEmailRequest, Email } from "../types/email";
import { emailLabelOptions } from "../constants/email-constants";

interface EmailFormProps {
  email?: Email;
  onSubmit: (data: CreateEmailRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EmailForm({
  email,
  onSubmit,
  onCancel,
  isLoading = false,
}: EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      emailAddress: "",
      label: "personal",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (email) {
      form.reset({
        emailAddress: email.emailAddress,
        label: email.label,
        isPrimary: email.isPrimary,
      });
    }
  }, [email, form]);

  const handleSubmit = (data: EmailFormData) => {
    console.log('Submitting email data:', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {email ? "Edit Email" : "Email Information"}
            </CardTitle>
            <CardDescription>
              {email
                ? "Update the email details below."
                : "Enter the email details below."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter email address (e.g., john.doe@example.com)"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    We'll never share your email with anyone else.
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
                      {emailLabelOptions.map((label) => (
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
                      Primary Email
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Set this as your primary contact email
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
              : email
              ? "Update Email"
              : "Create Email"}
          </Button>
        </div>
      </form>
    </Form>
  );
}