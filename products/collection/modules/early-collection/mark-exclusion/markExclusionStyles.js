export const markExclusionGridTemplate =
  "minmax(96px, 0.95fr) minmax(96px, 0.95fr) minmax(110px, 1fr) 56px minmax(118px, 1fr) minmax(118px, 1fr) minmax(118px, 1fr) minmax(120px, 1fr) 44px";

export const markExclusionActiveTableSx = {
  "--mark-exclusion-grid": markExclusionGridTemplate,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "block",
  maxHeight: { xs: "none", sm: 420 },
  overflowX: "auto",
  overflowY: "auto",
  overscrollBehaviorX: "contain",
  overscrollBehaviorY: "contain",
  scrollbarGutter: "stable",
  WebkitOverflowScrolling: "touch",
  background: "var(--drs-bg-paper)",
};

export const markExclusionActiveRowSx = {
  display: { xs: "block", sm: "grid" },
  gridTemplateColumns: "var(--mark-exclusion-grid)",
  gap: "8px",
  alignItems: "center",
  minWidth: { xs: 0, sm: 860, lg: 900 },
  px: 1.5,
  py: 1,
  borderBottom: "1px solid var(--drs-border-divider)",
  "@media (max-width: 700px)": {
    minWidth: 0,
    px: 1.5,
    py: 1.25,
  },
};

export const markExclusionFieldSx = {
  minWidth: 0,
  background: "transparent",
  "& .MuiFormControl-root, & .MuiInputBase-root": {
    width: "100%",
    minWidth: 0,
  },
  "@media (max-width: 700px)": {
    display: "grid",
    gridTemplateColumns: "minmax(108px, 0.42fr) minmax(0, 1fr)",
    alignItems: "center",
    gap: "10px",
    py: 0.5,
    "&::before": {
      content: "attr(data-label)",
      color: "var(--drs-text-secondary)",
      fontSize: 10,
      fontWeight: 700,
    },
  },
};

export const markExclusionBadgeBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 20,
  maxWidth: "100%",
  px: 0.75,
  borderRadius: "4px",
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
};
