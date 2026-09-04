export function filterRowsByStateAndDesc(rows, stateFilter, descFilter) {
  const stateQ = (stateFilter ?? "").trim().toLowerCase();
  const descQ = (descFilter ?? "").trim().toLowerCase();

  if (!stateQ && !descQ) {
    return rows;
  }

  return rows.filter((row) => {
    const code = (row.szStateCode ?? "").toLowerCase();
    const desc = (row.szDesc ?? "").toLowerCase();
    const okState = !stateQ || code.includes(stateQ);
    const okDesc = !descQ || desc.includes(descQ);
    return okState && okDesc;
  });
}
