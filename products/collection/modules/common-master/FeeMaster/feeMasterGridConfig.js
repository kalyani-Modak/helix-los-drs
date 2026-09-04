import React from "react";
import { HCheckBox } from "@helix/component-library";

export const FeeMasterCheckboxRenderer = (params) => {
  const checked = params.value === true || params.value === "Y";
  
  const handleChange = (e) => {
    e.stopPropagation();
    params.node.setDataValue(params.colDef.field, e.target.checked);
  };
  
  const handleCellClick = (e) => {
    e.stopPropagation();
  };
  
  return React.createElement(HCheckBox, {
    checked: checked,
    onChange: handleChange,
    onClick: handleCellClick,
    label: "",
    margin: "15px",
    align: "center"
  });
};

/** Value formatter for dropdown fields to display translated labels */
export const createDropdownFormatter = (metaData, t) => (params) => {
  const item = metaData?.find((m) => m.Code === params.value);
  return item ? t(item.Desc) : params.value;
};

export function buildFeeMasterColumnDefs(intl, metaData, t, defaultWaiveAmount) {
  const defaultPaymentHead = metaData.PMTHEAD?.[0]?.Code || "";
  return [
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.FeeCode",
        defaultMessage: "Fee Code",
      }),
      field: "feeCode",
      width: 150,
      editable: true,
      filter: false,
      required: true,
	    sortable: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.Description",
        defaultMessage: "Description",
      }),
      field: "feeDesc",
      width: 220,
      editable: true,
      filter: false,
      required: true,
	    sortable: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.PaymentHead",
        defaultMessage: "Payment Head",
      }),
      field: "paymentHead",
      width: 220,
      editable: true,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: metaData.PMTHEAD?.map((item) => item.Code) || [],
      },
      valueFormatter: createDropdownFormatter(metaData.PMTHEAD, t),
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.FeeWaivers",
        defaultMessage: "Fee Waivers",
      }),
      headerClass: "center-header",
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Allowed",
            defaultMessage: "Allowed",
          }),
          field: "waiveAllowed",
          width: 100,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer,
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Auth",
            defaultMessage: "Auth",
          }),
          field: "waiveAuth",
          width: 100,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer,
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.AllowWhat",
            defaultMessage: "Allow What",
          }),
          field: "waiveAmount",
          width: 200,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: metaData.FEEWAIVESTATUS?.map((item) => item.Code) || [],
          },
          valueFormatter: createDropdownFormatter(metaData.FEEWAIVESTATUS, t),
          defaultValue: defaultWaiveAmount,
        },
      ],
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.AllowedCharges",
        defaultMessage: "Charges",
      }),
      headerClass: "center-header",
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Allowed",
            defaultMessage: "Allowed",
          }),
          field: "chargeAllowed",
          width: 110,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer,
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Auth",
            defaultMessage: "Auth",
          }),
          field: "chargeAuth",
          width: 110,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer,
        },
      ],
    },
  ];
}