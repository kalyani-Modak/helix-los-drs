import { dB as jsxRuntimeExports, ed as useIntl, ct as ar, eh as useNavigate, ef as useLocation, dN as reactExports, aX as Kr, ac as Dt, cx as bp, ep as vp, b0 as Lg, cf as Typography, dK as ps, cs as ap, cy as bu } from "./index-BhdgJqva.js";
import { C as CollectionStrategiesAPI } from "./apiEndpoints-CGlR3-gk.js";
import { S as STRATEGY_TYPE_COLLECTION, g as mapStrategyListFromApi } from "./collection-strategies.screen-BOkNL2r3.js";
const ActiveBadge = ({ value }) => {
  const isActive = value === "Y";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `collection-strategies-badge collection-strategies-badge--yn ${isActive ? "collection-strategies-badge--active" : "collection-strategies-badge--inactive"}`,
      children: isActive ? "Y" : "N"
    }
  );
};
const StatusBadge = ({ value }) => {
  const isActive = value === "Active";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `collection-strategies-badge collection-strategies-badge--status ${isActive ? "collection-strategies-badge--active" : "collection-strategies-badge--inactive"}`,
      children: value || "—"
    }
  );
};
const StrategyListActionsCell = ({ data, intl, onEdit, onClone, onHistory, onDelete }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "collection-strategies-actions", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "collection-strategies-action-btn",
      title: intl.formatMessage({ id: "label.CollectionStrategies.action.edit" }),
      "aria-label": intl.formatMessage({ id: "label.CollectionStrategies.action.edit" }),
      onClick: () => onEdit(data),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          fill: "currentColor",
          d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        }
      ) })
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "collection-strategies-action-btn",
      title: intl.formatMessage({ id: "label.CollectionStrategies.action.clone" }),
      "aria-label": intl.formatMessage({ id: "label.CollectionStrategies.action.clone" }),
      onClick: () => onClone(data),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          fill: "currentColor",
          d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        }
      ) })
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "collection-strategies-action-btn",
      title: intl.formatMessage({ id: "label.CollectionStrategies.action.history" }),
      "aria-label": intl.formatMessage({ id: "label.CollectionStrategies.action.history" }),
      onClick: () => onHistory(data),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          fill: "currentColor",
          d: "M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
        }
      ) })
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "collection-strategies-action-btn collection-strategies-action-btn--danger",
      title: intl.formatMessage({ id: "label.CollectionStrategies.action.delete" }),
      "aria-label": intl.formatMessage({ id: "label.CollectionStrategies.action.delete" }),
      onClick: () => onDelete(data),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          fill: "currentColor",
          d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        }
      ) })
    }
  )
] });
const getCollectionStrategiesListColumnDefs = (intl, { onOpenStrategy, onClone, onHistory, onDelete }) => [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 48,
    maxWidth: 48,
    filter: false,
    sortable: false,
    resizable: false,
    suppressMenu: true
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.strategyCode",
      defaultMessage: "Strategy Code"
    }),
    field: "szStrategyCode",
    width: 140,
    filter: false,
    cellRenderer: (params) => {
      const code = params.value || "";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "collection-strategies-code-link",
          onClick: () => onOpenStrategy(code),
          children: code
        }
      );
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.description",
      defaultMessage: "Description"
    }),
    field: "szDescription",
    flex: 1,
    minWidth: 200,
    filter: false
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.active",
      defaultMessage: "Active"
    }),
    field: "cActiveYn",
    width: 90,
    filter: false,
    cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveBadge, { value: params.value })
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.status",
      defaultMessage: "Status"
    }),
    field: "statusLabel",
    width: 110,
    filter: false,
    cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: params.value })
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.version",
      defaultMessage: "Version"
    }),
    field: "versionNo",
    width: 90,
    filter: false,
    valueFormatter: (params) => params.value ? `v${params.value}` : "—"
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.effectiveFrom",
      defaultMessage: "Effective From"
    }),
    field: "effectiveFrom",
    width: 130,
    filter: false,
    valueFormatter: (params) => params.value || "—"
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.actions",
      defaultMessage: "Actions"
    }),
    field: "actions",
    width: 150,
    filter: false,
    sortable: false,
    cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      StrategyListActionsCell,
      {
        data: params.data,
        intl,
        onEdit: (row) => onOpenStrategy(row == null ? void 0 : row.szStrategyCode),
        onClone,
        onHistory,
        onDelete
      }
    )
  }
];
const collectionStrategiesListGridStyle = { width: "100%", height: "55vh" };
const STRATEGIES_PAGE_SIZE = 15;
function extractPagedStrategies(responseData) {
  const responseJson = responseData == null ? void 0 : responseData.responseJson;
  const source = responseJson ?? responseData;
  let rawRows = [];
  if (Array.isArray(source)) {
    rawRows = source;
  } else if (Array.isArray(source == null ? void 0 : source.content)) {
    rawRows = source.content;
  }
  const totalRaw = Number(
    (responseData == null ? void 0 : responseData.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (source == null ? void 0 : source.totalElements) ?? (source == null ? void 0 : source.total) ?? (source == null ? void 0 : source.count) ?? rawRows.length
  );
  return {
    rows: rawRows,
    totalElements: Number.isFinite(totalRaw) ? totalRaw : rawRows.length
  };
}
const CollectionStrategiesListScreen = () => {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const [loading, setLoading] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [totalElements, setTotalElements] = reactExports.useState(0);
  const [gridRefreshVersion, setGridRefreshVersion] = reactExports.useState(0);
  const openStrategy = reactExports.useCallback(
    (code) => {
      if (!code) return;
      navigate(`/homelayout/collectionStrategies/${encodeURIComponent(code)}`, {
        state: {
          menuId: screenMenuId
        }
      });
    },
    [navigate, screenMenuId]
  );
  const handleAddStrategy = reactExports.useCallback(() => {
    navigate("/homelayout/collectionStrategies/new", {
      state: {
        menuId: screenMenuId
      }
    });
  }, [navigate, screenMenuId]);
  const handleUnsupportedAction = reactExports.useCallback(
    (messageId) => {
      toast.info(intl.formatMessage({ id: messageId }));
    },
    [intl, toast]
  );
  const handleDelete = reactExports.useCallback(
    async (row) => {
      var _a2, _b;
      console.log("------------------");
      console.log(row);
      console.log("------------------");
      if (!(row == null ? void 0 : row.inStrategySeqNo)) {
        toast.error("Invalid Strategy.");
        return;
      }
      const confirmed = window.confirm(
        `Are you sure you want to delete strategy "${row.szStrategyCode}"?`
      );
      if (!confirmed) return;
      try {
        setLoading(true);
        const response = await Kr.DELETE(
          `${CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId)}?inStrategySeqNo=${row.inStrategySeqNo}`
        );
        if (((_a2 = response.data) == null ? void 0 : _a2.status) === "Success") {
          toast.success(response.data.message);
          setGridRefreshVersion((v) => v + 1);
        } else {
          toast.error((_b = response.data) == null ? void 0 : _b.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({ id: "collection.strategy.delete.error" })
        );
      } finally {
        setLoading(false);
      }
    },
    [intl, toast]
  );
  const columnDefs = reactExports.useMemo(
    () => getCollectionStrategiesListColumnDefs(intl, {
      onOpenStrategy: openStrategy,
      onClone: () => handleUnsupportedAction("message.CollectionStrategies.actionNotAvailable"),
      onHistory: () => handleUnsupportedAction("message.CollectionStrategies.actionNotAvailable"),
      onDelete: (row) => handleDelete(row)
    }),
    [intl, openStrategy, handleUnsupportedAction, handleDelete]
  );
  const strategiesDatasource = reactExports.useMemo(() => {
    return {
      getRows: async (params) => {
        var _a2, _b, _c, _d;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || STRATEGIES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        setLoading(true);
        try {
          const payload = {
            szType: STRATEGY_TYPE_COLLECTION,
            pageNumber,
            size,
            pageSize: size
          };
          const search = searchQuery.trim();
          if (search) {
            payload.searchQuery = search;
          }
          const res = await Kr.GET(
            `${CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId)}?szType=${payload.szType}`
          );
          if (((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.status) !== "Success") {
            (_b = params.failCallback) == null ? void 0 : _b.call(params);
            return;
          }
          const { rows, totalElements: total } = extractPagedStrategies(res.data);
          const mappedRows = rows.map(mapStrategyListFromApi);
          setTotalElements(total);
          (_c = params.successCallback) == null ? void 0 : _c.call(params, mappedRows, total);
        } catch (error) {
          console.error(error);
          toast.error(intl.formatMessage({ id: "collection.strategy.load.error" }));
          setTotalElements(0);
          (_d = params.failCallback) == null ? void 0 : _d.call(params);
        } finally {
          setLoading(false);
        }
      }
    };
  }, [intl, searchQuery, toast]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-list-title-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: intl.formatMessage({ id: "collection.strategy.title" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: "label.CollectionStrategies.addStrategy",
            onClick: handleAddStrategy,
            variant: "outlined",
            color: "primary",
            inline: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", className: "collection-strategies-description", children: intl.formatMessage({ id: "label.CollectionStrategies.listDescription" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-toolbar-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.CollectionStrategies.list.search",
              defaultMessage: "Search"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            id: "collection-strategies-search",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            editable: true,
            placeholder: "label.CollectionStrategies.list.searchPlaceholder",
            width: "280px"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { className: "collection-strategies-list-count", children: intl.formatMessage(
        { id: "label.CollectionStrategies.list.count" },
        { filtered: totalElements, total: totalElements }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-list-grid-host", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          columnDefs,
          gridStyle: collectionStrategiesListGridStyle,
          rowModelType: "infinite",
          datasource: strategiesDatasource,
          cacheBlockSize: STRATEGIES_PAGE_SIZE,
          maxBlocksInCache: 2,
          pagination: true,
          paginationPageSize: STRATEGIES_PAGE_SIZE,
          domLayout: "normal",
          globalSearch: false,
          allowAdd: false,
          allowDelete: false,
          allowUpdate: false,
          getRowId: (params) => String(params.data.szStrategyCode || params.data.inStrategySeqNo),
          suppressHorizontalScroll: false
        },
        `collection-strategies-${gridRefreshVersion}-${searchQuery}`
      ),
      !loading && totalElements === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-empty", children: intl.formatMessage({ id: "label.CollectionStrategies.list.empty" }) })
    ] })
  ] });
};
export {
  CollectionStrategiesListScreen as default
};
