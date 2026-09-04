import { BUCKET_MODE, LOGGED_IN_USER } from "./bucketMasterConstants";

export function mapPortfolioOptions(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.responseJson)
      ? payload.responseJson
      : [];

  return list
    .filter((item) => item.szActive === "Y")
    .map((item) => ({
      value: item.szPortfolioCode,
      label: `${item.szPortfolioCode} - ${item.szPortfolioDescription}`,
    }));
}

export function mapBucketRowsFromApi(bucketData) {
  if (!Array.isArray(bucketData)) return [];

  return bucketData
    .map((item, index) => ({
      key: item.szBucketCode || `temp-${index}`,
      szBucketCode: item.szBucketCode ?? "",
      szBucketDesc: item.szBucketDesc ?? "",
      szLabel: item.szLabel ?? "",
      inFromPeriod: Number(item.inFromPeriod ?? 0),
      inToPeriod: Number(item.inToPeriod ?? 0),
      mode: "",
    }))
    .sort((a, b) => a.inFromPeriod - b.inFromPeriod);
}

export function computeAddRowDefaults(rowData) {
  const sorted = [...rowData].sort(
    (a, b) => (a.inFromPeriod ?? 0) - (b.inFromPeriod ?? 0)
  );
  const last = sorted[sorted.length - 1];
  const from = last ? (last.inToPeriod ?? 0) + 1 : 0;

  return {
    key: `new-${Date.now()}-${Math.random()}`,
    szBucketCode: "",
    szBucketDesc: "",
    szLabel: "",
    inFromPeriod: from,
    inToPeriod: from + 30,
    mode: BUCKET_MODE.NEW,
  };
}

function normalizeRowForSave(row, mode, rowData) {
  const trimmedCode = (row.szBucketCode ?? "").trim();
  const trimmedDesc = (row.szBucketDesc ?? "").trim() || trimmedCode;
  const trimmedLabel = (row.szLabel ?? "").trim() || trimmedCode;

  let inFromPeriod = Number(row.inFromPeriod ?? 0);
  let inToPeriod = Number(row.inToPeriod ?? 0);

  if (mode === BUCKET_MODE.NEW) {
    const sorted = [...rowData].sort(
      (a, b) => (a.inFromPeriod ?? 0) - (b.inFromPeriod ?? 0)
    );
    const last = sorted.filter((r) => r.key !== row.key).pop();
    inFromPeriod = last ? (last.inToPeriod ?? 0) + 1 : 0;
    if (!inToPeriod || inToPeriod < inFromPeriod) {
      inToPeriod = inFromPeriod + 30;
    }
  }

  return {
    szBucketCode: trimmedCode,
    szBucketDesc: trimmedDesc,
    szLabel: trimmedLabel,
    inFromPeriod,
    inToPeriod,
    szMode: mode,
  };
}

export function buildSavePayload(portfolio, { newRows = [], updatedRows = [], deletedRows = [] }, rowData) {
  const buckets = [
    ...newRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.NEW, rowData)),
    ...updatedRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.EDIT, rowData)),
    ...deletedRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.DELETE, rowData)),
  ];

  return {
    szPortfolioCode: portfolio,
    szUser: LOGGED_IN_USER,
    buckets,
  };
}

export function parseApiErrorMessages(result, formatMessage) {
  const errorMessages = [];

  if (result.message && result.message !== "Validation Failed") {
    errorMessages.push(result.message);
  }

  if (result.responseJson && typeof result.responseJson === "object") {
    Object.values(result.responseJson).forEach((errorValue) => {
      if (typeof errorValue !== "string") return;
      const match = errorValue.match(/\{([^}]+)\}/);
      if (match) {
        errorMessages.push(
          formatMessage({
            id: match[1],
            defaultMessage: match[1].replace(/\./g, " "),
          })
        );
      } else {
        errorMessages.push(errorValue);
      }
    });
  }

  return [...new Set(errorMessages)];
}
