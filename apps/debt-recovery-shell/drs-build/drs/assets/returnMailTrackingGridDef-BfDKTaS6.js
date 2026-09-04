import { dD as lE } from "./index-BhdgJqva.js";
const primaryCell = {
  color: "var(--drs-text-primary)",
  fontSize: "11px",
  lineHeight: 1.35,
  whiteSpace: "normal"
};
const mutedCell = {
  color: "var(--drs-text-muted)",
  fontSize: "11px",
  lineHeight: 1.35,
  whiteSpace: "normal"
};
const descCell = {
  ...primaryCell,
  fontWeight: 600
};
const compactHeaderStyle = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.04em"
};
function textCellStyle(align = lE.TEXT) {
  return { ...primaryCell, textAlign: align };
}
function mutedTextCellStyle(align = lE.TEXT) {
  return { ...mutedCell, textAlign: align };
}
export {
  compactHeaderStyle as c,
  descCell as d,
  mutedTextCellStyle as m,
  textCellStyle as t
};
