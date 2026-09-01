// Shared pagination helpers for list API routes. Keeps every GET /api/<collection>
// endpoint from ever fetching (and serializing) an unbounded number of documents —
// caps the page size, still returns the same array-shaped body callers already
// expect, and surfaces the total via response headers for anyone that wants to page.

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(request: Request): PaginationParams {
  const url = new URL(request.url);

  const rawPage = Number(url.searchParams.get("page"));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const rawLimit = Number(url.searchParams.get("limit"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(MAX_LIMIT, Math.floor(rawLimit))
      : DEFAULT_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
}

export function paginationHeaders({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): HeadersInit {
  return {
    "X-Total-Count": String(total),
    "X-Page": String(page),
    "X-Limit": String(limit),
    "X-Total-Pages": String(Math.max(1, Math.ceil(total / limit))),
  };
}
