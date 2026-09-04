import { ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, dB as jsxRuntimeExports, v as Box, dK as ps, cB as cc, cj as Vg, aX as Kr, by as ReallocateCaseAPI } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const ReallocateCase = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [reallocateCase, setReallocateCase] = reactExports.useState(false);
  const resetForm = () => {
    setReallocateCase(false);
  };
  const handleSave = () => {
    const requestData = {
      reallocateCaseDto: {
        chReallocCaseFlag: reallocateCase ? "Y" : "N"
      }
    };
    Kr.POST(ReallocateCaseAPI.reallocateCase(), requestData).then((res) => {
      var _a, _b;
      if (((_a = res.data.status) == null ? void 0 : _a.toLowerCase()) === "success") {
        toast.success(
          res.data.msg || intl.formatMessage({
            id: "label.reallocate.success",
            defaultMessage: "Case reallocated successfully"
          })
        );
        resetForm();
      } else {
        if ((_b = res.data) == null ? void 0 : _b.responseJson) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data.msg || intl.formatMessage({
              id: "label.reallocate.error",
              defaultMessage: "Failed to reallocate case"
            })
          );
        }
      }
    }).catch((err) => {
      var _a, _b, _c, _d;
      if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
      } else {
        toast.error(
          ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
            id: "label.reallocate.error",
            defaultMessage: "Failed to reallocate case"
          })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.reallocate.case.title",
        defaultMessage: "Reallocate Case"
      }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { p: 2, maxWidth: 900 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 3, gap: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: labelStyles, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.reallocate.case",
                defaultMessage: "Reallocate Case"
              }),
              sx: { fontSize: "16px", fontWeight: 500 },
              l̥: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              label: " ",
              checked: reallocateCase,
              onChange: (e) => setReallocateCase(e.target.checked),
              sx: { mb: 0 }
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
      ] })
    }
  );
};
export {
  ReallocateCase as default
};
