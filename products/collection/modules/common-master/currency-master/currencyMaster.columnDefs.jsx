import dayjs from "dayjs";

export const getCurrencyMasterColumnDefs = (intl, convOperatorOptions) => {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.CurrencyCode",
        defaultMessage: "Currency Code ",
      }),
      field: "szCurrencyCode",
      editable: (params) => params.data?.mode === "N",
      width: 120,
      sortable: true,
      filter: false,
      required:true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.CurrencyName",
        defaultMessage: "Currency Name ",
      }),
      field: "szCurrencyName",
      editable: true,
      width: 150,
      sortable: true,
      filter: false,
      required:true
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Symbol",
        defaultMessage: "Symbol ",
      }),
      field: "szSymbol",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      required:true
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Abbreviation",
        defaultMessage: "Abbreviation",
      }),
      field: "szAbbreviation",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Country",
        defaultMessage: "COUNTRY",
      }),
      field: "szCountry",
      editable: true,
      width: 130,
      sortable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.RateApplyFrom",
        defaultMessage: "Rate Apply From",
      }),
      field: "dtApplyRate",
      editable: true,
      width: 150,
      sortable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MM-YYYY") : "",
      valueParser: (params) =>
        params.newValue ? new Date(params.newValue) : null,
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Rate",
        defaultMessage: "RATE",
      }),
      field: "bdRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) =>
        params.newValue === "" || params.newValue == null
          ? null
          : Number(params.newValue),
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.ConversionOperator",
        defaultMessage: "Conversion Operator",
      }),
      field: "chConvOper",
      width: 160,
      filter: false,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: convOperatorOptions.map((opt) => opt.szCondition),
      },
      valueSetter: (params) => {
        params.data.chConvOper = params.newValue;
        return true;
      },
      valueFormatter: (params) =>
        convOperatorOptions.find(
          (opt) => opt.szCondition === params.value
        )?.szDesc || params.value,
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.BuyingRate",
        defaultMessage: "Buying Rate",
      }),
      field: "bdBuyingRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) =>
        params.newValue === "" || params.newValue == null
          ? null
          : Number(params.newValue),
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.SellingRate",
        defaultMessage: "Selling Rate",
      }),
      field: "bdSellingRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) =>
        params.newValue === "" || params.newValue == null
          ? null
          : Number(params.newValue),
    },
  ];
};