import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HButtonBar, HLabel, TitleBar, HBreadCrumb, HBox, SearchCommonBox, HAgGrid } from "@helix/component-library";

import { CollectorMasterAPI } from "../apiEndpoints";

import { gridCollectorDefObj } from "../../../../common/components/SearchGridDefObj";

import "./CollectorMaster.css";
import CollectorMasterScreen from "./CollectorMasterScreen";
import { SEARCH_API_ENDPOINTS } from '@shared/config/apiConstants.jsx';
import { useLocation } from "react-router-dom";
const CollectorMaster = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const toast = useToast();
  const gridRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [collectorTypes, setCollectorTypes] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const SupervisorCodeSearchRenderer = (props) => {
    const { value, node } = props;

    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
        searchCode="COLLCDE"
        setSelectedValue={(dataValue) =>
          node.setDataValue("szSupervisorCode", dataValue || value)
        }
        selectedValue={value}
        selectedColumn="szCollectorCode"
        gridDefObj={gridCollectorDefObj}
        gridWidth={350}
        gridHeight={300}
        gridNoOfRowsPerPage={2}
        searchBoxWidth={150}
        searchBoxHeight={30}
        searchBoxFontSize={12}
      />
    );
  };

  const fetchCollectorType = useCallback(() => {
    HAxiosService.GET(`${CollectorMasterAPI.CollectorDetails(screenMenuId)}/fetchCollectorTypes?szConditionType=${"COLLECTOR_TYPE"}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setCollectorTypes(
            res.data.responseJson.map((item) => ({
              label: intl.formatMessage({
                id: item.szi18nDescription,
                defaultMessage: item.szDescription,
              }),
              value: item.szCondition,
            })),
          );
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            id: "label.collector.failedLoadTypes",
            defaultMessage: "Failed to load collector types",
          }),
        ),
      );
  }, [intl]);

  const fetchCollectors = useCallback(async () => {
    setLoading(true); 
    try {
      const { data } = await HAxiosService.GET(CollectorMasterAPI.CollectorDetails(screenMenuId ));

      const responseArray = Array.isArray(data?.responseJson) ? data.responseJson : [];
      const enriched = responseArray.map((item, index) => {
        const collector = item.collectorMasterDto || {};
        const address = item.addressDto || {};

        return {
          id: collector.szCollectorCode || index + 1,
          szCollectorCode: collector.szCollectorCode || "",
          addressType: address.szAddressType || "",
          type: item.collectorMasterDto?.szType,
          Supervisor: item.collectorMasterDto?.szSupervisorCode,
          maxCases: item.collectorMasterDto?.lnMaxCases,
          ...item.collectorMasterDto,
          ...item.addressDto,
          isPersisted: true,
        };
      });
      setRowData(enriched);
    } catch (error) {
      setRowData([]);
      toast.error(
        error?.response?.data?.responseJson?.responseMsg ||
        error?.response?.data?.message,
      );
    }
  }, [intl]);

  useEffect(() => {
    fetchCollectors();
    fetchCollectorType();
  }, [intl.locale]);

  const handleCellClick = useCallback(
    (params) => {
      const field = params?.colDef?.field || params?.column?.getColId?.() || "";
      const row = params?.data || params?.node?.data || null;
      const collectorCode = row?.szCollectorCode;

      if (field !== "szCollectorCode" || !row?.isPersisted || !collectorCode) {
        return;
      }

      setSelectedCollector({
        szCollectorCode: collectorCode,
        collectorRow: row,
        mode: "E",
      });
    },
    [],
  );

  const handleDetailClose = useCallback(() => {
    setSelectedCollector(null);
    fetchCollectors();
  }, [fetchCollectors]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.collector.code",
          defaultMessage: "Code",
        }),
        field: "szCollectorCode",
        width: 140,
        editable: true,
        required: true,
        cellStyle: (params) =>
          params?.data?.isPersisted
            ? {
                cursor: "pointer",
                color: "#032a50",
                textDecoration: "underline",
              }
            : {},
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.name",
          defaultMessage: "Name",
        }),
        field: "szCollectorName",
        width: 200,
        editable: true,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.type",
          defaultMessage: "Type",
        }),
        field: "szType",
        width: 200,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: collectorTypes.map((opt) => opt.value),
        },
        valueFormatter: (params) => {
          const type = collectorTypes.find((item) => item.value === params.value);
          return type ? type.label : params.value;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.supervisor",
          defaultMessage: "Supervisor",
        }),
        field: "szSupervisorCode",
        width: 180,
        editable: false,
        filter:false,
        cellRenderer: SupervisorCodeSearchRenderer,
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.maxCases",
          defaultMessage: "Max Cases",
        }),
        field: "maxCases",
        width: 100,
        editable: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.phone",
          defaultMessage: "Phone",
        }),
        field: "szMobileNo",
        width: 140,
        editable: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.email",
          defaultMessage: "Email",
        }),
        field: "szMailId",
        width: 250,
        editable: true,
      },
    ],
    [intl.locale, collectorTypes],
  );

  const buildPayload = (row, mode) => ({
    collectorMasterDto: {
      szCollectorCode: row.szCollectorCode,
      szCollectorName: row.szCollectorName,
      szType: row.szType,
      szSupervisorCode: row.szSupervisorCode,
      lnMaxCases:
        row.maxCases !== "" && row.maxCases != null
          ? Number(row.maxCases)
          : null,
      szMode: mode,
      szShiftStart: row.shiftStart,
      szShiftEnd: row.shiftEnd,
      szOperationMode: row.operationMode,
      dbAdhocCashLimit:
        row.adhocCashLimit !== "" && row.adhocCashLimit != null
          ? Number(row.adhocCashLimit)
          : null,
      dbCashLimit:
        row.cashLimit !== "" && row.cashLimit != null
          ? Number(row.cashLimit)
          : null,
      szHandlesReceiptBooksYN: row.handesReceiptBooksYN,
      szIssueReceiptYN: row.issueReceiptYN,
      szKeycloakRefId: row.szKeycloakRefId,
    },
    addressDto: {
      szAddressType: row.szAddressType,
      szPartitionCode: row.szPartitionCode,
      szAddress1: row.szAddress1,
      szAddress2: row.szAddress2,
      szAddress3: row.szAddress3,
      szAddress4: row.szAddress4,
      szCity: row.szCity,
      szZip: row.szZip,
      szState: row.szState,
      szCountry: row.szCountry,
      szPhone1: row.szPhone1,
      szFax: row.szFax,
      szMailId: row.szMailId,
      szMobileNo: row.szMobileNo,
      szPagerNo: row.pagerNo,
    },
  });

  const handleSave = async ({ updatedRows }) => {
    const payload = updatedRows.map((row) => buildPayload(row, "E"));

    try {
      const { data } = await HAxiosService.PUT(
        CollectorMasterAPI.CollectorDetails(screenMenuId),
        payload,
      );

      const statusCode = String(data?.responseJson?.statusCode ?? "");
      const isSuccess = data?.status === "Success" || statusCode === "200";

      if (!isSuccess) {
        return { success: false };
      }

      fetchCollectors();
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.responseJson?.responseMsg ||
          error?.response?.data?.message ||
          intl.formatMessage({
            id: "label.collector.operationFailed",
            defaultMessage: "Error occurred while saving collector details",
          }),
      );
    }
  };
  if (selectedCollector) {
    return (
      <CollectorMasterScreen
        injectState={selectedCollector}
        onClose={handleDetailClose}
      />
    );
  }

  return (
    <HBox className="collector-master-page">
      <HBox className="collector-master-header-card">
        <HBreadCrumb />
        <TitleBar
          title={intl.formatMessage({
            id: "label.collector.title",
            defaultMessage: "Collector Master",
          })}
        />
        <HLabel
          value={intl.formatMessage({
            id: "label.collector.description",
            defaultMessage: "Manage collector profiles, group membership, capacity and skills.",
          })}
          colon={false}
          align="left"
        />
      </HBox>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={rowData}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", minHeight: "380px" }}
          pagination={true}
          paginationPageSize={10}
          rowDragging={false}
          loading={loading}
          onSave={handleSave}
          onCellClicked={handleCellClick}
          onClickMapping={{ szCollectorCode: handleCellClick }}
        />

        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
};

export default CollectorMaster;
