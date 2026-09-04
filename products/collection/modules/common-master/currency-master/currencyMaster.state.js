export function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>   
      String(r.szCurrencyCode ?? "").toLowerCase().includes(q) 
      // String(r.szCurrencyName ?? "").toLowerCase().includes(q) ||
      // String(r.szCountry ?? "").toLowerCase().includes(q) ||
      // String(r.szAbbreviation ?? "").toLowerCase().includes(q)
  );
}