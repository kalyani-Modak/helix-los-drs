import React from "react";
import { StickyNote2 } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { displayValue } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, HLabel, OverviewSectionCard } from "@helix/component-library";
export default function StickyNotesSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.stickyNotes(),
    accountReady
  );
  const d = data || {};

  return (
    <HBox
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      <OverviewSectionCard
        title={intl.formatMessage({
          id: "label.Overview.fields.account_sticky_notes",
          defaultMessage: "Account Sticky Notes",
        })}
        icon={StickyNote2}
        accentColor="#2563eb"
        loading={loading}
        error={error}
        minHeight={84}
      >
        <HBox
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 2,
            // bgcolor: "#fff8e8",
            border: "1px solid rgba(245, 158, 11, 0.24)",
          }}
        >
          <HLabel 
            value={displayValue(d.szAccountStickyNotes)}
            sx={{ fontSize: 14, fontStyle: "italic" }}
            colon={false}
            align="left"
          />
        </HBox>
      </OverviewSectionCard>
      <OverviewSectionCard
        title={intl.formatMessage({
          id: "label.Overview.fields.customer_sticky_notes",
          defaultMessage: "Customer Sticky Notes",
        })}
        icon={StickyNote2}
        accentColor="#2563eb"
        loading={loading}
        error={error}
        minHeight={84}
      >
        <HBox
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 2,
            // bgcolor: "#f8fbff",
            border: "1px solid rgba(37, 99, 235, 0.14)",
          }}
        >
          <HLabel 
            value={displayValue(d.szCustomerStickyNotes)}
            sx={{ fontSize: 14, fontStyle: "italic" }}
            colon={false}
            align="left"
          />
        </HBox>
      </OverviewSectionCard>
    </HBox>
  );
}
