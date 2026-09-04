import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Grid, Paper, Stack, Tab, Tabs, alpha, useTheme } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import FunctionLayout from "./FunctionLayout";
import { HAxiosService, HBox, HButton, HButtonBar, HLabel, HPaper, HTextField, HTextarea, SearchCommonBox, HAgGrid, useToast } from "@helix/component-library";
import { FeeDetailsAPI } from "./apiEndpoints";

import { handleValidationErrors } from "./ValidationUtils.jsx";
import { mapFeeHistoryRow, mapWaiveRow, buildChargeReasonCode } from "./fee-details/feeDetailsMappers";
import { buildWaiveColumnDefs } from "./fee-details/feeDetailsGridColumns";
import FeeRequestHistoryTable from "./fee-details/FeeRequestHistoryTable.jsx";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { gridChargeReasonDefObj, gridFeeCodeDefObj } from "../../../common/components/SearchGridDefObj";

const fieldContainerStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: "4px",
};

/** Single subtle card edge — shadcn `border-border` / Interface Delight (no heavy outlined “accordion” frame). */
function delightCardSx(theme) {
  return {
    borderRadius: 2,
    overflow: "hidden",
    // bgcolor: "background.paper",
    border: "1px solid",
    borderColor: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 0.9),
    boxShadow: "none",
    marginTop: 2,
  };
}

const initialCharge = {
  amount: "",
  feeCode: "",
  chargeReason: "",
  remarks: "",
};

const FeeDetails = () => {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const waiveGridRef = useRef();
  const { selectedRow } = useSelector((state) => state.account);
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const [feeTab, setFeeTab] = useState("charge");

  const accountSeqNo = selectedRow?.ACNT_SEQNO ?? selectedRow?.acnt_seqno;
  const partitionCode =
    selectedRow?.PARTITION_CODE ?? selectedRow?.szPartitionCode ?? "001";
  const userCode = selectedRow?.USER_CODE ?? sessionStorage.getItem("SEC_USERNAME") ?? "SYSTEM";

  const [chargeDetails, setChargeDetails] = useState(initialCharge);
  const [waiveDetails, setWaiveDetails] = useState([]);
  const [feeHistory, setFeeHistory] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingCharge, setSavingCharge] = useState(false);
  const [savingWaive, setSavingWaive] = useState(false);

  const waiveColumns = useMemo(() => buildWaiveColumnDefs(theme, intl), [theme, intl]);

  const fetchFeeHistory = useCallback(async () => {
    if (!accountSeqNo) return;
    try {
      const res = await HAxiosService.GET(`${FeeDetailsAPI.FeeDetails(screenMenuId)}`);
      const data = res.data ?? {};
      if (data.status === "Success" && Array.isArray(data.responseJson)) {
        setFeeHistory(data.responseJson.map((item) => mapFeeHistoryRow(item, locale)));
      } else if (data.status === "Failure" && data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        setFeeHistory([]);
      }
    } catch (err) {
      console.error("Fetch fee history error:", err);
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.historyLoad" }));
      setFeeHistory([]);
    }
  }, [accountSeqNo, intl, locale, toast]);

  const fetchWaiveDetails = useCallback(async () => {
    if (!accountSeqNo) return;
    try {
      const res = await HAxiosService.GET(
        `${FeeDetailsAPI.FeeDetails(screenMenuId)}/fetchWaiveDetails`
      );
      const data = res.data ?? {};
      if (data.status === "Success" && Array.isArray(data.responseJson)) {
        setWaiveDetails(data.responseJson.map(mapWaiveRow));
      } else if (data.status === "Failure" && data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        setWaiveDetails([]);
        // toast.error(intl.formatMessage({ id: "label.FeeDetails.error.waiveUnexpected" }));
      }
    } catch (err) {
      console.error("Fetch waive details error:", err);
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.waiveLoad" }));
      setWaiveDetails([]);
    }
  }, [accountSeqNo, intl, toast]);

  const loadInitial = useCallback(async () => {
    if (!accountSeqNo) {
      setWaiveDetails([]);
      setFeeHistory([]);
      setLoadingInitial(false);
      return;
    }
    setLoadingInitial(true);
    await Promise.all([fetchFeeHistory(), fetchWaiveDetails()]);
    setLoadingInitial(false);
  }, [accountSeqNo, fetchFeeHistory, fetchWaiveDetails]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleChargeChange = (field, value) => {
    setChargeDetails((prev) => ({ ...prev, [field]: value }));
  };

  const buildCommonDtoFields = () => ({
    lnReqActivitySeqNo: 0,
    lnAuthActivitySeqNo: 0,
    chDownloaded: "N",
    chAcknowledged: "N",
    szPartitionCode: partitionCode,
    szCreatedBy: userCode,
    dtCreatedOn: new Date().toISOString(),
    szModifiedBy: userCode,
    dtModifiedOn: new Date().toISOString(),
  });

  const handleChargeFee = async () => {
    const errors = [];
    if (!chargeDetails.feeCode?.trim()) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.feeCode.mandatory" }));
    }
    if (!chargeDetails.amount?.toString().trim()) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.amount.mandatory" }));
    }
    if (!chargeDetails.chargeReason?.trim()) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.chargeReason.mandatory" }));
    }
    if (chargeDetails.remarks?.trim().length > 50 || chargeDetails.remarks?.split("\n").length > 3) {
      errors.push(
        intl.formatMessage({
          id: "error.feeDetails.remarks.maxLength",
          defaultMessage: "Remarks cannot exceed 50 characters or 3 lines",
        })
      );
    }
    const amt = parseFloat(chargeDetails.amount);
    if (Number.isNaN(amt) || amt <= 0) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.amount.positive" }));
    }
    if (errors.length) {
      errors.forEach((e) => toast.error(e));
      return;
    }

    const szReasonCode = buildChargeReasonCode(chargeDetails.chargeReason, chargeDetails.remarks);
    const feeDetailsRequestDto = [
      {
        szFeeCode: chargeDetails.feeCode.trim(),
        bdAmount: amt,
        chRequestFor: "C",
        szReasonCode,
        ...buildCommonDtoFields(),
      },
    ];

    setSavingCharge(true);
    try {
      const response = await HAxiosService.POST(FeeDetailsAPI.FeeDetails(screenMenuId), {
        feeDetailsRequestDto,
      });
      const body = response?.data;
      if (body?.status === "Success") {
        toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.chargeSuccess" }));
        setChargeDetails(initialCharge);
        await fetchFeeHistory();
        await fetchWaiveDetails();
      } else if (body?.status === "Failure" && body?.message === "Validation Failed") {
        handleValidationErrors(intl, toast, body.responseJson);
      } else {
        toast.error(body?.message || intl.formatMessage({ id: "label.FeeDetails.toast.chargeError" }));
      }
    } catch (err) {
      handleValidationErrors(intl, toast, err.response?.data?.responseJson);
      if (!err.response?.data?.responseJson) {
        toast.error(intl.formatMessage({ id: "label.FeeDetails.toast.chargeError" }));
      }
    } finally {
      setSavingCharge(false);
    }
  };

  const handleWaiveFee = async () => {
    if (!waiveGridRef.current?.api) {
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.gridNotReady" }));
      return;
    }
    waiveGridRef.current.api.stopEditing(false);
    const allRows = [];
    waiveGridRef.current.api.forEachNode((node) => {
      allRows.push(node.data);
    });
    const selectedWaive = allRows.filter((item) => item.WaiveNow && parseFloat(item.WaiveNow) > 0);
    if (!selectedWaive.length) {
      toast.error(intl.formatMessage({ id: "error.feeDetails.waiveNow.required" }));
      return;
    }
    const invalidRows = selectedWaive.filter((item) => !item.PaymentHead);
    if (invalidRows.length > 0) {
      toast.error(intl.formatMessage({ id: "error.feeDetails.paymentHead.mandatory" }));
      return;
    }

    const feeDetailsRequestDto = selectedWaive.map((item) => ({
      szFeeCode: item.PaymentHead,
      bdAmount: parseFloat(item.WaiveNow),
      chRequestFor: "W",
      szReasonCode: item.Reason?.trim() || "NA",
      ...buildCommonDtoFields(),
    }));

    setSavingWaive(true);
    try {
      const response = await HAxiosService.POST(FeeDetailsAPI.FeeDetails(screenMenuId), {
        feeDetailsRequestDto,
      });
      const body = response?.data;
      if (body?.status === "Success") {
        toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.waiveSuccess" }));
        await fetchFeeHistory();
        await fetchWaiveDetails();
      } else if (body?.status === "Failure" && body?.message === "Validation Failed") {
        handleValidationErrors(intl, toast, body.responseJson);
      } else {
        toast.error(body?.message || intl.formatMessage({ id: "label.FeeDetails.toast.waiveError" }));
      }
    } catch (err) {
      handleValidationErrors(intl, toast, err.response?.data?.responseJson);
      if (!err.response?.data?.responseJson) {
        toast.error(intl.formatMessage({ id: "label.FeeDetails.toast.waiveError" }));
      }
    } finally {
      setSavingWaive(false);
    }
  };

  const handleReset = async () => {
    setChargeDetails(initialCharge);
    setFeeTab("charge");
    await loadInitial();
    toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.resetSuccess" }));
  };

  /** Single Save action (same as earlier Fee Details): charge vs waive depends on active tab. */
  const handleSave = async () => {
    if (feeTab === "charge") {
      await handleChargeFee();
    } else {
      await handleWaiveFee();
    }
  };

  const gridBoxSx = { width: "100%", minHeight: 220, height: "28vh" };

  /** Delight `TabsList`: one muted track, triggers without boxed borders. */
  const tabBarSx = {
    mt: 1.5,
    minHeight: 32,
    p: 0.5,
    borderRadius: 2,
    width: "fit-content",
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.08)
        : alpha(theme.palette.grey[900], 0.06),
    alignItems: "center",
    "& .MuiTabs-flexContainer": { gap: 0.25, alignItems: "center" },
    "& .MuiTab-root": {
      minHeight: 28,
      py: 0.5,
      px: 1.25,
      fontSize: 11,
      fontWeight: 600,
      textTransform: "none",
      borderRadius: 0.75,
      border: "none",
      minWidth: "auto",
    },
    "& .MuiTabs-indicator": { display: "none" },
    "& .MuiTab-root.Mui-selected": {
      color: "text.primary",
      bgcolor: theme.palette.mode === "dark"
        ? "background.paper"
        : alpha(theme.palette.grey[900], 0.06),
      boxShadow:
        theme.palette.mode === "dark"
          ? `0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}`
          : `0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`,
    },
  };

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.FeeDetails.Title" })}
      contentPaddingTop={0}
      scrollMode="contain"
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
          // className="drs-page-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            px: { xs: 1.5, sm: 2 },
            pb: { xs: 1.5, sm: 2 },
            pt: 0,
            maxWidth: 1320,
            mx: "auto",
            width: "100%",
          }}
        >
          <HBox
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              mt: 0,
            }}
          >
            {!accountSeqNo ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                {intl.formatMessage({ id: "label.FeeDetails.noAccount" })}
              </Alert>
            ) : null}

            {accountSeqNo ? (
              <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <HPaper elevation={0} sx={{ ...delightCardSx(theme), p: 1.5 }}>
                  <HLabel
                    value={intl.formatMessage({ id: "label.FeeDetails.feeType" })}
                    translate={false}
                    align="left"
                    colon={false}
                    sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}
                  />
                  <Tabs value={feeTab} onChange={(_, v) => setFeeTab(v)} sx={tabBarSx}>
                    <Tab label={intl.formatMessage({ id: "label.FeeDetails.ChargeFees" })} value="charge" />
                    <Tab label={intl.formatMessage({ id: "label.FeeDetails.WaiveFees" })} value="waive" />
                  </Tabs>

                  <HBox sx={{ mt: 1.5, display: feeTab === "charge" ? "block" : "none" }}>
                    <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5, mt: -6 }}>
                      <HButton
                        id="fee-charge-policy"
                        label="label.FeeDetails.policy.charge"
                        variant="outlined"
                        size="small"
                        align="right"
                        startIcon={<VisibilityIcon sx={{ fontSize: "14px !important" }} />}
                        sx={{
                          // color: "black",
                          borderColor: "lightgrey",
                          height: 26,
                          fontSize: "11px",
                          bgcolor: "transparent",
                          "&:hover": { borderColor: "grey.400", bgcolor: "rgba(0,0,0,0.04)" },
                        }}
                        onClick={() =>
                          toast.info(intl.formatMessage({ id: "label.FeeDetails.policy.chargeStub" }))
                        }
                      />
                    </Stack>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <HBox className="label-textfield-row" sx={fieldContainerStyles}>
                          <HLabel value="label.FeeDetails.Fee Code" align="left" colon={false} disabled={false} required />
                          <SearchCommonBox
                            apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                            searchCode="FEECODE"
                            setSelectedValue={(dataValue) =>
                              handleChargeChange("feeCode", dataValue || "")
                            }
                            selectedValue={chargeDetails.feeCode}
                            selectedColumn="szfeecode"
                            gridDefObj={gridFeeCodeDefObj}
                            gridWidth={450}
                            gridHeight={300}
                            gridNoOfRowsPerPage={5}
                            searchBoxWidth="100%"
                            searchBoxHeight={30}
                            searchBoxFontSize={11}
                            error={false}
                          />
                        </HBox>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <HBox className="label-textfield-row" sx={fieldContainerStyles}>
                          <HLabel value="label.FeeDetails.Amount" align="left" colon={false} disabled={false} required />
                          <HTextField
                            value={chargeDetails.amount}
                            editable="true"
                            width="100%"
                            onChange={(e) => handleChargeChange("amount", e.target.value)}
                            type="currency"
                          />
                        </HBox>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <HBox className="label-textfield-row" sx={fieldContainerStyles}>
                          <HLabel value="label.FeeDetails.Charge Reason" align="left" colon={false} disabled={false} required />
                          <SearchCommonBox
                            apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                            searchCode="FEECH"
                            setSelectedValue={(dataValue) =>
                              handleChargeChange("chargeReason", dataValue || "")
                            }
                            selectedValue={chargeDetails.chargeReason}
                            selectedColumn="szreasondesc"
                            gridDefObj={gridChargeReasonDefObj}
                            gridWidth={450}
                            gridHeight={300}
                            gridNoOfRowsPerPage={5}
                            searchBoxWidth="100%"
                            searchBoxHeight={30}
                            searchBoxFontSize={11}
                            error={false}
                          />
                        </HBox>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <HBox sx={fieldContainerStyles}>
                          <HLabel value="label.FeeDetails.Remarks" align="left" colon={false} disabled={false} />
                          <HTextarea
                            placeholder="Enter Remark"
                            value={chargeDetails.remarks}
                            onChange={(e) => handleChargeChange("remarks", e.target.value)}
                            maxLines={3}
                            width="100%"
                            maxLength={500}
                          />
                        </HBox>
                      </Grid>
                    </Grid>
                  </HBox>

                  <HBox sx={{ mt: 1.5, display: feeTab === "waive" ? "block" : "none" }}>
                    <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5, mt: -6  }}>
                      <HButton
                        id="fee-waive-policy"
                        label="label.FeeDetails.policy.waive"
                        variant="outlined"
                        size="small"
                        align="right"
                        startIcon={<VisibilityIcon sx={{ fontSize: "14px !important" }} />}
                        sx={{
                          // color: "black",
                          borderColor: "lightgrey",
                          height: 26,
                          fontSize: "11px",
                          "&:hover": { borderColor: "grey.400", bgcolor: "rgba(0,0,0,0.04)" },
                        }}
                        onClick={() =>
                          toast.info(intl.formatMessage({ id: "label.FeeDetails.policy.waiveStub" }))
                        }
                      />
                    </Stack>
                    <HBox
                      sx={{
                        mt: 0,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.35 : 0.22)}`,
                        "& > div": { marginTop: "0 !important" },
                        "& .ag-root-wrapper": {
                          border: "none",
                          borderRadius: 0,
                        },
                      }}
                    >
                      <HAgGrid
                        ref={waiveGridRef}
                        rowData={waiveDetails}
                        columnDefs={waiveColumns}
                        gridStyle={gridBoxSx}
                        allowUpdate
                        hideInternalSaveButton
                        allowAdd={false}
                        allowDelete={false}
                      />
                    </HBox>
                  </HBox>
                </HPaper>

                <FeeRequestHistoryTable rows={feeHistory} loading={loadingInitial} />
              </HBox>
            ) : null}
          </HBox>
        </HBox>

        <HButtonBar
          onSave={accountSeqNo && !savingCharge && !savingWaive ? handleSave : undefined}
          onReset={accountSeqNo ? handleReset : undefined}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>
    </FunctionLayout>
  );
};

export default FeeDetails;
