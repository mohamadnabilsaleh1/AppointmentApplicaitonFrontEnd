// components/reviews/review-card.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User, Stethoscope } from "lucide-react";
import { Review } from "../types/review";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ));
  };
  console.log(review)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAppointmentDateTime = () => {
    return new Date(`${review.AppointmentDate}T${review.AppointmentTime}`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {renderStars(review.Rating)}
            <Badge 
              variant="secondary" 
              className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {review.Rating}.0
            </Badge>
          </div>
          <Badge 
            variant={review.AppointmentStatus === 'Completed' ? 'default' : 'secondary'}
            className={
              review.AppointmentStatus === 'Completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : ''
            }
          >
            {review.AppointmentStatus}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {review.Comment}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Patient Information */}
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {review.PatientFullName}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500 text-xs">{review.PatientEmail}</span>
        </div>

        {/* Doctor Information */}
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            Dr. {review.DoctorFullName}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500 text-xs">{review.DoctorSpecialization}</span>
        </div>

        {/* Appointment Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Appointment: {getAppointmentDateTime()}
          </span>
        </div>

        {/* Review Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          Reviewed on {formatDate(review.CreatedAtUtc)}
          {review.UpdatedAtUtc && (
            <span className="ml-2">
              (Updated on {formatDate(review.UpdatedAtUtc)})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}