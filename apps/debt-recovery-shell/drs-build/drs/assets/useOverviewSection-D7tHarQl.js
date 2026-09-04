import { dN as reactExports, aX as Kr, dH as parseOverviewResponse } from "./index-BhdgJqva.js";
function useOverviewSection(url, enabled) {
  const [state, setState] = reactExports.useState({
    loading: Boolean(enabled),
    data: null,
    error: null
  });
  reactExports.useEffect(() => {
    if (!enabled) {
      setState({ loading: false, data: null, error: null });
      return;
    }
    let cancelled = false;
    setState({ loading: true, data: null, error: null });
    (async () => {
      try {
        const res = await Kr.GET(url);
        const { data } = parseOverviewResponse(res);
        if (!cancelled) {
          setState({ loading: false, data, error: null });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error: (e == null ? void 0 : e.message) || "Unable to load this section"
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
export {
  useOverviewSection as u
};
