import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Grid, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HAxiosService, ALIGNMENT, HBox, HButtonBar, HDatePicker, HDropdown, HLabel, HTextField, HTextarea, HAgGrid, useToast } from "@helix/component-library";

import { PickupMaintenanceAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";
import { buildPickupMaintenanceUpdatePayload } from "./pickupMaintenancePayloadBuilders.js";
import { useLocation } from "react-router-dom";
const fieldContainerStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: "4px",
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
  const reqDateLabel = dtPickupDate?.isValid()
    ? dtPickupDate.format("YYYY-MM-DD")
    : dtActivity?.isValid()
      ? dtActivity.format("YYYY-MM-DD")
      : "";
  const reqAmount =
    item.bdPickupAmt != null
      ? String(item.bdPickupAmt)
      : item.bdVisitForAmt != null
        ? String(item.bdVisitForAmt)
        : "";
  return {
    lnActivitySeqNo: item.lnActivitySeqNo,
    szCompleted,
    szRemarks: item.szRemarks ?? "",
    szVisitFor: item.szVisitFor ?? "",
    szContactPerson: item.szContactPerson ?? "",
    bdVisitForAmt: item.bdVisitForAmt != null ? String(item.bdVisitForAmt) : "",
    dtVisitDate: dtVisitDate?.isValid() ? dtVisitDate : null,
    szVisitedBy: item.szVisitedBy ?? "",
    dtActivity: dtActivity?.isValid() ? dtActivity : null,
    reqAmount,
    reqContact: item.szPickupContact ?? "",
    reqDateLabel,
    reqUser: item.szCreatedBy ?? item.szPickupCollector ?? "",
  };
}

function statusChipSx(status, theme) {
  if (status === "Y") {
    return {
      bgcolor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.dark,
      border: `1px solid ${alpha(theme.palette.success.main, 0.35)}`,
    };
  }
  if (status === "N") {
    return {
      bgcolor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.error.dark,
      border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
    };
  }
  return {
    bgcolor: alpha(theme.palette.warning.main, 0.14),
    color: theme.palette.warning.dark,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
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

export default function PickupMaintenanceDetails() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [pendingRows, setPendingRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const statusOptions = useMemo(
    () => [
      { value: "Y", label: intl.formatMessage({ id: "label.pickupMaintenance.status.successful" }) },
      { value: "N", label: intl.formatMessage({ id: "label.pickupMaintenance.status.unsuccessful" }) },
    ],
    [intl],
  );

  const historyColumnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.index" }),
        field: "rowIndex",
        // width: 90,
        filter: false,
        cellStyle: { textAlign: ALIGNMENT.TEXT, alignItems: "center" },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.status" }),
        field: "szCompleted",
        // width: 150,
        filter: false,
        sortable: false,
        cellRenderer: () => (
          <Chip
            size="small"
            label={intl.formatMessage({ id: "label.pickupMaintenance.status.successful" })}
            sx={(theme) => ({ height: 18, fontSize: 9, ...statusChipSx("Y", theme) })}
          />
        ),
        cellStyle: { display: "flex", alignItems: "center" },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.actualDate" }),
        field: "dtVisitDate",
        type: "datetime",
        // width: 150,
        filter: false,
        cellStyle: { textAlign: ALIGNMENT.DATE },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.amount" }),
        field: "bdVisitForAmt",
        // width: 130,
        filter: false,
        valueFormatter: (params) => (params.value != null ? String(params.value) : "-"),
        cellStyle: { textAlign: ALIGNMENT.NUMBER },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.contact" }),
        field: "szContactPerson",
        // width: 180,
        filter: false,
        valueFormatter: (params) => params.value || "-",
        cellStyle: { textAlign: ALIGNMENT.TEXT },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.remarks" }),
        field: "szRemarks",
        // width: 240,
        filter: false,
        valueFormatter: (params) => params.value || "-",
        cellStyle: { textAlign: ALIGNMENT.TEXT },
      },
      {
        headerName: intl.formatMessage({ id: "label.pickupMaintenance.table.reqDate" }),
        field: "dtActivity",
        type: "date",
        // width: 150,
        filter: false,
        cellStyle: { textAlign: ALIGNMENT.DATE },
      },
    ],
    [intl],
  );

  const historyGridRows = useMemo(
    () =>
      historyRows.map((row, index) => ({
        ...row,
        rowIndex: index + 1,
        szCompleted: "Y",
      })),
    [historyRows],
  );

  const historyGridStyle = useMemo(
    () => ({
      // width: "100%",
      height: historyRows.length === 0 ? "150px" : "300px",
    }),
    [historyRows.length],
  );

  const loadData = useCallback(async () => {
    if (!selectedRow?.ACNT_SEQNO) {
      setPendingRows([]);
      setHistoryRows([]);
      setErrors({});
      return;
    }
    setLoading(true);
    try {
      const [pendingRes, histRes] = await Promise.all([
        HAxiosService.GET(`${PickupMaintenanceAPI.PickupApi(screenMenuId)}/getPendingPickupMaintenance`),
        HAxiosService.GET(PickupMaintenanceAPI.PickupApi(screenMenuId)),
      ]);

      if (pendingRes.data?.status?.toLowerCase() !== "success") {
        if (pendingRes.data?.responseJson) {
          handleValidationErrors(intl, toast, pendingRes.data.responseJson);
        } else {
          toast.error(pendingRes.data?.msg || intl.formatMessage({ id: "label.pickupMaintenance.loadError" }));
        }
        setPendingRows([]);
      } else {
        const raw = Array.isArray(pendingRes.data?.responseJson) ? pendingRes.data.responseJson : [];
        setPendingRows(raw.map(mapPendingFromApi));
        setErrors({});
      }

      if (histRes.data?.status?.toLowerCase() !== "success") {
        setHistoryRows([]);
      } else {
        const rawH = Array.isArray(histRes.data?.responseJson) ? histRes.data.responseJson : [];
        setHistoryRows(rawH);
      }
    } catch (e) {
      if (e.response?.data?.responseJson) {
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateRow = (lnActivitySeqNo, patch) => {
    setPendingRows((prev) =>
      prev.map((r) => (r.lnActivitySeqNo === lnActivitySeqNo ? { ...r, ...patch } : r)),
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
    if (!selectedRow?.ACNT_SEQNO) {
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
        const res = await HAxiosService.PUT(`${PickupMaintenanceAPI.PickupApi(screenMenuId)}/updatePickUpVisitMaintenance`, payload);
        if (res.data?.status?.toLowerCase() !== "success") {
          failures += 1;
          if (res.data?.responseJson) {
            handleValidationErrors(intl, toast, res.data.responseJson);
          }
        }
      } catch (err) {
        failures += 1;
        if (err.response?.data?.responseJson) {
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

  if (!selectedRow?.ACNT_SEQNO) {
    return (
      <HBox sx={{ p: 2, pb: 4 }}>
        <HLabel
          value={intl.formatMessage({ id: "label.pickupMaintenance.noAccount" })}
          translate={false}
          align="left"
          colon={false}
          sx={{ fontSize: 12, color: "text.secondary" }}
        />
      </HBox>
    );
  }

  return (
    <HBox sx={{ p: { xs: 1.5, sm: 2 }, pb: 4, width: "100%" }}>
      <HBox sx={{ mb: 2.5 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <HLabel
            value={intl.formatMessage({ id: "label.pickupMaintenance.pendingSection" })}
            translate={false}
            component="span"
            align="left"
            colon={false}
            sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }}
          />
          <Chip label={pendingRows.length} size="small" sx={{ height: 20, fontSize: 10, "& .MuiChip-label": { px: 0.75 } }} />
        </HBox>

        {loading ? (
          <HLabel value="..." translate={false} component="span" align="left" colon={false} sx={{ fontSize: 12, color: "text.secondary" }} />
        ) : pendingRows.length === 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 1, py: 4, textAlign: "center", borderColor: "divider" }}>
            <HLabel
              value={intl.formatMessage({ id: "label.pickupMaintenance.emptyPending" })}
              translate={false}
              align="center"
              colon={false}
              sx={{ fontSize: 12, color: "text.secondary" }}
            />
          </Paper>
        ) : (
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {pendingRows.map((row, idx) => (
              <Paper
                key={row.lnActivitySeqNo}
                variant="outlined"
                sx={{ borderRadius: 1, overflow: "hidden", borderColor: "divider" }}
              >
                <HBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HLabel
                      value={`#${idx + 1}`}
                      translate={false}
                      component="span"
                      align="left"
                      colon={false}
                      sx={{ fontSize: 10, fontFamily: "monospace", color: "text.secondary" }}
                    />
                    <Chip
                      size="small"
                      label={
                        row.szCompleted === "Y"
                          ? intl.formatMessage({ id: "label.pickupMaintenance.status.successful" })
                          : row.szCompleted === "N"
                            ? intl.formatMessage({ id: "label.pickupMaintenance.status.unsuccessful" })
                            : intl.formatMessage({ id: "label.pickupMaintenance.status.pending" })
                      }
                      sx={(theme) => ({
                        height: 20,
                        fontSize: 10,
                        ...statusChipSx(row.szCompleted || "PENDING", theme),
                      })}
                    />
                  </HBox>
                  <HLabel
                    value={`${intl.formatMessage({ id: "label.pickupMaintenance.requestedDate" })}: ${row.reqDateLabel || "-"}`}
                    translate={false}
                    component="span"
                    align="left"
                    colon={false}
                    sx={{ fontSize: 10, color: "text.secondary" }}
                  />
                </HBox>

                <HBox sx={{ p: 1.5 }}>
                  <HBox sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1, mb: 1.5 }}>
                    <HBox>
                      <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.reqAmount" })} translate={false} align="left" colon={false} />
                      <HLabel value={row.reqAmount || "-"} translate={false} align="left" colon={false} sx={{ fontSize: 12, fontWeight: 600 }} />
                    </HBox>
                    <HBox>
                      <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.reqContact" })} translate={false} align="left" colon={false} />
                      <HLabel value={row.reqContact || "-"} translate={false} align="left" colon={false} sx={{ fontSize: 12 }} />
                    </HBox>
                    <HBox>
                      <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.reqDate" })} translate={false} align="left" colon={false} />
                      <HLabel value={row.reqDateLabel || "-"} translate={false} align="left" colon={false} sx={{ fontSize: 12, fontFamily: "monospace" }} />
                    </HBox>
                    <HBox>
                      <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.reqUser" })} translate={false} align="left" colon={false} />
                      <HLabel value={row.reqUser || "-"} translate={false} align="left" colon={false} sx={{ fontSize: 12, fontFamily: "monospace" }} />
                    </HBox>
                  </HBox>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.status" })} translate={false} align="left" colon={false} />
                        <HDropdown
                          name="szCompleted"
                          options={statusOptions}
                          value={row.szCompleted}
                          onChange={(event) => updateRow(row.lnActivitySeqNo, { szCompleted: event.target.value })}
                          width="100%"
                          error={Boolean(errors[row.lnActivitySeqNo]?.szCompleted)}
                        />
                      </HBox>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.actualDate" })} translate={false} required align="left" colon={false} />
                        <HDatePicker
                          value={row.dtVisitDate}
                          onChange={(v) => updateRow(row.lnActivitySeqNo, { dtVisitDate: v })}
                          width="100%"
                          error={Boolean(errors[row.lnActivitySeqNo]?.dtVisitDate)}
                        />
                      </HBox>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.actualAmount" })} translate={false} required align="left" colon={false} />
                        <HTextField
                          value={row.bdVisitForAmt}
                          onChange={(e) => updateRow(row.lnActivitySeqNo, { bdVisitForAmt: e.target.value })}
                          editable
                          align={ALIGNMENT.TEXT}
                          width="100%"
                          error={Boolean(errors[row.lnActivitySeqNo]?.bdVisitForAmt)}
                          type="currency"
                        />
                      </HBox>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.contactPerson" })} translate={false} required align="left" colon={false} />
                        <HTextField
                          value={row.szContactPerson}
                          onChange={(e) => updateRow(row.lnActivitySeqNo, { szContactPerson: e.target.value })}
                          editable
                          align={ALIGNMENT.TEXT}
                          width="100%"
                          error={Boolean(errors[row.lnActivitySeqNo]?.szContactPerson)}
                          length={120}
                          type="name"
                        />
                      </HBox>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.pickupUser" })} translate={false} required align="left" colon={false} />
                        <HTextField
                          value={row.szVisitedBy}
                          onChange={(e) => updateRow(row.lnActivitySeqNo, { szVisitedBy: e.target.value })}
                          editable
                          align={ALIGNMENT.TEXT}
                          width="100%"
                          error={Boolean(errors[row.lnActivitySeqNo]?.szVisitedBy)}
                           type="name"
                           length={15}
                        />
                      </HBox>
                    </Grid>
                    <Grid size={12}>
                      <HBox sx={fieldContainerStyles}>
                        <HLabel value={intl.formatMessage({ id: "label.pickupMaintenance.remarks" })} translate={false} required align="left" colon={false} />
                        <HTextarea
                          value={row.szRemarks}
                          width="100%"
                          onChange={(e) => updateRow(row.lnActivitySeqNo, { szRemarks: e.target.value })}
                          rows={3}
                          error={Boolean(errors[row.lnActivitySeqNo]?.szRemarks)}
                        />
                      </HBox>
                    </Grid>
                  </Grid>
                </HBox>
              </Paper>
            ))}
          </HBox>
        )}
      </HBox>

      <HBox sx={{ mb: 2 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <HLabel
            value={intl.formatMessage({ id: "label.pickupMaintenance.previousSection" })}
            translate={false}
            component="span"
            align="left"
            colon={false}
            sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }}
          />
          <Chip label={historyRows.length} size="small" sx={{ height: 20, fontSize: 10, "& .MuiChip-label": { px: 0.75 } }} />
        </HBox>
        <Paper variant="outlined" sx={{ borderRadius: 1, overflow: "hidden", borderColor: "divider" }}>
          <HBox sx={{ p: 1 }}>
            <HAgGrid
              rowData={historyGridRows}
              columnDefs={historyColumnDefs}
              gridStyle={historyGridStyle}
              pagination
              paginationPageSize={5}
              sort
            />
          </HBox>
        </Paper>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={loadData}
        onClose={() => navigate("/homelayout/welcomepage")}
      />
    </HBox>
  );
}
