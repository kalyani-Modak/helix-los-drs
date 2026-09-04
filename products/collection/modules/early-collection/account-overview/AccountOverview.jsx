import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ButtonBase, Typography, useTheme } from "@mui/material";
import { Call, PhoneInTalk, ReceiptLong, MailOutline, Inventory2 } from "@mui/icons-material";
import FunctionLayout from "../FunctionLayout";
import OverviewDetailsContent from "./OverviewDetailsContent";

import { HBox, HLabel } from "@helix/component-library";
function QuickLink({ icon: Icon, label, accent, onClick }) {
  const theme = useTheme();
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        px: 0.95,
        py: 0.45,
        borderRadius: 999,
        border: "1px solid rgba(26, 71, 155, 0.10)",
        bgcolor: theme.palette.background.gradient || "#fff",
        justifyContent: "flex-start",
        gap: 0.5,
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
      }}
    >
      <HBox
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: `${accent}14`,
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 11 }} />
      </HBox>
      <HLabel
        value={label}
        sx={{ fontSize: 10, fontWeight: 700 }}
        colon={false}
        align="left"
        width="50%"
      />
    </ButtonBase>
  );
}

export default function AccountOverview() {
  const intl = useIntl();
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Call", icon: Call, accent: "#2563eb", to: "/homelayout/followup/followup" },
    { label: "Follow Up", icon: PhoneInTalk, accent: "#f59e0b", to: "/homelayout/followup/followup" },
    { label: "Activities", icon: ReceiptLong, accent: "#22c55e", to: "/homelayout/previousactivities" },
    { label: "Memos", icon: MailOutline, accent: "#7c3aed", to: "/homelayout/memos" },
    { label: "Assets", icon: Inventory2, accent: "#0f766e", to: "/homelayout/assets" },
  ];

  const actions = (
    <HBox
      sx={{
        display: "flex",
        gap: 0.6,
        flexWrap: "wrap",
        alignItems: "center",
        px: 0.5,
        py: 0,
        borderRadius: 1.5,
        border: "1px solid rgba(37,99,235,0.08)",
      }}
    >
      {quickLinks.map((link) => (
        <QuickLink
          key={link.label}
          icon={link.icon}
          label={link.label}
          accent={link.accent}
          onClick={() => navigate(link.to)}
        />
      ))}
    </HBox>
  );

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.Overview.title",
        defaultMessage: "Overview",
      })}
      actions={actions}
    >
      <OverviewDetailsContent />
    </FunctionLayout>
  );
}
