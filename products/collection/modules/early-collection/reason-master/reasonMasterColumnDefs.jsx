import React from "react";
import { HCheckBox } from "@helix/component-library";

/** Checkbox editor for `szActive` (Y/N from API). */
export function ReasonMasterActiveCellRenderer(params) {
  const v = params.value;
  const checked = v === "Y" || v === true;
  return (
    <HCheckBox
      checked={checked}
      onChange={(e) => {
        params.node.setDataValue("szActive", e.target.checked ? "Y" : "N");
      }}
      label=""
      margin="15px"
      align="center"
    />
  );
}

export function buildReasonMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.reasonCode",
        defaultMessage: "Reason Code",
      }),
      field: "szReasonCode",
      editable: true,
      width: 180,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.reasonDesc",
        defaultMessage: "Description",
      }),
      field: "szReasonDesc",
      editable: true,
      width: 932,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.reasonMaster.active",
        defaultMessage: "Active",
      }),
      field: "szActive",
      editable: false,
      width: 105,
      filter: false,
      isCheckbox: true,
      cellRenderer: ReasonMasterActiveCellRenderer,
    },
  ];
}
