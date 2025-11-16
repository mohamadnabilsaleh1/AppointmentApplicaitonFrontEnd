// src/features/profile/components/description-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";

const descriptionFormSchema = z.object({
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
});

type DescriptionFormData = z.infer<typeof descriptionFormSchema>;

interface DescriptionFormProps {
  initialDescription?: string;
  onSave: (description: string) => Promise<void>;
  isLoading?: boolean;
}

export function DescriptionForm({
  initialDescription = "",
  onSave,
  isLoading = false,
}: DescriptionFormProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<DescriptionFormData>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      description: initialDescription,
    },
  });

  // Update form when initial description changes - ADDED THIS
  useEffect(() => {
    form.reset({ description: initialDescription });
  }, [initialDescription, form]);

  const handleSubmit = async (data: DescriptionFormData) => {
    try {
      await onSave(data.description);
      toast({
        title: "Success",
        description: "Description updated successfully",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update description",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset({ description: initialDescription });
    setIsEditing(false);
  };

  const characterCount = form.watch("description").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Facility Description</CardTitle>
          <CardDescription>
            Update your healthcare facility description
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Description
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your facility description..."
                      {...field}
                      rows={4}
                      disabled={!isEditing || isLoading}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{characterCount}/1000 characters</span>
                    {isEditing && (
                      <span>{1000 - characterCount} characters remaining</span>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !form.formState.isDirty}
                >
                  {isLoading ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Description
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}