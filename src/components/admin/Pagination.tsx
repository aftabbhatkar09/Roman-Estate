import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Base path this pager lives on, e.g. "/admin/properties". */
  basePath: string;
}

// Server-rendered pager — works via plain links to ?page=N, so it functions
// even before client JS hydrates. Used across every admin list page so none
// of them ever load an unbounded collection again.
export default function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = `${basePath}?page=${Math.max(1, page - 1)}`;
  const nextHref = `${basePath}?page=${Math.min(totalPages, page + 1)}`;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <Link
        href={prevHref}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
          page <= 1
            ? "bg-gray-50 text-gray-300 border-gray-100 pointer-events-none"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Link>

      <p className="text-sm text-gray-500 font-medium">
        Page {page} of {totalPages}
      </p>

      <Link
        href={nextHref}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
          page >= totalPages
            ? "bg-gray-50 text-gray-300 border-gray-100 pointer-events-none"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
