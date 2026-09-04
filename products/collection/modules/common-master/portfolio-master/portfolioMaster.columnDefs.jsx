export function getPortfolioMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.PortfolioCode",
        defaultMessage: "Portfolio Code",
      }),
      field: "code",
      flex: 0.45,
      editable: false,
      sortable: true,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.Description",
        defaultMessage: "Description",
      }),
      field: "description",
      flex: 1,
      editable: true,
      required: true,
      sortable: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.Active",
        defaultMessage: "Active",
      }),
      field: "active",
      flex: 0.25,
      editable: true,
      sortable: true,
      cellRenderer: "agCheckboxCellRenderer",
    },
  ];
}
