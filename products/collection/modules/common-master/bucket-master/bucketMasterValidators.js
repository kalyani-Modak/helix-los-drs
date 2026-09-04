export function validateBucketRows(rows, formatMessage) {
  const errors = [];
  const codes = new Set();

  rows.forEach((row, index) => {
    if (row.mode === "D") return;

    const rowLabel = index + 1;
    const code = (row.szBucketCode ?? "").trim();
    const label = (row.szLabel ?? "").trim();
    const from = Number(row.inFromPeriod ?? 0);
    const to = row.inToPeriod;

    if (!code) {
      errors.push(
        formatMessage({
          id: "error.bucketCode.required",
          defaultMessage: "Bucket Code is required",
        }) + ` (row ${rowLabel})`
      );
    }

    if (!label) {
      errors.push(
        formatMessage({
          id: "error.bucketLabel.required",
          defaultMessage: "Bucket Label is required",
        }) + ` (row ${rowLabel})`
      );
    }

    if (to === null || to === undefined || to === "") {
      errors.push(
        formatMessage({
          id: "error.bucketDaysTo.required",
          defaultMessage: "Delq. Days To is required",
        }) + ` (row ${rowLabel})`
      );
    } else if (Number(to) < from) {
      errors.push(
        formatMessage(
          {
            id: "error.bucketDaysRange.invalid",
            defaultMessage:
              "Delq. Days To ({to}) must be greater than or equal to From ({from})",
          },
          { to: Number(to), from }
        ) + ` (row ${rowLabel})`
      );
    }

    if (code) {
      if (codes.has(code)) {
        errors.push(
          formatMessage(
            {
              id: "error.bucketCode.duplicate",
              defaultMessage: "Duplicate bucket code: {code}",
            },
            { code }
          )
        );
      }
      codes.add(code);
    }
  });

  return errors;
}
