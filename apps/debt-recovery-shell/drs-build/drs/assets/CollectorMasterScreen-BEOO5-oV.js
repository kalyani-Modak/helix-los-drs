import { eh as useNavigate, ef as useLocation, dN as reactExports, ed as useIntl, ct as ar, aX as Kr, dB as jsxRuntimeExports, ac as Dt, aR as IconButton, j as ArrowBackIcon, cx as bp, ep as vp, dK as ps, aW as Kg, aM as Grid, cs as ap, dD as lE, cf as Typography, bH as SE, cJ as dc, dd as gridCollectorDefObj, bI as SEARCH_API_ENDPOINTS, cB as cc, cj as Vg } from "./index-BhdgJqva.js";
import { b as CollectorMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const COLLECTOR_FORM_LABEL_WIDTH = 140;
const CollectorLabelFieldRow = ({ labelId, required, children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Dt,
  {
    styles: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      width: "80%"
    },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          width: COLLECTOR_FORM_LABEL_WIDTH,
          value: labelId,
          required: Boolean(required),
          align: "right"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { styles: { flex: 1, minWidth: 0 }, children })
    ]
  }
);
const emptyCollectorDto = () => ({
  szCollectorCode: "",
  szCollectorName: "",
  szType: "",
  szAgencyType: "",
  szAgencyCategory: "",
  szIsSupervisor: "N",
  szSupervisorCode: "",
  lnMaxCases: "",
  szShiftStart: "",
  szShiftEnd: "",
  szHandlesReceiptBooksYN: "N",
  szIssueReceiptYN: "N",
  dbCashLimit: "",
  dbAdhocCashLimit: "",
  szKeycloakRefId: "",
  szMode: "E",
  szOperationMode: ""
});
const emptyAddressDto = () => ({
  szAddressType: "RS",
  szPartitionCode: "001",
  szAddress1: "",
  szAddress2: "",
  szAddress3: "",
  szAddress4: "",
  szCity: "",
  szZip: "",
  szState: "",
  szCountry: "",
  szPhone1: "",
  szFax: "",
  szMailId: "",
  szMobileNo: "",
  szPagerNo: ""
});
const CollectorMasterScreen = ({ injectState, onClose }) => {
  var _a;
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const routeState = injectState ?? location.state ?? {};
  const incomingRow = routeState.collectorRow || null;
  const incomingCode = routeState.szCollectorCode || (incomingRow == null ? void 0 : incomingRow.szCollectorCode) || null;
  const handleClose = reactExports.useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate("/homelayout/collectorMaster");
    }
  }, [onClose, navigate]);
  const intl = useIntl();
  const toast = ar();
  const [collectorDto, setCollectorDto] = reactExports.useState(emptyCollectorDto);
  const [addressDto, setAddressDto] = reactExports.useState(emptyAddressDto);
  const [collectorTypes, setCollectorTypes] = reactExports.useState([]);
  reactExports.useEffect(() => {
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
  const applyCollectorResponse = reactExports.useCallback((col = {}, addr = {}) => {
    setCollectorDto({
      szCollectorCode: col.szCollectorCode || "",
      szCollectorName: col.szCollectorName || "",
      szType: col.szType || "",
      szAgencyType: col.szAgencyType || "",
      szAgencyCategory: col.szAgencyCategory || "",
      szIsSupervisor: col.szIsSupervisor ? "Y" : "N",
      szSupervisorCode: col.szSupervisorCode,
      lnMaxCases: col.lnMaxCases != null ? String(col.lnMaxCases) : col.maxCases != null ? String(col.maxCases) : "",
      szShiftStart: col.szShiftStart || "",
      szShiftEnd: col.szShiftEnd || "",
      szHandlesReceiptBooksYN: col.szHandlesReceiptBooksYN || (col.canHandleReceiptBook ? "Y" : "N"),
      szIssueReceiptYN: col.szIssueReceiptYN || (col.canIssueReceipt ? "Y" : "N"),
      dbCashLimit: col.dbCashLimit != null ? String(col.dbCashLimit) : "",
      dbAdhocCashLimit: col.dbAdhocCashLimit != null ? String(col.dbAdhocCashLimit) : "",
      szKeycloakRefId: col.szKeycloakRefId || "",
      szMode: "E",
      szOperationMode: col.szOperationMode || ""
    });
    setAddressDto({
      szAddressType: addr.szAddressType || "RS",
      szPartitionCode: addr.szPartitionCode || "001",
      szAddress1: addr.szAddress1 || "",
      szAddress2: addr.szAddress2 || "",
      szAddress3: addr.szAddress3 || "",
      szAddress4: addr.szAddress4 || "",
      szCity: addr.szCity || "",
      szZip: addr.szZip || "",
      szState: addr.szState || "",
      szCountry: addr.szCountry || "",
      szPhone1: addr.szPhone1 || "",
      szFax: addr.szFax || "",
      szMailId: addr.szMailId || "",
      szMobileNo: addr.szMobileNo || "",
      szPagerNo: addr.szPagerNo || ""
    });
  }, []);
  const fetchCollectorDetails = reactExports.useCallback(
    async (code) => {
      var _a2;
      if (!code) return;
      try {
        const res = await Kr.GET(
          `${CollectorMasterAPI.CollectorDetails(screenMenuId)}/fetchCollectorDetails?szCollectorCode=${code}`
        );
        if (((_a2 = res.data) == null ? void 0 : _a2.status) === "Success" && res.data.responseJson) {
          const responseJson = res.data.responseJson;
          const col = responseJson.collectorMasterDto || responseJson || {};
          const addr = responseJson.addressDto || {};
          applyCollectorResponse(col, addr);
        } else {
          toast.error(
            intl.formatMessage({
              id: "label.collector.fetchFailed",
              defaultMessage: "Failed to fetch collector details"
            })
          );
        }
      } catch {
        toast.error(
          intl.formatMessage({
            id: "label.collector.fetchFailed",
            defaultMessage: "Failed to fetch collector details"
          })
        );
      }
    },
    [intl, toast, applyCollectorResponse]
  );
  reactExports.useEffect(() => {
    if (incomingRow) {
      applyCollectorResponse(incomingRow, {});
      fetchCollectorDetails(incomingRow.szCollectorCode);
      return;
    }
    if (incomingCode) {
      fetchCollectorDetails(incomingCode);
      return;
    }
    setCollectorDto(emptyCollectorDto());
    setAddressDto(emptyAddressDto());
  }, [incomingCode, incomingRow]);
  const handleChangeCollector = (field, value) => {
    setCollectorDto((prev) => ({ ...prev, [field]: value }));
  };
  const handleChangeAddress = (field, value) => {
    setAddressDto((prev) => ({ ...prev, [field]: value }));
  };
  const buildPayload = () => ({
    collectorMasterDto: {
      szKeycloakRefId: collectorDto.szKeycloakRefId || "",
      szCollectorCode: collectorDto.szCollectorCode,
      szCollectorName: collectorDto.szCollectorName,
      szType: collectorDto.szType || null,
      szAgencyType: collectorDto.szAgencyType || null,
      szAgencyCategory: collectorDto.szAgencyCategory || null,
      szIsSupervisor: collectorDto.szIsSupervisor || null,
      szSupervisorCode: collectorDto.szSupervisorCode || null,
      lnMaxCases: collectorDto.lnMaxCases !== "" && collectorDto.lnMaxCases != null ? Number(collectorDto.lnMaxCases) : null,
      szMode: "E",
      szShiftStart: collectorDto.szShiftStart || null,
      szShiftEnd: collectorDto.szShiftEnd || null,
      szOperationMode: collectorDto.szOperationMode || null,
      dbAdhocCashLimit: collectorDto.dbAdhocCashLimit !== "" && collectorDto.dbAdhocCashLimit != null ? Number(collectorDto.dbAdhocCashLimit) : null,
      dbCashLimit: collectorDto.dbCashLimit !== "" && collectorDto.dbCashLimit != null ? Number(collectorDto.dbCashLimit) : null,
      szHandlesReceiptBooksYN: collectorDto.szHandlesReceiptBooksYN || null,
      szIssueReceiptYN: collectorDto.szIssueReceiptYN || null
    },
    addressDto: {
      szAddressType: addressDto.szAddressType,
      szPartitionCode: addressDto.szPartitionCode,
      szAddress1: addressDto.szAddress1,
      szAddress2: addressDto.szAddress2,
      szAddress3: addressDto.szAddress3,
      szAddress4: addressDto.szAddress4,
      szCity: addressDto.szCity,
      szZip: addressDto.szZip,
      szState: addressDto.szState,
      szCountry: addressDto.szCountry,
      szPhone1: addressDto.szPhone1,
      szFax: addressDto.szFax,
      szMailId: addressDto.szMailId,
      szMobileNo: addressDto.szMobileNo,
      szPagerNo: addressDto.szPagerNo
    }
  });
  const handleSave = async () => {
    var _a2, _b;
    const payload = [buildPayload()];
    try {
      const { data } = await Kr.PUT(
        CollectorMasterAPI.CollectorDetails(screenMenuId),
        payload
      );
      if (data.status != "Success") {
        return { success: false };
      }
      fetchCollectorDetails(incomingCode);
      return { success: true };
    } catch (error) {
      const errorMessage = ((_b = (_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) ?? intl.formatMessage({
        id: "label.collector.operationFailed",
        defaultMessage: "Error occurred while saving collector details"
      });
      toast.error(errorMessage);
    }
  };
  const handleReset = () => {
    if (incomingCode) {
      fetchCollectorDetails(incomingCode);
    } else {
      setCollectorDto(emptyCollectorDto());
      setAddressDto(emptyAddressDto());
    }
    return { data: { status: "Success" } };
  };
  const isSupervisor = collectorDto.szIsSupervisor === "Y";
  const canHandleReceiptBook = collectorDto.szHandlesReceiptBooksYN === "Y";
  const canIssueReceipt = collectorDto.szIssueReceiptYN === "Y";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collector-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collector-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IconButton,
        {
          "aria-label": "back",
          onClick: handleClose,
          sx: { mr: 1, color: "primary.main" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowBackIcon, {})
        }
      ),
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { elevation: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dt,
      {
        styles: {
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectorLabelFieldRow,
            {
              labelId: intl.formatMessage({
                id: "label.collector.code",
                defaultMessage: "Collector Code"
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  id: "szCollectorCode",
                  width: "100%",
                  align: lE.TEXT,
                  editable: false,
                  disabled: true,
                  value: collectorDto.szCollectorCode,
                  placeholder: intl.formatMessage({
                    id: "label.collector.code",
                    defaultMessage: "Collector Code"
                  }),
                  onChange: (e) => handleChangeCollector("szCollectorCode", e.target.value)
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectorLabelFieldRow,
            {
              labelId: intl.formatMessage({
                id: "label.collector.name",
                defaultMessage: "Collector Name"
              }),
              required: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  width: "100%",
                  align: lE.TEXT,
                  editable: true,
                  required: true,
                  value: collectorDto.szCollectorName,
                  placeholder: intl.formatMessage({
                    id: "label.collector.name",
                    defaultMessage: "Collector Name"
                  }),
                  onChange: (e) => handleChangeCollector("szCollectorName", e.target.value)
                }
              )
            }
          ) })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, alignItems: "stretch", sx: { mt: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { elevation: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dt,
        {
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 16,
            height: "100%",
            boxSizing: "border-box"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Typography,
              {
                variant: "subtitle2",
                color: "text.secondary",
                gutterBottom: true,
                children: intl.formatMessage({
                  id: "label.collector.collectorDetails",
                  defaultMessage: "Collector Details"
                })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.type",
                  defaultMessage: "Type"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    name: "szType",
                    value: collectorDto.szType,
                    onChange: (e) => handleChangeCollector("szType", e.target.value),
                    width: "100%",
                    options: collectorTypes
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.agencyType",
                  defaultMessage: "Agency Type"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.szAgencyType,
                    placeholder: intl.formatMessage({
                      id: "label.collector.agencyType",
                      defaultMessage: "Agency Type"
                    }),
                    onChange: (e) => handleChangeCollector("szAgencyType", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.category",
                  defaultMessage: "Agency Category"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    name: "szAgencyCategory",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.szAgencyCategory,
                    placeholder: intl.formatMessage({
                      id: "label.collector.category",
                      defaultMessage: "Agency Category"
                    }),
                    onChange: (e) => handleChangeCollector(
                      "szAgencyCategory",
                      e.target.value
                    ),
                    width: "100%"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.supervisor",
                  defaultMessage: "Supervisor Code"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "COLLCDE",
                    setSelectedValue: (dataValue) => {
                      handleChangeCollector("szSupervisorCode", dataValue || "");
                    },
                    selectedValue: collectorDto.szSupervisorCode,
                    selectedColumn: "szCollectorCode",
                    gridDefObj: gridCollectorDefObj,
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 220,
                    searchBoxHeight: 30,
                    searchBoxFontSize: 12
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.isSupervisor",
                  defaultMessage: "Is Supervisor"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    checked: isSupervisor,
                    onChange: (e) => handleChangeCollector(
                      "szIsSupervisor",
                      e.target.checked ? "Y" : "N"
                    )
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.maxCases",
                  defaultMessage: "Max Cases"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.lnMaxCases,
                    placeholder: intl.formatMessage({
                      id: "label.collector.maxCases",
                      defaultMessage: "Max Cases"
                    }),
                    onChange: (e) => handleChangeCollector("lnMaxCases", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.shiftStart",
                  defaultMessage: "Shift Start (HH:MM)"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    type: "time",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.szShiftStart,
                    placeholder: intl.formatMessage({
                      id: "label.collector.shiftStart",
                      defaultMessage: "HH:MM"
                    }),
                    onChange: (e) => handleChangeCollector("szShiftStart", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.shiftEnd",
                  defaultMessage: "Shift End (HH:MM)"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    type: "time",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.szShiftEnd,
                    placeholder: intl.formatMessage({
                      id: "label.collector.shiftEnd",
                      defaultMessage: "HH:MM"
                    }),
                    onChange: (e) => handleChangeCollector("szShiftEnd", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.canHandleReceipt",
                  defaultMessage: "Handles Receipt Book"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    checked: canHandleReceiptBook,
                    onChange: (e) => handleChangeCollector(
                      "szHandlesReceiptBooksYN",
                      e.target.checked ? "Y" : "N"
                    )
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.canIssueReceipt",
                  defaultMessage: "Issue Receipt"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    checked: canIssueReceipt,
                    onChange: (e) => handleChangeCollector(
                      "szIssueReceiptYN",
                      e.target.checked ? "Y" : "N"
                    )
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.cashLimit",
                  defaultMessage: "Cash Limit"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.dbCashLimit,
                    placeholder: intl.formatMessage({
                      id: "label.collector.cashLimit",
                      defaultMessage: "Cash Limit"
                    }),
                    onChange: (e) => handleChangeCollector("dbCashLimit", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.adhocCashLimit",
                  defaultMessage: "Adhoc Cash Limit"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: collectorDto.dbAdhocCashLimit,
                    placeholder: intl.formatMessage({
                      id: "label.collector.adhocCashLimit",
                      defaultMessage: "Adhoc Cash Limit"
                    }),
                    onChange: (e) => handleChangeCollector(
                      "dbAdhocCashLimit",
                      e.target.value
                    )
                  }
                )
              }
            ) })
          ] })
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { elevation: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dt,
        {
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 16,
            height: "100%",
            boxSizing: "border-box"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Typography,
              {
                variant: "subtitle2",
                color: "text.secondary",
                gutterBottom: true,
                children: intl.formatMessage({
                  id: "label.collector.addressDetails",
                  defaultMessage: "Address Details"
                })
              }
            ) }),
            [
              {
                id: "label.collector.szAddress1",
                defaultMessage: "Address 1",
                name: "szAddress1",
                ph: "label.collector.szAddress1"
              },
              {
                id: "label.collector.szAddress2",
                defaultMessage: "Address 2",
                name: "szAddress2",
                ph: "label.collector.szAddress2"
              },
              {
                id: "label.collector.szAddress3",
                defaultMessage: "Address 3",
                name: "szAddress3",
                ph: "label.collector.szAddress3"
              },
              {
                id: "label.collector.szAddress4",
                defaultMessage: "Address 4",
                name: "szAddress4",
                ph: "label.collector.szAddress4"
              }
            ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: field.id,
                  defaultMessage: field.defaultMessage
                }),
                required: field.required,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    required: field.required,
                    value: addressDto[field.name],
                    placeholder: intl.formatMessage({
                      id: field.ph,
                      defaultMessage: field.defaultMessage
                    }),
                    onChange: (e) => handleChangeAddress(field.name, e.target.value)
                  }
                )
              }
            ) }, field.name)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szCity",
                  defaultMessage: "City"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szCity,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szCity",
                      defaultMessage: "City"
                    }),
                    onChange: (e) => handleChangeAddress("szCity", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szZip",
                  defaultMessage: "Zip"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szZip,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szZip",
                      defaultMessage: "Zip Code"
                    }),
                    onChange: (e) => handleChangeAddress("szZip", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szState",
                  defaultMessage: "State"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szState,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szState",
                      defaultMessage: "State"
                    }),
                    onChange: (e) => handleChangeAddress("szState", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szCountry",
                  defaultMessage: "Country"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szCountry,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szCountry",
                      defaultMessage: "Country"
                    }),
                    onChange: (e) => handleChangeAddress("szCountry", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Typography,
              {
                variant: "subtitle2",
                color: "text.secondary",
                gutterBottom: true,
                sx: { mt: 1 },
                children: intl.formatMessage({
                  id: "label.collector.contactDetails",
                  defaultMessage: "Contact Details"
                })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szPhone1",
                  defaultMessage: "Phone"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    type: "phone",
                    value: addressDto.szPhone1,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szPhone1",
                      defaultMessage: "Phone Number"
                    }),
                    onChange: (e) => handleChangeAddress("szPhone1", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szFax",
                  defaultMessage: "Fax"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    type: "phone",
                    value: addressDto.szFax,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szFax",
                      defaultMessage: "Fax Number"
                    }),
                    onChange: (e) => handleChangeAddress("szFax", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szMobileNo",
                  defaultMessage: "Mobile No"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    type: "phone",
                    value: addressDto.szMobileNo,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szMobileNo",
                      defaultMessage: "Mobile Number"
                    }),
                    onChange: (e) => handleChangeAddress("szMobileNo", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szPagerNo",
                  defaultMessage: "Pager No"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szPagerNo,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szPagerNo",
                      defaultMessage: "Pager Number"
                    }),
                    onChange: (e) => handleChangeAddress("szPagerNo", e.target.value)
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectorLabelFieldRow,
              {
                labelId: intl.formatMessage({
                  id: "label.collector.szMailId",
                  defaultMessage: "Email"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    width: "100%",
                    align: lE.TEXT,
                    editable: true,
                    value: addressDto.szMailId,
                    placeholder: intl.formatMessage({
                      id: "label.collector.szMailId",
                      defaultMessage: "Email Address"
                    }),
                    onChange: (e) => handleChangeAddress("szMailId", e.target.value)
                  }
                )
              }
            ) })
          ] })
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onReset: handleReset,
        onClose: handleClose
      }
    )
  ] });
};
export {
  CollectorMasterScreen as default
};
