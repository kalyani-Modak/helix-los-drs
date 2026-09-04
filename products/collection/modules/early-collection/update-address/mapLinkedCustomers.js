/**
 * Normalizes col-customerinformation/fetchLinkedCustomers (or similar) rows into
 * the shape expected by LinkedCustomerTileStrip: { id, custSeqNo, name, role, customerNo }.
 */
export function normalizeLinkedCustomersFromApi(responseJson, selectedRow) {
  const rawList = Array.isArray(responseJson)
    ? responseJson
    : responseJson != null
      ? [responseJson]
      : [];

  const mapped = rawList
    .map((raw, idx) => {
      if (!raw || typeof raw !== "object") return null;
      const custSeq =
        raw.lnCustomerSeqNo ??
        raw.custSeqNo ??
        raw.CUST_SEQNO ??
        raw.iCustomerSeqNo ??
        raw.customerSeqNo;
      if (custSeq == null || custSeq === "") return null;
      const seqNum = Number(custSeq);
      if (Number.isNaN(seqNum)) return null;

      const name =
        raw.szName ??
        raw.customerName ??
        raw.szCustomerName ??
        raw.name ??
        raw.CUSTOMER_NAME ??
        raw.custName ??
        "";

      const role =
        raw.szRelationType ??
        raw.szCustomerType ??
        raw.szRole ??
        raw.role ??
        raw.RELATION_TYPE ??
        "";

      const customerNo =
        raw.szLegacyCustomerNo ??
        raw.customerNo ??
        raw.legacyCustomerNo ??
        raw.CUSTOMER_NO ??
        "";

      return {
        id: String(seqNum),
        custSeqNo: seqNum,
        name: String(name || "").trim() || `Customer ${seqNum}`,
        role: String(role || "").trim() || "—",
        customerNo: customerNo != null ? String(customerNo) : "",
      };
    })
    .filter(Boolean);

  if (mapped.length > 0) return mapped;

  if (selectedRow?.CUST_SEQNO != null) {
    const seqNum = Number(selectedRow.CUST_SEQNO);
    const name =
      selectedRow.CUSTOMER_NAME ??
      selectedRow.CUST_NM ??
      selectedRow.NAME ??
      selectedRow.szCustomerName ??
      "";
    return [
      {
        id: String(seqNum),
        custSeqNo: seqNum,
        name: String(name || "").trim() || `Customer ${seqNum}`,
        role: String(selectedRow.RELATION_TYPE || selectedRow.szRelationType || "Borrower").trim() || "Borrower",
        customerNo: String(selectedRow.LEGACY_CUST_NO ?? selectedRow.szLegacyCustomerNo ?? ""),
      },
    ];
  }

  return [];
}
