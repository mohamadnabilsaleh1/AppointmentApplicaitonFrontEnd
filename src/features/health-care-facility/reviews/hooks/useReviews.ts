// hooks/useReviews.ts
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review-service';
import { ReviewsResponse, ReviewsQueryParams } from '../types/review';

export const useReviews = (params: ReviewsQueryParams, token: string) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params, token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};