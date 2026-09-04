import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, $ as $e, dN as reactExports, ac as Dt, aW as Kg, c6 as Tabs, b_ as Tab, i as Alert, dK as ps, cy as bu, M as Chip, n as AssignmentOutlinedIcon, el as useSelector, ef as useLocation, aX as Kr, br as PreviousActivitiesAPI, v as Box, cf as Typography } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as hasSelectedAccount } from "./overviewRequestBody-1w14I_g2.js";
const TimelineIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2"
}));
const compactHeader = {
  fontSize: "10px",
  fontWeight: 600,
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: "0.02em"
};
const compactCell = {
  fontSize: "11px",
  fontFamily: '"Inter", system-ui, sans-serif',
  lineHeight: 1.45,
  whiteSpace: "normal"
};
function ActivitiesAndTasks({
  activitiesRowData,
  activitiesLoading,
  activitiesError,
  activitiesPageSize = 10,
  activitiesTotalElements,
  activitiesDatasource,
  activitiesCacheBlockSize,
  activitiesMaxBlocksInCache,
  tasksRowData,
  tasksLoading,
  tasksError,
  tasksUnavailable
}) {
  const intl = useIntl();
  const { theme, surfaces, text, border, action } = $e();
  const [tab, setTab] = reactExports.useState(0);
  const themedHeader = reactExports.useMemo(
    () => ({
      ...compactHeader,
      color: text.secondary,
      backgroundColor: surfaces.panel
    }),
    [surfaces.panel, text.secondary]
  );
  const themedCell = reactExports.useMemo(
    () => ({
      ...compactCell,
      color: text.primary
    }),
    [text.primary]
  );
  const activitiesColDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.activity" }),
        field: "activity",
        flex: 1.2,
        minWidth: 140,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell,
        tooltipField: "activity"
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.date" }),
        field: "date",
        type: "datetime",
        flex: 0.9,
        minWidth: 120,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.by" }),
        field: "activityBy",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: { ...themedCell, fontFamily: "ui-monospace, monospace" }
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.remark" }),
        field: "remark",
        flex: 1.2,
        minWidth: 120,
        editable: false,
        filter: false,
        autoHeight: true,
        headerStyle: themedHeader,
        cellStyle: themedCell,
        tooltipField: "remark"
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.systemRemark" }),
        field: "systemRemark",
        flex: 1.2,
        minWidth: 120,
        editable: false,
        filter: false,
        autoHeight: true,
        headerStyle: themedHeader,
        cellStyle: { ...themedCell, color: text.secondary, fontStyle: "italic" },
        tooltipField: "systemRemark"
      }
    ],
    [intl, text.secondary, themedCell, themedHeader]
  );
  const tasksColDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.action" }),
        field: "action",
        flex: 1,
        minWidth: 120,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.requestDate" }),
        field: "requestDate",
        type: "date",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.dueTo" }),
        field: "dueTo",
        flex: 0.9,
        minWidth: 110,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.execDate" }),
        field: "execDate",
        type: "date",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.status" }),
        field: "status",
        flex: 0.5,
        minWidth: 80,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.statusDate" }),
        field: "statusDate",
        type: "date",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.reason" }),
        field: "reason",
        flex: 1,
        minWidth: 120,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.requestedBy" }),
        field: "requestedBy",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: { ...themedCell, fontFamily: "ui-monospace, monospace" }
      }
    ],
    [intl, themedCell, themedHeader]
  );
  const gridStylePlain = {
    width: "100%",
    minWidth: "560px",
    height: "min(460px, 55vh)",
    maxHeight: "460px",
    minHeight: "280px",
    overflowX: "hidden",
    overflowY: "hidden"
  };
  const activitiesCount = Number.isFinite(Number(activitiesTotalElements)) ? Number(activitiesTotalElements) : (activitiesRowData == null ? void 0 : activitiesRowData.length) ?? 0;
  const tasksCount = (tasksRowData == null ? void 0 : tasksRowData.length) ?? 0;
  const tabLabel = (messageId, count, icon) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, background: "transparent" }, children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        component: "span",
        value: intl.formatMessage({ id: messageId }),
        translate: false,
        colon: false,
        align: "left",
        sx: { fontSize: "12px", fontWeight: 600, color: text.primary }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chip,
      {
        size: "small",
        label: count,
        sx: {
          height: 20,
          minWidth: 20,
          backgroundColor: action.selected,
          color: text.secondary,
          "& .MuiChip-label": { px: 0.75, fontSize: "10px", fontWeight: 600 }
        }
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        flex: 1,
        minHeight: 0,
        overflowY: "hidden",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "transparent"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Kg,
        {
          variant: "outlined",
          sx: {
            borderRadius: 2,
            borderColor: border.divider,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2, pt: 2, pb: 1, borderBottom: 1, borderColor: border.divider }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Tabs,
              {
                value: tab,
                onChange: (_, v) => setTab(v),
                variant: "scrollable",
                scrollButtons: "auto",
                sx: {
                  minHeight: 36,
                  backgroundColor: surfaces.panel,
                  borderRadius: 2,
                  p: 0.5,
                  display: "inline-flex",
                  "& .MuiTabs-flexContainer": {
                    gap: 0.5
                  },
                  "& .MuiTabs-indicator": {
                    display: "none"
                  },
                  "& .MuiTab-root": {
                    minHeight: 32,
                    py: 0.5,
                    px: 1.5,
                    textTransform: "none",
                    borderRadius: 1.5,
                    color: text.secondary,
                    "&.Mui-selected": {
                      color: text.primary,
                      backgroundColor: surfaces.paper,
                      boxShadow: theme.shadows[1]
                    },
                    "&:hover": {
                      backgroundColor: action.hover
                    }
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tab,
                    {
                      disableRipple: true,
                      label: tabLabel(
                        "label.activitiesTasks.tab.activities",
                        activitiesCount,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineIcon, { sx: { fontSize: 18 } })
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tab,
                    {
                      disableRipple: true,
                      label: tabLabel(
                        "label.activitiesTasks.tab.tasks",
                        tasksCount,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AssignmentOutlinedIcon, { sx: { fontSize: 18 } })
                      )
                    }
                  )
                ]
              }
            ) }),
            tab === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, p: 1 }, children: [
              activitiesError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 1 }, children: intl.formatMessage({ id: "label.activitiesTasks.activities.error" }) }) : null,
              !activitiesLoading && !activitiesError && activitiesCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({ id: "label.activitiesTasks.activities.empty" }),
                  translate: false,
                  colon: false,
                  align: "left",
                  sx: { mb: 1, fontSize: 13 }
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: {
                    flex: 1,
                    minHeight: 0,
                    "& > div": { marginTop: "0 !important" }
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    bu,
                    {
                      rowData: activitiesRowData,
                      columnDefs: activitiesColDefs,
                      gridStyle: gridStylePlain,
                      rowModelType: "infinite",
                      datasource: activitiesDatasource,
                      cacheBlockSize: activitiesCacheBlockSize || activitiesPageSize,
                      maxBlocksInCache: activitiesMaxBlocksInCache,
                      pagination: true,
                      paginationPageSize: activitiesPageSize,
                      domLayout: "normal",
                      sort: true,
                      allowUpdate: false,
                      isLoading: Boolean(activitiesLoading && !((activitiesRowData == null ? void 0 : activitiesRowData.length) > 0)),
                      hideInternalSaveButton: true
                    }
                  )
                }
              )
            ] }),
            tab === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, p: 1 }, children: [
              tasksUnavailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "info", sx: { mb: 1 }, children: intl.formatMessage({ id: "label.activitiesTasks.tasks.placeholder" }) }) : null,
              tasksError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 1 }, children: intl.formatMessage({ id: "label.activitiesTasks.tasks.error" }) }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: {
                    flex: 1,
                    minHeight: 0,
                    "& > div": { marginTop: "0 !important" }
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    bu,
                    {
                      rowData: tasksRowData || [],
                      columnDefs: tasksColDefs,
                      gridStyle: gridStylePlain,
                      pagination: true,
                      paginationPageSize: 10,
                      domLayout: "normal",
                      sort: true,
                      allowUpdate: false,
                      isLoading: tasksLoading,
                      hideInternalSaveButton: true
                    }
                  )
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const DEFAULT_ACTIVITY_PAGE_SIZE = 10;
function extractPreviousActivityDetailsList(payload) {
  var _a, _b, _c, _d, _e;
  if (payload == null) return null;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return null;
  const p = payload;
  const candidates = [
    p.previousActivityDetailsDto,
    p.previous_activity_details_dto,
    p.previousActivityDetails,
    p.previous_activity_details,
    (_a = p.data) == null ? void 0 : _a.previousActivityDetailsDto,
    (_b = p.data) == null ? void 0 : _b.previous_activity_details_dto,
    (_c = p.result) == null ? void 0 : _c.previousActivityDetailsDto,
    (_d = p.body) == null ? void 0 : _d.previousActivityDetailsDto,
    (_e = p.response) == null ? void 0 : _e.previousActivityDetailsDto
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    if (c && typeof c === "object" && Array.isArray(c.content)) return c.content;
  }
  if (Object.prototype.hasOwnProperty.call(p, "previousActivityDetailsDto") && p.previousActivityDetailsDto == null) {
    return [];
  }
  if (Object.prototype.hasOwnProperty.call(p, "previous_activity_details_dto") && p.previous_activity_details_dto == null) {
    return [];
  }
  return null;
}
function mapActivitiesDto(dtoList, intl) {
  if (!Array.isArray(dtoList) || dtoList.length === 0) return [];
  return dtoList.map((item, index) => {
    const activityCode = item.szActivity ?? item.sz_activity ?? item.activity ?? "";
    const activityLabel = activityCode ? intl.formatMessage({
      id: `label.menu.${activityCode}`,
      defaultMessage: activityCode
    }) : "";
    return {
      srNo: index + 1,
      activity: activityLabel,
      date: item.dtActivity ?? item.dt_activity ?? item.date ?? "",
      activityBy: item.szCollectorCode ?? item.sz_collector_code ?? item.activityBy ?? item.collectorCode ?? "",
      remark: item.szRemark ?? item.sz_remark ?? item.remark ?? "",
      systemRemark: item.szSystemRemark ?? item.sz_system_remark ?? item.systemRemark ?? ""
    };
  });
}
const PreviousActivities = () => {
  const intl = useIntl();
  const { selectedRow } = useSelector((state) => state.account);
  const [activitiesRowData, setActivitiesRowData] = reactExports.useState([]);
  const [activitiesLoading, setActivitiesLoading] = reactExports.useState(true);
  const [activitiesError, setActivitiesError] = reactExports.useState(null);
  const [activitiesPageSize, setActivitiesPageSize] = reactExports.useState(DEFAULT_ACTIVITY_PAGE_SIZE);
  const [activitiesTotalElements, setActivitiesTotalElements] = reactExports.useState(0);
  const [tasksRowData] = reactExports.useState([]);
  const [tasksLoading] = reactExports.useState(false);
  const [tasksError] = reactExports.useState(null);
  const tasksUnavailable = true;
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    if (!hasSelectedAccount(selectedRow)) {
      setActivitiesRowData([]);
      setActivitiesError(null);
      setActivitiesTotalElements(0);
      setActivitiesLoading(false);
      return;
    }
    setActivitiesLoading(true);
    setActivitiesError(null);
  }, [selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO]);
  const activitiesDatasource = reactExports.useMemo(() => {
    if (!hasSelectedAccount(selectedRow)) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || activitiesPageSize;
        const pageSize = Math.max(1, endRow - startRow);
        const page = Math.floor(startRow / pageSize);
        setActivitiesLoading(true);
        setActivitiesError(null);
        try {
          const res = await Kr.GET(PreviousActivitiesAPI.fetchPrevious(page, pageSize, screenMenuId));
          if (res == null || res.data == null || res.status < 200 || res.status >= 300) {
            setActivitiesRowData([]);
            setActivitiesTotalElements(0);
            setActivitiesError("network");
            (_a = params.failCallback) == null ? void 0 : _a.call(params);
            return;
          }
          let payload = res.data;
          if (typeof payload === "string") {
            try {
              payload = JSON.parse(payload);
            } catch {
              setActivitiesRowData([]);
              setActivitiesTotalElements(0);
              setActivitiesError("shape");
              (_b = params.failCallback) == null ? void 0 : _b.call(params);
              return;
            }
          }
          const list = extractPreviousActivityDetailsList(payload);
          if (list === null) {
            setActivitiesRowData([]);
            setActivitiesTotalElements(0);
            setActivitiesError("shape");
            (_c = params.failCallback) == null ? void 0 : _c.call(params);
            return;
          }
          const mappedRows = mapActivitiesDto(list, intl);
          const responsePageSize = Number(payload == null ? void 0 : payload.size);
          const totalElements = Number(payload == null ? void 0 : payload.totalElements);
          const lastRow = Number.isFinite(totalElements) ? totalElements : -1;
          if (Number.isFinite(responsePageSize) && responsePageSize > 0 && responsePageSize !== activitiesPageSize) {
            setActivitiesPageSize(responsePageSize);
          }
          setActivitiesRowData(mappedRows);
          setActivitiesTotalElements(Number.isFinite(totalElements) ? totalElements : mappedRows.length);
          setActivitiesError(null);
          (_d = params.successCallback) == null ? void 0 : _d.call(params, mappedRows, lastRow);
        } catch {
          setActivitiesRowData([]);
          setActivitiesTotalElements(0);
          setActivitiesError("network");
          (_e = params.failCallback) == null ? void 0 : _e.call(params);
        } finally {
          setActivitiesLoading(false);
        }
      }
    };
  }, [activitiesPageSize, intl, selectedRow]);
  if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FunctionLayout,
      {
        title: intl.formatMessage({ id: "label.activitiesTasks.pageTitle" }),
        breadcrumbMid: intl.formatMessage({ id: "label.activitiesTasks.breadcrumbMid" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", children: intl.formatMessage({ id: "label.activitiesTasks.noAccountSelected" }) }) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.activitiesTasks.pageTitle" }),
      breadcrumbMid: intl.formatMessage({ id: "label.activitiesTasks.breadcrumbMid" }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Box,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            width: "100%",
            maxWidth: 1320,
            mx: "auto",
            px: { xs: 1.5, sm: 2 },
            py: 1
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActivitiesAndTasks,
            {
              activitiesRowData,
              activitiesLoading,
              activitiesError,
              activitiesPageSize,
              activitiesTotalElements,
              activitiesDatasource,
              activitiesCacheBlockSize: activitiesPageSize,
              activitiesMaxBlocksInCache: 2,
              tasksRowData,
              tasksLoading,
              tasksError,
              tasksUnavailable
            }
          )
        }
      )
    }
  );
};
export {
  PreviousActivities as default
};
