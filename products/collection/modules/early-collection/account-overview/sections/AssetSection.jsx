import React, { useMemo } from "react";
import { Divider } from "@mui/material";
import { DirectionsCar } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount, isPropertyPortfolio } from "../overviewRequestBody";
import { formatMoney } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, HLabel, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function AssetSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const property = isPropertyPortfolio(selectedRow?.PRTFL);
  const url = useMemo(
    () => (property ? OverviewAPI.fetchPropertyDetails() : OverviewAPI.fetchAutoDetails()),
    [property]
  );

  const { loading, data, error } = useOverviewSection(url, accountReady);

  const autoRows = useMemo(() => {
    if (property) return [];
    if (Array.isArray(data)) return data;
    return data ? [data] : [];
  }, [data, property]);

  const prop = property && data && !Array.isArray(data) ? data : null;

  return (
    <OverviewSectionCard
      title={intl.formatMessage({ id: "label.Overview.sections.asset_details", defaultMessage: "Asset Details" })}
      icon={DirectionsCar}
      loading={loading}
      error={error}
      minHeight={(property && prop) || (!property && autoRows.length === 1) ? 72 : 90}
      emptyMinHeight={46}
    >
      {property && prop ? (
        <HBox
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          }}
        >
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.current_valuation", defaultMessage: "Current Valuation" })} value={formatMoney(prop.bgCurrentValue)} />
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.property_address", defaultMessage: "Property Address" })} value={prop.szPropertyAddress} />
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.project_name", defaultMessage: "Project Name" })} value={prop.szProjectName} />
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.developer", defaultMessage: "Developer" })} value={prop.szDeveloperName} />
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.insurance_policy_no", defaultMessage: "Insurance Policy No" })} value={prop.szInsuPolicyNo} />
          <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.asset_status", defaultMessage: "Asset Status" })} value={prop.szAssetStatus} />
        </HBox>
      ) : !property && autoRows.length > 0 ? (
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {autoRows.map((row, idx) => (
            <HBox key={idx}>
              {idx > 0 ? <Divider sx={{ my: 1 }} /> : null}
              <HLabel variant="caption" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
                {intl.formatMessage({ id: "label.Overview.fields.asset_index", defaultMessage: "Asset {index}" }, { index: idx + 1 })}
              </HLabel>
              <HBox
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                }}
              >
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.current_valuation", defaultMessage: "Current Valuation" })} value={formatMoney(row.fCurrentValue)} />
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.description", defaultMessage: "Description" })} value={row.szDesc} />
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.engine_no", defaultMessage: "Engine No" })} value={row.szEnginNo} />
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.chassis_no", defaultMessage: "Chassis No" })} value={row.szChasisNo} />
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.registration_no", defaultMessage: "Registration No" })} value={row.szRegNo} />
                <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.insurance_policy_no", defaultMessage: "Insurance Policy No" })} value={row.szInsuPolicyNo} />
              </HBox>
            </HBox>
          ))}
        </HBox>
      ) : !loading && !error ? (
        <HLabel variant="caption" color="text.secondary">
          {intl.formatMessage({ id: "error.Overview.no_asset_details", defaultMessage: "No asset details returned." })}
        </HLabel>
      ) : null}
    </OverviewSectionCard>
  );
}
