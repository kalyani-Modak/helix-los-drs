import React, { useMemo, useState } from "react";
import {
  Alert,
  Chip,
  Tab,
  Tabs,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useIntl } from "react-intl";
import { HBox, HLabel, HPaper, useDrsTheme, HAgGrid } from "@helix/component-library";

const compactHeader = {
  fontSize: "10px",
  fontWeight: 600,
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: "0.02em",
};

const compactCell = {
  fontSize: "11px",
  fontFamily: '"Inter", system-ui, sans-serif',
  lineHeight: 1.45,
  whiteSpace: "normal",
};

/**
 * Tabbed activities vs tasks history (Interface Delight–aligned). Presentational only.
 */
export default function ActivitiesAndTasks({
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
  tasksUnavailable,
}) {
  const intl = useIntl();
  const { theme, surfaces, text, border, action } = useDrsTheme();
  const [tab, setTab] = useState(0);

  const themedHeader = useMemo(
    () => ({
      ...compactHeader,
      color: text.secondary,
      backgroundColor: surfaces.panel,
    }),
    [surfaces.panel, text.secondary],
  );

  const themedCell = useMemo(
    () => ({
      ...compactCell,
      color: text.primary,
    }),
    [text.primary],
  );

  const activitiesColDefs = useMemo(
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
        tooltipField: "activity",
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
        cellStyle: themedCell,
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.activities.by" }),
        field: "activityBy",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: { ...themedCell, fontFamily: "ui-monospace, monospace" },
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
        tooltipField: "remark",
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
        tooltipField: "systemRemark",
      },
    ],
    [intl, text.secondary, themedCell, themedHeader],
  );

  const tasksColDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.action" }),
        field: "action",
        flex: 1,
        minWidth: 120,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell,
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
        cellStyle: themedCell,
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.dueTo" }),
        field: "dueTo",
        flex: 0.9,
        minWidth: 110,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell,
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
        cellStyle: themedCell,
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.status" }),
        field: "status",
        flex: 0.5,
        minWidth: 80,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell,
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
        cellStyle: themedCell,
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.reason" }),
        field: "reason",
        flex: 1,
        minWidth: 120,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: themedCell,
      },
      {
        headerName: intl.formatMessage({ id: "label.activitiesTasks.tasks.requestedBy" }),
        field: "requestedBy",
        flex: 0.8,
        minWidth: 100,
        editable: false,
        filter: false,
        headerStyle: themedHeader,
        cellStyle: { ...themedCell, fontFamily: "ui-monospace, monospace" },
      },
    ],
    [intl, themedCell, themedHeader],
  );

  // HAgGrid applies gridStyle as DOM `style={...}` — only string/number CSS values (not MUI breakpoint objects).
  const gridStylePlain = {
    width: "100%",
    minWidth: "560px",
    height: "min(460px, 55vh)",
    maxHeight: "460px",
    minHeight: "280px",
    overflowX: "hidden",
    overflowY: "hidden",
  };

  const activitiesCount = Number.isFinite(Number(activitiesTotalElements))
    ? Number(activitiesTotalElements)
    : (activitiesRowData?.length ?? 0);
  const tasksCount = tasksRowData?.length ?? 0;

  const tabLabel = (messageId, count, icon) => (
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, background: "transparent" }}>
      {icon}
      <HLabel
        component="span"
        value={intl.formatMessage({ id: messageId })}
        translate={false}
        colon={false}
        align="left"
        sx={{ fontSize: "12px", fontWeight: 600, color: text.primary }}
      />
      <Chip
        size="small"
        label={count}
        sx={{
          height: 20,
          minWidth: 20,
          backgroundColor: action.selected,
          color: text.secondary,
          "& .MuiChip-label": { px: 0.75, fontSize: "10px", fontWeight: 600 },
        }}
      />
    </HBox>
  );

  return (
    <HBox
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "hidden",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
      }}
    >
      <HPaper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderColor: border.divider,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <HBox sx={{ px: 2, pt: 2, pb: 1, borderBottom: 1, borderColor: border.divider }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 36,
              backgroundColor: surfaces.panel,
              borderRadius: 2,
              p: 0.5,
              display: "inline-flex",
              "& .MuiTabs-flexContainer": {
                gap: 0.5,
              },
              "& .MuiTabs-indicator": {
                display: "none",
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
                  boxShadow: theme.shadows[1],
                },
                "&:hover": {
                  backgroundColor: action.hover,
                },
              },
            }}
          >
            <Tab
              disableRipple
              label={tabLabel(
                "label.activitiesTasks.tab.activities",
                activitiesCount,
                <TimelineIcon sx={{ fontSize: 18 }} />
              )}
            />
            <Tab
              disableRipple
              label={tabLabel(
                "label.activitiesTasks.tab.tasks",
                tasksCount,
                <AssignmentOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            />
          </Tabs>
        </HBox>

        {tab === 0 && (
          <HBox sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, p: 1 }}>
            {activitiesError ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                {intl.formatMessage({ id: "label.activitiesTasks.activities.error" })}
              </Alert>
            ) : null}
            {!activitiesLoading && !activitiesError && activitiesCount === 0 ? (
              <HLabel
                value={intl.formatMessage({ id: "label.activitiesTasks.activities.empty" })}
                translate={false}
                colon={false}
                align="left"
                sx={{ mb: 1, fontSize: 13 }}
              />
            ) : null}
            <HBox
              sx={{
                flex: 1,
                minHeight: 0,
                "& > div": { marginTop: "0 !important" },
              }}
            >
              <HAgGrid
                rowData={activitiesRowData}
                columnDefs={activitiesColDefs}
                gridStyle={gridStylePlain}
                rowModelType="infinite"
                datasource={activitiesDatasource}
                cacheBlockSize={activitiesCacheBlockSize || activitiesPageSize}
                maxBlocksInCache={activitiesMaxBlocksInCache}
                pagination={true}
                paginationPageSize={activitiesPageSize}
                domLayout="normal"
                sort
                allowUpdate={false}
                isLoading={Boolean(activitiesLoading && !(activitiesRowData?.length > 0))}
                hideInternalSaveButton
              />
            </HBox>
          </HBox>
        )}

        {tab === 1 && (
          <HBox sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, p: 1 }}>
            {tasksUnavailable ? (
              <Alert severity="info" sx={{ mb: 1 }}>
                {intl.formatMessage({ id: "label.activitiesTasks.tasks.placeholder" })}
              </Alert>
            ) : null}
            {tasksError ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                {intl.formatMessage({ id: "label.activitiesTasks.tasks.error" })}
              </Alert>
            ) : null}
            <HBox
              sx={{
                flex: 1,
                minHeight: 0,
                "& > div": { marginTop: "0 !important" },
              }}
            >
              <HAgGrid
                rowData={tasksRowData || []}
                columnDefs={tasksColDefs}
                gridStyle={gridStylePlain}
                pagination={true}
                paginationPageSize={10}
                domLayout="normal"
                sort
                allowUpdate={false}
                isLoading={tasksLoading}
                hideInternalSaveButton
              />
            </HBox>
          </HBox>
        )}
      </HPaper>
    </HBox>
  );
}
