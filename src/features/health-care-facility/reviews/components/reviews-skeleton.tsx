// components/reviews/reviews-skeleton.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            {/* Rating and Status Skeleton */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <div key={starIndex} className="h-4 w-4 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="h-6 w-12 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-20 bg-muted rounded"></div>
            </div>
            
            {/* Comment Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {/* Patient Info Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>

            {/* Doctor Info Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>

            {/* Date Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-48"></div>
            </div>

            {/* Review Date Skeleton */}
            <div className="h-3 bg-muted rounded w-40 pt-2 border-t border-gray-100"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}