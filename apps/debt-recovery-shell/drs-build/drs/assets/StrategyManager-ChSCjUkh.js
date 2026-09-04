import { ed as useIntl, ct as ar, ef as useLocation, dN as reactExports, dB as jsxRuntimeExports, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr } from "./index-BhdgJqva.js";
import { n as StrategyManagerAPI } from "./apiEndpoints-CGlR3-gk.js";
const StrategyManager = () => {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    {
      name: intl.formatMessage({
        id: "StrategyManager.output.notAllowed",
        defaultMessage: "Not Allowed"
      }),
      type: "string",
      code: "NotAllowed"
    },
    {
      name: intl.formatMessage({
        id: "StrategyManager.output.authorizationRequired",
        defaultMessage: "Authorization required"
      }),
      type: "string",
      code: "AuthorizationRequired"
    }
  ];
  reactExports.useEffect(() => {
    console.log("Output Attributes Loaded:", outputAttributes);
  }, []);
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    console.log("Save Clicked. Payload:", dmnPayload);
    try {
      const res = await Kr.POST(
        StrategyManagerAPI.StrategyManager(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": Realm
        }
      );
      if (res.status === 200) {
        console.log("MN Upload Success:", res.data);
        toast.success(
          res.data.msg || intl.formatMessage({
            id: "StrategyManager.save.success",
            defaultMessage: "Strategy Manager Rule uploaded successfully"
          })
        );
      } else {
        console.log("DMN Upload Warning:", res.data);
        toast.error(
          res.data.msg || intl.formatMessage({
            id: "StrategyManager.save.failed",
            defaultMessage: "Failed to upload Strategy Manager Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ DMN Upload Failed:", err);
      toast.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "StrategyManager.save.error",
          defaultMessage: "Error uploading Strategy Manager Rule"
        })
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "StrategyManagerAPI.title",
          defaultMessage: "Strategy Manager"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "StrategyManager",
        modulename: "COL",
        tenantId: Realm,
        dmnType: "DECISION_TABLE",
        entityName: "StrategyManager",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  StrategyManager as default
};
