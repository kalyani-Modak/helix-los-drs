/**
 * @param {(opts: { id: string; defaultMessage?: string }) => string} formatMessage
 */
export function buildPhaseMasterColumnDefs(formatMessage) {
  return [
    {
      headerName: formatMessage({
        id: "label.PhaseMaster.Code",
        defaultMessage: "Code",
      }),
      field: "szCondition",
      required: true,
      width: 180,
      editable: true,
      filter: false,
      sortable: true,
    },
    {
      headerName: formatMessage({
        id: "label.PhaseMaster.Description",
        defaultMessage: "Description",
      }),
      field: "szDescription",
      flex: 1,
      minWidth: 220,
      required: true,
      editable: true,
      filter: false,
      sortable: true,
    },
  ];
}
