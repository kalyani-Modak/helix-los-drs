import dayjs from "dayjs";

export function formatLocalDateForApi(value) {
  if (value == null) return null;
  const d = dayjs.isDayjs(value) ? value : dayjs(value);
  if (!d.isValid()) return null;
  return d.format("YYYY-MM-DD");
}

/**
 * @param {object} row - normalized pickup maintenance row from component state
 */
export function buildPickupMaintenanceUpdatePayload(row) {
  const rawAmt = row.bdVisitForAmt != null ? String(row.bdVisitForAmt).trim() : "";
  const amt = rawAmt === "" ? null : Number(rawAmt.replace(/,/g, ""));
  return {
    pickUpVisitMaintenanceDto: {
      lnActivitySeqNo: row.lnActivitySeqNo,
      szCompleted: row.szCompleted === "" || row.szCompleted == null ? null : row.szCompleted,
      szRemarks: row.szRemarks ?? "",
      szVisitFor: row.szVisitFor ?? "",
      szContactPerson: row.szContactPerson ?? "",
      bdVisitForAmt: Number.isFinite(amt) ? amt : null,
      dtVisitDate: formatLocalDateForApi(row.dtVisitDate),
      szVisitedBy: row.szVisitedBy ?? "",
      dtActivity: formatLocalDateForApi(row.dtActivity) ?? undefined,
    },
  };
}
