import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { HBreadCrumb } from "@helix/component-library";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} props.title — Resolved page title (current crumb).
 * @param {string} [props.breadcrumbMid] — Optional middle segment (default: "Customer").
 * @param {number} [props.contentPaddingTop] — MUI spacing units between breadcrumb and body (default 1). Use 0 to sit content flush under the crumb row.
 * @param {'auto'|'contain'} [props.scrollMode] — `auto` (default): body scrolls as one block. `contain`: body does not scroll; children own vertical scroll (e.g. frozen chrome + inner scroller).
 */
const FunctionLayout = ({ children, title, breadcrumbMid, contentPaddingTop = 1, actions, scrollMode = "auto" }) => {
  const intl = useIntl();
  const { pathname, state } = useLocation();
  const menuId = state?.menuId;

  if (title == null || title === "") {
    throw new Error("FunctionLayout: 'title' prop is required");
  }

  const defaultRootLabel = intl.formatMessage({
    id: "label.functionLayout.breadcrumb.accountManagement",
    defaultMessage: "Account management",
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 0, flex: 1, minHeight: 0 }}>
      <Box
        component="nav"
        aria-label={"Breadcrumb"}
        sx={{
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
          borderColor: "divider",
        }}
      >
        <HBreadCrumb />

        {actions && (
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          padding: 0,
          pt: contentPaddingTop,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: scrollMode === "contain" ? "hidden" : "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default FunctionLayout;
