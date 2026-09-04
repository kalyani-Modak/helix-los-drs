import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, eh as useNavigate, ct as ar, $ as $e, el as useSelector, dN as reactExports, ef as useLocation, aX as Kr, af as EscalationAPI, ac as Dt, cB as cc, dK as ps, cl as VisibilityOutlined, aW as Kg, cy as bu, dI as pp, cj as Vg } from "./index-BhdgJqva.js";
import { W as WarningAmberOutlined } from "./WarningAmberOutlined-Dk2s5JuY.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
const NorthEastOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"
}));
const TrendingUpOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
}));
function EscalationTypeChip({ value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        width: "fit-content"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: value || "-",
          translate: false,
          align: "left",
          colon: false,
          sx: { fontSize: 11, fontWeight: 600 }
        }
      )
    }
  );
}
function StatCard({ card }) {
  const { colors, border, text } = $e();
  const Icon = card.icon;
  const palette = {
    warning: (colors == null ? void 0 : colors.warning) || "#f59e0b",
    success: (colors == null ? void 0 : colors.success) || "#22c55e",
    info: (colors == null ? void 0 : colors.primary) || "#2563eb"
  };
  const color = palette[card.tone] || "#64748b";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        px: 2,
        py: 1.25,
        borderRadius: 2,
        borderColor: border.divider,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 1
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color,
              background: `${color}15`,
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 15 } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: card.label,
            translate: false,
            align: "left",
            colon: false,
            sx: { fontSize: 11, color: text.secondary, fontWeight: 500, flex: 1 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: String(card.value),
            translate: false,
            align: "left",
            colon: false,
            sx: { fontSize: 14, fontWeight: 700, color: text.primary }
          }
        )
      ]
    }
  );
}
function Escalation() {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = ar();
  const { text, border } = $e();
  const { selectedRow } = useSelector((state) => state.account);
  const [selectedRowIds, setSelectedRowIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [supervisorNotes, setSupervisorNotes] = reactExports.useState("");
  const [activeRows, setActiveRows] = reactExports.useState([]);
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const stats = {
    active: activeRows.length,
    reviewedThisWeek: historyRows.length,
    escalationLevel: "0"
  };
  const activeGridHeight = reactExports.useMemo(() => {
    const headerHeight = 30;
    const rowHeight = 38;
    const paginationHeight = 48;
    const pageSize = 5;
    return headerHeight + rowHeight * pageSize + paginationHeight;
  }, []);
  const fetchEscalations = reactExports.useCallback(async () => {
    var _a, _b, _c;
    setLoading(true);
    try {
      const res = await Kr.GET(
        EscalationAPI.findEscalationsByAllocSeqNo(screenMenuId)
      );
      const data = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson;
      if (data) {
        const mappedActive = (data.lstPendingEscalations || []).map((item) => ({
          id: item.lnEscalateSeqNo,
          lnEscalateSeqNo: item.lnEscalateSeqNo,
          szPartitionCode: item.szPartitionCode,
          escalationType: item.szEscalationType || "-",
          requestedDate: item.dtCreatedOn || "-",
          requestedBy: item.szCreatedBy || "-",
          escalationDetails: item.szSystemRemark || "-",
          szMode: item.szMode
        }));
        const mappedHistory = (data.lstHistoryEscalations || []).map(
          (item) => ({
            id: item.lnHisEscSeqNo,
            date: item.dtCreatedOn || "-",
            type: item.szEscalationType || "-",
            detail: item.szSystemRemark || "-",
            level: item.szRefField1 || "-",
            rule: item.szRefField2 || "-",
            wfState: "-",
            collector: item.szRaisedBy || "-",
            group: item.szCollectorGrpCode || "-",
            reviewBy: item.szCreatedBy || "-",
            reviewDate: item.dtModifiedOn || "-"
          })
        );
        setActiveRows(mappedActive);
        setHistoryRows(mappedHistory);
      }
    } catch (error) {
      const msg = ((_c = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || intl.formatMessage({
        id: "label.escalation.loadFailed",
        defaultMessage: "Failed to load escalations."
      });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    fetchEscalations();
  }, [fetchEscalations]);
  const handleSave = reactExports.useCallback(async () => {
    var _a, _b;
    const selectedRows = activeRows.filter((row) => selectedRowIds.has(row.id));
    if (selectedRows.length === 0) {
      toast.error(
        intl.formatMessage({
          id: "label.escalation.noRowSelected",
          defaultMessage: "Please select an escalation."
        })
      );
      return;
    }
    if (!supervisorNotes.trim()) {
      toast.error(
        intl.formatMessage({
          id: "label.escalation.notesRequired",
          defaultMessage: "Please enter supervisor notes."
        })
      );
      return;
    }
    const payload = {
      lstEscalationDtos: selectedRows.map((row) => ({
        lnEscalateSeqNo: row.lnEscalateSeqNo,
        szPartitionCode: row.szPartitionCode,
        szSystemRemark: supervisorNotes,
        szMode: "E"
      }))
    };
    try {
      const res = await Kr.POST(
        EscalationAPI.updateEscalations(screenMenuId),
        payload
      );
      const data = (res == null ? void 0 : res.data) ?? {};
      const success = typeof data.status === "string" ? data.status.toLowerCase() === "success" : (res == null ? void 0 : res.status) >= 200 && (res == null ? void 0 : res.status) < 300;
      if (success) {
        setSupervisorNotes("");
        setSelectedRowIds(/* @__PURE__ */ new Set());
        await fetchEscalations();
        return { success: true };
      } else {
        toast.error(
          data.message || intl.formatMessage({
            id: "label.escalation.saveFailed",
            defaultMessage: "Failed to update escalation."
          })
        );
      }
    } catch (error) {
      toast.error(
        ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "label.escalation.saveFailed",
          defaultMessage: "Failed to update escalation."
        })
      );
    }
  }, [
    activeRows,
    selectedRowIds,
    supervisorNotes,
    intl,
    toast,
    fetchEscalations
  ]);
  const handleReset = reactExports.useCallback(() => {
    setSupervisorNotes("");
    setSelectedRowIds(/* @__PURE__ */ new Set());
  }, []);
  const toggleRow = (id) => setSelectedRowIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const activeColumnDefs = reactExports.useMemo(
    () => [
      {
        headerName: "",
        field: "__select__",
        width: 52,
        suppressMenu: true,
        filter: false,
        sortable: false,
        editable: false,
        cellStyle: () => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }),
        cellRenderer: (params) => {
          var _a;
          const active = Boolean(
            ((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.id) && selectedRowIds.has(params.data.id)
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              "data-escalation-checkbox": "true",
              component: "button",
              type: "button",
              onMouseDown: (e) => e.stopPropagation(),
              onClick: (e) => {
                e.stopPropagation();
                toggleRow(params.data.id);
              },
              sx: {
                border: 0,
                background: "transparent",
                p: 0.5,
                width: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 1
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(cc, { checked: active, onChange: () => {
              }, label: "" })
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.type",
          defaultMessage: "Escalation Type"
        }),
        field: "escalationType",
        flex: 1.1,
        minWidth: 160,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(EscalationTypeChip, { value: params == null ? void 0 : params.value })
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.requestedDate",
          defaultMessage: "Requested Date"
        }),
        field: "requestedDate",
        width: 130,
        editable: false,
        filter: false,
        type: "date"
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.requestedBy",
          defaultMessage: "Requested By"
        }),
        field: "requestedBy",
        width: 140,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.details",
          defaultMessage: "Escalation Details"
        }),
        field: "escalationDetails",
        flex: 2,
        minWidth: 260,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                background: "transparent",
                alignItems: "center",
                width: "100%"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: ((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.escalationDetails) || "-",
                  translate: false,
                  align: "left",
                  colon: false,
                  sx: {
                    fontSize: 11,
                    color: text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }
                }
              )
            }
          );
        },
        tooltipValueGetter: (params) => {
          var _a;
          return ((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.escalationDetails) || "-";
        }
      }
    ],
    [intl, selectedRowIds, text.primary]
  );
  const historyColumnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.date",
          defaultMessage: "Date"
        }),
        field: "date",
        width: 120,
        editable: false,
        filter: false,
        type: "date"
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.type",
          defaultMessage: "Type"
        }),
        field: "type",
        width: 160,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(EscalationTypeChip, { value: params == null ? void 0 : params.value })
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.detail",
          defaultMessage: "Detail"
        }),
        field: "detail",
        flex: 1.5,
        minWidth: 220,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.level",
          defaultMessage: "Level"
        }),
        field: "level",
        width: 80,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.rule",
          defaultMessage: "Rule"
        }),
        field: "rule",
        flex: 1,
        minWidth: 160,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.wfState",
          defaultMessage: "WF State"
        }),
        field: "wfState",
        width: 120,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.collector",
          defaultMessage: "Collector"
        }),
        field: "collector",
        width: 120,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.group",
          defaultMessage: "Group"
        }),
        field: "group",
        width: 100,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.reviewBy",
          defaultMessage: "Review By"
        }),
        field: "reviewBy",
        width: 120,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.reviewDate",
          defaultMessage: "Review Date"
        }),
        field: "reviewDate",
        width: 120,
        editable: false,
        filter: false,
        type: "date"
      }
    ],
    [intl]
  );
  const summaryCards = [
    {
      label: intl.formatMessage({
        id: "label.escalation.active",
        defaultMessage: "Active Escalations"
      }),
      value: stats.active,
      tone: "warning",
      icon: WarningAmberOutlined
    },
    {
      label: intl.formatMessage({
        id: "label.escalation.reviewedThisWeek",
        defaultMessage: "Reviewed This Week"
      }),
      value: stats.reviewedThisWeek,
      tone: "info",
      icon: VisibilityOutlined
    },
    {
      label: intl.formatMessage({
        id: "label.escalation.level",
        defaultMessage: "Escalation Level"
      }),
      value: stats.escalationLevel,
      tone: "success",
      icon: TrendingUpOutlined
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.escalation.title",
        defaultMessage: "Escalation"
      }),
      contentPaddingTop: 0,
      scrollMode: "auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  px: 2,
                  pt: 1.5,
                  pb: 0,
                  boxSizing: "border-box",
                  background: "transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0,1fr))",
                          lg: "repeat(3, minmax(0,1fr))"
                        },
                        gap: 1.5,
                        background: "transparent"
                      },
                      children: summaryCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { card }, card.label))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Kg,
                    {
                      variant: "outlined",
                      elevation: 0,
                      sx: {
                        borderRadius: 2,
                        borderColor: border.divider,
                        overflow: "hidden",
                        // ✅ changed from visible to hidden
                        flexShrink: 0
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
                              px: 2,
                              py: 1.25,
                              borderBottom: `1px solid ${border.divider}`
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(NorthEastOutlined, { sx: { fontSize: 14, color: "#f59e0b" } }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ps,
                                {
                                  value: intl.formatMessage({
                                    id: "label.escalation.active.title",
                                    defaultMessage: "Active Escalations"
                                  }),
                                  translate: false,
                                  align: "left",
                                  colon: false,
                                  sx: { fontSize: 13, fontWeight: 700, color: text.primary }
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          bu,
                          {
                            rowData: activeRows,
                            columnDefs: activeColumnDefs,
                            gridStyle: {
                              width: "100%",
                              height: `${activeGridHeight}px`
                            },
                            pagination: true,
                            paginationPageSize: 5,
                            sort: false,
                            allowUpdate: false,
                            hideInternalSaveButton: true,
                            embeddedInSection: true,
                            isLoading: loading && activeRows.length === 0
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Kg,
                    {
                      variant: "outlined",
                      elevation: 0,
                      sx: {
                        borderRadius: 2,
                        borderColor: border.divider,
                        p: 1.5,
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 1
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.escalation.supervisorNotes",
                              defaultMessage: "Supervisor Notes"
                            }),
                            translate: false,
                            align: "left",
                            colon: false,
                            required: true,
                            sx: { fontSize: 12, fontWeight: 600, mb: 0.75 }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          pp,
                          {
                            value: supervisorNotes,
                            onChange: (e) => setSupervisorNotes(e.target.value),
                            width: "100%",
                            rows: 3,
                            placeholder: intl.formatMessage({
                              id: "label.escalation.supervisorNotes.placeholder",
                              defaultMessage: "Enter review notes for selected escalation(s)..."
                            })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Kg,
                    {
                      variant: "outlined",
                      elevation: 0,
                      sx: {
                        borderRadius: 2,
                        borderColor: border.divider,
                        overflow: "hidden",
                        flexShrink: 0
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              display: "flex",
                              alignItems: "center",
                              px: 2,
                              py: 1.25,
                              borderBottom: `1px solid ${border.divider}`
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              ps,
                              {
                                value: intl.formatMessage({
                                  id: "label.escalation.history.title",
                                  defaultMessage: "Escalation History"
                                }),
                                translate: false,
                                align: "left",
                                colon: false,
                                sx: { fontSize: 13, fontWeight: 700, color: text.primary }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          bu,
                          {
                            rowData: historyRows,
                            columnDefs: historyColumnDefs,
                            gridStyle: {
                              width: "100%",
                              height: "auto"
                            },
                            pagination: true,
                            paginationPageSize: 5,
                            sort: true,
                            allowUpdate: false,
                            hideInternalSaveButton: true,
                            embeddedInSection: true
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: handleSave,
                onReset: handleReset,
                onClose: () => navigate("/homelayout/welcomepage")
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  Escalation as default
};
