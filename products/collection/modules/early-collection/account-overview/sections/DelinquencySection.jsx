import React from "react";
import { TrendingDown } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { displayValue } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, HLabel, OverviewSectionCard } from "@helix/component-library";
function getPillColors(value) {
  if (value === "-") return { bg: "#edf2f7", color: "#64748b", border: "#e2e8f0" };
  const num = Number(value);
  if (!Number.isNaN(num) && num >= 4) return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  if (!Number.isNaN(num) && num >= 2) return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  return { bg: "#fff8e8", color: "#c2410c", border: "#fed7aa" };
}

export default function DelinquencySection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getDelinquencyInfo(),
    accountReady
  );
  const d = data || {};
  const ds = String(d.szDelinquencyString || "")
    .split("/")
    .filter(Boolean);
  const cs = displayValue(d.szCycleString);

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.delinquency_cycle",
        defaultMessage: "Delinquency / Cycle",
      })}
      icon={TrendingDown}
      accentColor="#2563eb"
      subtitle={intl.formatMessage({
        id: "label.Overview.delinquency.subtitle",
        defaultMessage: "Payment ageing sequence and cycle progression for the account.",
      })}
      loading={loading}
      error={error}
    >
      <HBox sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
        <HBox>
          <HLabel value={intl.formatMessage({
              id: "label.Overview.delinquency.ds",
              defaultMessage: "Delinquency String (DS)",
            })}
            colon={false}
            align="left"
            sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}
          />
          <HBox sx={{ mt: 0.75, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {ds.length === 0 ? (
              <HLabel value={`—`} align='left' colon={false} />
            ) : (
              ds.map((v, i) => (
                <HBox
                  key={i}
                  sx={{
                    minWidth: 28,
                    height: 28,
                    px: 0.75,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontFamily: "monospace",
                    fontWeight: 800,
                    bgcolor: getPillColors(v).bg,
                    color: getPillColors(v).color,
                    border: `1px solid ${getPillColors(v).border}`,
                    boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.35)",
                  }}
                >
                  {v}
                </HBox>
              ))
            )}
          </HBox>
        </HBox>
        <HBox>
          <HLabel value={intl.formatMessage({
              id: "label.Overview.delinquency.cs",
              defaultMessage: "Cycle String (CS)",
            })} 
            sx={{ textTransform: "uppercase" }}
            colon={false}
            align="left"
          />
          <HBox sx={{ mt: 0.75 }}>
            <HLabel 
              value={cs}
              component="span"
              colon={false}
              align="left"
            />
          </HBox>
        </HBox>
      </HBox>
    </OverviewSectionCard>
  );
}
