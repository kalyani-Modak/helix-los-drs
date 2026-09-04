import React from "react";
import { Description } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { formatMoney, formatDate } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, OverviewField, OverviewSectionCard } from "@helix/component-library";
const gridSx = {
  display: "grid",
  gap: 1.5,
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(5, minmax(0, 1fr))",
  },
};

export default function AccountDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getAccountDetails(),
    accountReady
  );
  const d = data || {};

  return (
    <OverviewSectionCard
      title={t("label.Overview.sections.account_details", "Account Details")}
      icon={Description}
      loading={loading}
      error={error}
      minHeight={150}
      sx={{ overflow: "visible" }}
    >
      <HBox sx={gridSx}>
        <OverviewField label={t("label.Overview.fields.account_no", "Account No")} value={d.szLegacyAccountNo} />
        <OverviewField label={t("label.Overview.fields.disbursement_date", "Disbursement Date")} value={formatDate(d.dtDisb)} />
        <OverviewField label={t("label.Overview.fields.cycle_days", "Cycle Day")} value={d.iCycleDay} />
        <OverviewField label={t("label.Overview.fields.tenor", "Tenor")} value={d.iTenor != null ? `${d.iTenor} months` : "—"} />
        <OverviewField label={t("label.Overview.fields.interest_rate", "Interest Rate")} value={d.bgIntRate != null ? `${d.bgIntRate}%` : "—"} />
        <OverviewField label={t("label.Overview.fields.installment_start_date", "Inst. Start Date")} value={formatDate(d.dtInstStart)} />
        <OverviewField label={t("label.Overview.fields.inst_end_date", "Inst. End Date")} value={formatDate(d.dtInstEnd)} />
        <OverviewField label={t("label.Overview.fields.installement_amount", "Installment Amt")} value={formatMoney(d.bgInstAmt)} />
        <OverviewField label={t("label.Overview.fields.product_offered", "Product Offered")} value={d.szProductOffered} />
        <OverviewField label={t("label.Overview.fields.no_of_od_installments", "OD Installments")} value={d.iNoOfODInstallments} />
        <OverviewField label={t("label.Overview.fields.no_of_os_installments", "OS Installments")} value={d.iNoOfOSInstallments} />
        <OverviewField label={t("label.Overview.fields.last_reversal_date", "Last Reversal On")} value={formatDate(d.dtLastReversal)} />
        <OverviewField label={t("label.Overview.fields.last_payment_on", "Last Payment On")} value={formatDate(d.dtLastPymt)} />
        <OverviewField label={t("label.Overview.fields.payment_due_date", "Payment Due Date")} value={formatDate(d.dtNextDueDate)} />
        <OverviewField label={t("label.Overview.fields.last_reversal_amt", "Last Reversal Amt")} value={formatMoney(d.bgLastRevAmt)} />
        <OverviewField label={t("label.Overview.fields.last_payment_amount", "Last Payment Amt")} value={formatMoney(d.flastPymtAmt)} />
        <OverviewField label={t("label.Overview.fields.payment_mode", "Payment Mode")} value={d.szPaymentType} />
      </HBox>
    </OverviewSectionCard>
  );
}
