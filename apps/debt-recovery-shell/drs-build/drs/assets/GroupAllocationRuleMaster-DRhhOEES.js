import { dN as reactExports, ed as useIntl, ct as ar, ef as useLocation, dB as jsxRuntimeExports, cx as bp, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr } from "./index-BhdgJqva.js";
import { G as GroupAllocationRuleMasterAPI } from "./apiEndpoints-BEKhabSg.js";
const GroupAllocationRuleMaster = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const intl = useIntl();
  const toast = ar();
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "label.GroupAllocationRule.output.groupCode",
        defaultMessage: "Group Code"
      }),
      type: "string",
      code: "GroupCode"
    }
  ];
  const handleSave = async (dmnPayload) => {
    var _a, _b;
    try {
      setLoading(true);
      await Kr.POST(
        GroupAllocationRuleMasterAPI.saveGroupAllocationRuleMaster(screenMenuId),
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
          id: "message.GroupAllocationRuleMaster.SaveError",
          defaultMessage: "Error while saving Group Allocation Rule"
        })
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-allocation-rule-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-allocation-rule-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.GroupAllocationRuleMaster.title",
            defaultMessage: "Group Allocation Rule Master"
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "GroupAllocation",
        modulename: "COL",
        tenantId: realm,
        dmnType: "DECISION_TABLE",
        entityName: "ACNT",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  GroupAllocationRuleMaster as default
};
