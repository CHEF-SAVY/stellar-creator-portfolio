'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
}

export function Pagination({ total, page, pageSize, pageSizeOptions = [10, 25, 50] }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const navigate = (newPage: number, newSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    if (newSize) params.set('pageSize', String(newSize));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Showing {start}–{end} of {total}</span>
        <span className="text-border">|</span>
        <span>Per page:</span>
        <div className="flex gap-1">
          {pageSizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => navigate(1, size)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                pageSize === size
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft size={14} />
        </Button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
          ) : (
            <Button
              key={p}
              variant={page === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate(p as number)}
              className="h-8 w-8 p-0 text-xs"
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

export function parsePaginationParams(searchParams: { page?: string; pageSize?: string }, defaultPageSize = 25) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const pageSize = [10, 25, 50].includes(parseInt(searchParams.pageSize ?? '', 10))
    ? parseInt(searchParams.pageSize!, 10)
    : defaultPageSize;
  return { page, pageSize };
}
