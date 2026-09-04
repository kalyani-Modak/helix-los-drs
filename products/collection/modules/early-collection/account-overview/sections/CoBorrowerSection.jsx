import React from "react";
import { Box, Chip } from "@mui/material";
import { CallOutlined, Person } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { formatPhoneWithCountryCode, getPhoneHref } from "../overviewApiHelpers";

import { HBox, HLabel, OverviewSectionCard } from "@helix/component-library";
export default function CoBorrowerSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchAccountRelationships(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.coborrower_gaurantor_details",
        defaultMessage: "Co-Borrower / Guarantor",
      })}
      icon={Person}
      accentColor="#2563eb"
      subtitle={intl.formatMessage({
        id: "label.Overview.coborrower.subtitle",
        defaultMessage: "Relationship contacts linked to this account.",
      })}
      loading={loading}
      error={error}
      minHeight={rows.length <= 1 ? 76 : 96}
      emptyMinHeight={48}
    >
      {rows.length === 0 ? (
        <HLabel value={intl.formatMessage({
            id: "label.Overview.coborrower.empty",
            defaultMessage: "No co-borrower or guarantor details are available.",
          })}
          colon={false}
          align='left'/>
      ) : (
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, overflowX: "auto" }}>
          <HBox
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1,
              pb: 0.75,
              borderBottom: "1px solid rgba(26, 71, 155, 0.10)",
              minWidth: 420,
            }}
          >
            {[
              intl.formatMessage({ id: "label.Overview.fields.name", defaultMessage: "Name" }),
              intl.formatMessage({ id: "label.Overview.coborrower.phone", defaultMessage: "Phone" }),
              intl.formatMessage({ id: "label.Overview.fields.role", defaultMessage: "Role" }),
            ].map((label) => (
              <HLabel 
              key={label} 
              value={label} 
              sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }} 
              colon={false}
              align='left'
              />
            ))}
          </HBox>

          {rows.map((row, index) => {
            const role = row.szCustomerTypeDesc || row.szCustomerType || "--";
            const isCoBorrower = String(role).toLowerCase().includes("co");

            return (
              <HBox
                key={`${row.szName || "related-party"}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 1,
                  alignItems: "center",
                  minWidth: 420,
                }}
              >
                <HLabel value={row.szName || "--"} align='left' sx={{ fontSize: 10, fontWeight: 500}} colon={false}/>
                {getPhoneHref(row.szPrefContactNo) ? (
                  <Box
                    component="a"
                    href={getPhoneHref(row.szPrefContactNo)}
                    title={intl.formatMessage({ id: "label.Overview.coborrower.call", defaultMessage: "Click to call" })}
                    aria-label={`Click to call ${formatPhoneWithCountryCode(row.szPrefContactNo)}`}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.35,
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#2563eb",
                      textDecoration: "none",
                      "& .phone-call-icon": {
                        opacity: 0,
                        transition: "opacity 120ms ease-in-out",
                      },
                      "&:hover": {
                        textDecoration: "underline",
                      },
                      "&:hover .phone-call-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box component="span">{formatPhoneWithCountryCode(row.szPrefContactNo)}</Box>
                    <CallOutlined className="phone-call-icon" sx={{ fontSize: 13 }} />
                  </Box>
                ) : (
                  <HLabel value={row.szPrefContactNo || "--"} align='left' sx={{ fontSize: 10, fontWeight: 500 }} colon={false}/>
                )}
                <Chip
                  size="small"
                  label={role}
                  sx={{
                    width: "fit-content",
                    height: 20,
                    bgcolor: isCoBorrower ? "#dbeafe" : "#f3f4f6",
                    color: isCoBorrower ? "#1d4ed8" : "#374151",
                    fontWeight: 550,
                    fontSize: 11,
                  }}
                />
              </HBox>
            );
          })}
        </HBox>
      )}
    </OverviewSectionCard>
  );
}
