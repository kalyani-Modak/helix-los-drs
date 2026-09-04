import { dN as reactExports, ed as useIntl, ct as ar, ef as useLocation, dB as jsxRuntimeExports, cx as bp, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr } from "./index-BhdgJqva.js";
import { f as ManualRevisionPolicyAPI } from "./apiEndpoints-CGlR3-gk.js";
const ManualRevisionPolicyMaster = () => {
  var _a;
  const [loading, setLoading] = reactExports.useState(false);
  const intl = useIntl();
  const toast = ar();
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.minNewLimit",
        defaultMessage: "Minimum New Credit Limit Amount"
      }),
      type: "number",
      code: "MinimumNewCreditLimitAmount"
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.maxNewLimit",
        defaultMessage: "Maximum New Credit Limit Amount"
      }),
      type: "number",
      code: "MaximumNewCreditLimitAmount"
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.increasePercent",
        defaultMessage: "Increase Max Percent Change in Credit Limit"
      }),
      type: "number",
      code: "IncreaseMaxPercentChangeInCreditLimit"
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.decreasePercent",
        defaultMessage: "Decrease Max Percent Change in Credit Limit"
      }),
      type: "number",
      code: "DecreaseMaxPercentChangeInCreditLimit"
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.allowed",
        defaultMessage: "Allowed"
      }),
      type: "string",
      code: "Allowed",
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" }
      ]
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.hardValidate",
        defaultMessage: "Hard Validate"
      }),
      type: "string",
      code: "HardValidate",
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" }
      ]
    },
    {
      name: intl.formatMessage({
        id: "label.ManualRevisionPolicy.output.requiresAuth",
        defaultMessage: "Requires Authorization"
      }),
      type: "string",
      code: "RequiresAuthorization",
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" }
      ]
    }
  ];
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    try {
      setLoading(true);
      await Kr.POST(
        ManualRevisionPolicyAPI.saveManualRevisionPolicyMaster(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": realm
        }
      );
    } catch (err) {
      toast.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "message.ManualRevisionPolicy.SaveError",
          defaultMessage: "Error while saving Manual Revision Policy"
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
          id: "label.ManualRevisionPolicy.title",
          defaultMessage: "Manual Revision Policy Master"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "PolicyManualRevision",
        modulename: "COL",
        tenantId: realm,
        dmnType: "DECISION_TABLE",
        entityName: "ManualRevisionPolicy",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  ManualRevisionPolicyMaster as default
};
