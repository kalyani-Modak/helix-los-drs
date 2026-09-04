export function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      String(r.szBlockCode ?? "").toLowerCase().includes(q) ||
      String(r.szBlockDesc ?? "").toLowerCase().includes(q)
  );
}