import { cI as dayjs, ed as useIntl, eh as useNavigate, ct as ar, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, cs as ap, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { d as CurrencyMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const extractFetchWrapper = (data) => {
  const wrapper = (data == null ? void 0 : data.responseJson) || {};
  return {
    currencyList: wrapper.lstCurrencyDTO || [],
    convOperators: wrapper.lstConversionOperators || []
  };
};
const mapGridRowsFromApi = (currencyList) => {
  if (!currencyList || !Array.isArray(currencyList)) return [];
  return currencyList.map((row) => ({
    ...row,
    dtApplyRate: row.dtApplyRate ? new Date(row.dtApplyRate) : null,
    mode: "E"
    // Existing record
  }));
};
const buildSaveDto = (formDraft, szMode, userCode) => {
  const baseDto = {
    szCurrencyCode: formDraft.szCurrencyCode,
    szCurrencyName: formDraft.szCurrencyName,
    szSymbol: formDraft.szSymbol,
    szAbbreviation: formDraft.szAbbreviation,
    szCountry: formDraft.szCountry,
    dtApplyRate: formDraft.dtApplyRate ? dayjs(formDraft.dtApplyRate).format("YYYY-MM-DD") : null,
    bdRate: formDraft.bdRate == null ? null : Number(formDraft.bdRate),
    chConvOper: formDraft.chConvOper,
    bdBuyingRate: formDraft.bdBuyingRate == null ? null : Number(formDraft.bdBuyingRate),
    bdSellingRate: formDraft.bdSellingRate == null ? null : Number(formDraft.bdSellingRate),
    szMode
  };
  if (szMode === "N") {
    return {
      ...baseDto,
      szCreatedBy: userCode
    };
  } else {
    return {
      ...baseDto,
      szModifiedBy: userCode
    };
  }
};
const getModifiedBy = () => {
  try {
    return sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  } catch {
    return "SYSTEM";
  }
};
const getCurrencyMasterColumnDefs = (intl, convOperatorOptions) => {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.CurrencyCode",
        defaultMessage: "Currency Code "
      }),
      field: "szCurrencyCode",
      editable: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
      },
      width: 120,
      sortable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.CurrencyName",
        defaultMessage: "Currency Name "
      }),
      field: "szCurrencyName",
      editable: true,
      width: 150,
      sortable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Symbol",
        defaultMessage: "Symbol "
      }),
      field: "szSymbol",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Abbreviation",
        defaultMessage: "Abbreviation"
      }),
      field: "szAbbreviation",
      editable: true,
      width: 100,
      sortable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Country",
        defaultMessage: "COUNTRY"
      }),
      field: "szCountry",
      editable: true,
      width: 130,
      sortable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.RateApplyFrom",
        defaultMessage: "Rate Apply From"
      }),
      field: "dtApplyRate",
      editable: true,
      width: 150,
      sortable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MM-YYYY") : "",
      valueParser: (params) => params.newValue ? new Date(params.newValue) : null
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.Rate",
        defaultMessage: "RATE"
      }),
      field: "bdRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue)
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.ConversionOperator",
        defaultMessage: "Conversion Operator"
      }),
      field: "chConvOper",
      width: 160,
      filter: false,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: convOperatorOptions.map((opt) => opt.szCondition)
      },
      valueSetter: (params) => {
        params.data.chConvOper = params.newValue;
        return true;
      },
      valueFormatter: (params) => {
        var _a;
        return ((_a = convOperatorOptions.find(
          (opt) => opt.szCondition === params.value
        )) == null ? void 0 : _a.szDesc) || params.value;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.BuyingRate",
        defaultMessage: "Buying Rate"
      }),
      field: "bdBuyingRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue)
    },
    {
      headerName: intl.formatMessage({
        id: "label.CurrencyMaster.SellingRate",
        defaultMessage: "Selling Rate"
      }),
      field: "bdSellingRate",
      editable: true,
      width: 100,
      sortable: true,
      filter: false,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue)
    }
  ];
};
function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) => String(r.szCurrencyCode ?? "").toLowerCase().includes(q)
    // String(r.szCurrencyName ?? "").toLowerCase().includes(q) ||
    // String(r.szCountry ?? "").toLowerCase().includes(q) ||
    // String(r.szAbbreviation ?? "").toLowerCase().includes(q)
  );
}
function parseOptionalNumber(str) {
  if (str == null || String(str).trim() === "") return { ok: true, value: null };
  const n = Number(str);
  if (!Number.isFinite(n)) {
    return { ok: false };
  }
  return { ok: true, value: n };
}
function validateCurrencyForm(formDraft, intl, options) {
  const { uiMode, existingCodes } = options;
  const code = String(formDraft.szCurrencyCode ?? "").trim();
  const name = String(formDraft.szCurrencyName ?? "").trim();
  const symbol = String(formDraft.szSymbol ?? "").trim();
  if (!code) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.CurrencyCode.mandatory",
        defaultMessage: "Currency code is required."
      })
    };
  }
  if (!name) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.CurrencyName.mandatory",
        defaultMessage: "Currency name is required."
      })
    };
  }
  if (!symbol) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.Symbol.mandatory",
        defaultMessage: "Symbol is required."
      })
    };
  }
  if (uiMode === "new" && existingCodes.has(code.toUpperCase())) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "validation.currencyMaster.duplicateCode",
        defaultMessage: "A currency with this code already exists."
      })
    };
  }
  const rateFields = [
    { key: "bdRate", id: "validation.currencyMaster.invalidRate" },
    { key: "bdBuyingRate", id: "validation.currencyMaster.invalidBuyingRate" },
    { key: "bdSellingRate", id: "validation.currencyMaster.invalidSellingRate" }
  ];
  for (const { key, id } of rateFields) {
    const r = parseOptionalNumber(formDraft[key]);
    if (!r.ok) {
      return {
        ok: false,
        message: intl.formatMessage({
          id,
          defaultMessage: "Enter a valid number."
        })
      };
    }
  }
  return { ok: true };
}
function parseSaveSuccess(res) {
  var _a;
  if (!res) return false;
  if (res.status >= 400) return false;
  const st = (_a = res.data) == null ? void 0 : _a.status;
  if (typeof st === "string" && st.toLowerCase() === "success") return true;
  return res.status === 200 && res.data != null;
}
const CurrencyMaster = () => {
  var _a;
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [allRows, setAllRows] = reactExports.useState([]);
  const [convOperatorOptions, setConvOperatorOptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const columnDefs = reactExports.useMemo(
    () => getCurrencyMasterColumnDefs(intl, convOperatorOptions),
    [intl, intl.locale, convOperatorOptions]
  );
  const filteredRows = reactExports.useMemo(
    () => filterRowsBySearch(allRows, searchQuery),
    [allRows, searchQuery]
  );
  const existingCodes = reactExports.useMemo(
    () => new Set(allRows.map((row) => {
      var _a2;
      return (_a2 = row.szCurrencyCode) == null ? void 0 : _a2.toUpperCase();
    }).filter(Boolean)),
    [allRows]
  );
  const loadCurrencies = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const res = await Kr.GET(CurrencyMasterAPI.currencyMaster(screenMenuId), {});
      if (res.status >= 400) {
        toast.error(
          intl.formatMessage({
            id: "message.CurrencyMaster.FetchFailed",
            defaultMessage: "Failed to fetch currency data"
          })
        );
        setAllRows([]);
        setConvOperatorOptions([]);
        return [];
      }
      const { currencyList, convOperators: ops } = extractFetchWrapper(res.data);
      setConvOperatorOptions(ops || []);
      setAllRows(mapGridRowsFromApi(currencyList || []));
      setLoading(false);
      return currencyList;
    } catch (err) {
      console.error(err);
      setAllRows([]);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);
  const resetToBaseline = reactExports.useCallback(async () => {
    setSearchQuery("");
    await loadCurrencies();
    return { success: true };
  }, [loadCurrencies]);
  const handleGridSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a2, _b, _c, _d;
      const allChanged = [...newRows, ...updatedRows, ...deletedRows];
      if (allChanged.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.currencyMaster.noChanges",
            defaultMessage: "No changes to save."
          })
        );
        return { success: false };
      }
      for (const row of [...newRows, ...updatedRows]) {
        const uiMode = row.mode === "N" ? "new" : "edit";
        const validation = validateCurrencyForm(
          row,
          intl,
          {
            uiMode,
            existingCodes
          }
        );
        if (!validation.ok) {
          return { success: false, message: validation.message };
        }
      }
      const szModifiedBy = getModifiedBy();
      const payload = [
        ...newRows.map((r) => buildSaveDto(r, "N", szModifiedBy)),
        ...updatedRows.map((r) => buildSaveDto(r, "E", szModifiedBy)),
        ...deletedRows.map((r) => buildSaveDto(r, "D", szModifiedBy))
      ];
      try {
        const res = await Kr.POST(CurrencyMasterAPI.currencyMaster(screenMenuId), payload);
        if (res.status >= 400) {
          const data = res.data;
          if ((data == null ? void 0 : data.responseJson) && typeof data.responseJson === "object") {
            handleValidationErrors(intl, toast, data.responseJson);
            return { success: false };
          }
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "message.CurrencyMaster.SaveError",
              defaultMessage: "Error while saving currency"
            })
          );
          return { success: false };
        }
        if (((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.status) === "Failure" && ((_b = res.data) == null ? void 0 : _b.responseJson)) {
          handleValidationErrors(intl, toast, res.data.responseJson);
          return { success: false };
        }
        if (!parseSaveSuccess(res)) {
          toast.error(
            ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.message) || intl.formatMessage({
              id: "message.CurrencyMaster.SaveError",
              defaultMessage: "Error while saving currency"
            })
          );
          return { success: false };
        }
        await loadCurrencies();
        return { success: true };
      } catch (err) {
        console.error(err);
        const data = (_d = err.response) == null ? void 0 : _d.data;
        if ((data == null ? void 0 : data.responseJson) && typeof data.responseJson === "object") {
          handleValidationErrors(intl, toast, data.responseJson);
        } else if (data == null ? void 0 : data.message) {
          toast.error(data.message);
        } else {
          toast.error(
            intl.formatMessage({
              id: "message.CurrencyMaster.SaveError",
              defaultMessage: "Error while saving currency"
            })
          );
        }
        return { success: false };
      }
    },
    [intl, toast, loadCurrencies, existingCodes]
  );
  const handleClose = reactExports.useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);
  const titleText = intl.formatMessage({
    id: "label.CurrencyMaster.title",
    defaultMessage: "Currency Master"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "currency-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "currency-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: titleText }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: "currency-master-description", children: intl.formatMessage({
        id: "label.CurrencyMaster.subtitle",
        defaultMessage: "Maintain currencies, conversion operators, and buying/selling rates against the base currency."
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "currency-master-toolbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "currency-master-search-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "currency-master-search-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        id: "currency-master-search",
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        editable: true,
        placeholder: "label.CurrencyMaster.searchPlaceholder",
        width: "260px"
      }
    ) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "currency-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: filteredRows,
        columnDefs,
        gridStyle: { width: "100%", height: "380px" },
        pagination: true,
        paginationPageSize: 10,
        sort: true,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        globalSearch: false,
        isLoading: loading,
        embeddedInSection: true,
        onSave: handleGridSave
      },
      intl.locale
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: () => {
          var _a2, _b;
          return (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
        },
        onReset: () => resetToBaseline(),
        onClose: handleClose
      }
    )
  ] });
};
export {
  CurrencyMaster as default
};
