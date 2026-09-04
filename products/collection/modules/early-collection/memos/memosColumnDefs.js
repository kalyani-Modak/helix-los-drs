import { alpha } from "@mui/material/styles";

import { memosFontFamily, memosGridFontSize } from "./memosStyles";
import { formatNoteType, toCellText } from "./memosRowMapper";

/**
 * @param {import('react-intl').IntlShape} intl
 * @param {import('@mui/material/styles').Theme} theme
 */
export function createMemosColumnDefs(intl, theme) {
  const muted = theme.palette.text.secondary;
  const primary = theme.palette.text.primary;
  const zebraOdd = alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.08 : 0.04);

  const baseZebra = (params) => ({
    backgroundColor: params?.node?.rowIndex != null && params.node.rowIndex % 2 === 1 ? zebraOdd : "transparent",
    fontSize: memosGridFontSize,
    lineHeight: 1.35,
    fontFamily: memosFontFamily,
  });

  return [
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Date Time" }),
      field: "dtDisplay",
      valueGetter: (params) => toCellText(params.data?.dtDisplay),
      flex: 1,
      minWidth: 140,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: muted,
        fontWeight: 400,
      }),
    },
    {
      headerName: intl.formatMessage({
        id: "label.NotesHistory.Collector Name",
      }),
      field: "szCreatedBy",
      valueGetter: (params) => toCellText(params.data?.szCreatedBy || params.data?.szLogedInUser),
      flex: 1,
      minWidth: 120,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 600,
      }),
    },
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Notes Type" }),
      field: "szNoteType",
      valueGetter: (params) => formatNoteType(params.data?.szNoteType, intl),
      flex: 1,
      minWidth: 140,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 400,
      }),
    },
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Notes" }),
      field: "szNotes",
      valueGetter: (params) => toCellText(params.data?.szNotes),
      flex: 2,
      minWidth: 200,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 400,
      }),
    },
  ];
}
