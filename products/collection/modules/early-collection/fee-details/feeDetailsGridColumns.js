/**
 * @param {import("@mui/material").Theme} theme
 * @param {import("react-intl").IntlShape} intl
 */
export function buildWaiveColumnDefs(theme, intl) {
  const right = { textAlign: "right", fontVariantNumeric: "tabular-nums" };
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  return [
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Payment Head" }),
      field: "PaymentHead",
      flex: 1,
      editable: false,
      minWidth: 120,
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Paid" }),
      field: "Paid",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: theme.palette.text.primary }),
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Waived" }),
      field: "Waived",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: success, fontWeight: 600 }),
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Overdue" }),
      field: "Overdue",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: error, fontWeight: 600 }),
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Not Yet Due" }),
      field: "NotYetDue",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: theme.palette.text.primary }),
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Pending Requests" }),
      field: "PendingRequests",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: warning, fontWeight: 600 }),
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Waive Now" }),
      field: "WaiveNow",
      flex: 1,
      editable: true,
      cellStyle: () => right,
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Reason" }),
      field: "Reason",
      flex: 1,
      editable: true,
    },
  ];
}
