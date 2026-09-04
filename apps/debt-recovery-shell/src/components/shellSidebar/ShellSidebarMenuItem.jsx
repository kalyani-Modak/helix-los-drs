import React from "react";
import PropTypes from "prop-types";
import { Box, ListItemButton, ListItemText } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function ShellSidebarMenuItem({
  item,
  active,
  highlighted,
  tokens,
  collapsed,
  onNavigate,
}) {
  return (
    <ListItemButton
      dense
      onClick={() => onNavigate(item.path)}
      data-menu-id={item.menuId}
      sx={{
        borderRadius: 1,
        py: 0.75,
        pl: collapsed ? 1 : 2.25,
        pr: 1.5,
        minHeight: 36,
        color: active ? tokens.activeFg : tokens.railFg,
        bgcolor: active ? tokens.activeBg : "transparent",
        boxShadow: active ? `0 1px 2px ${alpha("#000", 0.12)}` : "none",
        "&:hover": {
          bgcolor: active ? tokens.activeBg : tokens.hoverBg,
          color: active ? tokens.activeFg : tokens.activeFg,
        },
        ...(highlighted &&
          !active && {
            bgcolor: alpha(tokens.primary, 0.2),
            boxShadow: `inset 0 0 0 1px ${tokens.focusRing}`,
          }),
      }}
    >
      {!collapsed && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "currentColor",
            opacity: 0.45,
            mr: 1,
            flexShrink: 0,
          }}
        />
      )}
      <ListItemText
        primary={item.name}
        primaryTypographyProps={{
          noWrap: true,
          sx: {
            fontSize: 12,
            fontWeight: active ? 600 : 400,
            fontFamily: '"Inter", system-ui, sans-serif',
          },
        }}
      />
    </ListItemButton>
  );
}

ShellSidebarMenuItem.propTypes = {
  item: PropTypes.shape({
    menuId: PropTypes.string,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool.isRequired,
  tokens: PropTypes.object.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
