import { ed as useIntl, ct as ar, ef as useLocation, dN as reactExports, dB as jsxRuntimeExports, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr, ah as ExclusionPolicyAPI } from "./index-BhdgJqva.js";
const ExclusionPolicy = () => {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    { name: "Description", type: "string", code: "Description" },
    { name: "Max number of exclusion days", type: "number", code: "MaxNumberOfExclusionDays" },
    { name: "Max number of Exclusion in Cycle", type: "number", code: "MaxNumberOfExclusionInCycle" },
    { name: "Grace Days", type: "number", code: "GraceDays" },
    { name: "Hard Validate", type: "string", code: "HardValidate" },
    { name: "Requires authorization", type: "string", code: "RequiresAuthorization" }
  ];
  reactExports.useEffect(() => {
    console.log("✅  Exclusion Policy Output Attributes Loaded:", outputAttributes);
  }, []);
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    console.log("➡️  Exclusion Policy Save Clicked. Payload:", dmnPayload);
    try {
      const res = await Kr.POST(
        ExclusionPolicyAPI.ExclusionPolicy(screenMenuId),
        dmnPayload,
        {},
        false,
        {
          "X-Tenant-Id": Realm
        }
      );
      if (res.status === 200) {
        toast.success(
          res.data.msg || intl.formatMessage({
            id: "Exclusionpolicy.save.success",
            defaultMessage: "Exclusion Policy  Rule uploaded successfully"
          })
        );
      } else {
        toast.error(
          res.data.msg || intl.formatMessage({
            id: "Exclusionpolicy.save.failed",
            defaultMessage: "Failed to upload  Exclusion Policy Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ Exclusion Policy DMN Upload Failed:", err);
      toast.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "Exclusionpolicy.save.error",
          defaultMessage: "Error uploading Exclusion Policy Rule"
        })
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "Exclusionpolicy.title",
          defaultMessage: "Exclusion Policy"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "PolicyExclusion",
        modulename: "COL",
        tenantId: Realm,
        dmnType: "DECISION_TABLE",
        entityName: "ExclusionPolicy",
        outputAttributes,
        onSubmit: handleSave,
        editMode: true
      }
    )
  ] });
};
export {
  ExclusionPolicy as default
};
