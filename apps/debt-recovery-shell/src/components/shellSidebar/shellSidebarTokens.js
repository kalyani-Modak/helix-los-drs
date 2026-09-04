import { alpha } from "@mui/material/styles";

/**
 * Interface Delight–aligned rail tokens + realm primary for active states.
 * @param {'light'|'dark'} mode
 * @param {object} colors — from `getColors(realm)`
 */
export function getShellSidebarTokens(mode, colors) {
  const base =
    mode === "dark"
      ? {
          railBg: "hsl(222, 47%, 6%)",
          railFg: "hsl(215, 20%, 65%)",
          railFgMuted: "hsl(215, 14%, 55%)",
          railBorder: "rgba(255, 255, 255, 0.06)",
          searchBg: "hsl(222, 30%, 14%)",
        }
      : {
          railBg: "hsl(220, 25%, 14%)",
          railFg: "hsl(215, 20%, 75%)",
          railFgMuted: "hsl(215, 20%, 55%)",
          railBorder: "rgba(255, 255, 255, 0.08)",
          searchBg: "hsl(220, 25%, 20%)",
        };

  return {
    ...base,
    activeBg: colors.primary,
    activeFg: colors.text?.white || "#ffffff",
    hoverBg: alpha(colors.primary, mode === "dark" ? 0.12 : 0.14),
    focusRing: alpha(colors.primary, 0.45),
    primary: colors.primary,
  };
}

/** Rail width & menu icon sizes = 70% of original compact (64px) spec. */
export const SHELL_SIDEBAR_RAIL_SCALE = 0.7;

const BASE_RAIL_WIDTH_PX = 64;
const BASE_PARENT_HIT_PX = 44;
const BASE_PARENT_ICON_PX = 22;
const BASE_LOGO_BOX_PX = 36;
const BASE_LOGO_FONT_PX = 12;
const BASE_SEARCH_ICON_PX = 18;

export const SHELL_SIDEBAR_WIDTH_EXPANDED = Math.round(260 * SHELL_SIDEBAR_RAIL_SCALE);
export const SHELL_SIDEBAR_WIDTH_COLLAPSED = Math.round(
  BASE_RAIL_WIDTH_PX * SHELL_SIDEBAR_RAIL_SCALE
);

export const RAIL_PARENT_BUTTON_PX = Math.round(BASE_PARENT_HIT_PX * SHELL_SIDEBAR_RAIL_SCALE);
export const RAIL_PARENT_ICON_PX = Math.round(BASE_PARENT_ICON_PX * SHELL_SIDEBAR_RAIL_SCALE);
export const RAIL_LOGO_BOX_PX = Math.round(BASE_LOGO_BOX_PX * SHELL_SIDEBAR_RAIL_SCALE);
export const RAIL_LOGO_FONT_PX = Math.max(8, Math.round(BASE_LOGO_FONT_PX * SHELL_SIDEBAR_RAIL_SCALE));
export const RAIL_SEARCH_ICON_PX = Math.round(BASE_SEARCH_ICON_PX * SHELL_SIDEBAR_RAIL_SCALE);

/**
 * Command-palette style surface (Interface Delight CommandPalette / card tokens).
 * @param {'light'|'dark'} mode
 * @param {object} colors — from `getColors(realm)`
 */
export function getSearchPopupTokens(mode, colors) {
  const primaryTint = alpha(colors.primary, mode === "dark" ? 0.18 : 0.1);
  if (mode === "dark") {
    return {
      backdrop: "rgba(0, 0, 0, 0.55)",
      cardBg: "hsl(222, 47%, 9%)",
      cardBorder: "hsl(222, 30%, 18%)",
      fg: "hsl(210, 20%, 92%)",
      mutedFg: "hsl(215, 14%, 55%)",
      kbdBg: "hsl(222, 30%, 14%)",
      kbdBorder: "hsl(222, 30%, 22%)",
      rowHover: "hsl(222, 30%, 14%)",
      rowSelected: primaryTint,
      inputBg: "hsl(222, 30%, 12%)",
    };
  }
  return {
    backdrop: "rgba(15, 23, 42, 0.4)",
    cardBg: "#ffffff",
    cardBorder: "hsl(214, 20%, 90%)",
    fg: "hsl(220, 20%, 10%)",
    mutedFg: "hsl(215, 14%, 46%)",
    kbdBg: "hsl(215, 20%, 95%)",
    kbdBorder: "hsl(214, 20%, 90%)",
    rowHover: "hsl(215, 20%, 96%)",
    rowSelected: primaryTint,
    inputBg: "hsl(215, 20%, 97%)",
  };
}
