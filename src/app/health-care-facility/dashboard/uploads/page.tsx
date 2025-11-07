// app/dashboard/uploads/page.tsx
"use client";

import { useAuth } from "@/features/authentication/hooks/useAuth";
import { UploadsContainer } from "@/features/health-care-facility/uploads/components/uploads-container";

export default function UploadsPage() {
  const { token } =  useAuth();
  if (!token) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">Authentication required</h3>
          <p className="text-muted-foreground">
            Please log in to access file management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <UploadsContainer token={token} />
    </div>
  );
}