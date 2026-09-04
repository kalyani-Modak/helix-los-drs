import { ef as useLocation, dN as reactExports, ed as useIntl, ct as ar, dB as jsxRuntimeExports, cx as bp, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr } from "./index-BhdgJqva.js";
import { S as StrategyActionLimitMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const StrategyActionLimitMaster = () => {
  var _a;
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const [loading, setLoading] = reactExports.useState(false);
  const intl = useIntl();
  const toast = ar();
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "output.collectionLimit",
        defaultMessage: "Collection Limit"
      }),
      type: "number",
      code: "CollectionLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.exposureLimit",
        defaultMessage: "Exposure Limit"
      }),
      type: "number",
      code: "ExposureLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.manualLimit",
        defaultMessage: "Manual Limit"
      }),
      type: "number",
      code: "ManualLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.othersLimit",
        defaultMessage: "Others Limit"
      }),
      type: "number",
      code: "OthersLimit"
    },
    {
      name: intl.formatMessage({
        id: "output.totalLimit",
        defaultMessage: "Total Limit"
      }),
      type: "number",
      code: "TotalLimit"
    }
  ];
  reactExports.useEffect(() => {
    console.log("Output Attributes:", outputAttributes);
  }, []);
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    try {
      setLoading(true);
      await Kr.POST(
        StrategyActionLimitMasterAPI.saveStrategyActionLimitMaster(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": Realm
        }
      );
    } catch (err) {
      toast.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "message.StrategyActionLimitMaster.SaveError",
          defaultMessage: "Error while saving Strategy Action Limit"
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
          id: "label.StrategyActionLimitMaster.title",
          defaultMessage: "Strategy Action Limit Master"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "StrategyActionLimit",
        modulename: "COL",
        tenantId: Realm,
        dmnType: "DECISION_TABLE",
        entityName: "StrategyActionLimit",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  StrategyActionLimitMaster as default
};
