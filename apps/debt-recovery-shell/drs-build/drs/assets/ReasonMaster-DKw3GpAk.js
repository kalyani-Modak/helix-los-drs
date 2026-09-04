import { dB as jsxRuntimeExports, cB as cc, ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, ac as Dt, cx as bp, ep as vp, dK as ps, bH as SE, b0 as Lg, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { R as ReasonMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
function ReasonMasterActiveCellRenderer(params) {
  const v = params.value;
  const checked = v === "Y" || v === true;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    cc,
    {
      checked,
      onChange: (e) => {
        params.node.setDataValue("szActive", e.target.checked ? "Y" : "N");
      },
      label: "",
      margin: "15px",
      align: "center"
    }
  );
}
function buildReasonMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.reasonCode",
        defaultMessage: "Reason Code"
      }),
      field: "szReasonCode",
      editable: true,
      width: 180,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.reasonDesc",
        defaultMessage: "Description"
      }),
      field: "szReasonDesc",
      editable: true,
      width: 932,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.active",
        defaultMessage: "Active"
      }),
      field: "szActive",
      editable: false,
      width: 105,
      filter: false,
      isCheckbox: true,
      cellRenderer: ReasonMasterActiveCellRenderer
    }
  ];
}
const REASON_MASTER_LEGACY_SYSTEM = "TELE";
function getCurrentUserId() {
  try {
    return sessionStorage.getItem("SEC_USERNAME") || "";
  } catch {
    return "";
  }
}
function extractReasonListFromResponse(res) {
  const body = (res == null ? void 0 : res.data) ?? res;
  const j = body == null ? void 0 : body.responseJson;
  if (Array.isArray(j)) return j;
  if (j && typeof j === "object" && Array.isArray(j.data)) return j.data;
  if (Array.isArray(body == null ? void 0 : body.data)) return body.data;
  return [];
}
function isSuccessEnvelope(res) {
  const body = (res == null ? void 0 : res.data) ?? res;
  const s = body == null ? void 0 : body.status;
  return s === "Success" || s === 200 || s === "200" || String(s) === "200";
}
function normalizeReasonRow(row) {
  return {
    ...row,
    szReasonCode: row.szReasonCode != null ? String(row.szReasonCode).trim() : "",
    szReasonDesc: row.szReasonDesc != null ? String(row.szReasonDesc).trim() : "",
    szActive: row.szActive === true || row.szActive === "Y" || row.szActive === "y" ? "Y" : "N",
    szLegacySystem: row.szLegacySystem || REASON_MASTER_LEGACY_SYSTEM
  };
}
const ReasonMasterScreen = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [reasonType, setReasonType] = reactExports.useState("");
  const [isFetched, setIsFetched] = reactExports.useState(false);
  const [fetchedReasonType, setFetchedReasonType] = reactExports.useState("");
  const [reasonTypeOptions, setReasonTypeOptions] = reactExports.useState([]);
  const [rawReasonTypes, setRawReasonTypes] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const columnDefs = reactExports.useMemo(() => buildReasonMasterColumnDefs(intl), [intl]);
  const fetchReasons = reactExports.useCallback(async () => {
    if (!reasonType) {
      toast.warn(
        intl.formatMessage({
          id: "message.reasonMaster.selectReasonTypeWarning",
          defaultMessage: "Please select a reason type before fetching."
        })
      );
      return;
    }
    try {
      setLoading(true);
      const url = `${ReasonMasterAPI.ReasonMasters(screenMenuId)}?szReasonType=${encodeURIComponent(reasonType)}`;
      const res = await Kr.GET(url);
      const list = extractReasonListFromResponse(res);
      if (!isSuccessEnvelope(res)) {
        setRowData([]);
        setIsFetched(false);
        setFetchedReasonType("");
        toast.error(
          intl.formatMessage({
            id: "message.reasonMaster.fetchError",
            defaultMessage: "Error while fetching reason masters."
          })
        );
        return;
      }
      setFetchedReasonType(reasonType);
      setIsFetched(true);
      setLoading(false);
      if (list.length === 0) {
        setRowData([]);
        toast.info(
          intl.formatMessage({
            id: "message.reasonMaster.fetchEmpty",
            defaultMessage: "No records found for the selected reason type."
          })
        );
        return;
      }
      setRowData(list.map((row) => normalizeReasonRow(row)));
    } catch (err) {
      console.error("ReasonMaster fetch error:", err);
      toast.error(
        intl.formatMessage({
          id: "message.reasonMaster.fetchError",
          defaultMessage: "Error while fetching reason masters."
        })
      );
      setRowData([]);
      setIsFetched(false);
      setFetchedReasonType("");
    }
  }, [reasonType, intl, toast]);
  const handleReasonTypeChange = (e) => {
    setReasonType(e.target.value);
    setIsFetched(false);
    setFetchedReasonType("");
    setRowData([]);
  };
  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    var _a, _b;
    if (!reasonType || !isFetched || reasonType !== fetchedReasonType) {
      toast.warn(
        intl.formatMessage({
          id: "error.reasontype.fetch",
          defaultMessage: "Please select and fetch data before saving."
        })
      );
      return { success: false };
    }
    const userId = getCurrentUserId();
    const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => ({
      szReasonType: reasonType,
      szReasonCode: (row.szReasonCode || "").trim(),
      szReasonDesc: (row.szReasonDesc || "").trim(),
      szActive: row.szActive === true || row.szActive === "Y" || row.szActive === "y" ? "Y" : "N",
      szUser: userId,
      szLegacySystem: row.szLegacySystem || REASON_MASTER_LEGACY_SYSTEM,
      szMode: row.mode
    }));
    if (payload.length === 0) {
      toast.warn(
        intl.formatMessage({
          id: "message.reasonMaster.saveNoChanges",
          defaultMessage: "No changes to save."
        })
      );
      return { success: false };
    }
    try {
      const res = await Kr.POST(ReasonMasterAPI.ReasonMasters(screenMenuId), payload);
      const body = (res == null ? void 0 : res.data) ?? res;
      if (isSuccessEnvelope(res)) {
        await fetchReasons();
        return { success: true };
      }
      toast.error(
        (body == null ? void 0 : body.message) || intl.formatMessage({
          id: "message.reasonMaster.saveError",
          defaultMessage: "Failed to save reason masters."
        })
      );
      return { success: false };
    } catch (err) {
      console.error("ReasonMaster save error:", err);
      const serverMsg = (_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message;
      toast.error(
        serverMsg || intl.formatMessage({
          id: "message.reasonMaster.saveError",
          defaultMessage: "Failed to save reason masters."
        })
      );
      return { success: false };
    }
  };
  const getReasonTypeLabel = reactExports.useCallback((typeValue) => {
    const messageId = `label.reasonMaster.${typeValue}`;
    try {
      const translated = intl.formatMessage({
        id: messageId,
        defaultMessage: typeValue
        // Fallback to the value itself if translation doesn't exist
      });
      return translated;
    } catch (error) {
      return typeValue;
    }
  }, [intl]);
  const updateDropdownLabels = reactExports.useCallback(() => {
    if (rawReasonTypes.length > 0) {
      const formattedOptions = rawReasonTypes.map((type) => ({
        value: type,
        label: getReasonTypeLabel(type)
      }));
      setReasonTypeOptions(formattedOptions);
    }
  }, [rawReasonTypes, getReasonTypeLabel]);
  const fetchReasonTypeOptions = async () => {
    try {
      const response = await Kr.GET(ReasonMasterAPI.ReasonMasters(screenMenuId) + `/fetchReasonTypeDropDown`);
      const responseData = (response == null ? void 0 : response.data) ?? response;
      let reasonTypesArray = [];
      if ((responseData == null ? void 0 : responseData.status) === "Success" && (responseData == null ? void 0 : responseData.responseJson)) {
        reasonTypesArray = responseData.responseJson;
      } else if (Array.isArray(responseData)) {
        reasonTypesArray = responseData;
      } else if ((responseData == null ? void 0 : responseData.data) && Array.isArray(responseData.data)) {
        reasonTypesArray = responseData.data;
      }
      setRawReasonTypes(reasonTypesArray);
      setLoading(false);
      const formattedOptions = reasonTypesArray.map((type) => ({
        value: type,
        label: getReasonTypeLabel(type)
      }));
      setReasonTypeOptions(formattedOptions);
      if (formattedOptions.length > 0 && !reasonType) {
        setReasonType(formattedOptions[0].value);
      }
    } catch (error) {
      console.error("Error fetching reason types:", error);
      toast.error(
        intl.formatMessage({
          id: "message.reasonMaster.fetchTypesError",
          defaultMessage: "Error fetching reason types."
        })
      );
    }
  };
  reactExports.useEffect(() => {
    fetchReasonTypeOptions();
  }, []);
  reactExports.useEffect(() => {
    if (rawReasonTypes.length > 0) {
      updateDropdownLabels();
    }
  }, [intl.locale, updateDropdownLabels, rawReasonTypes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-master-header-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-type-wrapper", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            vp,
            {
              title: intl.formatMessage({
                id: "label.reasonMaster.title",
                defaultMessage: "Reason Master"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "reason-master-description",
              value: intl.formatMessage({
                id: "label.reasonMaster.titleDesc",
                defaultMessage: "Define reasons used across follow-up, exclusions, fee waivers, workflow, and 11 other modules."
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "reason-master-controls", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-type-wrapper", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.reasonMaster.reasonType",
                defaultMessage: "REASON TYPE"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-master-fetch-button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SE,
              {
                name: "reasonType",
                options: reasonTypeOptions,
                value: reasonType,
                onChange: handleReasonTypeChange,
                placeholder: intl.formatMessage({
                  id: "label.reasonMaster.reasonTypePlaceholder",
                  defaultMessage: "Select reason type"
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                variant: "contained",
                onClick: fetchReasons,
                label: "label.reasonMaster.fetchButton",
                defaultMessage: "FETCH",
                sx: { height: "28px" }
              }
            )
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "reason-master-stack", loading, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          pagination: true,
          paginationPageSize: 5,
          sort: true,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleSave,
          rowDragging: false,
          gridClassName: "reason-master-ag-host",
          gridStyle: { width: "100%", height: "278px", marginTop: "20px" }
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
          onClose: () => navigate("/homelayout/welcomepage")
        }
      )
    ] })
  ] });
};
export {
  ReasonMasterScreen as default
};
