// components/reviews/reviews-list.tsx
"use client";

import { Review } from "../types/review";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageSquare } from "lucide-react";

interface ReviewsListProps {
  reviews: Review[];
  isRefetching?: boolean;
  onRefresh?: () => void;
}

export function ReviewsList({
  reviews,
  isRefetching,
  onRefresh,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
        <p className="text-muted-foreground">
          Patient reviews will appear here once they submit feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Patient Reviews ({reviews.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6">
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.id || `review-${index}-${review.createdAtUtc}`}
            review={review}
          />
        ))}
      </div>
    </div>
  );
}