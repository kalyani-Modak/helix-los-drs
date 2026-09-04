import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, ac as Dt, aW as Kg, cJ as dc, db as gridBatchCodeDefObj, bI as SEARCH_API_ENDPOINTS, cj as Vg } from "./index-BhdgJqva.js";
import { B as BatchProcessGridPanel } from "./BatchProcessGridPanel-8LjsATn8.js";
import "./apiEndpoints-B3TJTOpa.js";
const BatchProcessMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const panelRef = reactExports.useRef(null);
  const [batchCode, setBatchCode] = reactExports.useState("");
  const [loadedCode, setLoadedCode] = reactExports.useState("");
  const loadBatchProcesses = (selectedCode = batchCode) => {
    const code = String(selectedCode ?? "").trim();
    if (!code) {
      toast.warning(
        intl.formatMessage({
          id: "batchframework.toast.enterBatchCode",
          defaultMessage: "Enter a batch code"
        })
      );
      return;
    }
    setBatchCode(code);
    setLoadedCode(code);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.BatchProcessMaster.title",
          defaultMessage: "Batch processes"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { sx: { p: 2, width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          dc,
          {
            apiEndpoint: SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK(),
            searchCode: "BATCHCODE",
            setSelectedValue: (value) => {
              const selectedCode = value || "";
              setBatchCode(selectedCode);
              if (selectedCode) {
                loadBatchProcesses(selectedCode);
              }
            },
            selectedValue: batchCode,
            selectedColumn: "szBatchCode",
            gridDefObj: gridBatchCodeDefObj,
            gridWidth: 300,
            gridHeight: 300,
            gridNoOfRowsPerPage: 5,
            searchBoxWidth: "280px",
            searchBoxHeight: 30,
            searchBoxFontSize: 12,
            placeholder: intl.formatMessage({
              id: "label.batchprocess.batchCode",
              defaultMessage: "Batch code"
            }),
            translate: false
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BatchProcessGridPanel, { ref: panelRef, batchCode: loadedCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = panelRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onReset: () => {
            var _a, _b;
            return (_b = (_a = panelRef.current) == null ? void 0 : _a.reload) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, reset: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  BatchProcessMaster as default
};
