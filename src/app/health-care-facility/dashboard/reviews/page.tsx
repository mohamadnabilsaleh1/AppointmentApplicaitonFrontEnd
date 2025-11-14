// app/dashboard/reviews/page.tsx
"use client";

import { useAuth } from "@/features/authentication/hooks/useAuth";
import { ReviewsContainer } from "@/features/health-care-facility/reviews/components/reviews-container";

export default function ReviewsPage() {
  const { token } = useAuth();

  if (!token) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">Authentication required</h3>
          <p className="text-muted-foreground">
            Please log in to access patient reviews.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ReviewsContainer token={token} />
    </div>
  );
}