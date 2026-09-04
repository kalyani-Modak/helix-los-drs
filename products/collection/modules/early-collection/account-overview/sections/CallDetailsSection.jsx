import React from "react";
import { Phone } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function CallDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getCallDetails(),
    accountReady
  );
  const d = data || {};
  const hasData = Boolean(d.szPrefContactNo || d.szPrefEmailId);
  const intl = useIntl();

  return (
    <OverviewSectionCard
      title={intl.formatMessage({ id: "label.Overview.sections.call_details", defaultMessage: "Call Details" })}
      icon={Phone}
      loading={loading}
      error={error}
      minHeight={hasData ? 66 : 48}
      emptyMinHeight={46}
    >
      <HBox sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.preferred_contact_number", defaultMessage: "Preferred Contact No" })} value={d.szPrefContactNo} valueSx={{ color: "#2563eb", fontWeight: 500 }} isPhone />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.preferred_mail_id", defaultMessage: "Preferred Mail Id" })} value={d.szPrefEmailId} valueSx={{ color: "#7c3aed", fontWeight: 500 }} />
      </HBox>
    </OverviewSectionCard>
  );
}
