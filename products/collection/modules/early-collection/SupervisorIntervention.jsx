import React, { useCallback, useEffect, useState } from "react";
import { FormControl, FormHelperText, Radio, RadioGroup, Typography } from "@mui/material";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButtonBar, HLabel, HTextarea, OverviewSectionCard, useToast } from "@helix/component-library";

import FunctionLayout from "./FunctionLayout";
import { SupervisorInterventionAPI } from "./apiEndpoints.jsx";
import { handleValidationErrors } from "./ValidationUtils.jsx";


const INTERVENTION_IDS = ["pullback", "immediate", "requeue"];
const INTERVENTION_META = {
  pullback: { Icon: PersonRemoveOutlinedIcon, color: "error.main" },
  immediate: { Icon: BoltOutlinedIcon, color: "warning.main" },
  requeue: { Icon: AutorenewOutlinedIcon, color: "primary.main" },
};

function requiredTitle(label) {
  const title = String(label || "").replace(/\s*\*$/, "");

  return (
    <>
      {title} <span style={{ color: "var(--drs-color-error, #d32f2f)" }}>*</span>
    </>
  );
}

function mapUiInterventionToApi(ui) {
  const m = { pullback: "P", immediate: "I", requeue: "R" };
  return m[ui] || "";
}

export default function SupervisorIntervention() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);

  const [intervention, setIntervention] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({ intervention: false, notes: false });
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const chooseIntervention = useCallback((value) => {
    setIntervention(value);
    setErrors((prev) => ({ ...prev, intervention: false }));
  }, []);

  const loadDetails = useCallback(() => {
    setIntervention("");
    setNotes("");
    setErrors({ intervention: false, notes: false });
  }, []);

  useEffect(() => {
    loadDetails();
  }, [loadDetails, selectedRow]);

  const validate = useCallback(() => {
    const next = {
      intervention: !intervention,
      notes: !notes || !String(notes).trim(),
    };
    setErrors(next);
    if (next.intervention) {
      toast.error(intl.formatMessage({ id: "label.supervisorIntervention.validation.actionRequired" }));
      return false;
    }
    if (next.notes) {
      toast.error(intl.formatMessage({ id: "label.supervisorIntervention.validation.notesRequired" }));
      return false;
    }
    return true;
  }, [intervention, intl, notes, toast]);

  const handleSave = useCallback(() => {
    if (!validate() || !selectedRow) return undefined;

    const interventionType = mapUiInterventionToApi(intervention);
    const requestData = {
      supervisoryInterventionDto: {
        chInterventionType: interventionType,
        szInterventionRemark: String(notes).trim(),
      }
    };

    return HAxiosService.POST(
      SupervisorInterventionAPI.saveDetails(screenMenuId),
      requestData,
      {},
      false,
      { "Content-Type": "application/json" }
    ).then((res) => {
      const responseStatus = String(res.data?.status || "").toLowerCase();
      const responseMessage = res.data?.msg || res.data?.message;

      if (responseStatus === "success") {
        setIntervention("");
        setNotes("");
        setErrors({ intervention: false, notes: false });
        loadDetails();
        return { success: true, message: responseMessage };
      } else if (res.data?.responseJson) {
        handleValidationErrors(intl, toast, res.data.responseJson);
        return { success: false };
      } else {
        return { success: false, message: responseMessage };
      }
    }).catch((err) => {
      if (err.response?.data?.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
      }
      return { success: false, message: err.response?.data?.message };
    });
  }, [intervention, intl, loadDetails, notes, selectedRow, toast, validate]);

  const handleReset = useCallback(() => {
    setErrors({ intervention: false, notes: false });
    loadDetails();
  }, [loadDetails]);

  const handleClose = useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);

  const body = !selectedRow ? (
    <HBox sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
      <HLabel
        value={intl.formatMessage({ id: "label.supervisorIntervention.noAccount" })}
        colon={false}
        align="left"
      />
    </HBox>
  ) : (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
      }}
    >
      <HBox
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 10, sm: 12 },
          pt: 1,
          width: "100%",
          boxSizing: "border-box",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <OverviewSectionCard
          title={requiredTitle(
            intl.formatMessage({
              id: "label.supervisorIntervention.section.selectAction",
              defaultMessage: "Select Intervention Action *",
            })
          )}
          minHeight={0}
          sx={{ borderRadius: 1, height: "auto" }}
          bodySx={{ p: 0, minHeight: 0, flex: "0 0 auto" }}
        >
          <FormControl component="fieldset" error={errors.intervention} fullWidth>
            <RadioGroup
              aria-label={intl.formatMessage({ id: "label.supervisorIntervention.section.selectAction" })}
              name="supervisorInterventionType"
              value={intervention}
              onChange={(e) => chooseIntervention(e.target.value)}
              sx={{ width: "100%" }}
            >
              {INTERVENTION_IDS.map((id) => {
                const selected = intervention === id;
                const { Icon, color } = INTERVENTION_META[id];
                return (
                  <HBox
                    key={id}
                    onClick={() => chooseIntervention(id)}
                    sx={(theme) => ({
                      borderTop: id === INTERVENTION_IDS[0] ? 0 : 1,
                      borderColor: "divider",
                      bgcolor: selected ? "action.selected" : "transparent",
                      px: { xs: 1.25, sm: 1.5 },
                      py: { xs: 1.1, sm: 1.25 },
                      cursor: "pointer",
                      transition: theme.transitions.create("background-color", {
                        duration: theme.transitions.duration.shortest,
                      }),
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      "&:focus-within": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: -2,
                      },
                    })}
                  >
                    <HBox sx={{ background: "transparent" }}>
                      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.8, background: "transparent" }}>
                        <Radio
                          id={`supervisor-intervention-${id}`}
                          name="supervisorInterventionType"
                          value={id}
                          checked={selected}
                          onChange={(e) => chooseIntervention(e.target.value)}
                          size="small"
                          sx={{
                            p: 0.45,
                            color: "var(--drs-color-primary)",
                            "&.Mui-checked": { color: "var(--drs-color-primary)" },
                          }}
                        />
                        <Icon sx={{ color, fontSize: 16, flexShrink: 0 }} />
                        <Typography
                          component="label"
                          htmlFor={`supervisor-intervention-${id}`}
                          sx={{
                            color: "text.primary",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: selected ? 600 : 500,
                            lineHeight: 1.3,
                          }}
                        >
                          {intl.formatMessage({ id: `label.supervisorIntervention.option.${id}.title` })}
                        </Typography>
                      </HBox>
                      <Typography
                        id={`supervisor-intervention-${id}-description`}
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          ml: 5.15,
                          mt: 0.15,
                          fontSize: 12,
                          lineHeight: 1.45,
                        }}
                      >
                        {intl.formatMessage({ id: `label.supervisorIntervention.option.${id}.description` })}
                      </Typography>
                    </HBox>
                  </HBox>
                );
              })}
            </RadioGroup>
            {errors.intervention ? (
              <FormHelperText sx={{ mx: 1.5, mt: 0.75, mb: 1 }}>
                {intl.formatMessage({ id: "label.supervisorIntervention.validation.actionRequired" })}
              </FormHelperText>
            ) : null}
          </FormControl>
        </OverviewSectionCard>

        <OverviewSectionCard
          title={requiredTitle(
            intl.formatMessage({
              id: "label.supervisorIntervention.notes.label",
              defaultMessage: "Supervisor Notes *",
            })
          )}
          sx={{ borderRadius: 2, mt: 2, height: "auto" }}
          bodySx={{
            px: { xs: 1.25, sm: 1.5 },
            py: { xs: 1.25, sm: 1.5 },
            minHeight: 0,
            flex: "0 0 auto",
          }}
        >
          <HTextarea
            id="supervisor-intervention-notes"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setErrors((prev) => ({ ...prev, notes: false }));
            }}
            width="100%"
            maxLines={2}
            required
            error={errors.notes}
            placeholder="label.supervisorIntervention.notes.placeholder"
          />
          {errors.notes ? (
            <FormHelperText error sx={{ m: 0 }}>
              {intl.formatMessage({ id: "label.supervisorIntervention.validation.notesRequired" })}
            </FormHelperText>
          ) : null}
        </OverviewSectionCard>
      </HBox>

      <HBox sx={{ position: "relative", zIndex: 2000, flexShrink: 0, height: 0 }}>
        <HButtonBar
          onSave={handleSave}
          onReset={handleReset}
          onClose={handleClose}
        />
      </HBox>
    </HBox>
  );

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.supervisorIntervention.title" })}
      HBreadcrumb={intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection",
      })}
      contentPaddingTop={0}
    >
      {body}
    </FunctionLayout>
  );
}
