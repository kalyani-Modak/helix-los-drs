import { ed as useIntl, dB as jsxRuntimeExports, aW as Kg, ac as Dt, aM as Grid, cJ as dc, di as gridMailCodeDefObj, bI as SEARCH_API_ENDPOINTS, dK as ps, cs as ap, cB as cc, dI as pp, bH as SE, dD as lE, dN as reactExports, b6 as MailOutlinedIcon, cf as Typography, cy as bu, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, aX as Kr, aK as GenerateMailAPI, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
function GenerateMailForm({
  selectedRow,
  selectedMailCode,
  setSelectedMailCode,
  selectedTemplateId,
  setSelectedTemplateId,
  selectedEntityCode,
  setSelectedEntityCode,
  notes,
  setNotes,
  mailTypeUi,
  setMailTypeUi,
  addressToIds,
  setAddressToIds,
  communicationDetails,
  communicationLoading,
  selectedCommunicationValue,
  setSelectedCommunicationValue,
  addressTypeOptions,
  // ADD
  addressTypeLoading,
  // ADD
  generatedReady
}) {
  const intl = useIntl();
  const safeFormatMessage = (id, defaultMessage = "") => {
    if (typeof id === "string" && id.trim()) {
      return intl.formatMessage({ id, defaultMessage: defaultMessage || id });
    }
    return defaultMessage;
  };
  selectedRow ? intl.formatMessage(
    { id: "label.generateMail.accountContextHint" },
    {
      cust: selectedRow.CUST_SEQNO ?? "—",
      acct: selectedRow.ACNT_SEQNO ?? "—"
    }
  ) : intl.formatMessage({ id: "label.generateMail.noAccountSelected" });
  const toggleAddressTo = (id) => {
    setAddressToIds(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const fieldStack = (labelNode, control, fullWidthControl = false) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        width: "100%",
        minWidth: 0
      },
      children: [
        labelNode,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: fullWidthControl ? "100%" : "auto", minWidth: 0 }, children: control })
      ]
    }
  );
  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": { width: "auto" },
    "& .hcheckbox-label": { margin: 0, width: "auto" },
    "& .hcheckbox-label.MuiFormControlLabel-root": {},
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important",
      whiteSpace: "nowrap"
    },
    "& .hcheckbox-input": { paddingRight: "0px" }
  };
  const renderCommunicationField = (labelId) => {
    const options = communicationDetails.map((val) => ({
      label: val,
      value: val
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6, lg: 4 }, children: fieldStack(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: safeFormatMessage(labelId, labelId || ""),
          translate: false,
          align: "left",
          colon: false
        }
      ),
      communicationLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { value: "...", disabled: true, size: "small", translate: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          options,
          value: selectedCommunicationValue,
          onChange: (e) => setSelectedCommunicationValue(e.target.value),
          placeholder: communicationDetails.length === 0 ? "-" : (mailTypeUi == null ? void 0 : mailTypeUi.toUpperCase()) === "EMAIL" ? "Select email" : "Select mobile",
          width: "100%"
        }
      ),
      true
    ) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: 1.5,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        width: "100%"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2, py: 1.5, flexDirection: "column", gap: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: fieldStack(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.generateMail.mailCode" }),
              required: true,
              translate: false,
              align: "left",
              colon: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            dc,
            {
              apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
              searchCode: "MAILCODE",
              setSelectedValue: (value, row) => {
                setSelectedMailCode(value);
                setSelectedTemplateId((row == null ? void 0 : row.szTemplateId) || (row == null ? void 0 : row.id) || "");
                setSelectedEntityCode((row == null ? void 0 : row.szEntityCode) || "");
                setMailTypeUi((row == null ? void 0 : row.szCode) || "");
              },
              selectedValue: selectedMailCode,
              selectedColumn: "szMailCode",
              gridDefObj: gridMailCodeDefObj,
              gridWidth: 300,
              gridHeight: 300,
              gridNoOfRowsPerPage: 5,
              searchBoxWidth: "100%",
              searchBoxHeight: 30,
              searchBoxFontSize: 12,
              placeholder: "Select mail code"
            }
          ),
          true
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: fieldStack(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.generateMail.mailType" }),
              required: true,
              translate: false,
              align: "left",
              colon: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: mailTypeUi,
              disabled: true,
              size: "small",
              width: "100%",
              translate: false
            }
          ),
          true
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: fieldStack(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.generateMail.preferredLanguage" }),
              translate: false,
              align: "left",
              colon: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: intl.formatMessage({ id: "label.generateMail.preferredLanguage.value" }),
              disabled: true,
              size: "small",
              width: "100%",
              translate: false
            }
          ),
          true
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: fieldStack(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.generateMail.addressTo" }),
              required: true,
              translate: false,
              align: "left",
              colon: false
            }
          ),
          addressTypeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { value: "...", disabled: true, size: "small", translate: false }) : addressTypeOptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { value: "No address types found", disabled: true, size: "small", translate: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                gap: 2,
                width: "100%",
                minWidth: 0,
                overflowX: "auto",
                overflowY: "hidden",
                py: 0.25,
                scrollbarWidth: "thin"
              },
              children: addressTypeOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...checkboxCellSx }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  label: safeFormatMessage(opt == null ? void 0 : opt.szi18nDesc, (opt == null ? void 0 : opt.szDesc) || (opt == null ? void 0 : opt.szi18nDesc) || ""),
                  checked: addressToIds.includes(opt.szCondition),
                  onChange: () => toggleAddressTo(opt.szCondition),
                  size: "small",
                  align: "left",
                  margin: "0"
                }
              ) }, opt.code))
            }
          ),
          true
        ) }),
        (mailTypeUi == null ? void 0 : mailTypeUi.toUpperCase()) === "EMAIL" && renderCommunicationField("label.CommunicationPreferences.Email Id"),
        (mailTypeUi == null ? void 0 : mailTypeUi.toUpperCase()) === "SMS" && renderCommunicationField("label.generateMail.mobileBorrower"),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: fieldStack(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.generateMail.notes" }),
              required: true,
              translate: false,
              align: "left",
              colon: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            pp,
            {
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              maxLines: 3,
              width: "100%",
              maxLength: 2e3,
              translate: false,
              placeholder: intl.formatMessage({ id: "label.generateMail.notes.placeholder" })
            }
          ),
          true
        ) })
      ] }) })
    }
  );
}
const primaryCell = {
  color: "var(--drs-text-primary)",
  fontSize: "11px",
  lineHeight: 1.35
};
const mutedCell = {
  color: "var(--drs-text-muted)",
  fontSize: "11px",
  lineHeight: 1.35
};
const descCell = {
  ...primaryCell,
  fontWeight: 600
};
function createMailHistoryColDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.date" }),
      field: "dtSent",
      type: "date",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: lE.DATE }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.description" }),
      field: "mailDesc",
      minWidth: 120,
      flex: 1.2,
      filter: false,
      cellStyle: { ...descCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.type" }),
      field: "mailType",
      minWidth: 72,
      flex: 0.8,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.sendTo" }),
      field: "sendTo",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.contact" }),
      field: "contact",
      minWidth: 140,
      flex: 1.2,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.role" }),
      field: "role",
      minWidth: 140,
      flex: 1.2,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.status" }),
      field: "status",
      minWidth: 56,
      flex: 0.55,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.returned" }),
      field: "returned",
      minWidth: 56,
      flex: 0.55,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.fee" }),
      field: "feeAmount",
      minWidth: 64,
      flex: 0.55,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.notes" }),
      field: "notes",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: lE.TEXT }
    }
  ];
}
function mailHistoryDefaultColDef() {
  return {
    sortable: true,
    filter: false,
    floatingFilter: false,
    resizable: true,
    flex: 1
  };
}
function MailHistoryGrid({
  rowData,
  datasource = null,
  cacheBlockSize = 10,
  maxBlocksInCache = 2,
  totalElements = 0,
  loading = false,
  loadError = null
}) {
  const intl = useIntl();
  const columnDefs = reactExports.useMemo(() => createMailHistoryColDefs(intl), [intl]);
  const defaultColDef = reactExports.useMemo(() => mailHistoryDefaultColDef(), []);
  const objCustomGridStyle = {
    width: "100%",
    height: "min(360px, 32vh)",
    minHeight: 220,
    minWidth: "280px",
    overflowX: "auto",
    "--ag-borders": "none"
  };
  const rows = rowData || [];
  const count = Number(totalElements) > 0 ? Number(totalElements) : rows.length;
  const useInfinite = !!datasource;
  const empty = !loading && !loadError && count === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "var(--drs-border-divider)",
        bgcolor: "var(--drs-bg-paper)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              py: 1.5,
              px: 2,
              flexShrink: 0,
              bgcolor: "var(--drs-grid-header-bg)",
              borderBottom: 1,
              borderColor: "var(--drs-border-divider)",
              alignItems: "center",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, bgcolor: "transparent" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MailOutlinedIcon, { sx: { fontSize: 14, color: "primary.main" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: "label.generateMail.history.title",
                    colon: false,
                    translate: true,
                    align: "left",
                    component: "div",
                    sx: {
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.15,
                      color: "var(--drs-text-primary)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  variant: "caption",
                  sx: { fontSize: 10, color: "var(--drs-text-muted)" },
                  children: intl.formatMessage({ id: "label.generateMail.history.count" }, { count })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { flex: 1, minHeight: 0, flexDirection: "column", p: 0 }, children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Typography,
            {
              variant: "caption",
              sx: {
                px: 2,
                py: 1.5,
                color: "var(--drs-text-muted)",
                fontSize: 11
              },
              children: intl.formatMessage({ id: "label.generateMail.history.loading" })
            }
          ),
          loadError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { px: 2, py: 1.5, color: "error.main", fontSize: 11 }, children: loadError }),
          empty && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Typography,
            {
              variant: "caption",
              sx: {
                px: 2,
                py: 1.5,
                color: "var(--drs-text-muted)",
                fontSize: 11
              },
              children: intl.formatMessage({ id: "label.generateMail.history.empty" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bu,
            {
              rowData: useInfinite ? void 0 : rows,
              columnDefs,
              defaultColDef,
              gridStyle: objCustomGridStyle,
              gridClassName: "drs-list-grid drs-generate-mail-history-grid",
              embeddedInSection: true,
              rowModelType: useInfinite ? "infinite" : "clientSide",
              datasource: useInfinite ? datasource : void 0,
              cacheBlockSize: useInfinite ? cacheBlockSize : void 0,
              maxBlocksInCache: useInfinite ? maxBlocksInCache : void 0,
              pagination: count > 0,
              paginationPageSize: cacheBlockSize,
              domLayout: "normal",
              sort: true,
              isLoading: loading
            }
          )
        ] })
      ]
    }
  );
}
const MAIL_HISTORY_PAGE_SIZE = 10;
function extractMailHistoryRows(payload) {
  var _a;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload == null ? void 0 : payload.content)) return payload.content;
  if (Array.isArray(payload == null ? void 0 : payload.mailHistory)) return payload.mailHistory;
  if (Array.isArray((_a = payload == null ? void 0 : payload.mailHistory) == null ? void 0 : _a.content)) return payload.mailHistory.content;
  return [];
}
function extractMailHistoryTotal(responseData, fallbackLength = 0) {
  const responseJson = responseData == null ? void 0 : responseData.responseJson;
  const source = responseJson ?? responseData;
  const totalRaw = Number(
    (responseData == null ? void 0 : responseData.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (source == null ? void 0 : source.totalElements) ?? (source == null ? void 0 : source.total) ?? (source == null ? void 0 : source.count) ?? fallbackLength
  );
  return Number.isFinite(totalRaw) ? totalRaw : fallbackLength;
}
function GenerateMail() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [selectedMailCode, setSelectedMailCode] = reactExports.useState("");
  const [selectedTemplateId, setSelectedTemplateId] = reactExports.useState("");
  const [selectedEntityCode, setSelectedEntityCode] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [generatedReady, setGeneratedReady] = reactExports.useState(false);
  const [sendInFlight, setSendInFlight] = reactExports.useState(false);
  const [mailTypeUi, setMailTypeUi] = reactExports.useState("");
  const [addressToIds, setAddressToIds] = reactExports.useState([]);
  const [communicationDetails, setCommunicationDetails] = reactExports.useState([]);
  const [communicationLoading, setCommunicationLoading] = reactExports.useState(false);
  const [selectedCommunicationValue, setSelectedCommunicationValue] = reactExports.useState("");
  const [addressTypeOptions, setAddressTypeOptions] = reactExports.useState([]);
  const [addressTypeLoading, setAddressTypeLoading] = reactExports.useState(false);
  const [mailHistoryRows, setMailHistoryRows] = reactExports.useState([]);
  const [mailHistoryLoading, setMailHistoryLoading] = reactExports.useState(false);
  const [mailHistoryError, setMailHistoryError] = reactExports.useState(null);
  const [mailHistoryTotalElements, setMailHistoryTotalElements] = reactExports.useState(0);
  const [mailHistoryRefreshVersion, setMailHistoryRefreshVersion] = reactExports.useState(0);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.CASE_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.PARTITION_CODE)) {
      setMailHistoryRows([]);
      setMailHistoryTotalElements(0);
      setMailHistoryError(null);
      return;
    }
    setMailHistoryRefreshVersion((v) => v + 1);
  }, [selectedRow == null ? void 0 : selectedRow.CUST_SEQNO, selectedRow == null ? void 0 : selectedRow.CASE_SEQNO, selectedRow == null ? void 0 : selectedRow.PARTITION_CODE]);
  const mailHistoryDatasource = reactExports.useMemo(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.CASE_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.PARTITION_CODE)) {
      return null;
    }
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || MAIL_HISTORY_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        setMailHistoryLoading(true);
        setMailHistoryError(null);
        try {
          const res = await Kr.GET(GenerateMailAPI.GenerateMailApi(screenMenuId), {
            pageNumber,
            size,
            pageSize: size
          });
          const data = (res == null ? void 0 : res.data) ?? {};
          const ok = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
          if (!ok) {
            setMailHistoryRows([]);
            setMailHistoryTotalElements(0);
            setMailHistoryError(
              (data == null ? void 0 : data.message) || intl.formatMessage({ id: "label.generateMail.history.loadFailed" })
            );
            (_a = params.failCallback) == null ? void 0 : _a.call(params);
            return;
          }
          const rows = extractMailHistoryRows(data == null ? void 0 : data.responseJson);
          const total = extractMailHistoryTotal(data, rows.length);
          setMailHistoryRows(rows);
          setMailHistoryTotalElements(total);
          (_b = params.successCallback) == null ? void 0 : _b.call(params, rows, total);
        } catch (err) {
          setMailHistoryRows([]);
          setMailHistoryTotalElements(0);
          setMailHistoryError(
            ((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({ id: "label.generateMail.history.loadFailed" })
          );
          (_e = params.failCallback) == null ? void 0 : _e.call(params);
        } finally {
          setMailHistoryLoading(false);
        }
      }
    };
  }, [intl, selectedRow]);
  const fetchCommunicationDetails = reactExports.useCallback(() => {
    if (!selectedRow || !mailTypeUi) {
      setCommunicationDetails([]);
      return;
    }
    if (!(selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.PARTITION_CODE)) {
      setCommunicationDetails([]);
      return;
    }
    setCommunicationLoading(true);
    Kr.GET(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/fetchCommunicationDetails`, {
      mailType: mailTypeUi
    }).then((res) => {
      const data = res.data;
      const ok = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
      if (ok) {
        const result = data == null ? void 0 : data.responseJson;
        const list = (mailTypeUi == null ? void 0 : mailTypeUi.toUpperCase()) === "EMAIL" ? (result == null ? void 0 : result.emailId) || [] : (result == null ? void 0 : result.mobileNo) || [];
        setCommunicationDetails(list);
      } else {
        setCommunicationDetails([]);
      }
    }).catch(() => setCommunicationDetails([])).finally(() => setCommunicationLoading(false));
  }, [selectedRow, mailTypeUi]);
  reactExports.useEffect(() => {
    fetchCommunicationDetails();
  }, [fetchCommunicationDetails]);
  const fetchAddressTypes = reactExports.useCallback(() => {
    if (!selectedRow) {
      setAddressTypeOptions([]);
      return;
    }
    if (!(selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.PARTITION_CODE)) {
      setAddressTypeOptions([]);
      return;
    }
    setAddressTypeLoading(true);
    Kr.GET(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/fetchCustomerType`).then((res) => {
      const data = res.data;
      const ok = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
      if (ok) {
        const result = data == null ? void 0 : data.responseJson;
        setAddressTypeOptions((result == null ? void 0 : result.customerTypes) || []);
      } else {
        setAddressTypeOptions([]);
      }
    }).catch(() => setAddressTypeOptions([])).finally(() => setAddressTypeLoading(false));
  }, [selectedRow]);
  reactExports.useEffect(() => {
    fetchAddressTypes();
  }, [fetchAddressTypes]);
  reactExports.useEffect(() => {
    setGeneratedReady(false);
    setSelectedCommunicationValue("");
  }, [selectedTemplateId, selectedMailCode, mailTypeUi]);
  const resetForm = reactExports.useCallback(() => {
    setSelectedMailCode("");
    setSelectedTemplateId("");
    setNotes("");
    setGeneratedReady(false);
    setMailTypeUi("");
    setAddressToIds([]);
    setCommunicationDetails([]);
    setSelectedCommunicationValue("");
  }, []);
  const handleGenerate = reactExports.useCallback(async () => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.noAccount" }));
      return { data: { status: "Failure", message: "no account" } };
    }
    if (!selectedTemplateId) {
      toast.error(
        intl.formatMessage({
          id: "label.template.required",
          defaultMessage: "Please select template"
        })
      );
      return { data: { status: "Failure", message: "template" } };
    }
    if (!addressToIds.length) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.addressToRequired" }));
      return { data: { status: "Failure", message: "addressTo" } };
    }
    if (!notes.trim()) {
      toast.error(intl.formatMessage({ id: "error.szNotes.required" }));
      return { data: { status: "Failure", message: "notes" } };
    }
    setGeneratedReady(true);
    return { data: { status: "success" } };
  }, [selectedRow, selectedTemplateId, addressToIds, notes, mailTypeUi, intl, toast]);
  const handleSend = reactExports.useCallback(async () => {
    var _a, _b, _c;
    if (sendInFlight) return { data: { status: "Failure" } };
    const generateResult = await handleGenerate();
    if (((_a = generateResult == null ? void 0 : generateResult.data) == null ? void 0 : _a.status) !== "success") {
      return generateResult;
    }
    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "label.generateMail.error.noAccount" }));
      return { data: { status: "Failure" } };
    }
    const payload = {
      request: {
        templateId: selectedTemplateId || "",
        mailCode: selectedMailCode || "",
        entityCode: selectedEntityCode || "ACNT",
        contact: selectedCommunicationValue || "",
        communicationType: mailTypeUi || "",
        notes: notes && notes.trim() || "",
        mailChannel: mailTypeUi,
        addressToCsv: addressToIds.join(","),
        cGenerationMode: selectedMailCode || ""
      }
    };
    setSendInFlight(true);
    try {
      const res = await Kr.POST(`${GenerateMailAPI.GenerateMailApi(screenMenuId)}/send-email`, payload);
      const data = res.data;
      const statusOk = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
      const messageOk = typeof (data == null ? void 0 : data.message) === "string" && data.message.toLowerCase().includes("success");
      if (statusOk || messageOk) {
        toast.success(
          (data == null ? void 0 : data.message) || intl.formatMessage({
            id: "label.email.success",
            defaultMessage: "Email sent successfully"
          })
        );
        setGeneratedReady(false);
        setMailHistoryRefreshVersion((v) => v + 1);
        return { data: { status: "success", message: data == null ? void 0 : data.message } };
      }
      toast.error(
        (data == null ? void 0 : data.message) || intl.formatMessage({
          id: "label.email.error",
          defaultMessage: "Failed to send email"
        })
      );
      return { data: { status: "Failure", message: data == null ? void 0 : data.message } };
    } catch (err) {
      toast.error(
        ((_c = (_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || intl.formatMessage({
          id: "label.email.error",
          defaultMessage: "Failed to send email"
        })
      );
      return { data: { status: "Failure" } };
    } finally {
      setSendInFlight(false);
    }
  }, [
    sendInFlight,
    selectedRow,
    generatedReady,
    selectedTemplateId,
    selectedMailCode,
    notes,
    mailTypeUi,
    addressToIds,
    intl,
    toast
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.generateMail.title" }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            width: "100%",
            boxSizing: "border-box"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  px: { xs: 2, sm: 3, md: 4 },
                  pb: { xs: 10, sm: 12 },
                  pt: 1,
                  width: "100%",
                  boxSizing: "border-box",
                  background: "var(--drs-bg-page)",
                  flexDirection: "column",
                  gap: 2
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GenerateMailForm,
                    {
                      selectedRow,
                      selectedMailCode,
                      setSelectedMailCode,
                      selectedTemplateId,
                      setSelectedTemplateId,
                      selectedEntityCode,
                      setSelectedEntityCode,
                      notes,
                      setNotes,
                      mailTypeUi,
                      setMailTypeUi,
                      addressToIds,
                      setAddressToIds,
                      communicationDetails,
                      communicationLoading,
                      selectedCommunicationValue,
                      setSelectedCommunicationValue,
                      addressTypeOptions,
                      addressTypeLoading,
                      generatedReady
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MailHistoryGrid,
                    {
                      rowData: mailHistoryRows,
                      datasource: mailHistoryDatasource,
                      cacheBlockSize: MAIL_HISTORY_PAGE_SIZE,
                      maxBlocksInCache: 2,
                      totalElements: mailHistoryTotalElements,
                      loading: mailHistoryLoading,
                      loadError: mailHistoryError
                    },
                    `mail-history-${mailHistoryRefreshVersion}-${(selectedRow == null ? void 0 : selectedRow.CASE_SEQNO) || "none"}`
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3, flexShrink: 0, height: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: handleSend,
                onReset: resetForm,
                onClose: () => navigate("/homelayout/welcomepage"),
                disableToast: { save: true, reset: true, close: true }
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  GenerateMail as default
};
