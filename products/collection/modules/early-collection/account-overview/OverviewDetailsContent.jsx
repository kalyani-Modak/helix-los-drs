import React from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import AccountDetailsSection from "./sections/AccountDetailsSection";
import CoBorrowerSection from "./sections/CoBorrowerSection";
import CallDetailsSection from "./sections/CallDetailsSection";
import PersonalDetailsSection from "./sections/PersonalDetailsSection";
import AddressDetailsSection from "./sections/AddressDetailsSection";
import StickyNotesSection from "./sections/StickyNotesSection";
import WorkflowSection from "./sections/WorkflowSection";
import AssetSection from "./sections/AssetSection";
import CollectionSummarySection from "./sections/CollectionSummarySection";
import DelinquencySection from "./sections/DelinquencySection";
import LinkedLoansSection from "./sections/LinkedLoansSection";
import CardDetailsSection from "./sections/CardDetailsSection";
import OverviewHeroSection from "./sections/OverviewHeroSection";
import PreviousFollowupSection from "./sections/PreviousFollowupSection";
import CustomerProfileSummary from "./sections/CustomerProfileSummary";
import AIOverview from "../AIOverview";
import { HBox } from "@helix/component-library";
const twoCol = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5,
};

export default function OverviewDetailsContent() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();

  if (!selectedRow) {
    return (
      <HBox sx={{ p: 2 }}>
        <HLabel 
          value={intl.formatMessage({
            id: "label.Overview.empty.select_account",
            defaultMessage: "Select an account from the worklist to view overview details.",
          })}
          sx={{ fontSize: 10, flexShrink: 0 }}
          align="left"
          colon={false}
        />
      </HBox>
    );
  }

  return (
    <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5, pb: 2 }}>
      <AIOverview />
      <CustomerProfileSummary/>
      <AccountDetailsSection />

      <HBox sx={twoCol}>
        <CoBorrowerSection />
        <CallDetailsSection />
      </HBox>

      <HBox sx={twoCol}>
        <PersonalDetailsSection />
        <AddressDetailsSection />
      </HBox>

      <StickyNotesSection />

      <HBox sx={twoCol}>
        <WorkflowSection />
        <PreviousFollowupSection />
      </HBox>

      <HBox sx={twoCol}>
        <AssetSection />
        <CollectionSummarySection />
      </HBox>

      <DelinquencySection />

      <LinkedLoansSection />

      <CardDetailsSection />
    </HBox>
  );
}
