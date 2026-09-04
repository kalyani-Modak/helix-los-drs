import React from "react";
import { CreditCard } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { formatMoney, formatDate } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function CardDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(OverviewAPI.getCardDetails(), accountReady);
  const d = data || {};
  const intl = useIntl();

  if (!accountReady) return null;

  return (
    <OverviewSectionCard 
      title={intl.formatMessage({id: "label.Overview.sections.card_details", defaultMessage: "Card Details"})} 
      icon={CreditCard} 
      loading={loading} 
      error={error}
    >
      <HBox
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        }}
      >
        <OverviewField label={intl.formatMessage({id: "label.Overview.fields.cardName", defaultMessage: "Name"})} value={d.szName} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.cardNo", defaultMessage: "Card No" })} value={d.szCardNo} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.cardType", defaultMessage: "Card Type" })} value={d.szCardType} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.cycleDay", defaultMessage: "Cycle Day" })} value={d.inCycleDay} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.issueDate", defaultMessage: "Issue Date" })} value={formatDate(d.dtIssue)} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.expiryDate", defaultMessage: "Expiry Date" })} value={formatDate(d.dtExpiry)} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.limit", defaultMessage: "Limit" })} value={formatMoney(d.bdLimit)} />
      </HBox>
    </OverviewSectionCard>
  );
}
