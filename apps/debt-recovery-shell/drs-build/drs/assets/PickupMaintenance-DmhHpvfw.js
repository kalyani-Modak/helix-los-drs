import { cI as dayjs, ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, ef as useLocation, dD as lE, dB as jsxRuntimeExports, M as Chip, aX as Kr, bo as PickupMaintenanceAPI, ac as Dt, dK as ps, bg as Paper, aM as Grid, bH as SE, cg as Ug, cs as ap, dI as pp, cy as bu, cj as Vg, cr as alpha } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
function formatLocalDateForApi(value) {
  if (value == null) return null;
  const d = dayjs.isDayjs(value) ? value : dayjs(value);
  if (!d.isValid()) return null;
  return d.format("YYYY-MM-DD");
}
function buildPickupMaintenanceUpdatePayload(row) {
  const rawAmt = row.bdVisitForAmt != null ? String(row.bdVisitForAmt).trim() : "";
  const amt = rawAmt === "" ? null : Number(rawAmt.replace(/,/g, ""));
  return {
    pickUpVisitMaintenanceDto: {
      lnActivitySeqNo: row.lnActivitySeqNo,
      szCompleted: row.szCompleted === "" || row.szCompleted == null ? null : row.szCompleted,
      szRemarks: row.szRemarks ?? "",
      szVisitFor: row.szVisitFor ?? "",
      szContactPerson: row.szContactPerson ?? "",
      bdVisitForAmt: Number.isFinite(amt) ? amt : null,
      dtVisitDate: formatLocalDateForApi(row.dtVisitDate),
      szVisitedBy: row.szVisitedBy ?? "",
      dtActivity: formatLocalDateForApi(row.dtActivity) ?? void 0
    }
  };
}
const fieldContainerStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: "4px"
};
function normalizeCompleted(value) {
  if (value == null || String(value).trim() === "") return "";
  return String(value).trim().toUpperCase();
}
function mapPendingFromApi(item) {
  const dtVisitDate = item.dtVisitDate ? dayjs(item.dtVisitDate) : null;
  const dtActivity = item.dtActivity ? dayjs(item.dtActivity) : null;
  const dtPickupDate = item.dtPickupDate ? dayjs(item.dtPickupDate) : null;
  const nc = normalizeCompleted(item.szCompleted);
  const szCompleted = nc === "Y" || nc === "N" ? nc : "";
  const reqDateLabel = (dtPickupDate == null ? void 0 : dtPickupDate.isValid()) ? dtPickupDate.format("YYYY-MM-DD") : (dtActivity == null ? void 0 : dtActivity.isValid()) ? dtActivity.format("YYYY-MM-DD") : "";
  const reqAmount = item.bdPickupAmt != null ? String(item.bdPickupAmt) : item.bdVisitForAmt != null ? String(item.bdVisitForAmt) : "";
  return {
    lnActivitySeqNo: item.lnActivitySeqNo,
    szCompleted,
    szRemarks: item.szRemarks ?? "",
    szVisitFor: item.szVisitFor ?? "",
    szContactPerson: item.szContactPerson ?? "",
    bdVisitForAmt: item.bdVisitForAmt != null ? String(item.bdVisitForAmt) : "",
    dtVisitDate: (dtVisitDate == null ? void 0 : dtVisitDate.isValid()) ? dtVisitDate : null,
    szVisitedBy: item.szVisitedBy ?? "",
    dtActivity: (dtActivity == null ? void 0 : dtActivity.isValid()) ? dtActivity : null,
    reqAmount,
    reqContact: item.szPickupContact ?? "",
    reqDateLabel,
    reqUser: item.szCreatedBy ?? item.szPickupCollector ?? ""
  };
}
function statusChipSx(status, theme) {
  if (status === "Y") {
    return {
      bgcolor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.dark,
      border: `1px solid ${alpha(theme.palette.success.main, 0.35)}`
    };
  }
  if (status === "N") {
    return {
      bgcolor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.error.dark,
      border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`
    };
  }
  return {
    bgcolor: alpha(theme.palette.warning.main, 0.14),
    color: theme.palette.warning.dark,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`
  };
}
function validateRowForCompletion(row, intl, sectionIndexOneBased) {
  const c = row.szCompleted;
  if (!c) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  if (!row.dtVisitDate || !dayjs(row.dtVisitDate).isValid()) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  if (!String(row.bdVisitForAmt ?? "").trim()) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  if (!String(row.szContactPerson ?? "").trim()) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  if (!String(row.szVisitedBy ?? "").trim()) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  if (!String(row.szRemarks ?? "").trim()) {
    return intl.formatMessage({ id: "label.pickupMaintenance.validation.section" }, { n: sectionIndexOneBased });
  }
  return null;
}
function PickupMaintenanceDetails() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [loading, setLoading] = reactExports.useState(false);
  const [pendingRows, setPendingRows] = reactExports.useState([]);
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [errors, setErrors] = reactExports.useState({});
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const statusOptions = reactExports.useMemo(
    () => [
      { value: "Y", label: intl.formatMessage({ id: "label.pickupMaintenance.status.successful" }) },
      { value: "N", label: intl.formatMessage({ id: "label.pickupMaintenance.status.unsuccessful" }) }
    ],
    [intl]
  );
  const historyColumnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.index" }),
        field: "rowIndex",
        // width: 90,
        filter: false,
        cellStyle: { textAlign: lE.TEXT, alignItems: "center" }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.status" }),
        field: "szCompleted",
        // width: 150,
        filter: false,
        sortable: false,
        cellRenderer: () => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Chip,
          {
            size: "small",
            label: intl.formatMessage({ id: "label.pickupMaintenance.status.successful" }),
            sx: (theme) => ({ height: 18, fontSize: 9, ...statusChipSx("Y", theme) })
          }
        ),
        cellStyle: { display: "flex", alignItems: "center" }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.actualDate" }),
        field: "dtVisitDate",
        type: "datetime",
        // width: 150,
        filter: false,
        cellStyle: { textAlign: lE.DATE }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.amount" }),
        field: "bdVisitForAmt",
        // width: 130,
        filter: false,
        valueFormatter: (params) => params.value != null ? String(params.value) : "-",
        cellStyle: { textAlign: lE.NUMBER }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.contact" }),
        field: "szContactPerson",
        // width: 180,
        filter: false,
        valueFormatter: (params) => params.value || "-",
        cellStyle: { textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.remarks" }),
        field: "szRemarks",
        // width: 240,
        filter: false,
        valueFormatter: (params) => params.value || "-",
        cellStyle: { textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.reqDate" }),
        field: "dtActivity",
        type: "date",
        // width: 150,
        filter: false,
        cellStyle: { textAlign: lE.DATE }
      }
    ],
    [intl]
  );
  const historyGridRows = reactExports.useMemo(
    () => historyRows.map((row, index) => ({
      ...row,
      rowIndex: index + 1,
      szCompleted: "Y"
    })),
    [historyRows]
  );
  const historyGridStyle = reactExports.useMemo(
    () => ({
      // width: "100%",
      height: historyRows.length === 0 ? "150px" : "300px"
    }),
    [historyRows.length]
  );
  const loadData = reactExports.useCallback(async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      setPendingRows([]);
      setHistoryRows([]);
      setErrors({});
      return;
    }
    setLoading(true);
    try {
      const [pendingRes, histRes] = await Promise.all([
        Kr.GET(`${PickupMaintenanceAPI.PickupApi(screenMenuId)}/getPendingPickupMaintenance`),
        Kr.GET(PickupMaintenanceAPI.PickupApi(screenMenuId))
      ]);
      if (((_b = (_a = pendingRes.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) !== "success") {
        if ((_c = pendingRes.data) == null ? void 0 : _c.responseJson) {
          handleValidationErrors(intl, toast, pendingRes.data.responseJson);
        } else {
          toast.error(((_d = pendingRes.data) == null ? void 0 : _d.msg) || intl.formatMessage({ id: "label.pickupMaintenance.loadError" }));
        }
        setPendingRows([]);
      } else {
        const raw = Array.isArray((_e = pendingRes.data) == null ? void 0 : _e.responseJson) ? pendingRes.data.responseJson : [];
        setPendingRows(raw.map(mapPendingFromApi));
        setErrors({});
      }
      if (((_g = (_f = histRes.data) == null ? void 0 : _f.status) == null ? void 0 : _g.toLowerCase()) !== "success") {
        setHistoryRows([]);
      } else {
        const rawH = Array.isArray((_h = histRes.data) == null ? void 0 : _h.responseJson) ? histRes.data.responseJson : [];
        setHistoryRows(rawH);
      }
    } catch (e) {
      if ((_j = (_i = e.response) == null ? void 0 : _i.data) == null ? void 0 : _j.responseJson) {
        handleValidationErrors(intl, toast, e.response.data.responseJson);
      } else {
        toast.error(intl.formatMessage({ id: "label.pickupMaintenance.loadError" }));
      }
      setPendingRows([]);
      setHistoryRows([]);
      setErrors({});
    } finally {
      setLoading(false);
    }
  }, [selectedRow, intl, toast]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const updateRow = (lnActivitySeqNo, patch) => {
    setPendingRows(
      (prev) => prev.map((r) => r.lnActivitySeqNo === lnActivitySeqNo ? { ...r, ...patch } : r)
    );
    setErrors((prev) => {
      const current = prev[lnActivitySeqNo];
      if (!current) return prev;
      const nextRowErrors = { ...current };
      Object.keys(patch).forEach((field) => {
        delete nextRowErrors[field];
      });
      if (Object.keys(nextRowErrors).length === 0) {
        const next = { ...prev };
        delete next[lnActivitySeqNo];
        return next;
      }
      return { ...prev, [lnActivitySeqNo]: nextRowErrors };
    });
  };
  const buildRowErrors = (row) => {
    const rowErrors = {};
    if (!row.szCompleted) rowErrors.szCompleted = true;
    if (!row.dtVisitDate || !dayjs(row.dtVisitDate).isValid()) rowErrors.dtVisitDate = true;
    if (!String(row.bdVisitForAmt ?? "").trim()) rowErrors.bdVisitForAmt = true;
    if (!String(row.szContactPerson ?? "").trim()) rowErrors.szContactPerson = true;
    if (!String(row.szVisitedBy ?? "").trim()) rowErrors.szVisitedBy = true;
    if (!String(row.szRemarks ?? "").trim()) rowErrors.szRemarks = true;
    return rowErrors;
  };
  const handleSave = async () => {
    var _a, _b, _c, _d, _e;
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(intl.formatMessage({ id: "label.pickupMaintenance.noAccount" }));
      return;
    }
    if (pendingRows.length === 0) {
      toast.error(intl.formatMessage({ id: "label.pickupMaintenance.emptyPending" }));
      return;
    }
    const validationErrors = {};
    for (let i = 0; i < pendingRows.length; i += 1) {
      const row = pendingRows[i];
      const rowErrors = buildRowErrors(row);
      if (Object.keys(rowErrors).length > 0) {
        validationErrors[row.lnActivitySeqNo] = rowErrors;
      }
      const err = validateRowForCompletion(pendingRows[i], intl, i + 1);
      if (err) {
        setErrors(validationErrors);
        toast.error(err);
        return;
      }
    }
    setErrors({});
    let failures = 0;
    for (const row of pendingRows) {
      try {
        const payload = buildPickupMaintenanceUpdatePayload(row);
        const res = await Kr.PUT(`${PickupMaintenanceAPI.PickupApi(screenMenuId)}/updatePickUpVisitMaintenance`, payload);
        if (((_b = (_a = res.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) !== "success") {
          failures += 1;
          if ((_c = res.data) == null ? void 0 : _c.responseJson) {
            handleValidationErrors(intl, toast, res.data.responseJson);
          }
        }
      } catch (err) {
        failures += 1;
        if ((_e = (_d = err.response) == null ? void 0 : _d.data) == null ? void 0 : _e.responseJson) {
          handleValidationErrors(intl, toast, err.response.data.responseJson);
        }
      }
    }
    if (failures === 0) {
      toast.success(intl.formatMessage({ id: "label.pickupMaintenance.saveSuccess" }));
      await loadData();
    } else if (failures < pendingRows.length) {
      toast.warning(intl.formatMessage({ id: "label.pickupMaintenance.savePartial" }));
      await loadData();
    } else {
      toast.error(intl.formatMessage({ id: "label.pickupMaintenance.savePartial" }));
    }
  };
  if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2, pb: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({ id: "label.pickupMaintenance.noAccount" }),
        translate: false,
        align: "left",
        colon: false,
        sx: { fontSize: 12, color: "text.secondary" }
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { p: { xs: 1.5, sm: 2 }, pb: 4, width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mb: 2.5 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({ id: "label.pickupMaintenance.pendingSection" }),
            translate: false,
            component: "span",
            align: "left",
            colon: false,
            sx: { fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: pendingRows.length, size: "small", sx: { height: 20, fontSize: 10, "& .MuiChip-label": { px: 0.75 } } })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "...", translate: false, component: "span", align: "left", colon: false, sx: { fontSize: 12, color: "text.secondary" } }) : pendingRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Paper, { variant: "outlined", sx: { borderRadius: 1, py: 4, textAlign: "center", borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({ id: "label.pickupMaintenance.emptyPending" }),
          translate: false,
          align: "center",
          colon: false,
          sx: { fontSize: 12, color: "text.secondary" }
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.5 }, children: pendingRows.map((row, idx) => {
        var _a, _b, _c, _d, _e, _f;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Paper,
          {
            variant: "outlined",
            sx: { borderRadius: 1, overflow: "hidden", borderColor: "divider" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    borderBottom: 1,
                    borderColor: "divider"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ps,
                        {
                          value: `#${idx + 1}`,
                          translate: false,
                          component: "span",
                          align: "left",
                          colon: false,
                          sx: { fontSize: 10, fontFamily: "monospace", color: "text.secondary" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Chip,
                        {
                          size: "small",
                          label: row.szCompleted === "Y" ? intl.formatMessage({ id: "label.pickupMaintenance.status.successful" }) : row.szCompleted === "N" ? intl.formatMessage({ id: "label.pickupMaintenance.status.unsuccessful" }) : intl.formatMessage({ id: "label.pickupMaintenance.status.pending" }),
                          sx: (theme) => ({
                            height: 20,
                            fontSize: 10,
                            ...statusChipSx(row.szCompleted || "PENDING", theme)
                          })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: `${intl.formatMessage({ id: "label.pickupMaintenance.requestedDate" })}: ${row.reqDateLabel || "-"}`,
                        translate: false,
                        component: "span",
                        align: "left",
                        colon: false,
                        sx: { fontSize: 10, color: "text.secondary" }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { p: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1, mb: 1.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.reqAmount" }), translate: false, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.reqAmount || "-", translate: false, align: "left", colon: false, sx: { fontSize: 12, fontWeight: 600 } })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.reqContact" }), translate: false, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.reqContact || "-", translate: false, align: "left", colon: false, sx: { fontSize: 12 } })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.reqDate" }), translate: false, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.reqDateLabel || "-", translate: false, align: "left", colon: false, sx: { fontSize: 12, fontFamily: "monospace" } })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.reqUser" }), translate: false, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.reqUser || "-", translate: false, align: "left", colon: false, sx: { fontSize: 12, fontFamily: "monospace" } })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.status" }), translate: false, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SE,
                      {
                        name: "szCompleted",
                        options: statusOptions,
                        value: row.szCompleted,
                        onChange: (event) => updateRow(row.lnActivitySeqNo, { szCompleted: event.target.value }),
                        width: "100%",
                        error: Boolean((_a = errors[row.lnActivitySeqNo]) == null ? void 0 : _a.szCompleted)
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.actualDate" }), translate: false, required: true, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Ug,
                      {
                        value: row.dtVisitDate,
                        onChange: (v) => updateRow(row.lnActivitySeqNo, { dtVisitDate: v }),
                        width: "100%",
                        error: Boolean((_b = errors[row.lnActivitySeqNo]) == null ? void 0 : _b.dtVisitDate)
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.actualAmount" }), translate: false, required: true, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        value: row.bdVisitForAmt,
                        onChange: (e) => updateRow(row.lnActivitySeqNo, { bdVisitForAmt: e.target.value }),
                        editable: true,
                        align: lE.TEXT,
                        width: "100%",
                        error: Boolean((_c = errors[row.lnActivitySeqNo]) == null ? void 0 : _c.bdVisitForAmt),
                        type: "currency"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.contactPerson" }), translate: false, required: true, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        value: row.szContactPerson,
                        onChange: (e) => updateRow(row.lnActivitySeqNo, { szContactPerson: e.target.value }),
                        editable: true,
                        align: lE.TEXT,
                        width: "100%",
                        error: Boolean((_d = errors[row.lnActivitySeqNo]) == null ? void 0 : _d.szContactPerson),
                        length: 120,
                        type: "name"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.pickupUser" }), translate: false, required: true, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        value: row.szVisitedBy,
                        onChange: (e) => updateRow(row.lnActivitySeqNo, { szVisitedBy: e.target.value }),
                        editable: true,
                        align: lE.TEXT,
                        width: "100%",
                        error: Boolean((_e = errors[row.lnActivitySeqNo]) == null ? void 0 : _e.szVisitedBy),
                        type: "name",
                        length: 15
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.pickupMaintenance.remarks" }), translate: false, required: true, align: "left", colon: false }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      pp,
                      {
                        value: row.szRemarks,
                        width: "100%",
                        onChange: (e) => updateRow(row.lnActivitySeqNo, { szRemarks: e.target.value }),
                        rows: 3,
                        error: Boolean((_f = errors[row.lnActivitySeqNo]) == null ? void 0 : _f.szRemarks)
                      }
                    )
                  ] }) })
                ] })
              ] })
            ]
          },
          row.lnActivitySeqNo
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mb: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({ id: "label.pickupMaintenance.previousSection" }),
            translate: false,
            component: "span",
            align: "left",
            colon: false,
            sx: { fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: historyRows.length, size: "small", sx: { height: 20, fontSize: 10, "& .MuiChip-label": { px: 0.75 } } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paper, { variant: "outlined", sx: { borderRadius: 1, overflow: "hidden", borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          rowData: historyGridRows,
          columnDefs: historyColumnDefs,
          gridStyle: historyGridStyle,
          pagination: true,
          paginationPageSize: 5,
          sort: true
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onReset: loadData,
        onClose: () => navigate("/homelayout/welcomepage")
      }
    )
  ] });
}
const PickupMaintenance = () => {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FunctionLayout, { title: intl.formatMessage({ id: "label.pickupMaintenance.title" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        position: "relative"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(PickupMaintenanceDetails, {})
    }
  ) });
};
export {
  PickupMaintenance as default
};
