import { dB as jsxRuntimeExports, v as Box, x as ButtonBase, cr as alpha, cf as Typography, M as Chip } from "./index-BhdgJqva.js";
function initialsFromName(name) {
  if (!name || typeof name !== "string") return "";
  return name.split(/\s+/).filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function roleChipColor(role) {
  if (role === "Borrower") return { variant: "filled", color: "primary" };
  if (role === "Co-Borrower") return { variant: "filled", color: "secondary" };
  return { variant: "outlined", color: "default" };
}
function LinkedCustomerTileStrip({ customers, selectedCustomerId, onSelectCustomer }) {
  if (!customers || customers.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Box,
    {
      sx: {
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 0.5,
        pt: 0.5,
        mx: -0.5,
        px: 0.5
      },
      children: customers.map((c) => {
        const selected = c.id === selectedCustomerId;
        const chip = roleChipColor(c.role);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          ButtonBase,
          {
            onClick: () => onSelectCustomer(c.id),
            sx: (t) => {
              const primary = t.palette.primary.main;
              const isDark = t.palette.mode === "dark";
              const selectedBg = alpha(primary, isDark ? 0.14 : 0.05);
              const selectedRing = `0 0 0 1px ${alpha(primary, 0.2)}`;
              return {
                flexShrink: 0,
                textAlign: "left",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                border: 1,
                borderStyle: "solid",
                transition: "border-color 0.15s, background-color 0.15s, box-shadow 0.15s",
                ...selected ? {
                  borderColor: primary,
                  bgcolor: selectedBg,
                  boxShadow: selectedRing,
                  "&:hover": {
                    bgcolor: alpha(primary, isDark ? 0.18 : 0.08)
                  }
                } : {
                  borderColor: t.palette.divider,
                  bgcolor: t.palette.background.paper,
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: alpha(primary, 0.4),
                    bgcolor: alpha(primary, isDark ? 0.08 : 0.03)
                  }
                }
              };
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Box,
                {
                  sx: (t) => {
                    const primary = t.palette.primary.main;
                    const isDark = t.palette.mode === "dark";
                    return {
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: alpha(primary, isDark ? 0.22 : 0.1),
                      color: primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700
                    };
                  },
                  children: initialsFromName(c.name)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11, fontWeight: 600, display: "block", lineHeight: 1.3 }, children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.75, mt: 0.25, flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Chip,
                    {
                      label: c.role,
                      size: "small",
                      variant: chip.variant,
                      color: chip.color === "default" ? "default" : chip.color,
                      sx: { height: 18, fontSize: "8px", fontWeight: 600, "& .MuiChip-label": { px: 0.5 } }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: { fontSize: 9, fontFamily: "ui-monospace, monospace" }, children: c.customerNo })
                ] })
              ] })
            ] })
          },
          c.id
        );
      })
    }
  );
}
export {
  LinkedCustomerTileStrip as L
};
