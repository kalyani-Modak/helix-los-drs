import { ed as useIntl, dN as reactExports, dB as jsxRuntimeExports, ac as Dt, b6 as MailOutlinedIcon, cf as Typography, M as Chip, dD as lE, J as Checkbox, cg as Ug, cI as dayjs, bH as SE, aW as Kg, cy as bu, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, aX as Kr, bE as ReturnMailTrackingAPI, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { W as WarningAmberOutlined } from "./WarningAmberOutlined-Dk2s5JuY.js";
import { c as compactHeaderStyle, m as mutedTextCellStyle, d as descCell, t as textCellStyle } from "./returnMailTrackingGridDef-BfDKTaS6.js";
function normalizeMailRow(raw) {
  if (!raw || typeof raw !== "object") {
    return emptyRow();
  }
  const yn = (v) => {
    if (v === true) return "Y";
    if (v === false) return "N";
    const s = String(v ?? "").trim().toUpperCase();
    if (s === "Y" || s === "YES" || s === "1" || s === "TRUE") return "Y";
    if (s === "N" || s === "NO" || s === "0" || s === "FALSE") return "N";
    return s ? s.charAt(0) : "N";
  };
  const mailSeqNo = raw.mailSeqNo ?? raw.iMailSeqNo ?? raw.inMailSeqNo ?? raw.MAIL_SEQ_NO ?? raw.mail_seq_no ?? null;
  const dtSent = raw.dtSent ?? raw.dtMailGenerate ?? raw.szDtSent ?? raw.DT_SENT ?? "";
  const mailCode = raw.mailDesc ?? raw.szMailCode ?? raw.mailCode ?? raw.MAIL_CODE ?? "";
  const mailType = raw.mailType ?? raw.szSendThru ?? raw.chMailType ?? raw.MAIL_TYPE ?? "";
  const sendTo = raw.sendTo ?? raw.SEND_TO ?? "";
  const contact = raw.contact ?? raw.CONTACT ?? "";
  const status = raw.status ?? raw.chStatus ?? raw.STATUS ?? "";
  const returned = yn(raw.returned ?? raw.chMailReturned ?? raw.RETURNED);
  const badMarked = yn(raw.badMarked ?? raw.chBadMarkedYn ?? raw.chBadMarkedYN ?? raw.BAD_MARKED);
  const returnDateRaw = raw.returnDate ?? raw.dtMailReturned ?? raw.DT_MAIL_RETURNED ?? raw.szReturnDate ?? "";
  const returnReason = raw.returnReason ?? raw.szMailReturnReason ?? raw.MAIL_RETURN_REASON ?? raw.return_reason ?? "";
  const feeAmount = raw.feeAmount ?? raw.bdFeeAmount ?? raw.FEE_AMOUNT ?? "";
  const notes = raw.notes ?? raw.szNotes ?? raw.NOTES ?? "";
  const address1 = raw.szAddress1 ?? raw.address1 ?? raw.ADDRESS1 ?? "";
  const address2 = raw.szAddress2 ?? raw.address2 ?? "";
  const address3 = raw.szAddress3 ?? raw.address3 ?? "";
  const address4 = raw.szAddress4 ?? raw.address4 ?? "";
  const city = raw.szCity ?? raw.city ?? "";
  const state = raw.szState ?? raw.state ?? "";
  const zip = raw.szZip ?? raw.zip ?? "";
  const area = raw.szArea ?? raw.area ?? "";
  return {
    mailSeqNo,
    dtSent: String(dtSent),
    mailCode: String(mailCode),
    mailType: String(mailType),
    sendTo: String(sendTo),
    contact: String(contact),
    status: String(status),
    returned,
    badMarked,
    returnDate: formatDateForPicker(returnDateRaw),
    returnReason: String(returnReason),
    feeAmount: String(feeAmount),
    notes: String(notes),
    address1: String(address1),
    address2: String(address2),
    address3: String(address3),
    address4: String(address4),
    city: String(city),
    state: String(state),
    zip: String(zip),
    area: String(area),
    _raw: raw
  };
}
function formatDateForPicker(v) {
  if (v == null || v === "") return "";
  if (typeof v === "string") {
    const d = v.trim();
    if (d.length >= 10 && d.charAt(4) === "-" && d.charAt(7) === "-") {
      return d.slice(0, 10);
    }
    return d;
  }
  return String(v);
}
function emptyRow() {
  return {
    mailSeqNo: null,
    dtSent: "",
    mailCode: "",
    mailType: "",
    sendTo: "",
    contact: "",
    status: "",
    returned: "N",
    badMarked: "N",
    returnDate: "",
    returnReason: "",
    feeAmount: "",
    notes: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    city: "",
    state: "",
    zip: "",
    area: "",
    _raw: {}
  };
}
const FIELD_KEYS = [
  "address1",
  "address2",
  "address3",
  "address4",
  "area",
  "city",
  "state",
  "zip"
];
function buildAddressPayloadPatch(formSlice) {
  const addressLines = {};
  for (const k of FIELD_KEYS) {
    addressLines[k] = formSlice[k] != null ? String(formSlice[k]) : "";
  }
  return {
    addressLines,
    meta: { source: "return-mail-tracking-placeholder" }
  };
}
function mapReasonTextToKey(text, reasonOptions = []) {
  if (!text) return "";
  const normalizedText = String(text).toLowerCase().trim();
  const match = reasonOptions.find(
    (item) => String(item.label).toLowerCase().trim() === normalizedText || String(item.i18nKey || "").toLowerCase().trim() === normalizedText
  );
  return match ? match.value : "";
}
function formatReasonKey(reasonOptions, key) {
  if (!key) return "";
  const match = reasonOptions.find((item) => item.value === key);
  return match ? match.label : "";
}
function ReturnMailSummaryBar({ rows }) {
  const intl = useIntl();
  const badCount = reactExports.useMemo(
    () => (rows || []).filter((r) => String((r == null ? void 0 : r.badMarked) || "").toUpperCase() === "Y").length,
    [rows]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "nowrap",
        bgcolor: "transparent",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.75,
              bgcolor: "transparent",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MailOutlinedIcon, { sx: { fontSize: 14, color: "var(--drs-text-muted)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11, color: "var(--drs-text-muted)" }, children: intl.formatMessage({ id: "label.returnMailTracking.summary.lettersSent" }, { count: (rows || []).length }) })
            ]
          }
        ),
        badCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Chip,
          {
            size: "small",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WarningAmberOutlined, { sx: { fontSize: "14px !important" } }),
            label: intl.formatMessage({ id: "label.returnMailTracking.summary.badAddressBadge" }, { count: badCount }),
            color: "error",
            variant: "outlined",
            sx: { height: 24, fontSize: 10, flexShrink: 0, "& .MuiChip-label": { px: 0.75 } }
          }
        ) : null
      ]
    }
  );
}
function rowAlert(params) {
  var _a, _b;
  const r = String(((_a = params.data) == null ? void 0 : _a.returned) ?? "").toUpperCase();
  const b = String(((_b = params.data) == null ? void 0 : _b.badMarked) ?? "").toUpperCase();
  return r === "Y" || b === "Y";
}
function wrapRules(col) {
  return {
    ...col,
    filter: false,
    headerStyle: compactHeaderStyle,
    cellClassRules: {
      "drs-return-mail-row-alert": (params) => rowAlert(params)
    }
  };
}
function createReturnMailTrackingColumnDefs(intl, ctx) {
  const { onPatchRow, reasonOptions } = ctx;
  return [
    wrapRules({
      headerName: "#",
      maxWidth: 52,
      minWidth: 44,
      flex: 0,
      sortable: false,
      valueGetter: (p) => p.node != null ? p.node.rowIndex + 1 : "",
      cellStyle: mutedTextCellStyle(lE.TEXT)
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.mailCode" }),
      field: "mailCode",
      minWidth: 88,
      flex: 0.85,
      cellStyle: { ...descCell, textAlign: lE.TEXT }
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.name" }),
      field: "name",
      minWidth: 110,
      flex: 1,
      wrapText: true,
      cellStyle: textCellStyle(lE.TEXT)
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.mailingAddress" }),
      field: "mailingAddress",
      minWidth: 200,
      flex: 1.4,
      wrapText: true,
      cellStyle: mutedTextCellStyle(lE.TEXT)
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.type" }),
      field: "mailType",
      minWidth: 72,
      flex: 0.65,
      cellStyle: mutedTextCellStyle(lE.TEXT)
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.sendDate" }),
      field: "sendDate",
      minWidth: 100,
      flex: 0.85,
      cellStyle: textCellStyle(lE.DATE)
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.badAddress" }),
      field: "badMarked",
      minWidth: 96,
      maxWidth: 110,
      flex: 0,
      sortable: false,
      headerStyle: { ...compactHeaderStyle, textAlign: "center" },
      cellStyle: { textAlign: "center", fontSize: "11px" },
      cellRenderer: (params) => {
        var _a, _b;
        const id = (_a = params.data) == null ? void 0 : _a.mailSeqNo;
        if (id == null) return null;
        const checked = String(((_b = params.data) == null ? void 0 : _b.badMarked) || "").toUpperCase() === "Y";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              bgcolor: "transparent"
            },
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                size: "small",
                checked,
                onChange: (e) => {
                  e.stopPropagation();
                  onPatchRow(id, { badMarked: e.target.checked ? "Y" : "N" });
                },
                sx: { p: 0.25 }
              }
            )
          }
        );
      }
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.returnCol" }),
      field: "returned",
      minWidth: 72,
      maxWidth: 88,
      flex: 0,
      sortable: false,
      headerStyle: { ...compactHeaderStyle, textAlign: "center" },
      cellStyle: { textAlign: "center", fontSize: "11px" },
      cellRenderer: (params) => {
        var _a, _b, _c;
        const id = (_a = params.data) == null ? void 0 : _a.mailSeqNo;
        if (id == null) return null;
        const bad = String(((_b = params.data) == null ? void 0 : _b.badMarked) || "").toUpperCase() === "Y";
        const checked = String(((_c = params.data) == null ? void 0 : _c.returned) || "").toUpperCase() === "Y";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              bgcolor: "transparent"
            },
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                size: "small",
                checked,
                disabled: !bad,
                onChange: (e) => {
                  e.stopPropagation();
                  onPatchRow(id, { returned: e.target.checked ? "Y" : "N" });
                },
                sx: { p: 0.25 }
              }
            )
          }
        );
      }
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.returnDate" }),
      field: "returnDate",
      minWidth: 130,
      flex: 0.9,
      sortable: false,
      cellRenderer: (params) => {
        var _a, _b, _c;
        const id = (_a = params.data) == null ? void 0 : _a.mailSeqNo;
        if (id == null) return null;
        const bad = String(((_b = params.data) == null ? void 0 : _b.badMarked) || "").toUpperCase() === "Y";
        if (!bad) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11, color: "var(--drs-text-muted)" }, children: "—" });
        }
        const val = ((_c = params.data) == null ? void 0 : _c.returnDate) || "";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { onClick: (e) => e.stopPropagation(), sx: { py: 0.25, width: "100%", bgcolor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ug,
          {
            value: val ? dayjs(val) : null,
            onChange: (v) => {
              onPatchRow(id, { returnDate: v ? dayjs(v).format("YYYY-MM-DD") : "" });
            },
            format: "MM/DD/YYYY",
            width: "100%"
          }
        ) });
      }
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.reason" }),
      field: "returnReasonKey",
      minWidth: 160,
      flex: 1.1,
      sortable: false,
      cellRenderer: (params) => {
        var _a, _b, _c;
        const id = (_a = params.data) == null ? void 0 : _a.mailSeqNo;
        if (id == null) return null;
        const bad = String(((_b = params.data) == null ? void 0 : _b.badMarked) || "").toUpperCase() === "Y";
        if (!bad) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11, color: "var(--drs-text-muted)" }, children: "—" });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { onClick: (e) => e.stopPropagation(), sx: { py: 0.25, width: "100%", bgcolor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: `reason-${id}`,
            options: reasonOptions,
            value: ((_c = params.data) == null ? void 0 : _c.returnReasonKey) || "",
            onChange: (e) => {
              onPatchRow(id, { returnReasonKey: e.target.value || "" });
            },
            placeholder: intl.formatMessage({ id: "label.returnMailTracking.details.returnReason.placeholder" }),
            width: "100%"
          }
        ) });
      }
    })
  ];
}
function ReturnMailTrackingGrid({ rowData, loading, loadError, onPatchRow, reasonOptions }) {
  const intl = useIntl();
  const columnDefs = reactExports.useMemo(
    () => createReturnMailTrackingColumnDefs(intl, { onPatchRow, reasonOptions }),
    [intl, onPatchRow, reasonOptions]
  );
  const objCustomGridStyle = {
    width: "100%",
    height: "min(480px, 55vh)",
    minHeight: 280,
    minWidth: 0,
    overflowX: "auto",
    "--ag-borders": "none"
  };
  const rows = rowData || [];
  const empty = !loading && !loadError && !rows.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        minHeight: 0,
        width: "100%"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { flex: 1, minHeight: 0, flexDirection: "column", p: 0 }, children: [
        loadError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { px: 2, py: 1.5, color: "error.main", fontSize: 11 }, children: loadError }),
        empty && !loadError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { px: 2, py: 1.5, color: "var(--drs-text-muted)", fontSize: 11 }, children: intl.formatMessage({ id: "label.returnMailTracking.grid.empty" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            rowData: rows,
            columnDefs,
            gridStyle: objCustomGridStyle,
            gridClassName: "drs-list-grid drs-followup-history-grid drs-return-mail-grid",
            embeddedInSection: true,
            pagination: rows.length > 7,
            paginationPageSize: 7,
            sort: true,
            showTitle: false,
            hideInternalSaveButton: true,
            allowAdd: false,
            allowDelete: false,
            allowUpdate: false,
            isLoading: loading
          }
        )
      ] })
    }
  );
}
function toDisplayRow(rawNorm, reasonOptions = []) {
  const norm = rawNorm;
  const parts = [norm.address1, norm.address2, norm.address3, norm.city, norm.state, norm.zip].filter(
    (x) => String(x || "").trim()
  );
  const s = String(norm.dtSent || "").trim();
  let sendDate = s;
  if (s.length >= 10 && s.charAt(4) === "-" && s.charAt(7) === "-") {
    sendDate = s.slice(0, 10);
  } else if (s.includes(" ")) {
    sendDate = s.split(" ")[0] || s;
  }
  const rk = mapReasonTextToKey(norm.returnReason, reasonOptions);
  return {
    ...norm,
    name: norm.sendTo || "—",
    mailingAddress: parts.length ? parts.join(", ") : "—",
    sendDate,
    returnReasonKey: rk
  };
}
function rowTrackSig(r) {
  return JSON.stringify({
    mailSeqNo: r.mailSeqNo,
    badMarked: r.badMarked,
    returned: r.returned,
    returnDate: r.returnDate,
    returnReasonKey: r.returnReasonKey
  });
}
function ReturnMailTracking() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [gridRows, setGridRows] = reactExports.useState([]);
  const [snapshotRows, setSnapshotRows] = reactExports.useState([]);
  const [gridLoading, setGridLoading] = reactExports.useState(false);
  const [gridError, setGridError] = reactExports.useState(null);
  const [reasonOptions, setReasonOptions] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const fetchMailList = reactExports.useCallback(async () => {
    var _a, _b;
    if (!selectedRow) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(null);
      return [];
    }
    if (!(selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.CASE_SEQNO) || !(selectedRow == null ? void 0 : selectedRow.PARTITION_CODE)) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(null);
      return [];
    }
    setGridLoading(true);
    setGridError(null);
    try {
      const res = await Kr.GET(`${ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId)}/return-mail-tracking-list`);
      const data = res.data;
      const ok = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
      const raw = data == null ? void 0 : data.responseJson;
      const rows = Array.isArray(raw) ? raw : [];
      if (ok) {
        const mapped = rows.map(
          (r) => toDisplayRow(normalizeMailRow(r), reasonOptions)
        );
        const snap = JSON.parse(JSON.stringify(mapped));
        setGridRows(mapped);
        setSnapshotRows(snap);
        setGridError(null);
        return mapped;
      }
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(
        (data == null ? void 0 : data.message) || intl.formatMessage({
          id: "label.returnMailTracking.grid.loadFailed",
          defaultMessage: "Failed to load return mail data"
        })
      );
      return [];
    } catch (err) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(
        ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "label.returnMailTracking.grid.loadFailed",
          defaultMessage: "Failed to load return mail data"
        })
      );
      return [];
    } finally {
      setGridLoading(false);
    }
  }, [selectedRow, intl, reasonOptions]);
  reactExports.useEffect(() => {
    if (reasonOptions.length > 0) {
      fetchMailList();
    }
  }, [fetchMailList, reasonOptions]);
  reactExports.useEffect(() => {
    const fetchReturnReasons = async () => {
      var _a;
      try {
        const res = await Kr.GET(
          ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId)
        );
        const data = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) || [];
        const options = data.map((item) => ({
          value: item.szCondition,
          label: intl.formatMessage({
            id: item.szi18nDesc,
            defaultMessage: item.szi18nDesc
          }),
          i18nKey: item.szi18nDesc
        }));
        setReasonOptions(options);
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "label.returnMailTracking.reason.fetch.error",
            defaultMessage: "Unable to load return reasons"
          })
        );
      }
    };
    fetchReturnReasons();
  }, [intl, toast]);
  const accountKey = reactExports.useMemo(() => {
    if (!selectedRow) return "";
    const partitionCode = selectedRow.PARTITION_CODE ?? selectedRow.szPartitionCode ?? "";
    const custSeqNo = selectedRow.CUST_SEQNO ?? "";
    const caseSeqNo = selectedRow.CASE_SEQNO ?? "";
    return `${partitionCode}-${custSeqNo}-${caseSeqNo}`;
  }, [selectedRow]);
  reactExports.useEffect(() => {
    setGridRows([]);
    setSnapshotRows([]);
  }, [accountKey]);
  const isDirty = reactExports.useMemo(
    () => JSON.stringify(gridRows) !== JSON.stringify(snapshotRows),
    [gridRows, snapshotRows]
  );
  const handlePatchRow = reactExports.useCallback((mailSeqNo, patch) => {
    setGridRows(
      (prev) => prev.map((r) => {
        if (r.mailSeqNo !== mailSeqNo) return r;
        let next = { ...r, ...patch };
        if (patch.badMarked === "N") {
          next = {
            ...next,
            returned: "N",
            returnDate: "",
            returnReasonKey: "",
            returnReason: ""
          };
        }
        if (patch.badMarked === "Y") {
          next.returned = "Y";
        }
        return next;
      })
    );
  }, []);
  const resetForm = reactExports.useCallback(() => {
    setGridRows(JSON.parse(JSON.stringify(snapshotRows)));
  }, [snapshotRows]);
  const handleSave = reactExports.useCallback(async () => {
    var _a, _b, _c;
    if (!selectedRow) {
      toast.error(
        intl.formatMessage({
          id: "label.returnMailTracking.error.noAccount",
          defaultMessage: "No account selected"
        })
      );
      return { data: { status: "Failure" } };
    }
    const snapById = new Map(snapshotRows.map((r) => [r.mailSeqNo, r]));
    const changed = gridRows.filter(
      (r) => rowTrackSig(r) !== rowTrackSig(snapById.get(r.mailSeqNo) || {})
    );
    for (const r of gridRows) {
      if (String(r.badMarked || "").toUpperCase() === "Y") {
        if (!r.returnDate || !r.returnReasonKey) {
          toast.error(
            intl.formatMessage(
              {
                id: "label.returnMailTracking.validation.rowReturnDateReason",
                defaultMessage: "Return date and reason required for {mail}"
              },
              { mail: r.mailCode || r.mailSeqNo }
            )
          );
          return { data: { status: "Failure" } };
        }
      }
    }
    if (!changed.length) {
      toast.info(
        intl.formatMessage({
          id: "label.returnMailTracking.save.noChanges",
          defaultMessage: "No changes to save"
        })
      );
      return { data: { status: "success" } };
    }
    try {
      for (const row of changed) {
        const reasonText = row.returnReasonKey ? formatReasonKey(reasonOptions, row.returnReasonKey) : "";
        const payload = {
          mailSeqNo: row.mailSeqNo,
          mailReturn: {
            chMailReturned: String(row.returned || "").toUpperCase() === "Y" ? "Y" : "N",
            chBadMarkedYn: String(row.badMarked || "").toUpperCase() === "Y" ? "Y" : "N",
            dtMailReturned: row.returnDate || null,
            szMailReturnReason: reasonText
          },
          addressPatch: buildAddressPayloadPatch({
            address1: row.address1,
            address2: row.address2,
            address3: row.address3,
            address4: row.address4,
            area: row.area,
            city: row.city,
            state: row.state,
            zip: row.zip
          })
        };
        const res = await Kr.PUT(
          `${ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId)}/return-mail-tracking`,
          payload
        );
        const data = res.data;
        const statusOk = typeof (data == null ? void 0 : data.status) === "string" && data.status.toLowerCase() === "success";
        if (!statusOk) {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "label.returnMailTracking.save.error",
              defaultMessage: "Save failed"
            })
          );
          return { data: { status: "Failure" } };
        }
      }
      toast.success(
        intl.formatMessage({
          id: "label.returnMailTracking.save.success",
          defaultMessage: "Saved successfully"
        })
      );
      await fetchMailList();
      return { data: { status: "success" } };
    } catch (err) {
      const msg = ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) === 404 ? intl.formatMessage({
        id: "label.returnMailTracking.save.backendPending",
        defaultMessage: "Backend not available"
      }) : ((_c = (_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || intl.formatMessage({
        id: "label.returnMailTracking.save.error",
        defaultMessage: "Save failed"
      });
      toast.warning(msg);
      return { data: { status: "Failure" } };
    }
  }, [selectedRow, gridRows, snapshotRows, intl, toast, fetchMailList]);
  const handleClose = reactExports.useCallback(() => {
    if (isDirty && !window.confirm(
      intl.formatMessage({
        id: "label.returnMailTracking.confirm.discard",
        defaultMessage: "Discard unsaved changes?"
      })
    )) {
      return { data: { status: "Failure" } };
    }
    navigate("/homelayout/welcomepage");
    return { data: { status: "success" } };
  }, [isDirty, intl, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.returnMailTracking.title",
        defaultMessage: "Return Mail Tracking"
      }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              px: { xs: 2, sm: 3, md: 4 },
              pb: { xs: 10, sm: 12 },
              pt: 1,
              flexDirection: "column",
              gap: 2,
              width: "100%",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ReturnMailSummaryBar, { rows: gridRows }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReturnMailTrackingGrid,
                {
                  rowData: gridRows,
                  loading: gridLoading,
                  loadError: gridError,
                  onPatchRow: handlePatchRow,
                  reasonOptions
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: resetForm,
            onClose: handleClose,
            disableToast: { save: true, reset: true, close: true }
          }
        ) })
      ] })
    }
  );
}
export {
  ReturnMailTracking as default
};
