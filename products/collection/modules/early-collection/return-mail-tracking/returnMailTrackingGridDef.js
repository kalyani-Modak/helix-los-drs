import { ALIGNMENT } from "@helix/component-library";

/** Interface Delight–aligned typography (matches generate-mail / follow-up history grids). */
export const primaryCell = {
  color: "var(--drs-text-primary)",
  fontSize: "11px",
  lineHeight: 1.35,
  whiteSpace: "normal",
};

export const mutedCell = {
  color: "var(--drs-text-muted)",
  fontSize: "11px",
  lineHeight: 1.35,
  whiteSpace: "normal",
};

export const descCell = {
  ...primaryCell,
  fontWeight: 600,
};

export const compactHeaderStyle = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.04em",
};

export function returnMailTrackingDefaultColDef() {
  return {
    sortable: true,
    filter: false,
    floatingFilter: false,
    resizable: true,
    flex: 1,
    wrapText: true,
    autoHeight: false,
    suppressMenu: true,
  };
}

export function textCellStyle(align = ALIGNMENT.TEXT) {
  return { ...primaryCell, textAlign: align };
}

export function mutedTextCellStyle(align = ALIGNMENT.TEXT) {
  return { ...mutedCell, textAlign: align };
}
