import { ed as useIntl, ct as ar, ef as useLocation, dN as reactExports, dB as jsxRuntimeExports, ep as vp, Z as DMNDecisionTableBuilder, aX as Kr, bM as SegmentationAPI } from "./index-BhdgJqva.js";
const Segmentation = () => {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const Realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const outputAttributes = [
    { name: "Segment Code", type: "string", code: "SegmentCode" }
  ];
  reactExports.useEffect(() => {
    console.log("✅ Segmentation Output Attributes Loaded:", outputAttributes);
  }, []);
  const handleSave = async (dmnPayload) => {
    var _a2, _b;
    console.log("➡️ Segmentation Save Clicked. Payload:", dmnPayload);
    try {
      const res = await Kr.POST(
        SegmentationAPI.SegmentationRule(screenMenuId),
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
            id: "segmentation.save.success",
            defaultMessage: "Segmentation Rule uploaded successfully"
          })
        );
      } else {
        toast.error(
          res.data.msg || intl.formatMessage({
            id: "segmentation.save.failed",
            defaultMessage: "Failed to upload Segmentation Rule"
          })
        );
      }
    } catch (err) {
      console.error("❌ Segmentation DMN Upload Failed:", err);
      toast.error(
        ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "segmentation.save.error",
          defaultMessage: "Error uploading Segmentation Rule"
        })
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "20px", marginBottom: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "segmentation.title",
          defaultMessage: "Segmentation"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DMNDecisionTableBuilder,
      {
        rulename: "Segmentation",
        modulename: "COL",
        tenantId: Realm,
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
  Segmentation as default
};
