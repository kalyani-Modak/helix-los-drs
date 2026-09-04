const ActiveBadge = ({ value }) => {
  const isActive = value === "Y";
  return (
    <span
      className={`collection-strategies-badge collection-strategies-badge--yn ${
        isActive
          ? "collection-strategies-badge--active"
          : "collection-strategies-badge--inactive"
      }`}
    >
      {isActive ? "Y" : "N"}
    </span>
  );
};

const StatusBadge = ({ value }) => {
  const isActive = value === "Active";
  return (
    <span
      className={`collection-strategies-badge collection-strategies-badge--status ${
        isActive
          ? "collection-strategies-badge--active"
          : "collection-strategies-badge--inactive"
      }`}
    >
      {value || "—"}
    </span>
  );
};

const StrategyListActionsCell = ({ data, intl, onEdit, onClone, onHistory, onDelete }) => (
  <div className="collection-strategies-actions">
    <button
      type="button"
      className="collection-strategies-action-btn"
      title={intl.formatMessage({ id: "label.CollectionStrategies.action.edit" })}
      aria-label={intl.formatMessage({ id: "label.CollectionStrategies.action.edit" })}
      onClick={() => onEdit(data)}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
      </svg>
    </button>
    <button
      type="button"
      className="collection-strategies-action-btn"
      title={intl.formatMessage({ id: "label.CollectionStrategies.action.clone" })}
      aria-label={intl.formatMessage({ id: "label.CollectionStrategies.action.clone" })}
      onClick={() => onClone(data)}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        />
      </svg>
    </button>
    <button
      type="button"
      className="collection-strategies-action-btn"
      title={intl.formatMessage({ id: "label.CollectionStrategies.action.history" })}
      aria-label={intl.formatMessage({ id: "label.CollectionStrategies.action.history" })}
      onClick={() => onHistory(data)}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
        />
      </svg>
    </button>
    <button
      type="button"
      className="collection-strategies-action-btn collection-strategies-action-btn--danger"
      title={intl.formatMessage({ id: "label.CollectionStrategies.action.delete" })}
      aria-label={intl.formatMessage({ id: "label.CollectionStrategies.action.delete" })}
      onClick={() => onDelete(data)}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        />
      </svg>
    </button>
  </div>
);

export const getCollectionStrategiesListColumnDefs = (
  intl,
  { onOpenStrategy, onClone, onHistory, onDelete }
) => [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 48,
    maxWidth: 48,
    filter: false,
    sortable: false,
    resizable: false,
    suppressMenu: true,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.strategyCode",
      defaultMessage: "Strategy Code",
    }),
    field: "szStrategyCode",
    width: 140,
    filter: false,
    cellRenderer: (params) => {
      const code = params.value || "";
      return (
        <button
          type="button"
          className="collection-strategies-code-link"
          onClick={() => onOpenStrategy(code)}
        >
          {code}
        </button>
      );
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.description",
      defaultMessage: "Description",
    }),
    field: "szDescription",
    flex: 1,
    minWidth: 200,
    filter: false,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.active",
      defaultMessage: "Active",
    }),
    field: "cActiveYn",
    width: 90,
    filter: false,
    cellRenderer: (params) => <ActiveBadge value={params.value} />,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.status",
      defaultMessage: "Status",
    }),
    field: "statusLabel",
    width: 110,
    filter: false,
    cellRenderer: (params) => <StatusBadge value={params.value} />,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.version",
      defaultMessage: "Version",
    }),
    field: "versionNo",
    width: 90,
    filter: false,
    valueFormatter: (params) => (params.value ? `v${params.value}` : "—"),
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.effectiveFrom",
      defaultMessage: "Effective From",
    }),
    field: "effectiveFrom",
    width: 130,
    filter: false,
    valueFormatter: (params) => params.value || "—",
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.list.actions",
      defaultMessage: "Actions",
    }),
    field: "actions",
    width: 150,
    filter: false,
    sortable: false,
    cellRenderer: (params) => (
      <StrategyListActionsCell
        data={params.data}
        intl={intl}
        onEdit={(row) => onOpenStrategy(row?.szStrategyCode)}
        onClone={onClone}
        onHistory={onHistory}
        onDelete={onDelete}
      />
    ),
  },
];

export const collectionStrategiesListGridStyle = { width: "100%", height: "55vh" };
