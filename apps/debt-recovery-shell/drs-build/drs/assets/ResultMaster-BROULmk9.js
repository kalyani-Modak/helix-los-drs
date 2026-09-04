import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, bC as ResultCategoryMasterAPI, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, dK as ps, bH as SE, cs as ap, b0 as Lg, bL as SearchIcon, cy as bu, cj as Vg, bD as ResultMasterAPI } from "./index-BhdgJqva.js";
const ResultMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const ResultsActiveRequestDto = { chActive: "Y" };
  const [rowData, setRowData] = reactExports.useState([]);
  const [categoryOptions, setCategoryOptions] = reactExports.useState([]);
  const [categoryInput, setCategoryInput] = reactExports.useState("");
  const [resultInput, setResultInput] = reactExports.useState("");
  const [descriptionInput, setDescriptionInput] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("");
  const [resultFilter, setResultFilter] = reactExports.useState("");
  const [descriptionFilter, setDescriptionFilter] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const fetchCategories = reactExports.useCallback(async () => {
    try {
      const res = await Kr.GET(
        ResultCategoryMasterAPI.ResultCategoryDetails("EC-ResultCategories")
      );
      const payload = res.data;
      const categoryArray = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.responseJson) || [];
      if (Array.isArray(categoryArray)) {
        const normalized = categoryArray.map((item) => ({
          value: item.szCategoryCode ?? "",
          label: item.szCategoryDesc ?? item.szCategoryCode ?? ""
        }));
        setCategoryOptions(normalized);
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      toast.warn(
        intl.formatMessage({
          id: "label.ResultMaster.categories.fetchError",
          defaultMessage: "Failed to fetch result categories"
        })
      );
      setCategoryOptions([]);
    }
  }, [intl, toast]);
  const handleSearch = () => {
    setCategoryFilter(categoryInput);
    setResultFilter(resultInput);
    setDescriptionFilter(descriptionInput);
  };
  const filteredRowData = reactExports.useMemo(() => {
    return rowData.filter((row) => {
      const categoryMatches = !categoryFilter || String(row.szCategoryCode ?? "").toLowerCase().includes(categoryFilter.toLowerCase());
      const resultMatches = !resultFilter || String(row.szResultCode ?? "").toLowerCase().includes(resultFilter.toLowerCase());
      const descriptionMatches = !descriptionFilter || String(row.szResultName ?? "").toLowerCase().includes(descriptionFilter.toLowerCase());
      return categoryMatches && resultMatches && descriptionMatches;
    });
  }, [rowData, categoryFilter, resultFilter, descriptionFilter]);
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Result",
          defaultMessage: "Result"
        }),
        field: "szResultCode",
        width: 120,
        editable: true,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Description",
          defaultMessage: "Description"
        }),
        field: "szResultName",
        width: 500,
        editable: true,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Category",
          defaultMessage: "Category"
        }),
        field: "szCategoryCode",
        width: 130,
        editable: true,
        cellEditor: "agSelectCellEditor",
        required: true,
        cellEditorParams: {
          values: categoryOptions.map((opt) => opt.value)
        },
        valueFormatter: (params) => {
          const option = categoryOptions.find(
            (opt) => opt.value === params.value
          );
          return option ? option.label : params.value;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.daysLimit",
          defaultMessage: "Days Limit"
        }),
        field: "inNextActionLimitDays",
        width: 130,
        editable: true,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.escalationDays",
          defaultMessage: "Escalation Days"
        }),
        field: "inNoActionEscalate",
        width: 180,
        editable: true,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.active",
          defaultMessage: "Active"
        }),
        field: "chActive",
        width: 120,
        editable: true,
        isCheckbox: true,
        cellRenderer: "agCheckboxCellRenderer"
      }
      /* Commented-out "Available Actions" column kept below for reference:
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.AvailableActions",
          defaultMessage: "Available Actions",
        }),
        width: 182,
        editable: false,
        filter: false,
        cellRenderer: (params) => {
          const isDisabled = !params.data?.isPersisted;
          return (
            <span
              style={{
                color: isDisabled ? "#999" : "#1976d2",
                cursor: isDisabled ? "not-allowed" : "pointer",
                textDecoration: isDisabled ? "none" : "underline",
                fontWeight: 500,
              }}
              onClick={() => { if (!isDisabled) handleActionClick(params.data); }}
            >
              Edit
            </span>
          );
        },
      },
      */
    ],
    [intl.locale, categoryOptions]
  );
  const fetchResults = () => {
    Kr.GET(`${ResultMasterAPI.Result(screenMenuId)}?chActive=${ResultsActiveRequestDto.chActive}`).then((res) => {
      var _a;
      const responseArray = (_a = res.data) == null ? void 0 : _a.responseJson;
      if (Array.isArray(responseArray)) {
        const enrichedData = responseArray.map((item, index) => ({
          id: item.szResultCode || index + 1,
          ...item,
          chActive: item.chActive === "Y",
          isPersisted: true
        }));
        setRowData(enrichedData);
      } else {
        setRowData([]);
      }
    }).catch(() => {
      toast.error("Error while fetching Results.");
    });
  };
  reactExports.useEffect(() => {
    fetchResults();
    fetchCategories();
  }, []);
  const handleSave = ({ newRows, updatedRows, deletedRows }) => {
    const lstResults = [...newRows, ...updatedRows, ...deletedRows].filter((row) => row.szResultCode && row.szResultCode.trim() !== "").map((row) => ({
      szResultCode: row.szResultCode,
      szResultName: row.szResultName,
      szCategoryCode: row.szCategoryCode,
      inNextActionLimitDays: row.inNextActionLimitDays !== void 0 && row.inNextActionLimitDays !== "" ? Number(row.inNextActionLimitDays) : null,
      inNoActionEscalate: row.inNoActionEscalate !== void 0 && row.inNoActionEscalate !== "" ? Number(row.inNoActionEscalate) : null,
      chActive: row.chActive ? "Y" : "N",
      szRstMode: row.mode || "U",
      chGlobalyn: "Y"
    }));
    return Kr.POST(ResultMasterAPI.Result(screenMenuId), lstResults).then((response) => {
      const resData = response.data;
      const backendPayload = resData == null ? void 0 : resData.responseJson;
      const status = String((backendPayload == null ? void 0 : backendPayload.statusCode) || "");
      if (status === "200") {
        fetchResults();
        return { success: true };
      } else {
        toast.error((backendPayload == null ? void 0 : backendPayload.responseMsg) || "Failed to save changes.");
        return { success: false };
      }
    }).catch(() => {
      toast.error("Error while saving data.");
      return { success: false };
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "result-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.ResultMaster.title",
            defaultMessage: "Global Results"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.resultMaster.description",
            defaultMessage: "Outcome codes that can be recorded against an action. Days Limit drives Show Limit on Followup; Esc Days triggers no-action escalation."
          }),
          colon: false,
          align: "left"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "result-master-search", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { flexDirection: "column", gap: 0.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.ResultMaster.searchLabel",
              defaultMessage: "Category"
            }),
            colon: false,
            sx: { fontSize: "12px", textAlign: "left" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "Category",
            value: categoryInput,
            onChange: (e) => setCategoryInput(e.target.value),
            options: categoryOptions,
            width: "160px"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { flexDirection: "column", gap: 0.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.ResultMaster.ResultLabel",
              defaultMessage: "Result"
            }),
            colon: false,
            sx: { fontSize: "12px", textAlign: "left" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            value: resultInput,
            onChange: (e) => setResultInput(e.target.value),
            editable: true,
            placeholder: "",
            width: "160px",
            onKeyDown: (e) => e.key === "Enter" && handleSearch()
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { flexDirection: "column", gap: 0.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.ResultMaster.DescriptionLabel",
              defaultMessage: "Description"
            }),
            colon: false,
            sx: { fontSize: "12px", textAlign: "left" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            value: descriptionInput,
            onChange: (e) => setDescriptionInput(e.target.value),
            editable: true,
            placeholder: "",
            width: "200px",
            onKeyDown: (e) => e.key === "Enter" && handleSearch()
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.ResultMaster.searchBtn",
            defaultMessage: "Search"
          }),
          size: "medium",
          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}),
          onClick: handleSearch,
          sx: { width: "120px" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData: filteredRowData,
          columnDefs,
          gridStyle: { width: "100%", height: "57vh", minHeight: "360px" },
          buttonStyle: { paddingLeft: "0px", marginTop: "20px" },
          pagination: true,
          paginationPageSize: 10,
          sort: true,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          rowDragging: false,
          onSave: handleSave
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
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  ResultMaster as default
};
