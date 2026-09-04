/**
 * Normalizes API mail / correspondence rows for Return Mail Tracking grid and forms.
 * Tolerates MailCorrespondenceHistoryDto names and future extended snake/camel variants.
 * @param {Record<string, unknown>} raw
 * @returns {object} normalized mail row for grid + forms
 */
export function normalizeMailRow(raw) {
  if (!raw || typeof raw !== "object") {
    return emptyRow();
  }

  const yn = (v) => {
    if (v === true) return "Y";
    if (v === false) return "N";
    const s = String(v ?? "").trim().toUpperCase();
    if (s === "Y" || s === "YES" || s === "1" || s === "TRUE") return "Y";
    if (s === "N" || s === "NO" || s === "0" || s === "FALSE") return "N";
    return s ? s.charAt(0) : "N";
  };

  const mailSeqNo =
    raw.mailSeqNo ??
    raw.iMailSeqNo ??
    raw.inMailSeqNo ??
    raw.MAIL_SEQ_NO ??
    raw.mail_seq_no ??
    null;

  const dtSent =
    raw.dtSent ??
    raw.dtMailGenerate ??
    raw.szDtSent ??
    raw.DT_SENT ??
    "";

  const mailCode =
    raw.mailDesc ??
    raw.szMailCode ??
    raw.mailCode ??
    raw.MAIL_CODE ??
    "";

  const mailType = raw.mailType ?? raw.szSendThru ?? raw.chMailType ?? raw.MAIL_TYPE ?? "";

  const sendTo = raw.sendTo ?? raw.SEND_TO ?? "";
  const contact = raw.contact ?? raw.CONTACT ?? "";
  const status = raw.status ?? raw.chStatus ?? raw.STATUS ?? "";
  const returned = yn(raw.returned ?? raw.chMailReturned ?? raw.RETURNED);
  const badMarked = yn(raw.badMarked ?? raw.chBadMarkedYn ?? raw.chBadMarkedYN ?? raw.BAD_MARKED);

  const returnDateRaw =
    raw.returnDate ??
    raw.dtMailReturned ??
    raw.DT_MAIL_RETURNED ??
    raw.szReturnDate ??
    "";

  const returnReason =
    raw.returnReason ?? raw.szMailReturnReason ?? raw.MAIL_RETURN_REASON ?? raw.return_reason ?? "";

  const feeAmount = raw.feeAmount ?? raw.bdFeeAmount ?? raw.FEE_AMOUNT ?? "";
  const notes = raw.notes ?? raw.szNotes ?? raw.NOTES ?? "";

  const address1 = raw.szAddress1 ?? raw.address1 ?? raw.ADDRESS1 ?? "";
  const address2 = raw.szAddress2 ?? raw.address2 ?? "";
  const address3 = raw.szAddress3 ?? raw.address3 ?? "";
  const address4 = raw.szAddress4 ?? raw.address4 ?? "";
  const city = raw.szCity ?? raw.city ?? "";
  const state = raw.szState ?? raw.state ?? "";
  const zip = raw.szZip ?? raw.zip ?? "";
  const area = raw.szArea ?? raw.area ?? "";

  return {
    mailSeqNo,
    dtSent: String(dtSent),
    mailCode: String(mailCode),
    mailType: String(mailType),
    sendTo: String(sendTo),
    contact: String(contact),
    status: String(status),
    returned,
    badMarked,
    returnDate: formatDateForPicker(returnDateRaw),
    returnReason: String(returnReason),
    feeAmount: String(feeAmount),
    notes: String(notes),
    address1: String(address1),
    address2: String(address2),
    address3: String(address3),
    address4: String(address4),
    city: String(city),
    state: String(state),
    zip: String(zip),
    area: String(area),
    _raw: raw,
  };
}

function formatDateForPicker(v) {
  if (v == null || v === "") return "";
  if (typeof v === "string") {
    const d = v.trim();
    if (d.length >= 10 && d.charAt(4) === "-" && d.charAt(7) === "-") {
      return d.slice(0, 10);
    }
    return d;
  }
  return String(v);
}

function emptyRow() {
  return {
    mailSeqNo: null,
    dtSent: "",
    mailCode: "",
    mailType: "",
    sendTo: "",
    contact: "",
    status: "",
    returned: "N",
    badMarked: "N",
    returnDate: "",
    returnReason: "",
    feeAmount: "",
    notes: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    city: "",
    state: "",
    zip: "",
    area: "",
    _raw: {},
  };
}
