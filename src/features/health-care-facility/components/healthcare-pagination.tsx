// src/components/healthcare-pagination.tsx
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
  } from '@/components/ui/pagination';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationInfo } from '../types/healthcare-facility';
  
  interface HealthcarePaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
  }
  
  export function HealthcarePagination({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className = '',
  }: HealthcarePaginationProps) {
    const { page, pageSize, totalCount, totalPages } = pagination;
  
    const getVisiblePages = () => {
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
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
  
      rangeWithDots.push(...range);
  
      if (page + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }
  
      return rangeWithDots;
    };
  
    if (totalPages <= 1) return null;
  
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 w-full ${className}`}>
        {/* Page Size Selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
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
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
          <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </div>
  
        {/* Pagination Controls */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
  
            {getVisiblePages().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={() => onPageChange(pageNumber as number)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
  
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && onPageChange(page + 1)}
                className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }