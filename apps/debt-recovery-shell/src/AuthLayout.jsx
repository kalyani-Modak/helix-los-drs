// AuthLayout.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  AssessmentOutlined as AssessmentIcon,
  GroupsOutlined as GroupsIcon,
  SecurityOutlined as SecurityIcon,
  PublicOutlined as PublicIcon,
  CorporateFareOutlined as CorporateFareIcon,
} from "@mui/icons-material";

const palette = {
  navy: "#0b1726",
  mint: "#00d6b2",
  border: "rgba(148, 163, 184, 0.18)",
};

const featureRows = [
  { label: "Real-time Analytics Dashboard", icon: <AssessmentIcon fontSize="small" /> },
  { label: "Multi-tenant Organization Support", icon: <GroupsIcon fontSize="small" /> },
  { label: "Enterprise Security & Compliance", icon: <SecurityIcon fontSize="small" /> },
  { label: "Global Multi-currency Operations", icon: <PublicIcon fontSize="small" /> },
];

const stats = [
  { value: "150+", label: "INSTITUTIONS" },
  { value: "$2.4B", label: "RECOVERED" },
  { value: "99.9%", label: "UPTIME" },
];

const AuthLayout = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "407px 1fr" },
      backgroundColor: palette.navy,
      color: "#f8fafc",
      overflow: "hidden",
    }}
  >
    {/* ── Sidebar (never unmounts) ── */}
    <Box
      component="aside"
      sx={{
        minHeight: { xs: "auto", md: "100vh" },
        px: { xs: 3, sm: 4, md: 4.5 },
        py: { xs: 3, md: 2.6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: { xs: 4, md: 5 },
        background: "linear-gradient(160deg, #0b1b35 0%, #0d2140 45%, #0b3e48 100%)",
        boxShadow: { md: "22px 0 70px rgba(0,0,0,0.18)" },
      }}
    >
      <Box>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44, height: 44, borderRadius: "8px",
              display: "grid", placeItems: "center",
              background: "linear-gradient(135deg, #2563eb 0%, #00d6b2 100%)",
              boxShadow: "0 14px 32px rgba(0,214,178,0.22)",
            }}
          >
            <CorporateFareIcon sx={{ color: "#fff", fontSize: 25 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#3b82f6", fontSize: 13, fontWeight: 800, letterSpacing: 1.6, lineHeight: 1.1 }}>
              EBIX
            </Typography>
            <Typography sx={{ color: "#8b98aa", fontSize: 12.5, mt: 0.3 }}>
              Debt Recovery Suite
            </Typography>
          </Box>
        </Box>

        {/* Headline */}
        <Box sx={{ mt: { xs: 5, md: 8 }, maxWidth: 322 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: { xs: 32, sm: 37, md: 34 },
              lineHeight: 1.18, fontWeight: 800, letterSpacing: "-1px",
            }}
          >
            Enterprise-grade<br />debt recovery,<br />
            <Box component="span" sx={{ color: palette.mint }}>simplified.</Box>
          </Typography>
          <Typography sx={{ mt: 2.4, color: "#a1adbd", fontSize: 14, lineHeight: 1.55, maxWidth: 318 }}>
            Streamline collections, automate workflows, and recover more - all from one unified platform.
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={{ mt: 3.4, display: "grid", gap: 1.35 }}>
          {featureRows.map((f) => (
            <Box key={f.label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 32, height: 32, borderRadius: "8px",
                  display: "grid", placeItems: "center",
                  color: "#2f7df6",
                  backgroundColor: "rgba(37,99,235,0.14)",
                  border: "1px solid rgba(37,99,235,0.22)",
                }}
              >
                {f.icon}
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#9aa7b7" }}>
                {f.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", gap: { xs: 3.5, md: 4.8 }, pb: { xs: 1, md: 2 }, mt: 2 }}>
        {stats.map((s) => (
          <Box key={s.label}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{s.value}</Typography>
            <Typography sx={{ mt: 0.8, color: "#566173", fontSize: 10, letterSpacing: 0.5, fontWeight: 700 }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>

    {/* ── Right panel: swaps between pages ── */}
    <Box
      component="main"
      sx={{
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "center", md: "flex-end" },
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 4 },
        backgroundColor: palette.navy,
        backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.12) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Outlet renders RealmSelector or LoginScreen card only */}
      <Outlet />
    </Box>
  </Box>
);

export default AuthLayout;