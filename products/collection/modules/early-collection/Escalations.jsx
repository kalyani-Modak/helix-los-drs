import React, { useMemo, useState, useEffect, useCallback } from "react";
import { TrendingUpOutlined, WarningAmberOutlined, VisibilityOutlined, NorthEastOutlined, } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HBox, HButtonBar, HLabel, HPaper, HTextarea, useDrsTheme, HCheckBox, HAgGrid, HAxiosService, useToast } from "@helix/component-library";

import FunctionLayout from "./FunctionLayout.jsx";
import { EscalationAPI } from "./apiEndpoints.jsx";
import { useLocation } from "react-router-dom";    

function EscalationTypeChip({ value }) {
  return (
    <HBox
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        width: "fit-content",
      }}
    >
      <HLabel
        value={value || "-"}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 11, fontWeight: 600 }}
      />
    </HBox>
  );
}

function StatCard({ card }) {
  const { colors, border, text } = useDrsTheme();
  const Icon = card.icon;
  const palette = {
    warning: colors?.warning || "#f59e0b",
    success: colors?.success || "#22c55e",
    info: colors?.primary || "#2563eb",
  };
  const color = palette[card.tone] || "#64748b";

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2,
        borderColor: border.divider,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <HBox
        sx={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          color,
          background: `${color}15`,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 15 }} />
      </HBox>
      <HLabel
        value={card.label}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 11, color: text.secondary, fontWeight: 500, flex: 1 }}
      />
      <HLabel
        value={String(card.value)}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 14, fontWeight: 700, color: text.primary }}
      />
    </HPaper>
  );
}

export default function Escalation() {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const { text, border } = useDrsTheme();
  const { selectedRow } = useSelector((state) => state.account);

  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [supervisorNotes, setSupervisorNotes] = useState("");
  const [activeRows, setActiveRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const stats = {
    active: activeRows.length,
    reviewedThisWeek: historyRows.length,
    escalationLevel: "0",
  };

  const activeGridHeight = useMemo(() => {
    const headerHeight = 30;
    const rowHeight = 38;
    const paginationHeight = 48;
    const pageSize = 5;

    return headerHeight + rowHeight * pageSize + paginationHeight;
  }, []);

  const fetchEscalations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HAxiosService.GET(
        EscalationAPI.findEscalationsByAllocSeqNo(screenMenuId),
      );
      const data = res?.data?.responseJson;
      if (data) {
        const mappedActive = (data.lstPendingEscalations || []).map((item) => ({
          id: item.lnEscalateSeqNo,
          lnEscalateSeqNo: item.lnEscalateSeqNo,
          szPartitionCode: item.szPartitionCode,
          escalationType: item.szEscalationType || "-",
          requestedDate: item.dtCreatedOn || "-",
          requestedBy: item.szCreatedBy || "-",
          escalationDetails: item.szSystemRemark || "-",
          szMode: item.szMode,
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
            reviewDate: item.dtModifiedOn || "-",
          }),
        );

        setActiveRows(mappedActive);
        setHistoryRows(mappedHistory);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        intl.formatMessage({
          id: "label.escalation.loadFailed",
          defaultMessage: "Failed to load escalations.",
        });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    fetchEscalations();
  }, [fetchEscalations]);

  // ── Save handler ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    const selectedRows = activeRows.filter((row) => selectedRowIds.has(row.id));
    if (selectedRows.length === 0) {
      toast.error(
        intl.formatMessage({
          id: "label.escalation.noRowSelected",
          defaultMessage: "Please select an escalation.",
        }),
      );
      return;
    }
    if (!supervisorNotes.trim()) {
      toast.error(
        intl.formatMessage({
          id: "label.escalation.notesRequired",
          defaultMessage: "Please enter supervisor notes.",
        }),
      );
      return;
    }

    const payload = {
      lstEscalationDtos: selectedRows.map((row) => ({
        lnEscalateSeqNo: row.lnEscalateSeqNo,
        szPartitionCode: row.szPartitionCode,
        szSystemRemark: supervisorNotes,
        szMode: "E",
      })),
    };

    try {
      const res = await HAxiosService.POST(
        EscalationAPI.updateEscalations(screenMenuId),
        payload,
      );
      const data = res?.data ?? {};
      const success =
        typeof data.status === "string"
          ? data.status.toLowerCase() === "success"
          : res?.status >= 200 && res?.status < 300;

      if (success) {
        setSupervisorNotes("");
        setSelectedRowIds(new Set());
        await fetchEscalations();
        return { success: true };
      } else {
        toast.error(
          data.message ||
            intl.formatMessage({
              id: "label.escalation.saveFailed",
              defaultMessage: "Failed to update escalation.",
            }),
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          intl.formatMessage({
            id: "label.escalation.saveFailed",
            defaultMessage: "Failed to update escalation.",
          }),
      );
    }
  }, [
    activeRows,
    selectedRowIds,
    supervisorNotes,
    intl,
    toast,
    fetchEscalations,
  ]);

  const handleReset = useCallback(() => {
    setSupervisorNotes("");
    setSelectedRowIds(new Set());
  }, []);

  const toggleRow = (id) =>
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const activeColumnDefs = useMemo(
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
          justifyContent: "center",
        }),
        cellRenderer: (params) => {
          const active = Boolean(
            params?.data?.id && selectedRowIds.has(params.data.id),
          );
          return (
            <HBox
              data-escalation-checkbox="true"
              component="button"
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(params.data.id);
              }}
              sx={{
                border: 0,
                background: "transparent",
                p: 0.5,
                width: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 1,
              }}
            >
              <HCheckBox checked={active} onChange={() => {}} label="" />
            </HBox>
          );
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.type",
          defaultMessage: "Escalation Type",
        }),
        field: "escalationType",
        flex: 1.1,
        minWidth: 160,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => <EscalationTypeChip value={params?.value} />,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.requestedDate",
          defaultMessage: "Requested Date",
        }),
        field: "requestedDate",
        width: 130,
        editable: false,
        filter: false,
        type: "date",
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.requestedBy",
          defaultMessage: "Requested By",
        }),
        field: "requestedBy",
        width: 140,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.table.details",
          defaultMessage: "Escalation Details",
        }),
        field: "escalationDetails",
        flex: 2,
        minWidth: 260,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => (
          <HBox
            sx={{
              background: "transparent",
              alignItems: "center",
              width: "100%",
            }}
          >
            <HLabel
              value={params?.data?.escalationDetails || "-"}
              translate={false}
              align="left"
              colon={false}
              sx={{
                fontSize: 11,
                color: text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </HBox>
        ),
        tooltipValueGetter: (params) => params?.data?.escalationDetails || "-",
      },
    ],
    [intl, selectedRowIds, text.primary],
  );

  const historyColumnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.date",
          defaultMessage: "Date",
        }),
        field: "date",
        width: 120,
        editable: false,
        filter: false,
        type: "date",
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.type",
          defaultMessage: "Type",
        }),
        field: "type",
        width: 160,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => <EscalationTypeChip value={params?.value} />,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.detail",
          defaultMessage: "Detail",
        }),
        field: "detail",
        flex: 1.5,
        minWidth: 220,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.level",
          defaultMessage: "Level",
        }),
        field: "level",
        width: 80,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.rule",
          defaultMessage: "Rule",
        }),
        field: "rule",
        flex: 1,
        minWidth: 160,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.wfState",
          defaultMessage: "WF State",
        }),
        field: "wfState",
        width: 120,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.collector",
          defaultMessage: "Collector",
        }),
        field: "collector",
        width: 120,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.group",
          defaultMessage: "Group",
        }),
        field: "group",
        width: 100,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.reviewBy",
          defaultMessage: "Review By",
        }),
        field: "reviewBy",
        width: 120,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.escalation.history.reviewDate",
          defaultMessage: "Review Date",
        }),
        field: "reviewDate",
        width: 120,
        editable: false,
        filter: false,
        type: "date",
      },
    ],
    [intl],
  );

  const summaryCards = [
    {
      label: intl.formatMessage({
        id: "label.escalation.active",
        defaultMessage: "Active Escalations",
      }),
      value: stats.active,
      tone: "warning",
      icon: WarningAmberOutlined,
    },
    {
      label: intl.formatMessage({
        id: "label.escalation.reviewedThisWeek",
        defaultMessage: "Reviewed This Week",
      }),
      value: stats.reviewedThisWeek,
      tone: "info",
      icon: VisibilityOutlined,
    },
    {
      label: intl.formatMessage({
        id: "label.escalation.level",
        defaultMessage: "Escalation Level",
      }),
      value: stats.escalationLevel,
      tone: "success",
      icon: TrendingUpOutlined,
    },
  ];

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.escalation.title",
        defaultMessage: "Escalation",
      })}
      contentPaddingTop={0}
      scrollMode="auto"
    >
      <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 2,
          pt: 1.5,
          pb: 0,
          boxSizing: "border-box",
          background: "transparent",
        }}
      >
        {/* ── Stat Cards ── */}
        <HBox
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0,1fr))",
              lg: "repeat(3, minmax(0,1fr))",
            },
            gap: 1.5,
            background: "transparent",
          }}
        >
          {summaryCards.map((card) => (
            <StatCard key={card.label} card={card} />
          ))}
        </HBox>

        {/* ── Active Escalations Grid ── */}
        <HPaper
          variant="outlined"
          elevation={0}
          sx={{
            borderRadius: 2,
            borderColor: border.divider,
            overflow: "hidden", // ✅ changed from visible to hidden
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <HBox
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.75,
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${border.divider}`,
            }}
          >
            <NorthEastOutlined sx={{ fontSize: 14, color: "#f59e0b" }} />
            <HLabel
              value={intl.formatMessage({
                id: "label.escalation.active.title",
                defaultMessage: "Active Escalations",
              })}
              translate={false}
              align="left"
              colon={false}
              sx={{ fontSize: 13, fontWeight: 700, color: text.primary }}
            />
          </HBox>

          {/* Grid */}
          <HAgGrid
            rowData={activeRows}
            columnDefs={activeColumnDefs}
            gridStyle={{
              width: "100%",
              height: `${activeGridHeight}px`,
            }}
            pagination={true}
            paginationPageSize={5}
            sort={false}
            allowUpdate={false}
            hideInternalSaveButton
            embeddedInSection
            isLoading={loading && activeRows.length === 0}
          />
        </HPaper>

        {/* ── Supervisor Notes ── */}
        <HPaper
          variant="outlined"
          elevation={0}
          sx={{
            borderRadius: 2,
            borderColor: border.divider,
            p: 1.5,
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.escalation.supervisorNotes",
              defaultMessage: "Supervisor Notes",
            })}
            translate={false}
            align="left"
            colon={false}
            required
            sx={{ fontSize: 12, fontWeight: 600, mb: 0.75 }}
          />
          <HTextarea
            value={supervisorNotes}
            onChange={(e) => setSupervisorNotes(e.target.value)}
            width="100%"
            rows={3}
            placeholder={intl.formatMessage({
              id: "label.escalation.supervisorNotes.placeholder",
              defaultMessage:
                "Enter review notes for selected escalation(s)...",
            })}
          />
        </HPaper>

        {/* ── Escalation History Grid ── */}
        <HPaper
          variant="outlined"
          elevation={0}
          sx={{
            borderRadius: 2,
            borderColor: border.divider,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${border.divider}`,
            }}
          >
            <HLabel
              value={intl.formatMessage({
                id: "label.escalation.history.title",
                defaultMessage: "Escalation History",
              })}
              translate={false}
              align="left"
              colon={false}
              sx={{ fontSize: 13, fontWeight: 700, color: text.primary }}
            />
          </HBox>
          <HAgGrid
            rowData={historyRows}
            columnDefs={historyColumnDefs}
            gridStyle={{
              width: "100%",
              height: "auto",
            }}
            pagination={true}
            paginationPageSize={5}
            sort={true}
            allowUpdate={false}
            hideInternalSaveButton
            embeddedInSection
          />
        </HPaper>
      </HBox>
      <HBox sx={{ position: "relative", zIndex: 2000 }}>
        <HButtonBar
          onSave={handleSave}
          onReset={handleReset}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
      </HBox>
    </FunctionLayout>
  );
}
