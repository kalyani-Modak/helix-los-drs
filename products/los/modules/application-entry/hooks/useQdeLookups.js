import { useEffect, useState } from "react";
import { HAxiosService } from "@helix/component-library";
import { LosQdeAPI } from "../apiEndpoints";
import { unwrapApiResponse } from "../unwrapApiResponse";

/** Lookup types the QDE screen's dropdowns are backed by, keyed to szLookupType in Ls_Mst_Lookup. */
export const QDE_LOOKUP_TYPES = [
  "los.applicationtype",
  "los.portfolio",
  "party.gender",
  "los.entitytype",
  "los.borrowercategory",
  "los.address.type.individual",
  "los.address.type.nonindividual",
  "los.channel",
  "los.loantype",
  "los.doctype",
  "los.product",
  "los.scheme",
  "los.relationship",
  "los.branch",
];

const toHDropdownOptions = (values = []) =>
  values.map((v) => ({ label: v.szDescription, value: v.szCode }));

/**
 * Fetches every QDE lookup type in one call and returns them as `{label, value}`
 * option arrays keyed by lookup type, ready for HDropdown.
 */
export function useQdeLookups(orgId, types = QDE_LOOKUP_TYPES) {
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

export default useQdeLookups;
