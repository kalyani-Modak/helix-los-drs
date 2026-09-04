import * as XLSX from "xlsx";

export function exportToExcel(records, fileName = "export.xlsx", sheetName = "Sheet1") {
  try {
    const data = Array.isArray(records) ? records : [records];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    // Fallback: try CSV download
    try {
      const keys = Array.from(
        new Set(
          records.reduce((acc, r) => acc.concat(Object.keys(r || {})), []),
        ),
      );
      const csv = [keys.join(",")]
        .concat(
          (records || []).map((r) => keys.map((k) => JSON.stringify(r?.[k] ?? "")).join(",")),
        )
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/\.xlsx$/, ".csv");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
    }
  }
}
