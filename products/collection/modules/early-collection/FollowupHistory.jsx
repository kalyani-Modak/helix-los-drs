import React, { useMemo, useState } from "react";
import { Typography } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, ALIGNMENT, HBox, HLabel, HPaper, HAgGrid } from "@helix/component-library";
import { FollowupAPI } from "./apiEndpoints";
import { useLocation } from "react-router-dom";

const FollowupHistory = ({ reloadFlag }) => {
  const { selectedRow } = useSelector((state) => state.account);
  const intl = useIntl();
  const PAGE_SIZE = 7;

  const [objRowData, setObjRowData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const objColDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.followup.Date", defaultMessage: "Date" }),
        field: "dtAction",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.DATE, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.User", defaultMessage: "User" }),
        field: "szLogedInUser",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Action", defaultMessage: "Action" }),
        field: "szActionCode",
        minWidth: 120,
        flex: 1.2,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" }),
        field: "szResultCode",
        minWidth: 120,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.NextDate", defaultMessage: "Next Date" }),
        field: "dtNextAction",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.DATE, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Remark", defaultMessage: "Remarks" }),
        field: "szRemark",
        minWidth: 180,
        flex: 1.5,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
    ],
    [intl],
  );

  const objDefaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: false,
    resizable: true,
    flex: 1,
  };

  const objCustomGridStyle = {
    width: "100%",
    height: "32vh",
    minWidth: 0,
    overflowX: "hidden",
    "--ag-borders": "none",
  };

  const datasource = useMemo(() => {
    if (!selectedRow) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        setFetchError(null);

        try {
          const res = await HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/fetchFollowupHisForAcct`, {
            pageNumber,
            size,
            pageSize: size,
          });

          const statusOk =
            typeof res?.data?.status === "string" &&
            res.data.status.toLowerCase() === "success";

          const responseJson = res?.data?.responseJson;
          const rows = Array.isArray(responseJson)
            ? responseJson
            : Array.isArray(responseJson?.content)
              ? responseJson.content
              : [];

          const mappedRows = rows.map((item) => ({
            ...item,
            szLogedInUser: item.szLogedInUser || "ADMIN",
          }));

          const totalElementsRaw = Number(
            res?.data?.totalElements ??
            res?.data?.totalCount ??
            responseJson?.totalElements ??
            responseJson?.totalCount ??
            mappedRows.length
          );
          const lastRow = Number.isFinite(totalElementsRaw) ? totalElementsRaw : mappedRows.length;

          if (statusOk) {
            setObjRowData(mappedRows);
            params.successCallback?.(mappedRows, lastRow);
            return;
          }

          setObjRowData([]);
          setFetchError(
            res?.data?.msg ||
              intl.formatMessage({
                id: "label.followup.historyLoadUnexpected",
                defaultMessage: "Could not load follow-up history.",
              }),
          );
          params.failCallback?.();
        } catch (error) {
          console.error("Failed to fetch follow-up history", error);
          setObjRowData([]);
          setFetchError(
            error?.response?.data?.message ||
              intl.formatMessage({
                id: "label.followup.historyLoadFailed",
                defaultMessage: "Failed to load follow-up history.",
              }),
          );
          params.failCallback?.();
        }
      },
    };
  }, [intl, reloadFlag, selectedRow]);

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "var(--drs-border-divider)",
        bgcolor: "var(--drs-bg-paper)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HBox
        sx={{
          py: 1.5,
          px: 2,
          flexShrink: 0,
          bgcolor: "var(--drs-grid-header-bg)",
          borderBottom: 1,
          borderColor: "var(--drs-border-divider)",
        }}
      >
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "transparent" }}>
          <HistoryOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.History",
              defaultMessage: "Follow Up History",
            })}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--drs-text-primary)",
            }}
          />
        </HBox>
      </HBox>

      <HBox sx={{ p: 0, flex: 1, minHeight: 0 }}>
        {fetchError && (
          <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
            {fetchError}
          </Typography>
        )}
        <HAgGrid
          key={`followup-history-${selectedRow?.ACNT_SEQNO || "none"}-${reloadFlag ? "1" : "0"}`}
          rowData={objRowData}
          columnDefs={objColDefs}
          defaultColDef={objDefaultColDef}
          gridStyle={objCustomGridStyle}
          gridClassName="drs-list-grid drs-followup-history-grid"
          embeddedInSection
          rowModelType="infinite"
          datasource={datasource}
          cacheBlockSize={PAGE_SIZE}
          maxBlocksInCache={2}
          pagination
          paginationPageSize={PAGE_SIZE}
          domLayout="normal"
          sort
        />
      </HBox>
    </HPaper>
  );
};

export default FollowupHistory;
