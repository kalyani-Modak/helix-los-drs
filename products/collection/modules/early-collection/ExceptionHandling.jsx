import React, { useCallback, useEffect, useMemo, useState } from "react";
import { alpha, Stack, Typography, CircularProgress, useTheme } from "@mui/material";
import Block from "@mui/icons-material/Block";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, HBox, HButtonBar, HCheckBox, HDropdown, HLabel, HPaper, HTextarea, useToast } from "@helix/component-library";
import { useLocation, useNavigate } from "react-router-dom";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import { ExceptionAPI } from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";


function buildSavePayload(treatAsException, specialCode, remarks) {
  return {
    cException: treatAsException ? "Y" : "N",
    szSpecialCode: treatAsException ? String(specialCode || "").trim() : "",
    szRemarks: String(remarks || "").trim(),
  };
}

function isSaveSuccess(data) {
  if (data == null) return false;
  if (typeof data.status === "string" && data.status.toLowerCase() === "success") return true;
  if (typeof data.success === "boolean" && data.success) return true;
  return false;
}

const ExceptionHandling = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const [treatAsException, setTreatAsException] = useState(false);
  const [specialCode, setSpecialCode] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({ specialCode: false });

  // ✅ NEW: State for fetching special codes from backend
  const [specialCodesData, setSpecialCodesData] = useState([]);
  const [loadingSpecialCodes, setLoadingSpecialCodes] = useState(false);
  const [specialCodesError, setSpecialCodesError] = useState(null);
  const theme = useTheme();

  // ✅ NEW: useEffect to fetch special codes from backend API
  useEffect(() => {
    fetchSpecialCodesFromBackend();
  }, []);

  const fetchSpecialCodesFromBackend = async () => {
    setLoadingSpecialCodes(true);
    setSpecialCodesError(null);
    try {
      const response = await HAxiosService.GET(ExceptionAPI.Exception(screenMenuId));

      if (response && response.data) {
        const data = response.data;

        // ✅ Handle different response formats
        let codes = [];
        if (data.responseJson && Array.isArray(data.responseJson)) {
          codes = data.responseJson;
        } else if (Array.isArray(data.data)) {
          codes = data.data;
        } else if (Array.isArray(data)) {
          codes = data;
        }

        setSpecialCodesData(codes);
        console.log("✅ Special codes fetched successfully:", codes);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("❌ Error fetching special codes:", error);
      setSpecialCodesError(error.message);
      toast.error(intl.formatMessage({ id: "error.exception.failedToLoadSpecialCodes" }));
    } finally {
      setLoadingSpecialCodes(false);
    }
  };

  // ✅ UPDATED: Build dropdown options from fetched data
  const specialCodeOptions = useMemo(() => {
    return specialCodesData.map((item) => {
      // Handle different response formats from backend
      const code = item.szCondition || item.code || item.id;
      const description = item.szi18nDesc || item.szDesc || item.description || item.label;

      return {
        value: code,
        label: intl.formatMessage({
          id: description,
          defaultMessage: item.szDesc || description,
        }),
      };
    });
  }, [specialCodesData, intl]);

  const resetForm = useCallback(() => {
    setTreatAsException(false);
    setSpecialCode("");
    setNotes("");
    setErrors({ specialCode: false });
  }, []);

  const handleSave = async () => {
    if (!selectedRow?.ACNT_SEQNO) {
      toast.error(intl.formatMessage({ id: "label.exceptionHandling.noAccountSelected" }));
      return undefined;
    }

    const needsCode = treatAsException;
    const nextErrors = {
      specialCode: needsCode && String(specialCode || "").trim() === "",
    };
    setErrors(nextErrors);

    if (nextErrors.specialCode) {
      toast.error(intl.formatMessage({ id: "error.exception.specialCode.required" }));
      return undefined;
    }

    const payload = buildSavePayload(treatAsException, specialCode, notes);

    return HAxiosService.POST(ExceptionAPI.Exception(screenMenuId), payload).then(
      (res) => {
        if (res == null || res.data == null) {
          toast.error(intl.formatMessage({ id: "error.exception.saveFailed" }));
          return res;
        }
        if (res.status < 200 || res.status >= 300) {
          toast.error(intl.formatMessage({ id: "error.exception.saveFailed" }));
          return res;
        }
        const data = res.data;
        if (isSaveSuccess(data)) {
          toast.success(
            data.message || data.msg || intl.formatMessage({ id: "success.exception.saved" }),
          );
          if (notes.trim()) {
            toast.info(intl.formatMessage({ id: "label.exceptionHandling.notesNotSavedToast" }));
          }
        } else {
          toast.error(
            data.message || data.msg || intl.formatMessage({ id: "error.exception.saveFailed" }),
          );
        }
        return res;
      },
      (err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.msg ||
          intl.formatMessage({ id: "error.exception.saveFailed" });
        toast.error(msg);
        throw err;
      },
    );
  };

  const highlightRowSx = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 1.5,
    p: 1.5,
    borderRadius: 1.5,
     //backgroundColor: "1px solid #dbe7ff",
    border: "1px solid #dbe7ff",
  };

  const formBody = (
    <Stack spacing={2} sx={{ pt: 0.5,backgroundColor: theme.palette.background.gradient, borderRadius: 2, p: 2 }}>
      <HBox sx={highlightRowSx}>
        <HBox
          sx={{
            flexShrink: 0,
            alignSelf: "flex-start",
            pt: "6px",
            display: "flex",
            alignItems: "flex-start",
            "& .hcheckbox-wrapper": {
              width: "auto",
              margin: 0,
              minWidth: 0,
            },
            "& .MuiFormControlLabel-root": {
              marginRight: 0,
              marginLeft: 0,
            },

          }}
        >
          <HCheckBox
            label=""
            checked={treatAsException}
            onChange={(e) => {
              setTreatAsException(e.target.checked);
              setErrors((prev) => ({ ...prev, specialCode: false }));
            }}
            align="left"
            margin="0"
          />
        </HBox>
        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap" }}>
            <GppMaybeOutlinedIcon
              sx={{
                fontSize: 18,
                color: "#f59e0b",
                flexShrink: 0,
                display: "block",
              }}
            />            <Typography
              component="span"
              variant="caption"
              sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.35, color: "text.primary" }}
            >
              {intl.formatMessage({ id: "label.ExceptionHandling.Treat as exception case" })}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            component="p"
            sx={{ m: 0, fontSize: 10, lineHeight: 1.45, color: "text.secondary" }}
          >
            {intl.formatMessage({ id: "label.exceptionHandling.exceptionHelper" })}
          </Typography>
        </Stack>
      </HBox>

      {treatAsException ? (
        <Stack spacing={2} sx={{ width: "100%", alignItems: "stretch" }}>
          {/* Special Code Dropdown */}
          <HBox
            sx={{
              width: "100%",
              textAlign: "left",
              "& .label-field": { textAlign: "left !important" },
            }}
          >
            <HLabel
              value={intl.formatMessage({ id: "label.ExceptionHandling.Special code" })}
              required
              align="left"
              translate={false}
            />
            <HBox sx={{ mt: 0.75, maxWidth: 480, width: "100%", position: "relative" }}>
              {/* ✅ Show loading indicator while fetching codes */}
              {loadingSpecialCodes && (
                <HBox
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <CircularProgress size={20} />
                </HBox>
              )}

              {/* ✅ Show error message if fetching failed */}
              {specialCodesError && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "error.main",
                    mb: 1,
                    fontSize: 12,
                  }}
                >
                  {intl.formatMessage({
                    id: "error.exception.failedToLoadSpecialCodes",
                    defaultMessage: "Failed to load special codes. Please try again.",
                  })}
                </Typography>
              )}

              <HDropdown
                name="specialCode"
                value={specialCode}
                onChange={(e) => {
                  setSpecialCode(e.target.value);
                  if (e.target.value) setErrors((prev) => ({ ...prev, specialCode: false }));
                }}
                options={specialCodeOptions}
                placeholder={intl.formatMessage({
                  id: "label.exceptionHandling.specialCode.placeholder",
                  defaultMessage: "Select special code",
                })}
                required
                fullwidth
                error={errors.specialCode}
                width="100%"
                disabled={loadingSpecialCodes || specialCodesError}
              />
            </HBox>
          </HBox>

          {/* Remarks/Notes Field - Updated to match second screenshot */}
          <HBox
            sx={{
              width: "100%",
              textAlign: "left",
              "& .label-field": { textAlign: "left !important" },
            }}
          >
            <HLabel
              value={intl.formatMessage({ id: "label.ExceptionHandling.Notes" })}
              translate={false}
              align="left"
            />
           <HBox sx={{ mt: 1, width: "100%" }}>
            <HTextarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="label.exceptionHandling.notes.placeholder"
              width="480px"
              maxLines={3}
              maxLength={500}
              hiddenYN={false}
              mandatory={false}
              readOnly={false}
              disabled={false}
              translate={true}
            />
          </HBox>
            <Typography variant="caption" sx={{ display: "block", fontSize: 10, color: "text.secondary", mt: 0.75 }}>
              {/* {intl.formatMessage({ id: "label.exceptionHandling.notesNotPersistedHint" })} */}
            </Typography>
          </HBox>
        </Stack>
      ) : (
        <HBox sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <GppMaybeOutlinedIcon sx={{ fontSize: 32, mx: "auto", mb: 1, opacity: 0.35 }} />
          <Typography variant="caption" sx={{ display: "block", fontSize: 12 }}>
            {intl.formatMessage({ id: "label.exceptionHandling.emptyStatePrimary" })}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", fontSize: 10, mt: 0.5 }}>
            {intl.formatMessage({ id: "label.exceptionHandling.emptyStateSecondary" })}
          </Typography>
        </HBox>
      )}
    </Stack>
  );

  if (!selectedRow?.ACNT_SEQNO) {
    return (
      <FunctionLayout
        title={intl.formatMessage({ id: "label.ExceptionHandling.title" })}
        breadcrumbMid={intl.formatMessage({ id: "label.functionLayout.breadcrumb.customer" })}
      >
        <HBox sx={{ p: 2 }}>
          <Typography variant="body1">
            {intl.formatMessage({ id: "label.exceptionHandling.noAccountSelected" })}
          </Typography>
        </HBox>
      </FunctionLayout>
    );
  }

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.ExceptionHandling.title" })}
      breadcrumbMid={intl.formatMessage({ id: "label.functionLayout.breadcrumb.customer" })}
    >
      <HBox
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          // bgcolor: "background.default",
        }}
      >
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            pb: 10,
          }}
        >
          <HBox
            sx={{
              maxWidth: 1320,
              mx: "auto",
              px: { xs: 1.5, sm: 2 },
              py: 1,
            }}
          >
            <HPaper
              variant="outlined"
              elevation={0}
              sx={{
                borderRadius: 2,
                borderColor: "divider",
                p: { xs: 1.5, sm: 2 },
                mb: 1,
              }}
            >
              {formBody}
            </HPaper>
          </HBox>
        </HBox>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={resetForm}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true }}
      />
    </FunctionLayout>
  );
};

export default ExceptionHandling;
