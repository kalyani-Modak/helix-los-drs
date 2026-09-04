import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButtonBar, useToast } from "@helix/component-library";

import FunctionLayout from "./FunctionLayout";
import { ReturnMailTrackingAPI } from "./apiEndpoints.jsx";

import { normalizeMailRow } from "./return-mail-tracking/normalizeMailRow";
import { buildAddressPayloadPatch } from "./return-mail-tracking/addressUpdatePlaceholder";
import { mapReasonTextToKey, formatReasonKey } from "./return-mail-tracking/reasonKeyUtils";
import ReturnMailSummaryBar from "./return-mail-tracking/ReturnMailSummaryBar.jsx";
import ReturnMailTrackingGrid from "./return-mail-tracking/ReturnMailTrackingGrid.jsx";
import { useLocation } from "react-router-dom";

function toDisplayRow(rawNorm, reasonOptions = []) {
  const norm = rawNorm;
  const parts = [norm.address1, norm.address2, norm.address3, norm.city, norm.state, norm.zip].filter((x) =>
    String(x || "").trim(),
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
    returnReasonKey: rk,
  };
}

function rowTrackSig(r) {
  return JSON.stringify({
    mailSeqNo: r.mailSeqNo,
    badMarked: r.badMarked,
    returned: r.returned,
    returnDate: r.returnDate,
    returnReasonKey: r.returnReasonKey,
  });
}

export default function ReturnMailTracking() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [gridRows, setGridRows] = useState([]);
  const [snapshotRows, setSnapshotRows] = useState([]);
  const [gridLoading, setGridLoading] = useState(false);
  const [gridError, setGridError] = useState(null);
  const [reasonOptions, setReasonOptions] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const fetchMailList = useCallback(async () => {
    if (!selectedRow) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(null);
      return [];
    }

    if (!selectedRow?.CUST_SEQNO || !selectedRow?.CASE_SEQNO || !selectedRow?.PARTITION_CODE) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(null);
      return [];
    }

    setGridLoading(true);
    setGridError(null);

    try {
      const res = await HAxiosService.GET(`${ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId)}/return-mail-tracking-list`);
      const data = res.data;

      const ok =
        typeof data?.status === "string" &&
        data.status.toLowerCase() === "success";

      const raw = data?.responseJson;
      const rows = Array.isArray(raw) ? raw : [];

      if (ok) {
        const mapped = rows.map((r) =>
          toDisplayRow(normalizeMailRow(r), reasonOptions),
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
        data?.message ||
          intl.formatMessage({
            id: "label.returnMailTracking.grid.loadFailed",
            defaultMessage: "Failed to load return mail data",
          }),
      );
      return [];
    } catch (err) {
      setGridRows([]);
      setSnapshotRows([]);
      setGridError(
        err?.response?.data?.message ||
          intl.formatMessage({
            id: "label.returnMailTracking.grid.loadFailed",
            defaultMessage: "Failed to load return mail data",
          }),
      );
      return [];
    } finally {
      setGridLoading(false);
    }
  }, [selectedRow, intl, reasonOptions]);

  useEffect(() => {
    if (reasonOptions.length > 0) {
      fetchMailList();
    }
  }, [fetchMailList, reasonOptions]);

  useEffect(() => {
    const fetchReturnReasons = async () => {
      try {
        const res = await HAxiosService.GET(
          ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId),
        );

        const data = res?.data?.responseJson || [];

        const options = data.map((item) => ({
          value: item.szCondition,
          label: intl.formatMessage({
            id: item.szi18nDesc,
            defaultMessage: item.szi18nDesc,
          }),
          i18nKey: item.szi18nDesc,
        }));

        setReasonOptions(options);
      } catch (error) {
        console.error(error);

        toast.error(
          intl.formatMessage({
            id: "label.returnMailTracking.reason.fetch.error",
            defaultMessage: "Unable to load return reasons",
          }),
        );
      }
    };

    fetchReturnReasons();
  }, [intl, toast]);

  const accountKey = useMemo(() => {
    if (!selectedRow) return "";
    const partitionCode = selectedRow.PARTITION_CODE ?? selectedRow.szPartitionCode ?? "";
    const custSeqNo = selectedRow.CUST_SEQNO ?? "";
    const caseSeqNo = selectedRow.CASE_SEQNO ?? "";
    return `${partitionCode}-${custSeqNo}-${caseSeqNo}`;
  }, [selectedRow]);

  useEffect(() => {
    setGridRows([]);
    setSnapshotRows([]);
  }, [accountKey]);

  const isDirty = useMemo(
    () => JSON.stringify(gridRows) !== JSON.stringify(snapshotRows),
    [gridRows, snapshotRows],
  );

  const handlePatchRow = useCallback((mailSeqNo, patch) => {
    setGridRows((prev) =>
      prev.map((r) => {
        if (r.mailSeqNo !== mailSeqNo) return r;

        let next = { ...r, ...patch };

        if (patch.badMarked === "N") {
          next = {
            ...next,
            returned: "N",
            returnDate: "",
            returnReasonKey: "",
            returnReason: "",
          };
        }

        if (patch.badMarked === "Y") {
          next.returned = "Y";
        }

        return next;
      }),
    );
  }, []);

  const resetForm = useCallback(() => {
    setGridRows(JSON.parse(JSON.stringify(snapshotRows)));
  }, [snapshotRows]);

  const handleSave = useCallback(async () => {
    if (!selectedRow) {
      toast.error(
        intl.formatMessage({
          id: "label.returnMailTracking.error.noAccount",
          defaultMessage: "No account selected",
        }),
      );
      return { data: { status: "Failure" } };
    }

    const snapById = new Map(snapshotRows.map((r) => [r.mailSeqNo, r]));
    const changed = gridRows.filter(
      (r) =>
        rowTrackSig(r) !== rowTrackSig(snapById.get(r.mailSeqNo) || {}),
    );

    for (const r of gridRows) {
      if (String(r.badMarked || "").toUpperCase() === "Y") {
        if (!r.returnDate || !r.returnReasonKey) {
          toast.error(
            intl.formatMessage(
              {
                id: "label.returnMailTracking.validation.rowReturnDateReason",
                defaultMessage:
                  "Return date and reason required for {mail}",
              },
              { mail: r.mailCode || r.mailSeqNo },
            ),
          );
          return { data: { status: "Failure" } };
        }
      }
    }

    if (!changed.length) {
      toast.info(
        intl.formatMessage({
          id: "label.returnMailTracking.save.noChanges",
          defaultMessage: "No changes to save",
        }),
      );
      return { data: { status: "success" } };
    }

    try {
      for (const row of changed) {
        const reasonText = row.returnReasonKey
          ? formatReasonKey(reasonOptions, row.returnReasonKey)
          : "";

        const payload = {
          mailSeqNo: row.mailSeqNo,
          mailReturn: {
            chMailReturned:
              String(row.returned || "").toUpperCase() === "Y"
                ? "Y"
                : "N",
            chBadMarkedYn:
              String(row.badMarked || "").toUpperCase() === "Y"
                ? "Y"
                : "N",
            dtMailReturned: row.returnDate || null,
            szMailReturnReason: reasonText,
          },
          addressPatch: buildAddressPayloadPatch({
            address1: row.address1,
            address2: row.address2,
            address3: row.address3,
            address4: row.address4,
            area: row.area,
            city: row.city,
            state: row.state,
            zip: row.zip,
          }),
        };

        const res = await HAxiosService.PUT(
           `${ReturnMailTrackingAPI.ReturnMailTracking(screenMenuId)}/return-mail-tracking`,
          payload,
        );

        const data = res.data;
        const statusOk =
          typeof data?.status === "string" &&
          data.status.toLowerCase() === "success";

        if (!statusOk) {
          toast.error(
            data?.message ||
              intl.formatMessage({
                id: "label.returnMailTracking.save.error",
                defaultMessage: "Save failed",
              }),
          );
          return { data: { status: "Failure" } };
        }
      }

      toast.success(
        intl.formatMessage({
          id: "label.returnMailTracking.save.success",
          defaultMessage: "Saved successfully",
        }),
      );

      await fetchMailList();
      return { data: { status: "success" } };
    } catch (err) {
      const msg =
        err?.response?.status === 404
          ? intl.formatMessage({
              id: "label.returnMailTracking.save.backendPending",
              defaultMessage: "Backend not available",
            })
          : err?.response?.data?.message ||
            intl.formatMessage({
              id: "label.returnMailTracking.save.error",
              defaultMessage: "Save failed",
            });

      toast.warning(msg);
      return { data: { status: "Failure" } };
    }
  }, [selectedRow, gridRows, snapshotRows, intl, toast, fetchMailList]);

  const handleClose = useCallback(() => {
    if (
      isDirty &&
      !window.confirm(
        intl.formatMessage({
          id: "label.returnMailTracking.confirm.discard",
          defaultMessage: "Discard unsaved changes?",
        }),
      )
    ) {
      return { data: { status: "Failure" } };
    }

    navigate("/homelayout/welcomepage");
    return { data: { status: "success" } };
  }, [isDirty, intl, navigate]);

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.returnMailTracking.title",
        defaultMessage: "Return Mail Tracking",
      })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <HBox sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 10, sm: 12 },
            pt: 1,
            flexDirection: "column",
            gap: 2,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <ReturnMailSummaryBar rows={gridRows} />
          <ReturnMailTrackingGrid
            rowData={gridRows}
            loading={gridLoading}
            loadError={gridError}
            onPatchRow={handlePatchRow}
            reasonOptions={reasonOptions}
          />
        </HBox>

        <HBox sx={{ position: "relative", zIndex: 2000 }}>
          <HButtonBar
            onSave={handleSave}
            onReset={resetForm}
            onClose={handleClose}
            disableToast={{ save: true, reset: true, close: true }}
          />
        </HBox>
      </HBox>
    </FunctionLayout>
  );
}
