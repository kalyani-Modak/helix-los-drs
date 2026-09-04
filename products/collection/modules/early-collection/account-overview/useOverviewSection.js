import { useState, useEffect } from "react";
import { HAxiosService } from "@helix/component-library";
import { parseOverviewResponse } from "./overviewApiHelpers";

/**
 * Loads an overview section; account context comes from FunctionContext on the server.
 * @param {string} url
 * @param {boolean} enabled
 */
export function useOverviewSection(url, enabled) {
  const [state, setState] = useState({
    loading: Boolean(enabled),
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      setState({ loading: false, data: null, error: null });
      return;
    }

    let cancelled = false;
    setState({ loading: true, data: null, error: null });

    (async () => {
      try {
        const res = await HAxiosService.GET(url);
        const { data } = parseOverviewResponse(res);
        if (!cancelled) {
          setState({ loading: false, data, error: null });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error: e?.message || "Unable to load this section",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return state;
}
