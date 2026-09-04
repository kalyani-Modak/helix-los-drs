export function getBlockcodeMasterColumnDefs(intl) {
    return [ 
         {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.BlockCode",
        defaultMessage: "Block Code",
      }),
      field: "szBlockCode",
      flex :0.45,
      filter: false,
      required: true,
      editable: (params) =>
        params.data?.mode === "N" || params.data?.szMode === "N",
    },
    {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.Description",
        defaultMessage: "Block Code Description",
      }),
      field: "szBlockDesc",
      editable: true,
     flex :1,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.Active",
        defaultMessage: "Active",
      }),
      field: "chActiveYn",
      flex :0.25,
      editable: true,
      filter: false,
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      valueGetter: (params) => params.data.chActiveYn === "Y",
      valueSetter: (params) => {
        params.data.chActiveYn = params.newValue ? "Y" : "N";
        return true;
      },
    },
    ];
}