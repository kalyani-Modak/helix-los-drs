export function getGlobalStatesMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.GlobalStatesMaster.stateCode",
        defaultMessage: "State",
      }),
      field: "szStateCode",
      width: 200,
      minWidth: 160,
      filter: false,
      required: true,
      sortable: true,
      editable: (params) =>
        params.data?.mode === "N" || params.data?.szMode === "N",
      valueSetter: (params) => {
        params.data.szStateCode = (params.newValue || "").toUpperCase();
        return true;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.GlobalStatesMaster.description",
        defaultMessage: "Description",
      }),
      field: "szDesc",
      flex: 1,
      minWidth: 200,
      editable: true,
      filter: false,
      required: true,
      sortable: true,
    },
  ];
}
