import { ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, dB as jsxRuntimeExports, v as Box, dK as ps, dI as pp, cj as Vg, aX as Kr, aS as ImmediateAttentionAPI } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const ImmediateAttention = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [notes, setNotes] = reactExports.useState("");
  const [objErrors, setObjErrors] = reactExports.useState({
    notes: false
  });
  const resetForm = () => {
    setNotes("");
  };
  const validateForm = () => {
    const errors = {};
    if (!notes) errors.notes = true;
    setObjErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSave = () => {
    if (!validateForm()) {
      toast.error(
        intl.formatMessage({ id: "label.immediateAttention.validation.error" })
      );
      return;
    }
    const requestData = {
      immediateAttentionDto: {
        szNotes: notes || ""
      }
    };
    Kr.POST(
      ImmediateAttentionAPI.updateImmediateAttentionDetails,
      requestData,
      {},
      false,
      {
        "Content-Type": "application/json"
      }
    ).then((res) => {
      var _a, _b;
      if (((_a = res.data.status) == null ? void 0 : _a.toLowerCase()) === "success") {
        toast.success(
          res.data.msg || intl.formatMessage({ id: "label.immediateAttention.success" })
        );
        resetForm();
      } else {
        if ((_b = res.data) == null ? void 0 : _b.responseJson) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data.msg || intl.formatMessage({ id: "label.immediateAttention.error" })
          );
        }
      }
    }).catch((err) => {
      var _a, _b, _c, _d;
      if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
      } else {
        toast.error(
          ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({ id: "label.immediateAttention.error" })
        );
      }
    });
  };
  const labelStyles = {
    width: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FunctionLayout, { title: intl.formatMessage({ id: "label.immediateAttention.title" }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "flex-start", mb: 3, gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { ...labelStyles, pt: "6px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.notes" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        pp,
        {
          value: notes,
          width: "300px",
          onChange: (e) => setNotes(e.target.value),
          rows: 4
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onReset: resetForm,
        onClose: () => navigate("/homelayout/welcomepage")
      }
    )
  ] });
};
export {
  ImmediateAttention as default
};
