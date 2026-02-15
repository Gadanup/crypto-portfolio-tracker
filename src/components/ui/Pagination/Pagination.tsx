import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const DEFAULT_PER_PAGE_OPTIONS = [25, 50, 100];

const getVisiblePages = (
  current: number,
  total: number,
): (number | 'ellipsis')[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  for (let page = rangeStart; page <= rangeEnd; page++) {
    pages.push(page);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  pages.push(total);

  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  perPage,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  onPageChange,
  onPerPageChange,
}: PaginationProps): React.JSX.Element => {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">Rows per page:</span>
        <select
          value={perPage}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
          className="h-7 rounded border border-border bg-background px-1.5 text-xs text-text-primary focus:border-accent focus:outline-none"
          aria-label="Rows per page"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-7 w-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-7 w-7 items-center justify-center text-xs text-text-secondary"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-medium transition-colors ${
                page === currentPage
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-7 w-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
