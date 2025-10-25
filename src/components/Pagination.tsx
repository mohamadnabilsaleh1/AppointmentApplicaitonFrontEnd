// src/components/dynamic-pagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface DynamicPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageInfo?: boolean;
  rowsLabel?: string;
  showingText?: string;
  ofText?: string;
  resultsText?: string;
}

export function DynamicPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = "",
  showPageInfo = true,
  rowsLabel = "Rows per page",
  showingText = "Showing",
  ofText = "of",
  resultsText = "results",
}: DynamicPaginationProps) {
  const { page, pageSize, totalCount, totalPages } = pagination;

  const getVisiblePages = () => {
    if (totalPages <= 1) return [1];

    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const getDisplayRange = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalCount);
    return { start, end };
  };

  if (totalPages <= 1 && !onPageSizeChange) return null;

  const { start, end } = getDisplayRange();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 w-full ${className}`}
    >
      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{rowsLabel}:</span>
          <Select
            defaultValue="10"
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Page Info */}
      {showPageInfo && totalCount > 0 && (
        <div className="text-sm text-muted-foreground">
          {showingText} <span className="font-medium">{start}</span> to{" "}
          <span className="font-medium">{end}</span> {ofText}{" "}
          <span className="font-medium">{totalCount}</span> {resultsText}
        </div>
      )}

      {/* Pagination Controls - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-label="Go to previous page"
              />
            </PaginationItem>

            {getVisiblePages().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={() => onPageChange(pageNumber as number)}
                    className="cursor-pointer"
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={pageNumber === page ? "page" : undefined}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && onPageChange(page + 1)}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-label="Go to next page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
