import { useEffect, useState } from "react";
import { HAxiosService } from "@helix/component-library";
import { LosQdeAPI } from "../apiEndpoints";
import { unwrapApiResponse } from "../unwrapApiResponse";

/** Lookup types owned by the DD screen. QDE types it also uses (gender, entity type, address types, etc.) come from useQdeLookups. */
export const DD_LOOKUP_TYPES = [
  "party.title",
  "party.maritalstatus",
  "party.nationality",
  "party.religion",
  "party.education",
  "party.residencestatus",
  "party.address.state",
  "party.address.district",
  "los.pensionertype",
  "los.pensioncreditmode",
  "los.bankname",
  "los.bankaccounttype",
  "los.repaymentmode",
  "los.loanpurpose",
  "los.repaymentfrequency",
  "los.ratetype",
  "los.repaymentscheduletype",
  "los.coapplicanttype",
  "los.coapplicant.relationship",
  "los.guarantor.relationship",
  "los.income.type.salaried",
];

const toHDropdownOptions = (values = []) =>
  values.map((v) => ({ label: v.szDescription, value: v.szCode }));

/**
 * Fetches every DD lookup type in one call and returns them as {label, value}
 * option arrays keyed by lookup type, ready for HDropdown.
 */
export function useDdLookups(orgId, types = DD_LOOKUP_TYPES) {
  const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true);
  const typesKey = types.join(",");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    HAxiosService.GET(LosQdeAPI.fetchLookups(orgId, types))
      .then((res) => {
        if (cancelled) return;
        const data = unwrapApiResponse(res) || {};
        const mapped = Object.fromEntries(
          Object.entries(data).map(([type, values]) => [type, toHDropdownOptions(values)])
        );
        setLookups(mapped);
      })
      .catch(() => {
        if (!cancelled) setLookups({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orgId, typesKey]);

  return { lookups, loading };
}

export default useDdLookups;