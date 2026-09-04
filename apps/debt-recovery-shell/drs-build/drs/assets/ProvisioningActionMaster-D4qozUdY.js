import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, aX as Kr, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, ac as Dt, cy as bu, cj as Vg, cJ as dc, dn as gridServiceStatusDefObj, bI as SEARCH_API_ENDPOINTS, dg as gridFeeCodeDefObj } from "./index-BhdgJqva.js";
import { k as ProvisioningActionMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const ProvisioningActionMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const ServiceStatusSearchRenderer = (props) => {
    const { value, node } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
        searchCode: "SERVSTAT",
        setSelectedValue: (dataValue) => node.setDataValue("chServiceStatus", dataValue || value),
        selectedValue: value,
        selectedColumn: "szcondition",
        gridDefObj: gridServiceStatusDefObj,
        gridWidth: 450,
        gridHeight: 300,
        gridNoOfRowsPerPage: 5,
        searchBoxWidth: 120,
        searchBoxHeight: 25,
        searchBoxFontSize: 11,
        error: false
      }
    );
  };
  const FeeCodeSearchRenderer = (props) => {
    const { value, node } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
        searchCode: "FEECODE",
        setSelectedValue: (dataValue) => node.setDataValue("szFeeCode", dataValue || value),
        selectedValue: value,
        selectedColumn: "szfeecode",
        gridDefObj: gridFeeCodeDefObj,
        gridWidth: 450,
        gridHeight: 300,
        gridNoOfRowsPerPage: 5,
        searchBoxWidth: 120,
        searchBoxHeight: 25,
        searchBoxFontSize: 11,
        error: false
      }
    );
  };
  const columnDefs = [
    {
      headerName: intl.formatMessage({
        id: "label.Sequence.No",
        defaultMessage: "Sequence No"
      }),
      field: "inProvisionSeqNo",
      width: 130,
      editable: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
      },
      filter: false,
      hide: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Code",
        defaultMessage: "Code"
      }),
      field: "szCode",
      width: 130,
      editable: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
      },
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Description",
        defaultMessage: "Description"
      }),
      field: "szDescription",
      width: 200,
      editable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.CommunicationCode",
        defaultMessage: "Communication Code"
      }),
      field: "szCommunicationCode",
      width: 180,
      editable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Reason",
        defaultMessage: "Reason"
      }),
      field: "szReasonCode",
      width: 160,
      editable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.User",
        defaultMessage: "User"
      }),
      field: "szCommunicationUser",
      width: 150,
      editable: true,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Server",
        defaultMessage: "Server"
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.AutoServer",
            defaultMessage: "Automatic Server"
          }),
          field: "szCommunicationServer",
          width: 170,
          editable: true,
          filter: false
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.ManualServer",
            defaultMessage: "Manual Server"
          }),
          field: "szManCommunicationServer",
          width: 170,
          editable: true,
          filter: false
        }
      ]
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.ServiceStatus",
        defaultMessage: "Service Status"
      }),
      field: "chServiceStatus",
      width: 160,
      editable: false,
      cellRenderer: ServiceStatusSearchRenderer,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.ChargeFee",
        defaultMessage: "Charge Fee"
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.FeeCode",
            defaultMessage: "Fee Code"
          }),
          field: "szFeeCode",
          width: 150,
          editable: false,
          cellRenderer: FeeCodeSearchRenderer,
          filter: false
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Method",
            defaultMessage: "Method"
          }),
          field: "szCalculationType",
          width: 160,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              intl.formatMessage({
                id: "dropdown.method.none",
                defaultMessage: "None"
              }),
              intl.formatMessage({
                id: "dropdown.method.percentOnly",
                defaultMessage: "% Only"
              }),
              intl.formatMessage({
                id: "dropdown.method.flatPercent",
                defaultMessage: "Flat + %"
              }),
              intl.formatMessage({
                id: "dropdown.method.flatOnly",
                defaultMessage: "Flat Only"
              }),
              intl.formatMessage({
                id: "dropdown.method.maxFlatPercent",
                defaultMessage: "Maximum of Flat & %"
              }),
              intl.formatMessage({
                id: "dropdown.method.minFlatPercent",
                defaultMessage: "Minimum of Flat & %"
              })
            ]
          }
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Flat",
            defaultMessage: "Flat"
          }),
          field: "bdFeeAmount",
          width: 130,
          editable: true,
          cellEditor: "agNumberCellEditor",
          valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue),
          filter: false
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Percent",
            defaultMessage: "%"
          }),
          field: "flFeePerc",
          width: 120,
          editable: true,
          cellEditor: "agNumberCellEditor",
          valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue),
          filter: false
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.BaseAmount",
            defaultMessage: "Base Amount"
          }),
          field: "szBaseAmountField",
          width: 170,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              intl.formatMessage({
                id: "dropdown.baseAmount.none",
                defaultMessage: "None"
              }),
              intl.formatMessage({
                id: "dropdown.baseAmount.outstandingBalance",
                defaultMessage: "Outstanding Balance"
              }),
              intl.formatMessage({
                id: "dropdown.baseAmount.overdueAmount",
                defaultMessage: "Overdue Amount"
              })
            ]
          }
        }
      ]
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Cost",
        defaultMessage: "Cost"
      }),
      field: "bdActionCost",
      width: 130,
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) => params.newValue === "" || params.newValue == null ? null : Number(params.newValue),
      filter: false
    }
  ];
  reactExports.useEffect(() => {
    Kr.POST(
      ProvisioningActionMasterAPI.fetchProvisioningActionMaster,
      {}
    ).then((res) => {
      var _a;
      const wrapper = ((_a = res.data) == null ? void 0 : _a.responseJson) || {};
      setRowData(wrapper.lstProvisionActionDTO || []);
    });
  }, []);
  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    try {
      const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => {
        const mode = row.mode || "U";
        return {
          ...row,
          szMode: mode
        };
      });
      const res = await Kr.POST(
        ProvisioningActionMasterAPI.saveProvisioningActionMaster,
        payload
      );
      const data = res == null ? void 0 : res.data;
      if ((data == null ? void 0 : data.errors) && Object.keys(data.errors).length > 0) {
        handleValidationErrors(intl, toast, data.errors);
        return { success: false };
      }
      if ((data == null ? void 0 : data.status) !== "Success") {
        toast.error(
          intl.formatMessage({
            id: "message.ProvisionAction.SaveError",
            defaultMessage: "Provision Action save failed"
          })
        );
        return { success: false };
      }
      toast.success(
        intl.formatMessage({
          id: "message.ProvisionAction.SaveSuccess",
          defaultMessage: "Provision Action saved successfully"
        })
      );
      return { success: true };
    } catch (e) {
      toast.error(
        intl.formatMessage({
          id: "message.ProvisionAction.SaveError",
          defaultMessage: "Provision Action save failed"
        })
      );
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.ProvisioningAction.title",
          defaultMessage: "Provisioning Action Master"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "100%", height: "65vh", margin: "10px auto" },
          pagination: true,
          paginationPageSize: 10,
          allowAdd: true,
          allowUpdate: true,
          allowDelete: true,
          addCheckBoxes: true,
          onSave: handleSave
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  ProvisioningActionMaster as default
};
