import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, ef as useLocation, aX as Kr, bY as SupervisorInterventionAPI, ac as Dt, dK as ps, A as AE, aH as FormControl, bw as RadioGroup, u as BoltOutlinedIcon, bv as Radio, cf as Typography, aI as FormHelperText, dI as pp, cj as Vg } from "./index-BhdgJqva.js";
import { A as AutorenewOutlinedIcon } from "./AutorenewOutlined-BEkg8ZAd.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const PersonRemoveOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4m-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4m2 0c.2-.71 3.3-2 6-2 2.69 0 5.77 1.28 6 2zm13-8h6v2h-6z"
}));
const INTERVENTION_IDS = ["pullback", "immediate", "requeue"];
const INTERVENTION_META = {
  pullback: { Icon: PersonRemoveOutlinedIcon, color: "error.main" },
  immediate: { Icon: BoltOutlinedIcon, color: "warning.main" },
  requeue: { Icon: AutorenewOutlinedIcon, color: "primary.main" }
};
function requiredTitle(label) {
  const title = String(label || "").replace(/\s*\*$/, "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    title,
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--drs-color-error, #d32f2f)" }, children: "*" })
  ] });
}
function mapUiInterventionToApi(ui) {
  const m = { pullback: "P", immediate: "I", requeue: "R" };
  return m[ui] || "";
}
function SupervisorIntervention() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);
  const [intervention, setIntervention] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({ intervention: false, notes: false });
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const chooseIntervention = reactExports.useCallback((value) => {
    setIntervention(value);
    setErrors((prev) => ({ ...prev, intervention: false }));
  }, []);
  const loadDetails = reactExports.useCallback(() => {
    setIntervention("");
    setNotes("");
    setErrors({ intervention: false, notes: false });
  }, []);
  reactExports.useEffect(() => {
    loadDetails();
  }, [loadDetails, selectedRow]);
  const validate = reactExports.useCallback(() => {
    const next = {
      intervention: !intervention,
      notes: !notes || !String(notes).trim()
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
  const handleSave = reactExports.useCallback(() => {
    if (!validate() || !selectedRow) return void 0;
    const interventionType = mapUiInterventionToApi(intervention);
    const requestData = {
      supervisoryInterventionDto: {
        chInterventionType: interventionType,
        szInterventionRemark: String(notes).trim()
      }
    };
    return Kr.POST(
      SupervisorInterventionAPI.saveDetails(screenMenuId),
      requestData,
      {},
      false,
      { "Content-Type": "application/json" }
    ).then((res) => {
      var _a, _b, _c, _d;
      const responseStatus = String(((_a = res.data) == null ? void 0 : _a.status) || "").toLowerCase();
      const responseMessage = ((_b = res.data) == null ? void 0 : _b.msg) || ((_c = res.data) == null ? void 0 : _c.message);
      if (responseStatus === "success") {
        setIntervention("");
        setNotes("");
        setErrors({ intervention: false, notes: false });
        loadDetails();
        return { success: true, message: responseMessage };
      } else if ((_d = res.data) == null ? void 0 : _d.responseJson) {
        handleValidationErrors(intl, toast, res.data.responseJson);
        return { success: false };
      } else {
        return { success: false, message: responseMessage };
      }
    }).catch((err) => {
      var _a, _b, _c, _d;
      if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
      }
      return { success: false, message: (_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message };
    });
  }, [intervention, intl, loadDetails, notes, selectedRow, toast, validate]);
  const handleReset = reactExports.useCallback(() => {
    setErrors({ intervention: false, notes: false });
    loadDetails();
  }, [loadDetails]);
  const handleClose = reactExports.useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);
  const body = !selectedRow ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: { xs: 2, sm: 3, md: 4 }, py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ps,
    {
      value: intl.formatMessage({ id: "label.supervisorIntervention.noAccount" }),
      colon: false,
      align: "left"
    }
  ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
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
              gap: 1.5
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AE,
                {
                  title: requiredTitle(
                    intl.formatMessage({
                      id: "label.supervisorIntervention.section.selectAction",
                      defaultMessage: "Select Intervention Action *"
                    })
                  ),
                  minHeight: 0,
                  sx: { borderRadius: 1, height: "auto" },
                  bodySx: { p: 0, minHeight: 0, flex: "0 0 auto" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FormControl, { component: "fieldset", error: errors.intervention, fullWidth: true, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RadioGroup,
                      {
                        "aria-label": intl.formatMessage({ id: "label.supervisorIntervention.section.selectAction" }),
                        name: "supervisorInterventionType",
                        value: intervention,
                        onChange: (e) => chooseIntervention(e.target.value),
                        sx: { width: "100%" },
                        children: INTERVENTION_IDS.map((id) => {
                          const selected = intervention === id;
                          const { Icon, color } = INTERVENTION_META[id];
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Dt,
                            {
                              onClick: () => chooseIntervention(id),
                              sx: (theme) => ({
                                borderTop: id === INTERVENTION_IDS[0] ? 0 : 1,
                                borderColor: "divider",
                                bgcolor: selected ? "action.selected" : "transparent",
                                px: { xs: 1.25, sm: 1.5 },
                                py: { xs: 1.1, sm: 1.25 },
                                cursor: "pointer",
                                transition: theme.transitions.create("background-color", {
                                  duration: theme.transitions.duration.shortest
                                }),
                                "&:hover": {
                                  bgcolor: "action.hover"
                                },
                                "&:focus-within": {
                                  outline: "2px solid",
                                  outlineColor: "primary.main",
                                  outlineOffset: -2
                                }
                              }),
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { background: "transparent" }, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.8, background: "transparent" }, children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    Radio,
                                    {
                                      id: `supervisor-intervention-${id}`,
                                      name: "supervisorInterventionType",
                                      value: id,
                                      checked: selected,
                                      onChange: (e) => chooseIntervention(e.target.value),
                                      size: "small",
                                      sx: {
                                        p: 0.45,
                                        color: "var(--drs-color-primary)",
                                        "&.Mui-checked": { color: "var(--drs-color-primary)" }
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { color, fontSize: 16, flexShrink: 0 } }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    Typography,
                                    {
                                      component: "label",
                                      htmlFor: `supervisor-intervention-${id}`,
                                      sx: {
                                        color: "text.primary",
                                        cursor: "pointer",
                                        fontSize: 12,
                                        fontWeight: selected ? 600 : 500,
                                        lineHeight: 1.3
                                      },
                                      children: intl.formatMessage({ id: `label.supervisorIntervention.option.${id}.title` })
                                    }
                                  )
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Typography,
                                  {
                                    id: `supervisor-intervention-${id}-description`,
                                    variant: "caption",
                                    color: "text.secondary",
                                    sx: {
                                      display: "block",
                                      ml: 5.15,
                                      mt: 0.15,
                                      fontSize: 12,
                                      lineHeight: 1.45
                                    },
                                    children: intl.formatMessage({ id: `label.supervisorIntervention.option.${id}.description` })
                                  }
                                )
                              ] })
                            },
                            id
                          );
                        })
                      }
                    ),
                    errors.intervention ? /* @__PURE__ */ jsxRuntimeExports.jsx(FormHelperText, { sx: { mx: 1.5, mt: 0.75, mb: 1 }, children: intl.formatMessage({ id: "label.supervisorIntervention.validation.actionRequired" }) }) : null
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                AE,
                {
                  title: requiredTitle(
                    intl.formatMessage({
                      id: "label.supervisorIntervention.notes.label",
                      defaultMessage: "Supervisor Notes *"
                    })
                  ),
                  sx: { borderRadius: 2, mt: 2, height: "auto" },
                  bodySx: {
                    px: { xs: 1.25, sm: 1.5 },
                    py: { xs: 1.25, sm: 1.5 },
                    minHeight: 0,
                    flex: "0 0 auto"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      pp,
                      {
                        id: "supervisor-intervention-notes",
                        value: notes,
                        onChange: (e) => {
                          setNotes(e.target.value);
                          setErrors((prev) => ({ ...prev, notes: false }));
                        },
                        width: "100%",
                        maxLines: 2,
                        required: true,
                        error: errors.notes,
                        placeholder: "label.supervisorIntervention.notes.placeholder"
                      }
                    ),
                    errors.notes ? /* @__PURE__ */ jsxRuntimeExports.jsx(FormHelperText, { error: true, sx: { m: 0 }, children: intl.formatMessage({ id: "label.supervisorIntervention.validation.notesRequired" }) }) : null
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3, flexShrink: 0, height: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: handleReset,
            onClose: handleClose
          }
        ) })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.supervisorIntervention.title" }),
      HBreadcrumb: intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection"
      }),
      contentPaddingTop: 0,
      children: body
    }
  );
}
export {
  SupervisorIntervention as default
};
