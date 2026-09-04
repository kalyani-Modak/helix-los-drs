import { useEffect, useMemo, useState } from "react";

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

/**
 * Client-side pagination for listing screens (slice after fetch/filter).
 * Resets to page 0 when the items array reference changes.
 */
export function useClientPagination(items, defaultRowsPerPage = 10) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [items]);

  const paged = useMemo(
    () => items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [items, page, rowsPerPage],
  );

  return {
    paged,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    count: items.length,
    onPageChange: (_, next) => setPage(next),
    onRowsPerPageChange: (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    rowsPerPageOptions: DEFAULT_ROWS_PER_PAGE_OPTIONS,
  };
}
