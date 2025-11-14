// components/reviews/reviews-container.tsx
"use client";

import { useState, useEffect } from "react";
import { useReviews } from "../hooks/useReviews";
import { ReviewsList } from "./reviews-list";
import { ReviewsSkeleton } from "./reviews-skeleton";
import { ReviewsQueryParams } from "../types/review";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Search, Filter, MessageSquare, RefreshCw } from "lucide-react";
import { DynamicPagination } from "@/components/Pagination";

interface ReviewsContainerProps {
  token: string;
}

export function ReviewsContainer({ token }: ReviewsContainerProps) {
  const [queryParams, setQueryParams] = useState<ReviewsQueryParams>({
    page: 1,
    pageSize: 10,
    sort: "CreatedAtUtc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle rating filter
  useEffect(() => {
    if (ratingFilter === "all") {
      setQueryParams(prev => ({
        ...prev,
        minRating: undefined,
        maxRating: undefined,
        page: 1
      }));
    } else {
      const rating = parseInt(ratingFilter);
      setQueryParams(prev => ({
        ...prev,
        minRating: rating,
        maxRating: rating,
        page: 1
      }));
    }
  }, [ratingFilter]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useReviews(queryParams, token);

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter("all");
  };

  const hasActiveFilters = searchTerm || (ratingFilter !== "all");

  // Calculate review statistics
  const calculateStats = () => {
    if (!response?.data) return { total: 0, positive: 0, neutral: 0, needsImprovement: 0 };
    
    const reviews = response.data;
    return {
      total: reviews.length,
      positive: reviews.filter(r => r.Rating >= 4).length,
      neutral: reviews.filter(r => r.Rating === 3).length,
      needsImprovement: reviews.filter(r => r.Rating <= 2).length
    };
  };

  const stats = calculateStats();

  if (isError) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Failed to load reviews</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Use the skeleton in the loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted rounded w-24"></div>
        </div>

        {/* Filters Card Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-muted rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Skeleton */}
        <ReviewsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patient Reviews</h2>
          <p className="text-muted-foreground">
            View and manage patient feedback and ratings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter reviews by rating or search in comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search in comments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Rating Filter */}
            {/* <div className="space-y-2">
              <Label htmlFor="rating">Filter by rating</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All ratings
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span>5 stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span>4+ stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span>3+ stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span>2+ stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>1+ stars</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      {response?.data && response.data.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.positive}
                </div>
                <div className="text-sm text-muted-foreground">Positive (4+ stars)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.neutral}
                </div>
                <div className="text-sm text-muted-foreground">Neutral (3 stars)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.needsImprovement}
                </div>
                <div className="text-sm text-muted-foreground">Needs Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <ReviewsList
        reviews={response?.data || []}
        isRefetching={isRefetching}
        onRefresh={handleRefresh}
      />

      {/* Pagination */}
      {response?.pagination && response.pagination.totalPages > 1 && (
        <DynamicPagination
          pagination={response.pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
