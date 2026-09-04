/**
 * Design tokens aligned with `user-management/modules/idmUI/UserScreen.jsx`
 * for consistent look & feel across utility templates and editors.
 */
export const idmLayoutColors = {
  primary: "#0378A6",
  secondary: "#8dbf41",
  accent: "#d80808",
  primaryLight: "#4aa3d9",
  primaryDark: "#025a8c",
  accentDark: "#a30404",
  background: {
    start: "#f8fafc",
    end: "#f1f5f9",
    gradient: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
  },
  cardBg: "rgba(255, 255, 255, 0.98)",
  text: {
    primary: "#0f172a",
    secondary: "#334155",
    light: "#64748b",
    muted: "#94a3b8",
  },
  border: "#e2e8f0",
  hover: "#f1f5f9",
  appBarGradient: "linear-gradient(135deg, #0378A6 0%, #025a8c 50%, #01406b 100%)",
  headerBarGradient:
    "linear-gradient(270deg, #0378A6, #025a8c, #8dbf41, #025a8c, #0378A6)",
} as const;

export const idmFontFamily = "'Inter', sans-serif";
