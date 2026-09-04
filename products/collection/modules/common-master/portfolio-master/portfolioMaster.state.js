export function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      String(r.code ?? "").toLowerCase().includes(q) ||
      String(r.description ?? "").toLowerCase().includes(q)
  );
}
