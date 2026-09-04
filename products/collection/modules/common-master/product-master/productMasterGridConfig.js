export const buildProductMasterColumnDefs = ({
  intl,
  groupTypeOptions,
  groupCategoryOptions,
  translate,
}) => [
    {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Product Code",
      defaultMessage: "Product Code",
    }),
    field: "szProductCode",
    editable: (params) => params.data?.mode === "N",
    required: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Description",
      defaultMessage: "Description",
    }),
    field: "szProductDescription",
    editable: true,
    required: true,
    flex: 1.6,
    headerClass: "drs-delight-header",
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Type",
      defaultMessage: "Type",
    }),
    field: "szProductType",
    editable: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: groupTypeOptions.map((o) => o.code),
    },
    valueFormatter: (params) => {
      const opt = groupTypeOptions.find((o) => o.code === params.value);
      return opt ? translate(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Category",
      defaultMessage: "Category",
    }),
    field: "szProductCategory",
    editable: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: groupCategoryOptions.map((o) => o.code),
    },
    valueFormatter: (params) => {
      const opt = groupCategoryOptions.find((o) => o.code === params.value);
      return opt ? translate(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.INT",
      defaultMessage: "INT %",
    }),
    field: "flDefaultInterestRate",
    editable: true,
    required: false,
    flex: 0.6,
    headerClass: "drs-delight-header",
    valueParser: (params) => {
      if (params.newValue === "" || params.newValue === null || params.newValue === undefined) {
        return null;
      }

      return Number(params.newValue);
     },
   },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.INT DAYS",
      defaultMessage: "INT DAYS",
    }),
    field: "inInterestDaysInYear",
    editable: true,
    required: true,
    flex: 0.6,
    headerClass: "drs-delight-header",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => {
        if ( params.newValue === "" ||params.newValue === null || params.newValue === undefined) {
          return null;
        }

        return Number(params.newValue);
      },
    },
    {
      headerName: intl.formatMessage({
      id: "label.ProductMaster.Prov",
      defaultMessage: "Prov %",
    }),
    field: "flProvisionPercentage",
    editable: true,
    required: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => {
        if (params.newValue === "" || params.newValue === null || params.newValue === undefined) {
          return null;
        }

        return Number(params.newValue);
      },
    },
];

export const PRODUCT_MASTER_GRID_CLASS = "drs-list-grid ag-theme-alpine product-master-grid";
