import { ed as useIntl, ef as useLocation, dB as jsxRuntimeExports, v as Box, cx as bp } from "./index-BhdgJqva.js";
const FunctionLayout = ({ children, title, breadcrumbMid, contentPaddingTop = 1, actions, scrollMode = "auto" }) => {
  const intl = useIntl();
  const { pathname, state } = useLocation();
  state == null ? void 0 : state.menuId;
  if (title == null || title === "") {
    throw new Error("FunctionLayout: 'title' prop is required");
  }
  intl.formatMessage({
    id: "label.functionLayout.breadcrumb.accountManagement",
    defaultMessage: "Account management"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", mt: 0, flex: 1, minHeight: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Box,
      {
        component: "nav",
        "aria-label": "Breadcrumb",
        sx: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          mt: 0,
          mb: 0,
          py: 0,
          minHeight: 0,
          /* Top edge: FunctionGroupsBar section already has a bottom border; avoid a double line. */
          borderBottom: 1,
          borderStyle: "solid",
          borderColor: "divider"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
          actions && /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { ml: "auto", display: "flex", alignItems: "center", gap: 1 }, children: actions })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          flex: 1,
          minHeight: 0,
          padding: 0,
          pt: contentPaddingTop,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: scrollMode === "contain" ? "hidden" : "auto"
        },
        children
      }
    )
  ] });
};
export {
  FunctionLayout as F
};
