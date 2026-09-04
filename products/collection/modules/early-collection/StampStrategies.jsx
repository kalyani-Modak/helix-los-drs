import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast, HAxiosService, ALIGNMENT, HButtonBar, HDatePicker, HTextField, HTextarea, SearchCommonBox } from "@helix/component-library";
import { StampStrategiesAPI } from "./apiEndpoints.jsx";

import FunctionLayout from "./FunctionLayout";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import ChangeStrategyDetails from "./change-strategy/ChangeStrategyDetails.jsx";
import {
  filterStampStrategyHistoryRows,
} from "./change-strategy/strategyHistoryUtils.js";
import { useLocation } from "react-router-dom";

import { gridStrategyCodeDefObj } from "../../../common/components/SearchGridDefObj";
const labelSx = {
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: 1.35,
  display: "block",
  mb: 0.5,
};

const hintSx = {
  fontSize: "10px",
  color: "text.secondary",
  mt: 0.5,
  pl: 0.25,
  lineHeight: 1.35,
};

const sectionTitleSx = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "text.secondary",
  textTransform: "uppercase",
  mb: 1,
};

function FieldStack({ label, required, children, hintId, intl }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%" }}>
      <Typography component="label" sx={labelSx}>
        {label}
        {required ? (
          <Typography component="span" sx={{ color: "error.main", ml: 0.25 }}>
            *
          </Typography>
        ) : null}
      </Typography>
      {children}
      {hintId ? (
        <Typography sx={hintSx}>{intl.formatMessage({ id: hintId })}</Typography>
      ) : null}
    </Box>
  );
}

const StampStrategies = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [collectionStrategy, setCollectionStrategy] = useState("");
  const [exposureStrategy, setExposureStrategy] = useState("");
  const [collectionStrategySeq, setCollectionStrategySeq] = useState("");
  const [exposureStrategySeq, setExposureStrategySeq] = useState("");
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const [formData, setFormData] = useState({
    revisionStrategy: "",
    budgetStrategy: "",
    collectionTillDate: null,
    exposureTillDate: null,
    revisionTillDate: null,
    budgetTillDate: null,
    notes: "",
  });

  const [historyRows, setHistoryRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyReloadKey, setHistoryReloadKey] = useState(0);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (field) => (newVal) => {
    setFormData((prev) => ({ ...prev, [field]: newVal }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === "string") return date.split("T")[0];
    let d = date;
    if (d.$d) d = d.$d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const resetForm = () => {
    setCollectionStrategy("");
    setCollectionStrategySeq("");
    setExposureStrategy("");
    setExposureStrategySeq("");
    setFormData({
      revisionStrategy: "",
      budgetStrategy: "",
      collectionTillDate: null,
      exposureTillDate: null,
      revisionTillDate: null,
      budgetTillDate: null,
      notes: "",
    });
  };

  const mapHistoryForGrid = useCallback(
    (dtoList) => {
      const na = intl.formatMessage({ id: "label.changeStrategy.history.na" });
      const filtered = filterStampStrategyHistoryRows(dtoList);
      return filtered.map((item) => ({
        dtActivity: item.dtActivity || "",
        fromVal: item.szActivity || na,
        toVal: na,
        tillVal: na,
        szCollectorCode: item.szCollectorCode || "",
        note: item.szRemark || item.szSystemRemark || "",
      }));
    },
    [intl],
  );

  const loadStrategyHistory = useCallback(() => {
    if (!selectedRow?.ACNT_SEQNO) {
      setHistoryRows([]);
      setHistoryError(null);
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    console.log(">>>>>>>>>screenMenuId",screenMenuId);
    HAxiosService.GET(StampStrategiesAPI.fetchStrategyHistory(0, 100, screenMenuId))
      .then((res) => {
        const dto = res.data?.previousActivityDetailsDto;
        if (Array.isArray(dto)) {
          setHistoryRows(mapHistoryForGrid(dto));
        } else {
          setHistoryRows([]);
          setHistoryError(
            intl.formatMessage({ id: "label.changeStrategy.history.loadUnexpected" }),
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setHistoryRows([]);
        setHistoryError(
          err.response?.data?.message ||
            intl.formatMessage({ id: "label.changeStrategy.history.loadFailed" }),
        );
      })
      .finally(() => setHistoryLoading(false));
  }, [selectedRow, mapHistoryForGrid, intl]);

  useEffect(() => {
    loadStrategyHistory();
  }, [loadStrategyHistory, historyReloadKey]);

  const handleSave = async () => {
    const requestData = {
      stampStrategiesDto: {
        lnNextCollStrategy: collectionStrategySeq,
        dtNextCollStrategyTill: formatDate(formData.collectionTillDate),
        lnNextExpStrategy: exposureStrategySeq,
        dtNextExpStrategyTill: formatDate(formData.exposureTillDate),
        lnNextCLRevStrategy: formData.revisionStrategy,
        dtNextCLRevStrategyTill: formatDate(formData.revisionTillDate),
        lnNextBudgStrategy: formData.budgetStrategy,
        dtNextBudgStrategyTill: formatDate(formData.budgetTillDate),
        szRemarks: (formData.notes || "").trim(),
      },
    };

    return HAxiosService.PUT(StampStrategiesAPI.updateStrategiesDetails(screenMenuId), requestData).then(
      (res) => {
        if (res.data.status?.toLowerCase() === "success") {
          toast.success(
            res.data.msg || intl.formatMessage({ id: "label.changeStrategy.saveSuccess" }),
          );
          resetForm();
          setHistoryReloadKey((k) => k + 1);
        } else {
          if (res.data?.responseJson) {
            handleValidationErrors(intl, toast, res.data.responseJson);
          } else {
            toast.error(
              res.data.msg || intl.formatMessage({ id: "label.changeStrategy.saveError" }),
            );
          }
        }
        return res;
      },
      (err) => {
        if (err.response?.data?.responseJson) {
          handleValidationErrors(intl, toast, err.response.data.responseJson);
        } else {
          toast.error(
            err.response?.data?.message ||
              intl.formatMessage({ id: "label.changeStrategy.saveError" }),
          );
        }
        throw err;
      },
    );
  };

  const searchBoxCompact = {
    searchBoxWidth: "100%",
    searchBoxHeight: 32,
    searchBoxFontSize: 12,
  };

  const formContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography sx={sectionTitleSx}>
        {intl.formatMessage({ id: "label.changeStrategy.section.collectionExposure" })}
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack
            label={intl.formatMessage({ id: "label.stamp.strategies.collectionStrategy" })}
            required
            intl={intl}
          >
            <SearchCommonBox
              apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
              searchCode="COLSTRCDE"
              setSelectedValue={(value) => setCollectionStrategy(value)}
              onRowSelect={(row) => setCollectionStrategySeq(row?.ISTRATEGYSEQNO ?? "")}
              selectedValue={collectionStrategy}
              selectedColumn="SZSTRATEGYCODE"
              gridDefObj={gridStrategyCodeDefObj}
              gridWidth={400}
              gridHeight={400}
              gridNoOfRowsPerPage={2}
              {...searchBoxCompact}
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack
            label={intl.formatMessage({ id: "label.stamp.strategies.tillDate" })}
            intl={intl}
            hintId="label.changeStrategy.form.tillHint"
          >
            <HDatePicker
              value={formData.collectionTillDate}
              onChange={handleDateChange("collectionTillDate")}
              align={ALIGNMENT.DATE}
              format="MM/DD/YYYY"
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack
            label={intl.formatMessage({ id: "label.stamp.strategies.exposureStrategy" })}
            required
            intl={intl}
          >
            <SearchCommonBox
              apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
              searchCode="EXPSTRCDE"
              setSelectedValue={(value) => setExposureStrategy(value)}
              onRowSelect={(row) => setExposureStrategySeq(row?.ISTRATEGYSEQNO ?? "")}
              selectedValue={exposureStrategy}
              selectedColumn="SZSTRATEGYCODE"
              gridDefObj={gridStrategyCodeDefObj}
              gridWidth={350}
              gridHeight={300}
              gridNoOfRowsPerPage={2}
              {...searchBoxCompact}
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack label={intl.formatMessage({ id: "label.stamp.strategies.tillDate" })} intl={intl}>
            <HDatePicker
              value={formData.exposureTillDate}
              onChange={handleDateChange("exposureTillDate")}
              align={ALIGNMENT.DATE}
              format="MM/DD/YYYY"
            />
          </FieldStack>
        </Grid>
      </Grid>

      <Typography sx={{ ...sectionTitleSx, mt: 0.5 }}>
        {intl.formatMessage({ id: "label.changeStrategy.section.revisionBudget" })}
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack
            label={intl.formatMessage({ id: "label.stamp.strategies.revisionStrategy" })}
            intl={intl}
          >
            <HTextField
              value={formData.revisionStrategy}
              onChange={handleInputChange("revisionStrategy")}
              editable
              align={ALIGNMENT.TEXT}
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack label={intl.formatMessage({ id: "label.stamp.strategies.tillDate" })} intl={intl}>
            <HDatePicker
              value={formData.revisionTillDate}
              onChange={handleDateChange("revisionTillDate")}
              align={ALIGNMENT.DATE}
              format="MM/DD/YYYY"
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack
            label={intl.formatMessage({ id: "label.stamp.strategies.budgetStrategy" })}
            intl={intl}
          >
            <HTextField
              value={formData.budgetStrategy}
              onChange={handleInputChange("budgetStrategy")}
              editable
              align={ALIGNMENT.TEXT}
            />
          </FieldStack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldStack label={intl.formatMessage({ id: "label.stamp.strategies.tillDate" })} intl={intl}>
            <HDatePicker
              value={formData.budgetTillDate}
              onChange={handleDateChange("budgetTillDate")}
              align={ALIGNMENT.DATE}
              format="MM/DD/YYYY"
            />
          </FieldStack>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={12}>
          <FieldStack label={intl.formatMessage({ id: "label.changeStrategy.form.notes" })} intl={intl}>
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <HTextarea
                id="change-strategy-notes"
                value={formData.notes}
                onChange={handleInputChange("notes")}
                placeholder={intl.formatMessage({ id: "label.changeStrategy.form.notesPlaceholder" })}
                maxLines={4}
                maxLength={500}
                width="100%"
                height={88}
              />
            </Box>
          </FieldStack>
          <Typography sx={{ ...hintSx, mt: 0.75 }}>
            {intl.formatMessage({ id: "label.changeStrategy.form.notesHint" })}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <FunctionLayout title={intl.formatMessage({ id: "label.changeStrategy.title" })}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            pb: 10,
          }}
        >
          <ChangeStrategyDetails
            form={formContent}
            historyRows={historyRows}
            historyLoading={historyLoading}
            historyError={historyError}
          />
        </Box>
      </Box>

      <HButtonBar
        onSave={handleSave}
        onReset={resetForm}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true }}
      />
    </FunctionLayout>
  );
};

export default StampStrategies;
