/**
 * @param {(opts: { id: string; defaultMessage?: string }) => string} formatMessage
 */
export function buildActionTypeMasterColumnDefs(formatMessage) {
  return [
    {
      headerName: formatMessage({
        id: "label.ActionTypeMaster.Code",
        defaultMessage: "Code",
      }),
      field: "szCondition",
      width: 180,
      editable: (params) => params.data?.mode === "N",
      filter: false,
      sortable: true,
    },
    {
      headerName: formatMessage({
        id: "label.ActionTypeMaster.Description",
        defaultMessage: "Description",
      }),
      field: "szDescription",
      flex: 1,
      minWidth: 220,
      editable: true,
      filter: false,
      sortable: true,
    },
  ];
}
