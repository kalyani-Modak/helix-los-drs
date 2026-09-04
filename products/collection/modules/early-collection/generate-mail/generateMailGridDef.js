import { ALIGNMENT } from "@helix/component-library";

const primaryCell = {
  color: "var(--drs-text-primary)",
  fontSize: "11px",
  lineHeight: 1.35,
};

const mutedCell = {
  color: "var(--drs-text-muted)",
  fontSize: "11px",
  lineHeight: 1.35,
};

const descCell = {
  ...primaryCell,
  fontWeight: 600,
};

/**
 * Column defs for session/local mail history (Interface Delight–aligned typography).
 * @param {import("react-intl").IntlShape} intl
 */
export function createMailHistoryColDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.date" }),
      field: "dtSent",
      type : "date",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: ALIGNMENT.DATE },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.description" }),
      field: "mailDesc",
      minWidth: 120,
      flex: 1.2,
      filter: false,
      cellStyle: { ...descCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.type" }),
      field: "mailType",
      minWidth: 72,
      flex: 0.8,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.sendTo" }),
      field: "sendTo",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.contact" }),
      field: "contact",
      minWidth: 140,
      flex: 1.2,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.role" }),
      field: "role",
      minWidth: 140,
      flex: 1.2,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.status" }),
      field: "status",
      minWidth: 56,
      flex: 0.55,
      filter: false,
      cellStyle: { ...primaryCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.returned" }),
      field: "returned",
      minWidth: 56,
      flex: 0.55,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.fee" }),
      field: "feeAmount",
      minWidth: 64,
      flex: 0.55,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
    {
      headerName: intl.formatMessage({ id: "label.generateMail.grid.notes" }),
      field: "notes",
      minWidth: 100,
      flex: 1,
      filter: false,
      cellStyle: { ...mutedCell, textAlign: ALIGNMENT.TEXT },
    },
  ];
}

export function mailHistoryDefaultColDef() {
  return {
    sortable: true,
    filter: false,
    floatingFilter: false,
    resizable: true,
    flex: 1,
  };
}
