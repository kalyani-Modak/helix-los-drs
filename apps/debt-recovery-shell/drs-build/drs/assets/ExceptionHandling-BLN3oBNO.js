import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, eh as useNavigate, ct as ar, el as useSelector, ef as useLocation, dN as reactExports, em as useTheme, aX as Kr, ag as ExceptionAPI, bV as Stack, ac as Dt, cB as cc, cf as Typography, dK as ps, N as CircularProgress, bH as SE, dI as pp, aW as Kg, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
const GppMaybeOutlinedIcon = createSvgIcon([/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25z"
}, "0"), /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M11 14h2v2h-2zm0-7h2v5h-2z"
}, "1")]);
function buildSavePayload(treatAsException, specialCode, remarks) {
  return {
    cException: treatAsException ? "Y" : "N",
    szSpecialCode: treatAsException ? String(specialCode || "").trim() : "",
    szRemarks: String(remarks || "").trim()
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
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [treatAsException, setTreatAsException] = reactExports.useState(false);
  const [specialCode, setSpecialCode] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({ specialCode: false });
  const [specialCodesData, setSpecialCodesData] = reactExports.useState([]);
  const [loadingSpecialCodes, setLoadingSpecialCodes] = reactExports.useState(false);
  const [specialCodesError, setSpecialCodesError] = reactExports.useState(null);
  const theme = useTheme();
  reactExports.useEffect(() => {
    fetchSpecialCodesFromBackend();
  }, []);
  const fetchSpecialCodesFromBackend = async () => {
    setLoadingSpecialCodes(true);
    setSpecialCodesError(null);
    try {
      const response = await Kr.GET(ExceptionAPI.Exception(screenMenuId));
      if (response && response.data) {
        const data = response.data;
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
  const specialCodeOptions = reactExports.useMemo(() => {
    return specialCodesData.map((item) => {
      const code = item.szCondition || item.code || item.id;
      const description = item.szi18nDesc || item.szDesc || item.description || item.label;
      return {
        value: code,
        label: intl.formatMessage({
          id: description,
          defaultMessage: item.szDesc || description
        })
      };
    });
  }, [specialCodesData, intl]);
  const resetForm = reactExports.useCallback(() => {
    setTreatAsException(false);
    setSpecialCode("");
    setNotes("");
    setErrors({ specialCode: false });
  }, []);
  const handleSave = async () => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(intl.formatMessage({ id: "label.exceptionHandling.noAccountSelected" }));
      return void 0;
    }
    const needsCode = treatAsException;
    const nextErrors = {
      specialCode: needsCode && String(specialCode || "").trim() === ""
    };
    setErrors(nextErrors);
    if (nextErrors.specialCode) {
      toast.error(intl.formatMessage({ id: "error.exception.specialCode.required" }));
      return void 0;
    }
    const payload = buildSavePayload(treatAsException, specialCode, notes);
    return Kr.POST(ExceptionAPI.Exception(screenMenuId), payload).then(
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
            data.message || data.msg || intl.formatMessage({ id: "success.exception.saved" })
          );
          if (notes.trim()) {
            toast.info(intl.formatMessage({ id: "label.exceptionHandling.notesNotSavedToast" }));
          }
        } else {
          toast.error(
            data.message || data.msg || intl.formatMessage({ id: "error.exception.saveFailed" })
          );
        }
        return res;
      },
      (err) => {
        var _a, _b, _c, _d;
        const msg = ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || ((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.msg) || intl.formatMessage({ id: "error.exception.saveFailed" });
        toast.error(msg);
        throw err;
      }
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
    border: "1px solid #dbe7ff"
  };
  const formBody = /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 2, sx: { pt: 0.5, backgroundColor: theme.palette.background.gradient, borderRadius: 2, p: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: highlightRowSx, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dt,
        {
          sx: {
            flexShrink: 0,
            alignSelf: "flex-start",
            pt: "6px",
            display: "flex",
            alignItems: "flex-start",
            "& .hcheckbox-wrapper": {
              width: "auto",
              margin: 0,
              minWidth: 0
            },
            "& .MuiFormControlLabel-root": {
              marginRight: 0,
              marginLeft: 0
            }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              label: "",
              checked: treatAsException,
              onChange: (e) => {
                setTreatAsException(e.target.checked);
                setErrors((prev) => ({ ...prev, specialCode: false }));
              },
              align: "left",
              margin: "0"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.75, sx: { flex: 1, minWidth: 0, pt: 0.25 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", alignItems: "center", spacing: 1, sx: { flexWrap: "nowrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GppMaybeOutlinedIcon,
            {
              sx: {
                fontSize: 18,
                color: "#f59e0b",
                flexShrink: 0,
                display: "block"
              }
            }
          ),
          "            ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Typography,
            {
              component: "span",
              variant: "caption",
              sx: { fontSize: 12, fontWeight: 600, lineHeight: 1.35, color: "text.primary" },
              children: intl.formatMessage({ id: "label.ExceptionHandling.Treat as exception case" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Typography,
          {
            variant: "caption",
            component: "p",
            sx: { m: 0, fontSize: 10, lineHeight: 1.45, color: "text.secondary" },
            children: intl.formatMessage({ id: "label.exceptionHandling.exceptionHelper" })
          }
        )
      ] })
    ] }),
    treatAsException ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 2, sx: { width: "100%", alignItems: "stretch" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            width: "100%",
            textAlign: "left",
            "& .label-field": { textAlign: "left !important" }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.ExceptionHandling.Special code" }),
                required: true,
                align: "left",
                translate: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 0.75, maxWidth: 480, width: "100%", position: "relative" }, children: [
              loadingSpecialCodes && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: {
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 20 })
                }
              ),
              specialCodesError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  variant: "caption",
                  sx: {
                    display: "block",
                    color: "error.main",
                    mb: 1,
                    fontSize: 12
                  },
                  children: intl.formatMessage({
                    id: "error.exception.failedToLoadSpecialCodes",
                    defaultMessage: "Failed to load special codes. Please try again."
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "specialCode",
                  value: specialCode,
                  onChange: (e) => {
                    setSpecialCode(e.target.value);
                    if (e.target.value) setErrors((prev) => ({ ...prev, specialCode: false }));
                  },
                  options: specialCodeOptions,
                  placeholder: intl.formatMessage({
                    id: "label.exceptionHandling.specialCode.placeholder",
                    defaultMessage: "Select special code"
                  }),
                  required: true,
                  fullwidth: true,
                  error: errors.specialCode,
                  width: "100%",
                  disabled: loadingSpecialCodes || specialCodesError
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            width: "100%",
            textAlign: "left",
            "& .label-field": { textAlign: "left !important" }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.ExceptionHandling.Notes" }),
                translate: false,
                align: "left"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 1, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              pp,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "label.exceptionHandling.notes.placeholder",
                width: "480px",
                maxLines: 3,
                maxLength: 500,
                hiddenYN: false,
                mandatory: false,
                readOnly: false,
                disabled: false,
                translate: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { display: "block", fontSize: 10, color: "text.secondary", mt: 0.75 } })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { textAlign: "center", py: 4, color: "text.secondary" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GppMaybeOutlinedIcon, { sx: { fontSize: 32, mx: "auto", mb: 1, opacity: 0.35 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { display: "block", fontSize: 12 }, children: intl.formatMessage({ id: "label.exceptionHandling.emptyStatePrimary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { display: "block", fontSize: 10, mt: 0.5 }, children: intl.formatMessage({ id: "label.exceptionHandling.emptyStateSecondary" }) })
    ] })
  ] });
  if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FunctionLayout,
      {
        title: intl.formatMessage({ id: "label.ExceptionHandling.title" }),
        breadcrumbMid: intl.formatMessage({ id: "label.functionLayout.breadcrumb.customer" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", children: intl.formatMessage({ id: "label.exceptionHandling.noAccountSelected" }) }) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.ExceptionHandling.title" }),
      breadcrumbMid: intl.formatMessage({ id: "label.functionLayout.breadcrumb.customer" }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
              // bgcolor: "background.default",
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pb: 10
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      maxWidth: 1320,
                      mx: "auto",
                      px: { xs: 1.5, sm: 2 },
                      py: 1
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Kg,
                      {
                        variant: "outlined",
                        elevation: 0,
                        sx: {
                          borderRadius: 2,
                          borderColor: "divider",
                          p: { xs: 1.5, sm: 2 },
                          mb: 1
                        },
                        children: formBody
                      }
                    )
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: resetForm,
            onClose: () => navigate("/homelayout/welcomepage"),
            disableToast: { save: true }
          }
        )
      ]
    }
  );
};
export {
  ExceptionHandling as default
};
