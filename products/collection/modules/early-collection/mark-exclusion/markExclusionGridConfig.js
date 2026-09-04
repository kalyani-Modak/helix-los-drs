import dayjs from "dayjs";
import { getDateFormat, getDateTimeFormat } from "@helix/component-library";

function fmtDate(value) {
  if (value == null || value === "") return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format(getDateFormat()) : "—";
}

function fmtDateTime(value) {
  if (value == null || value === "") return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format(getDateTimeFormat()) : "—";
}

/**
 * @param {import('react-intl').IntlShape} intl
 * @param {Record<string, string>} styles — CSS module class map
 */
export function buildMarkExclusionHistoryColumnDefs(intl, styles) {
  const headerClass = styles.markExclusionAgHeaderCompact;
  const cell = styles.markExclusionAgCellCompact;
  const cellMono = styles.markExclusionAgCellMono;

  return [
    {
      field: "szActionType",
      headerName: intl.formatMessage({ id: "markExclusion.grid.actionType", defaultMessage: "Action Type" }),
      sortable: true,
      headerClass,
      cellClass: cell,
    },
    {
      field: "szActionCategory",
      headerName: intl.formatMessage({ id: "markExclusion.grid.category", defaultMessage: "Category" }),
      sortable: true,
      headerClass,
      cellClass: cell,
    },
    {
      field: "szActionLeaf",
      headerName: intl.formatMessage({ id: "markExclusion.grid.leaf", defaultMessage: "Leaf" }),
      sortable: true,
      headerClass,
      cellClass: cell,
    },
    {
      field: "dtExcludedFrom",
      headerName: intl.formatMessage({ id: "markExclusion.grid.from", defaultMessage: "From" }),
      sortable: true,
      headerClass,
      cellClass: cell,
      valueFormatter: (p) => fmtDate(p.value),
    },
    {
      field: "dtExcludedTill",
      headerName: intl.formatMessage({ id: "markExclusion.grid.till", defaultMessage: "Till" }),
      sortable: true,
      headerClass,
      cellClass: cell,
      valueFormatter: (p) => fmtDate(p.value),
    },
    {
      field: "szReasonCode",
      headerName: intl.formatMessage({ id: "markExclusion.grid.reason", defaultMessage: "Reason" }),
      sortable: true,
      headerClass,
      cellClass: cell,
    },
    {
      field: "cStatus",
      headerName: intl.formatMessage({ id: "markExclusion.grid.status", defaultMessage: "Status" }),
      sortable: true,
      headerClass,
      cellClass: (p) => {
        const v = String(p.value || "").toUpperCase();
        let status = styles.markExclusionStatusOther;
        if (v === "A" || v === "Y" || v === "APPROVED") status = styles.markExclusionStatusApproved;
        else if (v === "P" || v === "PENDING") status = styles.markExclusionStatusPending;
        return `${cell} ${status}`;
      },
    },
    {
      field: "szCreatedBy",
      headerName: intl.formatMessage({ id: "markExclusion.grid.createdBy", defaultMessage: "By" }),
      sortable: true,
      headerClass,
      cellClass: cellMono,
    },
    {
      field: "dtCreatedOn",
      headerName: intl.formatMessage({ id: "markExclusion.grid.createdDate", defaultMessage: "Created" }),
      sortable: true,
      headerClass,
      cellClass: cell,
      valueFormatter: (p) => fmtDateTime(p.value),
    },
  ];
}
