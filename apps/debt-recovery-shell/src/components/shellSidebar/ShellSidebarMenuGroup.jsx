import React from "react";
import PropTypes from "prop-types";
import { Box, ListItemButton } from "@mui/material";
import { getParentMenuIcon } from "./parentMenuIcon";
import { RAIL_PARENT_BUTTON_PX, RAIL_PARENT_ICON_PX } from "./shellSidebarTokens";

/**
 * Compact rail: parent icon only. Children open in PopupDrawer (no inline expansion).
 */
export default function ShellSidebarMenuGroup({
  parentMenu,
  items,
  hasActiveChild,
  isPopupOpen,
  onParentClick,
  tokens,
}) {
  const GroupIcon = getParentMenuIcon(parentMenu);
  const railActive = hasActiveChild || isPopupOpen;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 0.25 }}>
      <ListItemButton
        dense
        onClick={() => onParentClick(parentMenu)}
        title={`${parentMenu}${items.length ? ` (${items.length})` : ""}`}
        aria-expanded={isPopupOpen}
        aria-haspopup="dialog"
        sx={{
          borderRadius: 2,
          width: RAIL_PARENT_BUTTON_PX,
          height: RAIL_PARENT_BUTTON_PX,
          minWidth: RAIL_PARENT_BUTTON_PX,
          justifyContent: "center",
          p: 0,
          color: railActive ? tokens.activeFg : tokens.railFg,
          bgcolor: hasActiveChild ? tokens.activeBg : isPopupOpen ? tokens.hoverBg : "transparent",
          boxShadow: isPopupOpen ? `0 0 0 2px ${tokens.focusRing}` : "none",
          "&:hover": {
            bgcolor: hasActiveChild ? tokens.activeBg : tokens.hoverBg,
            color: tokens.activeFg,
          },
        }}
      >
        <GroupIcon sx={{ fontSize: RAIL_PARENT_ICON_PX }} />
      </ListItemButton>
    </Box>
  );
}

ShellSidebarMenuGroup.propTypes = {
  parentMenu: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasActiveChild: PropTypes.bool.isRequired,
  isPopupOpen: PropTypes.bool.isRequired,
  onParentClick: PropTypes.func.isRequired,
  tokens: PropTypes.object.isRequired,
};
