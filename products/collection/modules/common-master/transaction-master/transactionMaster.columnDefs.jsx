import React from "react";

export const getTransactionMasterColumnDefs = (
  intl,
  paymentTypeOptions,
  translateDesc,
  renderCheckBox
) => {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Code",
        defaultMessage: "Code",
      }),
      field: "szTransactionCode",
      flex: 1,
      editable: true,
      sortable: true,
      filter: false,
      required: true,
    },

    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Description",
        defaultMessage: "Description",
      }),
      field: "szTransactionDesc",
      flex: 3,
      editable: true,
      sortable: true,
      filter: false,
      required: true,
    },

    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Type",
        defaultMessage: "Type",
      }),
      field: "szPaymentType",
      flex: 1.5,
      editable: true,
      sortable: true,
      filter: false,
      required: true,

      cellEditor: "agSelectCellEditor",

      cellEditorParams: {
        values: paymentTypeOptions.map((opt) => opt.Code),
      },

      valueFormatter: (params) => {
        const opt = paymentTypeOptions.find(
          (o) => o.Code === params.value
        );

        return opt
          ? translateDesc(opt.Desc)
          : params.value;
      },
    },

    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Credit",
        defaultMessage: "Credit",
      }),
      field: "chCreditYn",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      cellRenderer: renderCheckBox("chCreditYn"),
    },

    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Payment",
        defaultMessage: "Payment",
      }),
      field: "chPaymentYn",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      cellRenderer: renderCheckBox("chPaymentYn"),
    },

    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Active",
        defaultMessage: "Active",
      }),
      field: "chActive",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      isCheckbox: true,
      cellRenderer: renderCheckBox("chActive"),
    },
  ];
};