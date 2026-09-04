import React, { useMemo, useState } from "react";
import { FollowupAPI } from "../apiEndpoints";
import { HAxiosService, ALIGNMENT, HBox, HLabel, HPaper, HAgGrid } from "@helix/component-library";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { Typography } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
 import { useLocation } from "react-router-dom";


/**
 * PTP (promise-to-pay) history from col-followup/getPromiseHistory.
 */
export default function PtpHistoryGrid({ reloadFlag }) {
  const { selectedRow } = useSelector((state) => state.account);
  const intl = useIntl();
  const PAGE_SIZE = 5;
  const [rowData, setRowData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const colDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.takenOn", defaultMessage: "Taken on" }),
        field: "dtCreatedOn",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.DATE, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.promiseDate", defaultMessage: "Promise date" }),
        field: "dtPromise",
        type: "date",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.DATE, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.amount", defaultMessage: "Amount" }),
        field: "bdPromiseAmt",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.NUMBER, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.status", defaultMessage: "Status" }),
        field: "szDesc",
        minWidth: 140,
        flex: 1.6,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.pmtDate", defaultMessage: "Pmt date" }),
        field: "dtPayment",
        type: "date",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.DATE, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.pmtAmt", defaultMessage: "Pmt amt" }),
        field: "bdPaymentAmt",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.NUMBER, whiteSpace: "normal", lineHeight: 1.25 },
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.by", defaultMessage: "By" }),
        field: "szCollectorCode",
        minWidth: 120,
        flex: 1.2,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25 },
      },
    ],
    [intl]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      flex: 1,
    }),
    []
  );

  const gridStyle = {
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
          const res = await HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/getPromiseHistory`, {
            pageNumber,
            size,
            pageSize: size,
          });

          const ok =
            typeof res?.data?.status === "string" &&
            res.data.status.toLowerCase() === "success";
          const responseJson = res?.data?.responseJson;
          const rows = Array.isArray(responseJson)
            ? responseJson
            : Array.isArray(responseJson?.content)
              ? responseJson.content
              : Array.isArray(res?.data?.data)
                ? res.data.data
                : [];

          const totalElementsRaw = Number(
            res?.data?.totalElements ??
            res?.data?.totalCount ??
            responseJson?.totalElements ??
            responseJson?.totalCount ??
            rows.length
          );
          const lastRow = Number.isFinite(totalElementsRaw) ? totalElementsRaw : rows.length;

          if (ok) {
            setRowData(rows);
            params.successCallback?.(rows, lastRow);
            return;
          }

          setRowData([]);
          setFetchError(
            res?.data?.msg ||
              intl.formatMessage({
                id: "label.followup.ptpHistoryLoadUnexpected",
                defaultMessage: "Could not load PTP history.",
              })
          );
          params.failCallback?.();
        } catch (err) {
          console.error(err);
          setRowData([]);
          setFetchError(
            err?.response?.data?.message ||
              intl.formatMessage({
                id: "label.followup.ptpHistoryLoadFailed",
                defaultMessage: "Failed to load PTP history.",
              })
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
          <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.ptpHistoryTitle",
              defaultMessage: "PTP History",
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
          key={`ptp-history-${selectedRow?.ACNT_SEQNO || "none"}-${reloadFlag ? "1" : "0"}`}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          gridStyle={gridStyle}
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
}
