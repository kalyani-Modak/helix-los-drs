import React from "react";
import { Divider } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, HLabel, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function AddressDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getAddressDetails(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  const displayRows = rows.length > 0 ? rows : [{}];
  const intl = useIntl();

  return (
    <OverviewSectionCard
      title={intl.formatMessage({ id: "label.Overview.sections.address_details", defaultMessage: "Address Details" })}
      icon={LocationOn}
      loading={loading}
      error={error}
      minHeight={displayRows.length <= 1 ? 72 : 90}
      emptyMinHeight={46}
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {displayRows.map((addr, idx) => (
          <HBox key={idx}>
            {idx > 0 ? <Divider sx={{ my: 1 }} /> : null}
            <HLabel 
             value={addr?.szAddressType || `Address ${idx + 1}`}
             colon={false}
             align="left"
             sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
             />
            <HBox
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              }}
            >
              <OverviewField label={intl.formatMessage({id: "label.Overview.fields.address_1",defaultMessage: "Address 1"})} value={addr?.szAddress1} />
              <OverviewField label={intl.formatMessage({id: "label.Overview.fields.address_2",defaultMessage: "Address 2"})} value={addr?.szAddress2} />
              <OverviewField label={intl.formatMessage({id: "label.Overview.fields.city",defaultMessage: "City"})} value={addr?.szCity} />
              <OverviewField label={intl.formatMessage({id: "label.Overview.fields.zip",defaultMessage: "Zip"})} value={addr?.szZip} />
              <OverviewField label={intl.formatMessage({id: "label.Overview.fields.state",defaultMessage: "State"})} value={addr?.szState} />
            </HBox>
          </HBox>
        ))}
      </HBox>
    </OverviewSectionCard>
  );
}
