import { eh as useNavigate, ed as useIntl, ct as ar, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, dK as ps, cy as bu, cj as Vg, cJ as dc, dd as gridCollectorDefObj, bI as SEARCH_API_ENDPOINTS } from "./index-BhdgJqva.js";
import { b as CollectorMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import CollectorMasterScreen from "./CollectorMasterScreen-BEOO5-oV.js";
const CollectorMaster = () => {
  var _a;
  const navigate = useNavigate();
  const intl = useIntl();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [rowData, setRowData] = reactExports.useState([]);
  const [collectorTypes, setCollectorTypes] = reactExports.useState([]);
  const [selectedCollector, setSelectedCollector] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const SupervisorCodeSearchRenderer = (props) => {
    const { value, node } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
        searchCode: "COLLCDE",
        setSelectedValue: (dataValue) => node.setDataValue("szSupervisorCode", dataValue || value),
        selectedValue: value,
        selectedColumn: "szCollectorCode",
        gridDefObj: gridCollectorDefObj,
        gridWidth: 350,
        gridHeight: 300,
        gridNoOfRowsPerPage: 2,
        searchBoxWidth: 150,
        searchBoxHeight: 30,
        searchBoxFontSize: 12
      }
    );
  };
  const fetchCollectorType = reactExports.useCallback(() => {
    Kr.GET(`${CollectorMasterAPI.CollectorDetails(screenMenuId)}/fetchCollectorTypes?szConditionType=${"COLLECTOR_TYPE"}`).then((res) => {
      if (res.data.status === "Success") {
        setCollectorTypes(
          res.data.responseJson.map((item) => ({
            label: intl.formatMessage({
              id: item.szi18nDescription,
              defaultMessage: item.szDescription
            }),
            value: item.szCondition
          }))
        );
      } else {
        toast.error(res.data.message);
      }
    }).catch(
      () => toast.error(
        intl.formatMessage({
          id: "label.collector.failedLoadTypes",
          defaultMessage: "Failed to load collector types"
        })
      )
    );
  }, [intl]);
  const fetchCollectors = reactExports.useCallback(async () => {
    var _a2, _b, _c, _d, _e;
    setLoading(true);
    try {
      const { data } = await Kr.GET(CollectorMasterAPI.CollectorDetails(screenMenuId));
      const responseArray = Array.isArray(data == null ? void 0 : data.responseJson) ? data.responseJson : [];
      const enriched = responseArray.map((item, index) => {
        var _a3, _b2, _c2;
        const collector = item.collectorMasterDto || {};
        const address = item.addressDto || {};
        return {
          id: collector.szCollectorCode || index + 1,
          szCollectorCode: collector.szCollectorCode || "",
          addressType: address.szAddressType || "",
          type: (_a3 = item.collectorMasterDto) == null ? void 0 : _a3.szType,
          Supervisor: (_b2 = item.collectorMasterDto) == null ? void 0 : _b2.szSupervisorCode,
          maxCases: (_c2 = item.collectorMasterDto) == null ? void 0 : _c2.lnMaxCases,
          ...item.collectorMasterDto,
          ...item.addressDto,
          isPersisted: true
        };
      });
      setRowData(enriched);
    } catch (error) {
      setRowData([]);
      toast.error(
        ((_c = (_b = (_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.responseJson) == null ? void 0 : _c.responseMsg) || ((_e = (_d = error == null ? void 0 : error.response) == null ? void 0 : _d.data) == null ? void 0 : _e.message)
      );
    }
  }, [intl]);
  reactExports.useEffect(() => {
    fetchCollectors();
    fetchCollectorType();
  }, [intl.locale]);
  const handleCellClick = reactExports.useCallback(
    (params) => {
      var _a2, _b, _c, _d;
      const field = ((_a2 = params == null ? void 0 : params.colDef) == null ? void 0 : _a2.field) || ((_c = (_b = params == null ? void 0 : params.column) == null ? void 0 : _b.getColId) == null ? void 0 : _c.call(_b)) || "";
      const row = (params == null ? void 0 : params.data) || ((_d = params == null ? void 0 : params.node) == null ? void 0 : _d.data) || null;
      const collectorCode = row == null ? void 0 : row.szCollectorCode;
      if (field !== "szCollectorCode" || !(row == null ? void 0 : row.isPersisted) || !collectorCode) {
        return;
      }
      setSelectedCollector({
        szCollectorCode: collectorCode,
        collectorRow: row,
        mode: "E"
      });
    },
    []
  );
  const handleDetailClose = reactExports.useCallback(() => {
    setSelectedCollector(null);
    fetchCollectors();
  }, [fetchCollectors]);
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.collector.code",
          defaultMessage: "Code"
        }),
        field: "szCollectorCode",
        width: 140,
        editable: true,
        required: true,
        cellStyle: (params) => {
          var _a2;
          return ((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.isPersisted) ? {
            cursor: "pointer",
            color: "#032a50",
            textDecoration: "underline"
          } : {};
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.name",
          defaultMessage: "Name"
        }),
        field: "szCollectorName",
        width: 200,
        editable: true,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.type",
          defaultMessage: "Type"
        }),
        field: "szType",
        width: 200,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: collectorTypes.map((opt) => opt.value)
        },
        valueFormatter: (params) => {
          const type = collectorTypes.find((item) => item.value === params.value);
          return type ? type.label : params.value;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.supervisor",
          defaultMessage: "Supervisor"
        }),
        field: "szSupervisorCode",
        width: 180,
        editable: false,
        filter: false,
        cellRenderer: SupervisorCodeSearchRenderer
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.maxCases",
          defaultMessage: "Max Cases"
        }),
        field: "maxCases",
        width: 100,
        editable: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.phone",
          defaultMessage: "Phone"
        }),
        field: "szMobileNo",
        width: 140,
        editable: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.collector.email",
          defaultMessage: "Email"
        }),
        field: "szMailId",
        width: 250,
        editable: true
      }
    ],
    [intl.locale, collectorTypes]
  );
  const buildPayload = (row, mode) => ({
    collectorMasterDto: {
      szCollectorCode: row.szCollectorCode,
      szCollectorName: row.szCollectorName,
      szType: row.szType,
      szSupervisorCode: row.szSupervisorCode,
      lnMaxCases: row.maxCases !== "" && row.maxCases != null ? Number(row.maxCases) : null,
      szMode: mode,
      szShiftStart: row.shiftStart,
      szShiftEnd: row.shiftEnd,
      szOperationMode: row.operationMode,
      dbAdhocCashLimit: row.adhocCashLimit !== "" && row.adhocCashLimit != null ? Number(row.adhocCashLimit) : null,
      dbCashLimit: row.cashLimit !== "" && row.cashLimit != null ? Number(row.cashLimit) : null,
      szHandlesReceiptBooksYN: row.handesReceiptBooksYN,
      szIssueReceiptYN: row.issueReceiptYN,
      szKeycloakRefId: row.szKeycloakRefId
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
      szPagerNo: row.pagerNo
    }
  });
  const handleSave = async ({ updatedRows }) => {
    var _a2, _b, _c, _d, _e, _f;
    const payload = updatedRows.map((row) => buildPayload(row, "E"));
    try {
      const { data } = await Kr.PUT(
        CollectorMasterAPI.CollectorDetails(screenMenuId),
        payload
      );
      const statusCode = String(((_a2 = data == null ? void 0 : data.responseJson) == null ? void 0 : _a2.statusCode) ?? "");
      const isSuccess = (data == null ? void 0 : data.status) === "Success" || statusCode === "200";
      if (!isSuccess) {
        return { success: false };
      }
      fetchCollectors();
      return { success: true };
    } catch (error) {
      toast.error(
        ((_d = (_c = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.responseJson) == null ? void 0 : _d.responseMsg) || ((_f = (_e = error == null ? void 0 : error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.message) || intl.formatMessage({
          id: "label.collector.operationFailed",
          defaultMessage: "Error occurred while saving collector details"
        })
      );
    }
  };
  if (selectedCollector) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollectorMasterScreen,
      {
        injectState: selectedCollector,
        onClose: handleDetailClose
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collector-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collector-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.collector.title",
            defaultMessage: "Collector Master"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.collector.description",
            defaultMessage: "Manage collector profiles, group membership, capacity and skills."
          }),
          colon: false,
          align: "left"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "100%", minHeight: "380px" },
          pagination: true,
          paginationPageSize: 10,
          rowDragging: false,
          loading,
          onSave: handleSave,
          onCellClicked: handleCellClick,
          onClickMapping: { szCollectorCode: handleCellClick }
        },
        intl.locale
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a2, _b;
            return (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
          },
          onClose: () => navigate("/homelayout/welcomepage")
        }
      )
    ] })
  ] });
};
export {
  CollectorMaster as default
};
