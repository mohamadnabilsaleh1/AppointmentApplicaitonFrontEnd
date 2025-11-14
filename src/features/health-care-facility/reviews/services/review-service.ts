// services/review-service.ts
import { Review, ReviewsResponse, ReviewsQueryParams } from '../types/review';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class ReviewService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/health-care-facilities`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get reviews for healthcare facility
  async getReviews(params: ReviewsQueryParams, token: string): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<ReviewsResponse>(`/me/reviews?${queryParams}`, {}, token);
  }
}

export const reviewService = new ReviewService();