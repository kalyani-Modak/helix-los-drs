import { ed as useIntl, dN as reactExports, ef as useLocation, aX as Kr, ct as ar, eh as useNavigate, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, dK as ps, bH as SE, b0 as Lg, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { a as BucketMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const BUCKET_MODE = {
  NEW: "N",
  EDIT: "E",
  DELETE: "D"
};
const LOGGED_IN_USER = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM" : "SYSTEM";
function mapPortfolioOptions(payload) {
  const list = Array.isArray(payload) ? payload : Array.isArray(payload == null ? void 0 : payload.responseJson) ? payload.responseJson : [];
  return list.filter((item) => item.szActive === "Y").map((item) => ({
    value: item.szPortfolioCode,
    label: `${item.szPortfolioCode} - ${item.szPortfolioDescription}`
  }));
}
function mapBucketRowsFromApi(bucketData) {
  if (!Array.isArray(bucketData)) return [];
  return bucketData.map((item, index) => ({
    key: item.szBucketCode || `temp-${index}`,
    szBucketCode: item.szBucketCode ?? "",
    szBucketDesc: item.szBucketDesc ?? "",
    szLabel: item.szLabel ?? "",
    inFromPeriod: Number(item.inFromPeriod ?? 0),
    inToPeriod: Number(item.inToPeriod ?? 0),
    mode: ""
  })).sort((a, b) => a.inFromPeriod - b.inFromPeriod);
}
function computeAddRowDefaults(rowData) {
  const sorted = [...rowData].sort(
    (a, b) => (a.inFromPeriod ?? 0) - (b.inFromPeriod ?? 0)
  );
  const last = sorted[sorted.length - 1];
  const from = last ? (last.inToPeriod ?? 0) + 1 : 0;
  return {
    key: `new-${Date.now()}-${Math.random()}`,
    szBucketCode: "",
    szBucketDesc: "",
    szLabel: "",
    inFromPeriod: from,
    inToPeriod: from + 30,
    mode: BUCKET_MODE.NEW
  };
}
function normalizeRowForSave(row, mode, rowData) {
  const trimmedCode = (row.szBucketCode ?? "").trim();
  const trimmedDesc = (row.szBucketDesc ?? "").trim() || trimmedCode;
  const trimmedLabel = (row.szLabel ?? "").trim() || trimmedCode;
  let inFromPeriod = Number(row.inFromPeriod ?? 0);
  let inToPeriod = Number(row.inToPeriod ?? 0);
  if (mode === BUCKET_MODE.NEW) {
    const sorted = [...rowData].sort(
      (a, b) => (a.inFromPeriod ?? 0) - (b.inFromPeriod ?? 0)
    );
    const last = sorted.filter((r) => r.key !== row.key).pop();
    inFromPeriod = last ? (last.inToPeriod ?? 0) + 1 : 0;
    if (!inToPeriod || inToPeriod < inFromPeriod) {
      inToPeriod = inFromPeriod + 30;
    }
  }
  return {
    szBucketCode: trimmedCode,
    szBucketDesc: trimmedDesc,
    szLabel: trimmedLabel,
    inFromPeriod,
    inToPeriod,
    szMode: mode
  };
}
function buildSavePayload(portfolio, { newRows = [], updatedRows = [], deletedRows = [] }, rowData) {
  const buckets = [
    ...newRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.NEW, rowData)),
    ...updatedRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.EDIT, rowData)),
    ...deletedRows.map((row) => normalizeRowForSave(row, BUCKET_MODE.DELETE, rowData))
  ];
  return {
    szPortfolioCode: portfolio,
    szUser: LOGGED_IN_USER,
    buckets
  };
}
function parseApiErrorMessages(result, formatMessage) {
  const errorMessages = [];
  if (result.message && result.message !== "Validation Failed") {
    errorMessages.push(result.message);
  }
  if (result.responseJson && typeof result.responseJson === "object") {
    Object.values(result.responseJson).forEach((errorValue) => {
      if (typeof errorValue !== "string") return;
      const match = errorValue.match(/\{([^}]+)\}/);
      if (match) {
        errorMessages.push(
          formatMessage({
            id: match[1],
            defaultMessage: match[1].replace(/\./g, " ")
          })
        );
      } else {
        errorMessages.push(errorValue);
      }
    });
  }
  return [...new Set(errorMessages)];
}
function validateBucketRows(rows, formatMessage) {
  const errors = [];
  const codes = /* @__PURE__ */ new Set();
  rows.forEach((row, index) => {
    if (row.mode === "D") return;
    const rowLabel = index + 1;
    const code = (row.szBucketCode ?? "").trim();
    const label = (row.szLabel ?? "").trim();
    const from = Number(row.inFromPeriod ?? 0);
    const to = row.inToPeriod;
    if (!code) {
      errors.push(
        formatMessage({
          id: "error.bucketCode.required",
          defaultMessage: "Bucket Code is required"
        }) + ` (row ${rowLabel})`
      );
    }
    if (!label) {
      errors.push(
        formatMessage({
          id: "error.bucketLabel.required",
          defaultMessage: "Bucket Label is required"
        }) + ` (row ${rowLabel})`
      );
    }
    if (to === null || to === void 0 || to === "") {
      errors.push(
        formatMessage({
          id: "error.bucketDaysTo.required",
          defaultMessage: "Delq. Days To is required"
        }) + ` (row ${rowLabel})`
      );
    } else if (Number(to) < from) {
      errors.push(
        formatMessage(
          {
            id: "error.bucketDaysRange.invalid",
            defaultMessage: "Delq. Days To ({to}) must be greater than or equal to From ({from})"
          },
          { to: Number(to), from }
        ) + ` (row ${rowLabel})`
      );
    }
    if (code) {
      if (codes.has(code)) {
        errors.push(
          formatMessage(
            {
              id: "error.bucketCode.duplicate",
              defaultMessage: "Duplicate bucket code: {code}"
            },
            { code }
          )
        );
      }
      codes.add(code);
    }
  });
  return errors;
}
function useBucketMaster(toast) {
  const intl = useIntl();
  const [portfolio, setPortfolio] = reactExports.useState("");
  const [portfolioOptions, setPortfolioOptions] = reactExports.useState([]);
  const [rowData, setRowData] = reactExports.useState([]);
  const [originalRowData, setOriginalRowData] = reactExports.useState([]);
  const [isFetched, setIsFetched] = reactExports.useState(false);
  const [fetchedPortfolio, setFetchedPortfolio] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const formatMessage = reactExports.useCallback(
    (descriptor, values) => intl.formatMessage(descriptor, values),
    [intl]
  );
  reactExports.useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const response = await Kr.GET(
          BucketMasterAPI.BucketDetails("EC-PortfolioMaster")
        );
        const options = mapPortfolioOptions((response == null ? void 0 : response.data) || []);
        setPortfolioOptions(options);
        if (options.length > 0) {
          setPortfolio(options[0].value);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          formatMessage({
            id: "error.bucket.portfolio",
            defaultMessage: "Unable to load portfolio options."
          })
        );
      }
    };
    loadPortfolios();
  }, [formatMessage, toast]);
  const handlePortfolioChange = reactExports.useCallback((value) => {
    setPortfolio(value);
    setIsFetched(false);
    setFetchedPortfolio("");
    setRowData([]);
    setOriginalRowData([]);
  }, []);
  const handleFetch = reactExports.useCallback(async () => {
    var _a;
    if (!(portfolio == null ? void 0 : portfolio.trim())) {
      toast.error(
        formatMessage({
          id: "error.portfolioCode.required",
          defaultMessage: "Portfolio Code is required"
        })
      );
      return;
    }
    setLoading(true);
    try {
      const response = await Kr.GET(
        BucketMasterAPI.BucketDetails(screenMenuId) + `?szPortfolioCode=${portfolio}`
      );
      const data = (response == null ? void 0 : response.data) || {};
      if (((_a = data == null ? void 0 : data.status) == null ? void 0 : _a.toLowerCase()) !== "success") {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        setFetchedPortfolio(portfolio);
        if (response.status === 204 || response.status === 406) {
          toast.info(
            formatMessage({
              id: "info.no.bucket.data",
              defaultMessage: "No bucket data found for selected portfolio."
            })
          );
          return;
        }
        if ((data == null ? void 0 : data.responseJson) && typeof data.responseJson === "object") {
          const messages = parseApiErrorMessages(data, formatMessage);
          toast.error(messages.join("\n") || data.message || "Fetch failed");
          return;
        }
        if (data == null ? void 0 : data.errors) {
          handleValidationErrors(intl, toast, data.errors);
          return;
        }
        toast.error((data == null ? void 0 : data.message) || "Fetch failed");
        return;
      }
      const bucketData = (data == null ? void 0 : data.responseJson) || data;
      if (!Array.isArray(bucketData) || bucketData.length === 0) {
        setRowData([]);
        setOriginalRowData([]);
        setIsFetched(true);
        setFetchedPortfolio(portfolio);
        toast.info(
          formatMessage({
            id: "info.no.bucket.data",
            defaultMessage: "No bucket data found for selected portfolio."
          })
        );
        return;
      }
      const mapped = mapBucketRowsFromApi(bucketData);
      setRowData(mapped);
      setOriginalRowData(JSON.parse(JSON.stringify(mapped)));
      setIsFetched(true);
      setFetchedPortfolio(portfolio);
    } catch (error) {
      console.error(error);
      setRowData([]);
      setOriginalRowData([]);
      setIsFetched(false);
      toast.error(
        formatMessage({
          id: "error.bucket.fetch",
          defaultMessage: "Error fetching bucket details"
        })
      );
    } finally {
      setLoading(false);
    }
  }, [portfolio, formatMessage, intl, toast]);
  const handleSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a, _b, _c;
      if (!portfolio || !isFetched || portfolio !== fetchedPortfolio) {
        toast.warn(
          formatMessage({
            id: "error.portfolioCode.fetch",
            defaultMessage: "Please select portfolio and fetch data before saving"
          })
        );
        return;
      }
      if (newRows.length === 0 && updatedRows.length === 0 && deletedRows.length === 0) {
        toast.info(
          formatMessage({
            id: "info.no.changes.save",
            defaultMessage: "No changes to save."
          })
        );
        return;
      }
      const updatedMap = new Map(updatedRows.map((row) => [row.key, row]));
      const deletedMap = new Map(deletedRows.map((row) => [row.key, row]));
      const rowsToValidate = [
        ...rowData.map(
          (row) => deletedMap.get(row.key) || updatedMap.get(row.key) || row
        ),
        ...newRows
      ];
      const validationErrors = validateBucketRows(rowsToValidate, formatMessage);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join("\n"));
        return;
      }
      const finalUpdatedRows = [...updatedRows];
      for (let i = 1; i < rowsToValidate.length; i++) {
        const current = rowsToValidate[i];
        if (current.mode === BUCKET_MODE.DELETE) {
          continue;
        }
        let previous = null;
        for (let j = i - 1; j >= 0; j--) {
          if (rowsToValidate[j].mode !== BUCKET_MODE.DELETE) {
            previous = rowsToValidate[j];
            break;
          }
        }
        if (!previous) continue;
        const expectedFrom = Number(previous.inToPeriod) + 1;
        if (current.inFromPeriod !== expectedFrom) {
          current.inFromPeriod = expectedFrom;
          if (current.mode !== BUCKET_MODE.NEW && !finalUpdatedRows.some((r) => r.key === current.key)) {
            finalUpdatedRows.push(current);
          }
        }
      }
      const payload = buildSavePayload(
        portfolio,
        { newRows, updatedRows: finalUpdatedRows, deletedRows },
        rowsToValidate
      );
      try {
        const response = await Kr.POST(
          BucketMasterAPI.BucketDetails(screenMenuId),
          payload
        );
        const result = (response == null ? void 0 : response.data) || {};
        if (result.status === "Success") {
          let successMessage = formatMessage({
            id: "success.bucket.saved",
            defaultMessage: "Bucket details saved successfully"
          });
          if (result.messageKey) {
            successMessage = formatMessage(
              { id: result.messageKey },
              result.messageParams || {}
            );
          } else if (result.message) {
            successMessage = result.message;
          }
          await handleFetch();
          return { success: true };
        }
        const errorMessages = parseApiErrorMessages(result, formatMessage);
        if (errorMessages.length > 0) {
          toast.error(errorMessages.join("\n"));
        } else {
          toast.error(
            formatMessage({
              id: "error.validation.failed",
              defaultMessage: "Validation failed"
            })
          );
        }
        return { success: false };
      } catch (error) {
        console.error(error);
        const status = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.status;
        const message = ((_c = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || formatMessage({
          id: "error.bucket.save",
          defaultMessage: "Error saving bucket details."
        });
        if (status === 409) {
          toast.error(message);
        } else {
          toast.error(message);
        }
        return { success: false };
      }
    },
    [
      portfolio,
      isFetched,
      fetchedPortfolio,
      rowData,
      formatMessage,
      toast,
      handleFetch
    ]
  );
  const handleAddRow = reactExports.useCallback(
    (newRow) => {
      if (!portfolio || !isFetched || portfolio !== fetchedPortfolio) {
        toast.warn(
          formatMessage({
            id: "info.bucket.fetchBeforeAdd",
            defaultMessage: "Please select a Portfolio and fetch records before adding a new row."
          })
        );
        return null;
      }
      const defaults = computeAddRowDefaults(rowData);
      return {
        ...defaults,
        ...newRow,
        key: (newRow == null ? void 0 : newRow.key) || defaults.key,
        mode: BUCKET_MODE.NEW
      };
    },
    [portfolio, isFetched, fetchedPortfolio, rowData, formatMessage, toast]
  );
  const handleReset = reactExports.useCallback(() => {
    setRowData(JSON.parse(JSON.stringify(originalRowData)));
    return { success: true };
  }, [originalRowData]);
  return {
    portfolio,
    portfolioOptions,
    rowData,
    setRowData,
    loading,
    isFetched,
    handlePortfolioChange,
    handleFetch,
    handleSave,
    handleAddRow,
    handleReset
  };
}
function buildBucketColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketCode",
        defaultMessage: "Bucket Code"
      }),
      field: "szBucketCode",
      flex: 0.7,
      editable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketLabel",
        defaultMessage: "Bucket Label"
      }),
      field: "szLabel",
      flex: 0.8,
      editable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.BucketDescription",
        defaultMessage: "Bucket Description"
      }),
      field: "szBucketDesc",
      flex: 1.5,
      editable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.DaysFrom",
        defaultMessage: "DPD From"
      }),
      field: "inFromPeriod",
      flex: 0.8,
      editable: false,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueGetter: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.inFromPeriod) ?? 0;
      },
      valueFormatter: (params) => {
        const value = params.value;
        return value === null || value === void 0 ? "0" : String(value);
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.BucketMaster.DaysTo",
        defaultMessage: "DPD To"
      }),
      field: "inToPeriod",
      flex: 0.8,
      editable: true,
      filter: false,
      required: true,
      cellEditor: "agNumberCellEditor",
      valueGetter: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.inToPeriod) ?? 0;
      },
      valueFormatter: (params) => {
        const value = params.value;
        return value === null || value === void 0 ? "0" : String(value);
      }
    }
  ];
}
const BucketMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const {
    portfolio,
    portfolioOptions,
    rowData,
    setRowData,
    loading,
    isFetched,
    handlePortfolioChange,
    handleFetch,
    handleSave,
    handleAddRow,
    handleReset
  } = useBucketMaster(toast);
  const columnDefs = reactExports.useMemo(
    () => buildBucketColumnDefs(intl),
    [intl.locale]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "bucket-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "bucket-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { style: { display: "flex", marginBottom: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "bucket.master" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          colon: false,
          align: "left",
          value: intl.formatMessage({
            id: "label.BucketMaster.description",
            defaultMessage: "Categorize accounts by delinquency days (DPD). Each bucket's 'From' is auto-suggested from the previous row."
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "bucket-master-toolbar", children: [
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
          onChange: (e) => handlePortfolioChange(e.target.value),
          options: portfolioOptions,
          width: "180px",
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          id: "bucket-master-fetch",
          label: "label.common.fetch",
          onClick: handleFetch,
          loading,
          disabled: loading,
          style: { minWidth: "150px", height: "30px" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "bucket-master-grid-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "bucket-master-grid-wrapper", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          setRowData,
          columnDefs,
          gridStyle: { width: "100%", height: "50vh", minHeight: "360px" },
          pagination: true,
          paginationPageSize: 10,
          globalSearch: false,
          allowAdd: isFetched,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleSave,
          onAddRow: handleAddRow,
          getRowId: (params) => params.data.key,
          overlayNoRowsTemplate: `<span>
            ${!isFetched ? intl.formatMessage({ id: "label.agGrid.fetch", defaultMessage: "Please click Fetch to load records" }) : intl.formatMessage({ id: "label.agGrid.noData", defaultMessage: "No Data To Show" })}
            </span>`
        },
        `${intl.locale}-${isFetched}`
      ) }),
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
  BucketMaster as default
};
