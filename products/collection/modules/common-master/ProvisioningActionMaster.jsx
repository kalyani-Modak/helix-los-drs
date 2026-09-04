import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HButtonBar, SearchCommonBox, TitleBar, HBreadCrumb, HAgGrid } from "@helix/component-library";

import { ProvisioningActionMasterAPI } from "./apiEndpoints";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { gridFeeCodeDefObj, gridServiceStatusDefObj } from "../../../common/components/SearchGridDefObj";

const ProvisioningActionMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const ServiceStatusSearchRenderer = (props) => {
    const { value, node } = props;

    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
        searchCode="SERVSTAT"
        setSelectedValue={(dataValue) =>
          node.setDataValue("chServiceStatus", dataValue || value)
        }
        selectedValue={value}
        selectedColumn="szcondition"
        gridDefObj={gridServiceStatusDefObj}
        gridWidth={450}
        gridHeight={300}
        gridNoOfRowsPerPage={5}
        searchBoxWidth={120}
        searchBoxHeight={25}
        searchBoxFontSize={11}
        error={false}
      />
    );
  };
  const FeeCodeSearchRenderer = (props) => {
    const { value, node } = props;

    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
        searchCode="FEECODE"
        setSelectedValue={(dataValue) =>
          node.setDataValue("szFeeCode", dataValue || value)
        }

        selectedValue={value}
        selectedColumn="szfeecode"
        gridDefObj={gridFeeCodeDefObj}
        gridWidth={450}
        gridHeight={300}
        gridNoOfRowsPerPage={5}
        searchBoxWidth={120}
        searchBoxHeight={25}
        searchBoxFontSize={11}
        error={false}
      />
    );
  };
  const columnDefs = [
    {
      headerName: intl.formatMessage({
        id: "label.Sequence.No",
        defaultMessage: "Sequence No",
      }),
      field: "inProvisionSeqNo",
      width: 130,
      editable: (params) => params.data?.mode === "N",
      filter: false,
      hide: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Code",
        defaultMessage: "Code",
      }),
      field: "szCode",
      width: 130,
      editable: (params) => params.data?.mode === "N",
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Description",
        defaultMessage: "Description",
      }),
      field: "szDescription",
      width: 200,
      editable: true,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.CommunicationCode",
        defaultMessage: "Communication Code",
      }),
      field: "szCommunicationCode",
      width: 180,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Reason",
        defaultMessage: "Reason",
      }),
      field: "szReasonCode",
      width: 160,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.User",
        defaultMessage: "User",
      }),
      field: "szCommunicationUser",
      width: 150,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Server",
        defaultMessage: "Server",
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.AutoServer",
            defaultMessage: "Automatic Server",
          }),
          field: "szCommunicationServer",
          width: 170,
          editable: true,
          filter: false,
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.ManualServer",
            defaultMessage: "Manual Server",
          }),
          field: "szManCommunicationServer",
          width: 170,
          editable: true,
          filter: false,
        },
      ],
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.ServiceStatus",
        defaultMessage: "Service Status",
      }),
      field: "chServiceStatus",
      width: 160,
      editable: false,
      cellRenderer: ServiceStatusSearchRenderer,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.ChargeFee",
        defaultMessage: "Charge Fee",
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.FeeCode",
            defaultMessage: "Fee Code",
          }),
          field: "szFeeCode",
          width: 150,
          editable: false,
          cellRenderer: FeeCodeSearchRenderer,
          filter: false,
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Method",
            defaultMessage: "Method",
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
                defaultMessage: "None",
              }),
              intl.formatMessage({
                id: "dropdown.method.percentOnly",
                defaultMessage: "% Only",
              }),
              intl.formatMessage({
                id: "dropdown.method.flatPercent",
                defaultMessage: "Flat + %",
              }),
              intl.formatMessage({
                id: "dropdown.method.flatOnly",
                defaultMessage: "Flat Only",
              }),
              intl.formatMessage({
                id: "dropdown.method.maxFlatPercent",
                defaultMessage: "Maximum of Flat & %",
              }),
              intl.formatMessage({
                id: "dropdown.method.minFlatPercent",
                defaultMessage: "Minimum of Flat & %",
              }),
            ],
          },
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Flat",
            defaultMessage: "Flat",
          }),
          field: "bdFeeAmount",
          width: 130,
          editable: true,
          cellEditor: "agNumberCellEditor",
          valueParser: (params) =>
            params.newValue === "" || params.newValue == null
              ? null
              : Number(params.newValue),
          filter: false,
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.Percent",
            defaultMessage: "%",
          }),
          field: "flFeePerc",
          width: 120,
          editable: true,
          cellEditor: "agNumberCellEditor",
          valueParser: (params) =>
            params.newValue === "" || params.newValue == null
              ? null
              : Number(params.newValue),
          filter: false,
        },
        {
          headerName: intl.formatMessage({
            id: "label.ProvisionAction.BaseAmount",
            defaultMessage: "Base Amount",
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
                defaultMessage: "None",
              }),
              intl.formatMessage({
                id: "dropdown.baseAmount.outstandingBalance",
                defaultMessage: "Outstanding Balance",
              }),
              intl.formatMessage({
                id: "dropdown.baseAmount.overdueAmount",
                defaultMessage: "Overdue Amount",
              }),
            ],
          },
        },
      ],
    },
    {
      headerName: intl.formatMessage({
        id: "label.ProvisionAction.Cost",
        defaultMessage: "Cost",
      }),
      field: "bdActionCost",
      width: 130,
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) =>
        params.newValue === "" || params.newValue == null
          ? null
          : Number(params.newValue),
      filter: false,
    },
  ];

  useEffect(() => {
    HAxiosService.POST(
      ProvisioningActionMasterAPI.fetchProvisioningActionMaster,
      {}
    ).then((res) => {
      const wrapper = res.data?.responseJson || {};
      setRowData(wrapper.lstProvisionActionDTO || []);
    });
  }, []);

  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => {
        const mode = row.mode || "U";

        return {
          ...row,
          szMode: mode,
        };
      });

      const res = await HAxiosService.POST(
        ProvisioningActionMasterAPI.saveProvisioningActionMaster,
        payload
      );

      const data = res?.data;

      if (data?.errors && Object.keys(data.errors).length > 0) {
        handleValidationErrors(intl, toast, data.errors);
        return { success: false };
      }

      if (data?.status !== "Success") {
        toast.error(
          intl.formatMessage({
            id: "message.ProvisionAction.SaveError",
            defaultMessage: "Provision Action save failed",
          })
        );
        return { success: false };
      }

      toast.success(
        intl.formatMessage({
          id: "message.ProvisionAction.SaveSuccess",
          defaultMessage: "Provision Action saved successfully",
        })
      );

      return { success: true };
    } catch (e) {
      toast.error(
        intl.formatMessage({
          id: "message.ProvisionAction.SaveError",
          defaultMessage: "Provision Action save failed",
        })
      );
      return { success: false };
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar
        title={intl.formatMessage({
          id: "label.ProvisioningAction.title",
          defaultMessage: "Provisioning Action Master",
        })}
      />

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "65vh", margin: "10px auto" }}
          pagination
          paginationPageSize={10}
          allowAdd
          allowUpdate
          allowDelete
          addCheckBoxes
          onSave={handleSave}
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default ProvisioningActionMaster;
