import { dN as reactExports, ed as useIntl, ct as ar, dB as jsxRuntimeExports, cx as bp, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr } from "./index-BhdgJqva.js";
import { T as ThresholdLimitMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const ThresholdLimitMaster = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const intl = useIntl();
  const toast = ar();
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "label.ThresholdLimitMaster.output.limits",
        defaultMessage: "Limits"
      }),
      type: "number",
      code: "Limits"
    }
  ];
  const handleSave = async (dmnPayload) => {
    var _a, _b;
    try {
      setLoading(true);
      await Kr.POST(
        ThresholdLimitMasterAPI.saveThresholdLimitMaster(),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": realm
        }
      );
    } catch (err) {
      toast.error(
        ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "message.ThresholdLimitMaster.SaveError",
          defaultMessage: "Error while saving Threshold Limit"
        })
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.ThresholdLimitMaster.title",
          defaultMessage: "Threshold Limit Master"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "ThresholdLimit",
        modulename: "COL",
        tenantId: realm,
        dmnType: "DECISION_TABLE",
        entityName: "ThresholdLimit",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  ThresholdLimitMaster as default
};
