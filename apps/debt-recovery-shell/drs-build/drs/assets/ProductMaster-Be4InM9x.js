import { ed as useIntl, dB as jsxRuntimeExports, ac as Dt, dK as ps, bH as SE, b0 as Lg, bt as PropTypes, aX as Kr, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, cx as bp, ep as vp, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { j as ProductMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const ProductMasterToolbar = ({
  portfolio,
  portfolioOptions,
  onPortfolioChange,
  onFetch,
  loading = false
}) => {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "product-master-toolbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.ProductMaster.portfolio",
          defaultMessage: "Portfolio Code"
        }),
        sx: { whiteSpace: "nowrap" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SE,
      {
        name: "portfolio",
        value: portfolio,
        onChange: onPortfolioChange,
        options: portfolioOptions,
        width: "180px",
        required: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Lg,
      {
        id: "productMasterFetch",
        label: "label.common.fetch",
        onClick: onFetch,
        disabled: loading,
        loading,
        style: { minWidth: "150px", height: "30px" }
      }
    )
  ] });
};
ProductMasterToolbar.propTypes = {
  portfolio: PropTypes.string.isRequired,
  portfolioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  ).isRequired,
  onPortfolioChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
const buildProductMasterColumnDefs = ({
  intl,
  groupTypeOptions,
  groupCategoryOptions,
  translate
}) => [
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Product Code",
      defaultMessage: "Product Code"
    }),
    field: "szProductCode",
    editable: (params) => {
      var _a;
      return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
    },
    required: true,
    flex: 0.8,
    headerClass: "drs-delight-header"
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Description",
      defaultMessage: "Description"
    }),
    field: "szProductDescription",
    editable: true,
    required: true,
    flex: 1.6,
    headerClass: "drs-delight-header"
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Type",
      defaultMessage: "Type"
    }),
    field: "szProductType",
    editable: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: groupTypeOptions.map((o) => o.code)
    },
    valueFormatter: (params) => {
      const opt = groupTypeOptions.find((o) => o.code === params.value);
      return opt ? translate(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Category",
      defaultMessage: "Category"
    }),
    field: "szProductCategory",
    editable: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: groupCategoryOptions.map((o) => o.code)
    },
    valueFormatter: (params) => {
      const opt = groupCategoryOptions.find((o) => o.code === params.value);
      return opt ? translate(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.INT",
      defaultMessage: "INT %"
    }),
    field: "flDefaultInterestRate",
    editable: true,
    required: false,
    flex: 0.6,
    headerClass: "drs-delight-header",
    valueParser: (params) => {
      if (params.newValue === "" || params.newValue === null || params.newValue === void 0) {
        return null;
      }
      return Number(params.newValue);
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.INT DAYS",
      defaultMessage: "INT DAYS"
    }),
    field: "inInterestDaysInYear",
    editable: true,
    required: true,
    flex: 0.6,
    headerClass: "drs-delight-header",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => {
      if (params.newValue === "" || params.newValue === null || params.newValue === void 0) {
        return null;
      }
      return Number(params.newValue);
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.ProductMaster.Prov",
      defaultMessage: "Prov %"
    }),
    field: "flProvisionPercentage",
    editable: true,
    required: true,
    flex: 0.8,
    headerClass: "drs-delight-header",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => {
      if (params.newValue === "" || params.newValue === null || params.newValue === void 0) {
        return null;
      }
      return Number(params.newValue);
    }
  }
];
const PRODUCT_MASTER_GRID_CLASS = "drs-list-grid ag-theme-alpine product-master-grid";
const normalizeLookupOption = (item) => ({
  code: item.szCondition ?? "",
  desc: item.szi18nDesc || item.szCondition || ""
});
const mapProductRowsFromApi = (productData = []) => productData.map((item, index) => ({
  key: item.szProductCode || `row-${index}`,
  szProductCode: item.szProductCode ?? "",
  szProductDescription: item.szProductDescription ?? "",
  szProductType: item.szProductType ?? "",
  szProductCategory: item.szProductCategory ?? "",
  inInterestDaysInYear: item.inInterestDaysInYear ?? null,
  flProvisionPercentage: item.flProvisionPercentage ?? null,
  flDefaultInterestRate: item.flDefaultInterestRate ?? null,
  mode: ""
}));
const mapPortfolioOptions = (payload = []) => payload.filter((item) => item.szActive === "Y").map((item) => ({
  value: item.szPortfolioCode,
  label: `${item.szPortfolioCode} - ${item.szPortfolioDescription}`
}));
const normalizePortfolioPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data == null ? void 0 : data.responseJson)) return data.responseJson;
  return [];
};
const buildSavePayload = ({
  portfolioCode,
  user,
  newRows = [],
  updatedRows = [],
  deletedRows = []
}) => {
  const products = [
    ...newRows.map((r) => ({ ...r, szMode: "N" })),
    ...updatedRows.map((r) => ({ ...r, szMode: "E" })),
    ...deletedRows.map((r) => ({ ...r, szMode: "D" }))
  ].map((r) => ({
    szProductCode: r.szProductCode,
    szProductDescription: r.szProductDescription,
    szProductType: r.szProductType,
    szProductCategory: r.szProductCategory,
    flDefaultInterestRate: r.flDefaultInterestRate,
    inInterestDaysInYear: r.inInterestDaysInYear,
    flProvisionPercentage: r.flProvisionPercentage,
    szMode: r.szMode
  }));
  return {
    szPortfolioCode: portfolioCode,
    szUser: user,
    products
  };
};
const findDuplicateProductCodes = (rows = []) => {
  const seen = /* @__PURE__ */ new Set();
  const duplicates = /* @__PURE__ */ new Set();
  rows.forEach((row) => {
    const code = (row.szProductCode || "").trim();
    if (!code) return;
    if (seen.has(code)) duplicates.add(code);
    seen.add(code);
  });
  return [...duplicates];
};
const LOGGED_IN_USER = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM" : "SYSTEM";
const fetchPortfolioOptions = async (screenMenuId) => {
  const res = await Kr.GET(ProductMasterAPI.fetchPortfolioDetails(screenMenuId));
  const payload = normalizePortfolioPayload(res == null ? void 0 : res.data);
  return mapPortfolioOptions(payload);
};
const fetchInitialData = async (screenMenuId) => {
  const res = await Kr.GET(ProductMasterAPI.ProductDetails(screenMenuId) + `/fetchInitialData`);
  return res == null ? void 0 : res.data;
};
const fetchProductDetails = async (szPortfolioCode, screenMenuId) => {
  const res = await Kr.GET(ProductMasterAPI.ProductDetails(screenMenuId) + `?szPortfolioCode=${szPortfolioCode}`);
  return res == null ? void 0 : res.data;
};
const saveProductDetails = async ({
  portfolioCode,
  screenMenuId,
  newRows,
  updatedRows,
  deletedRows,
  user = LOGGED_IN_USER
}) => {
  const payload = buildSavePayload({
    portfolioCode,
    user,
    newRows,
    updatedRows,
    deletedRows
  });
  const res = await Kr.POST(ProductMasterAPI.ProductDetails(screenMenuId), payload);
  return res == null ? void 0 : res.data;
};
const ProductMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [portfolio, setPortfolio] = reactExports.useState("");
  const [portfolioOptions, setPortfolioOptions] = reactExports.useState([]);
  const [rowData, setRowData] = reactExports.useState([]);
  const [originalRowData, setOriginalRowData] = reactExports.useState([]);
  const [isFetched, setIsFetched] = reactExports.useState(false);
  const [groupTypeOptions, setGroupTypeOptions] = reactExports.useState([]);
  const [groupCategoryOptions, setGroupCategoryOptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const translate = reactExports.useCallback(
    (key) => key ? intl.formatMessage({ id: key, defaultMessage: key }) : "",
    [intl]
  );
  reactExports.useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const options = await fetchPortfolioOptions("EC-PortfolioMaster");
        setPortfolioOptions(options);
        if (options.length > 0) {
          setPortfolio(options[0].value);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.fetch",
            defaultMessage: "Unable to load portfolio options."
          })
        );
      }
    };
    loadPortfolios();
  }, [intl, toast]);
  const columnDefs = reactExports.useMemo(
    () => buildProductMasterColumnDefs({
      intl,
      groupTypeOptions,
      groupCategoryOptions,
      translate
    }),
    [intl, groupTypeOptions, groupCategoryOptions, translate]
  );
  const handlePortfolioChange = (e) => {
    setPortfolio(e.target.value);
    setIsFetched(false);
    setRowData([]);
    setOriginalRowData([]);
    setTimeout(() => {
      var _a, _b, _c, _d;
      (_b = (_a = gridRef.current) == null ? void 0 : _a.api) == null ? void 0 : _b.hideOverlay();
      (_d = (_c = gridRef.current) == null ? void 0 : _c.api) == null ? void 0 : _d.showNoRowsOverlay();
    }, 0);
  };
  const handleFetch = async () => {
    if (!(portfolio == null ? void 0 : portfolio.trim())) {
      toast.error(
        intl.formatMessage({
          id: "error.portfolioCode.required",
          defaultMessage: "Portfolio Code is required"
        })
      );
      return;
    }
    try {
      setLoading(true);
      const result = await fetchProductDetails(portfolio, screenMenuId);
      const productData = (result == null ? void 0 : result.responseJson) || [];
      if (!productData.length) {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        return;
      }
      const mappedRows = mapProductRowsFromApi(productData);
      setRowData(mappedRows);
      setOriginalRowData(mappedRows);
      setIsFetched(true);
    } catch (error) {
      console.error(error);
      setIsFetched(false);
      setRowData([]);
      setOriginalRowData([]);
      toast.error(
        intl.formatMessage({
          id: "error.product.fetch",
          defaultMessage: "Error fetching product details."
        })
      );
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    const loadInitialData = async () => {
      var _a, _b;
      try {
        const result = await fetchInitialData(screenMenuId);
        setGroupTypeOptions((((_a = result == null ? void 0 : result.responseJson) == null ? void 0 : _a.PRODUCTTYPE) || []).map(normalizeLookupOption));
        setGroupCategoryOptions((((_b = result == null ? void 0 : result.responseJson) == null ? void 0 : _b.PRODUCTCATEGORY) || []).map(normalizeLookupOption));
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "error.initial.fetch",
            defaultMessage: "Unable to load lookup data."
          })
        );
      }
    };
    loadInitialData();
  }, [intl, toast]);
  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    setRowData(
      (prev) => prev.map(
        (row) => row.key === data.key ? {
          ...row,
          [colDef.field]: newValue,
          mode: row.mode !== "N" ? "E" : row.mode
        } : row
      )
    );
  };
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    var _a;
    if (!portfolio || !isFetched) {
      toast.warn(
        intl.formatMessage({
          id: "error.portfolioCode.fetch",
          defaultMessage: "Please select portfolio and fetch data before saving"
        })
      );
      return;
    }
    if (![...newRows, ...updatedRows, ...deletedRows].length) {
      toast.info(
        intl.formatMessage({
          id: "info.no.changes.save",
          defaultMessage: "No changes to save."
        })
      );
      return;
    }
    const allActiveRows = [...rowData, ...newRows].filter(
      (r) => !deletedRows.some((d) => d.key === r.key)
    );
    const duplicates = findDuplicateProductCodes(allActiveRows);
    if (duplicates.length > 0) {
      toast.error(
        intl.formatMessage(
          {
            id: "validation.product.duplicate",
            defaultMessage: "Duplicate product code: {code}"
          },
          { code: duplicates.join(", ") }
        )
      );
      return { success: false };
    }
    try {
      const result = await saveProductDetails({
        portfolioCode: portfolio,
        screenMenuId,
        newRows,
        updatedRows,
        deletedRows
      });
      if ((result == null ? void 0 : result.status) === "Success") {
        await handleFetch();
        return { success: true };
      }
      if ((_a = result == null ? void 0 : result.responseJson) == null ? void 0 : _a["products[0].szProductCode"]) {
        toast.error(
          intl.formatMessage({
            id: "error.prdCode.required",
            defaultMessage: "Product is required"
          })
        );
        return { success: false };
      }
      toast.error(
        (result == null ? void 0 : result.message) || intl.formatMessage({ id: "error.product.save", defaultMessage: "Save failed" })
      );
      return { success: false };
    } catch (error) {
      console.error(error);
      toast.error(
        intl.formatMessage({
          id: "error.product.save",
          defaultMessage: "Error saving product details."
        })
      );
      return { success: false };
    }
  };
  const handleAddRow = (newRow) => {
    if (!portfolio || !isFetched) {
      toast.warn(
        intl.formatMessage({
          id: "info.product.fetchBeforeAdd",
          defaultMessage: "Please select a Portfolio and fetch records before adding a new row."
        })
      );
      return null;
    }
    return {
      ...newRow,
      key: newRow.key || `new-${Date.now()}-${Math.random()}`,
      mode: "N"
    };
  };
  const handleReset = () => {
    setRowData([...originalRowData]);
    return { success: true };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "product-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { style: { display: "flex", marginBottom: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.ProductMaster.title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({ id: "label.ProductMaster.titleDesc", defaultMessage: "Define individual loan products under each portfolio" }),
          align: "left",
          colon: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "product-master-grid-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductMasterToolbar,
        {
          portfolio,
          portfolioOptions,
          onPortfolioChange: handlePortfolioChange,
          onFetch: handleFetch,
          loading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridClassName: PRODUCT_MASTER_GRID_CLASS,
          gridStyle: { width: "100%", height: "55vh", minHeight: "360px" },
          embeddedInSection: true,
          pagination: true,
          paginationPageSize: 10,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleSave,
          onAddRow: handleAddRow,
          onCellValueChanged: handleCellEdit,
          getRowId: (params) => params.data.key,
          isLoading: loading,
          hideInternalSaveButton: true,
          overlayNoRowsTemplate: `<span>
            ${!isFetched ? intl.formatMessage({ id: "label.agGrid.fetch", defaultMessage: "Please click Fetch to load records" }) : intl.formatMessage({ id: "label.agGrid.noData", defaultMessage: "No Data To Show" })}
            </span>`
        },
        intl.locale
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onReset: handleReset,
          onClose: () => navigate("/homelayout/welcomepage")
        }
      )
    ] })
  ] });
};
export {
  ProductMaster as default
};
