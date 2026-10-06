import { useEffect, useState } from "react";
import { HAxiosService } from "@helix/component-library";
import { LosQdeAPI } from "../apiEndpoints";
import { unwrapApiResponse } from "../unwrapApiResponse";

/** Lookup types owned by the DU screen. Customer Type reuses los.borrowercategory, fetched via useQdeLookups. */
export const DU_LOOKUP_TYPES = [
  "los.du.stage",
];

const toHDropdownOptions = (values = []) =>
  values.map((v) => ({ label: v.szDescription, value: v.szCode }));

/**
 * Fetches every DU lookup type in one call and returns them as `{label, value}`
 * option arrays keyed by lookup type, ready for HDropdown.
 */
export function useDuLookups(orgId, types = DU_LOOKUP_TYPES) {
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

export default useDuLookups;
