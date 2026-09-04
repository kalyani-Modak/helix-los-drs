export function buildBucketColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketCode",
        defaultMessage: "Bucket Code",
      }),
      field: "szBucketCode",
      flex: 0.7,
      editable: true,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketLabel",
        defaultMessage: "Bucket Label",
      }),
      field: "szLabel",
      flex: 0.8,
      editable: true,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketDescription",
        defaultMessage: "Bucket Description",
      }),
      field: "szBucketDesc",
      flex: 1.5,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.DaysFrom",
        defaultMessage: "DPD From",
      }),
      field: "inFromPeriod",
      flex: 0.8,
      editable: false,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueGetter: (params) => params.data?.inFromPeriod ?? 0,
      valueFormatter: (params) => {
        const value = params.value;
        return value === null || value === undefined ? "0" : String(value);
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.DaysTo",
        defaultMessage: "DPD To",
      }),
      field: "inToPeriod",
      flex: 0.8,
      editable: true,
      filter: false,
      required: true,
      cellEditor: "agNumberCellEditor",
      valueGetter: (params) => params.data?.inToPeriod ?? 0,
      valueFormatter: (params) => {
        const value = params.value;
        return value === null || value === undefined ? "0" : String(value);
      },
    },
  ];
}
