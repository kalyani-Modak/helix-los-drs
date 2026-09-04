import { bx as React, cB as cc, eh as useNavigate, dN as reactExports, ed as useIntl, ct as ar, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, dK as ps, bH as SE, b0 as Lg, cy as bu, cj as Vg, aX as Kr } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { F as FeeMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const FeeMasterCheckboxRenderer = (params) => {
  const checked = params.value === true || params.value === "Y";
  const handleChange = (e) => {
    e.stopPropagation();
    params.node.setDataValue(params.colDef.field, e.target.checked);
  };
  const handleCellClick = (e) => {
    e.stopPropagation();
  };
  return React.createElement(cc, {
    checked,
    onChange: handleChange,
    onClick: handleCellClick,
    label: "",
    margin: "15px",
    align: "center"
  });
};
const createDropdownFormatter = (metaData, t) => (params) => {
  const item = metaData == null ? void 0 : metaData.find((m) => m.Code === params.value);
  return item ? t(item.Desc) : params.value;
};
function buildFeeMasterColumnDefs(intl, metaData, t, defaultWaiveAmount) {
  var _a, _b, _c, _d;
  ((_b = (_a = metaData.PMTHEAD) == null ? void 0 : _a[0]) == null ? void 0 : _b.Code) || "";
  return [
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.FeeCode",
        defaultMessage: "Fee Code"
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
        defaultMessage: "Description"
      }),
      field: "feeDesc",
      width: 220,
      editable: true,
      filter: false,
      required: true,
      sortable: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.PaymentHead",
        defaultMessage: "Payment Head"
      }),
      field: "paymentHead",
      width: 220,
      editable: true,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ((_c = metaData.PMTHEAD) == null ? void 0 : _c.map((item) => item.Code)) || []
      },
      valueFormatter: createDropdownFormatter(metaData.PMTHEAD, t)
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.FeeWaivers",
        defaultMessage: "Fee Waivers"
      }),
      headerClass: "center-header",
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Allowed",
            defaultMessage: "Allowed"
          }),
          field: "waiveAllowed",
          width: 100,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Auth",
            defaultMessage: "Auth"
          }),
          field: "waiveAuth",
          width: 100,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.AllowWhat",
            defaultMessage: "Allow What"
          }),
          field: "waiveAmount",
          width: 200,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ((_d = metaData.FEEWAIVESTATUS) == null ? void 0 : _d.map((item) => item.Code)) || []
          },
          valueFormatter: createDropdownFormatter(metaData.FEEWAIVESTATUS, t),
          defaultValue: defaultWaiveAmount
        }
      ]
    },
    {
      headerName: intl.formatMessage({
        id: "label.FeeMaster.AllowedCharges",
        defaultMessage: "Charges"
      }),
      headerClass: "center-header",
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Allowed",
            defaultMessage: "Allowed"
          }),
          field: "chargeAllowed",
          width: 110,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer
        },
        {
          headerName: intl.formatMessage({
            id: "label.FeeMaster.Auth",
            defaultMessage: "Auth"
          }),
          field: "chargeAuth",
          width: 110,
          editable: false,
          filter: false,
          cellRenderer: FeeMasterCheckboxRenderer
        }
      ]
    }
  ];
}
const FeeMasterScreen = () => {
  var _a;
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [originalRowData, setOriginalRowData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [metaData, setMetaData] = reactExports.useState({
    FEE_TYPE: [],
    PMTHEAD: [],
    FEEWAIVESTATUS: []
  });
  const [selectedFeeType, setSelectedFeeType] = reactExports.useState("");
  const intl = useIntl();
  const toast = ar();
  const [defaultWaiveAmount, setDefaultWaiveAmount] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  reactExports.useEffect(() => {
    if (metaData.FEEWAIVESTATUS && metaData.FEEWAIVESTATUS.length > 0) {
      setDefaultWaiveAmount(metaData.FEEWAIVESTATUS[0].Code);
    }
  }, [metaData.FEEWAIVESTATUS]);
  const t = (key) => key ? intl.formatMessage({ id: key, defaultMessage: key }) : "";
  const fetchMetaData = async () => {
    var _a2;
    try {
      setLoading(true);
      const res = await Kr.GET(
        FeeMasterAPI.feeMaster(screenMenuId),
        {}
      );
      if ((_a2 = res.data) == null ? void 0 : _a2.responseJson) {
        setMetaData(res.data.responseJson);
        setSelectedFeeType("");
        setLoading(false);
      } else {
        toast.error("No meta data found.");
      }
    } catch (err) {
      console.error("Error fetching fee meta data:", err);
      toast.error("Error fetching fee meta data.");
    }
  };
  reactExports.useEffect(() => {
    fetchMetaData();
  }, []);
  const handleFetch = async () => {
    var _a2;
    if (!selectedFeeType) {
      toast.error(
        intl.formatMessage({
          id: "error.feeType.required",
          defaultMessage: "Please select a fee type."
        })
      );
      return;
    }
    setLoading(true);
    try {
      const res = await Kr.GET(
        `${FeeMasterAPI.feeMaster(screenMenuId)}/fetchFeeMaster?szFeeType=${selectedFeeType}`
      );
      if (Array.isArray((_a2 = res.data) == null ? void 0 : _a2.responseJson)) {
        const mapped = res.data.responseJson.map((item, index) => ({
          id: item.szFeeCode || `row-${Date.now()}-${index}`,
          feeCode: item.szFeeCode ?? "",
          feeDesc: item.szFeeDesc ?? "",
          paymentHead: item.szPmtHeadType ?? "",
          waiveAllowed: item.szWaiveable === "Y",
          waiveAuth: item.szWaiveAuthYn === "Y",
          waiveAmount: item.szWaivableAmt ?? "",
          chargeAllowed: item.szChargeable === "Y",
          chargeAuth: item.szChrgAuthYn === "Y",
          mode: "E"
        }));
        setRowData(mapped);
        setOriginalRowData(JSON.parse(JSON.stringify(mapped)));
      } else {
        toast.error("Unexpected data format received.");
        setRowData([]);
      }
    } catch (err) {
      console.error("Error fetching Fee Master:", err);
      toast.error("Error fetching fee details.");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    var _a2, _b, _c, _d;
    if (!selectedFeeType) {
      toast.error(
        intl.formatMessage({
          id: "error.feeType.fetchFirst",
          defaultMessage: "Select the fee type and fetch the data first"
        })
      );
      return { success: false };
    }
    const buildRow = (row, mode) => ({
      szFeeCode: row.feeCode,
      szFeeDesc: row.feeDesc,
      szChargeable: row.chargeAllowed ? "Y" : "N",
      szChrgAuthYn: row.chargeAuth ? "Y" : "N",
      szWaiveable: row.waiveAllowed ? "Y" : "N",
      szWaiveAuthYn: row.waiveAuth ? "Y" : "N",
      szWaivableAmt: row.waiveAmount || "",
      szFeeType: selectedFeeType,
      szPmtHeadType: row.paymentHead || "",
      szMode: mode,
      szUserId: "ADMIN"
    });
    const payload = [
      ...newRows.map((row) => buildRow(row, "N")),
      ...updatedRows.map((row) => buildRow(row, "E")),
      ...deletedRows.map((row) => buildRow(row, "D"))
    ];
    if (payload.length === 0) {
      toast.error("Nothing to save.");
      return;
    }
    try {
      const res = await Kr.POST(
        FeeMasterAPI.feeMaster(screenMenuId),
        payload
      );
      setTimeout(async () => {
        await handleFetch();
      }, 100);
      return { success: true };
    } catch (err) {
      console.error("Error saving Fee Master:", err);
      if ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.errors) {
        handleValidationErrors(intl, toast, err.response.data.errors);
      } else {
        toast.error(((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || "Error saving fee details.");
      }
      return { success: false };
    }
  };
  const handleDelete = (selectedRows) => {
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select at least one row to delete.");
      return;
    }
    const updated = rowData.map(
      (row) => selectedRows.includes(row) ? row.mode === "N" ? null : { ...row, mode: "D" } : row
    ).filter(Boolean);
    setRowData(updated);
  };
  const feeTypeOptions = reactExports.useMemo(
    () => {
      var _a2;
      return ((_a2 = metaData.FEE_TYPE) == null ? void 0 : _a2.map((item) => ({
        label: t(item.Desc),
        value: item.Code
      }))) || [];
    },
    [metaData.FEE_TYPE, t]
  );
  const columnDefs = reactExports.useMemo(
    () => buildFeeMasterColumnDefs(intl, metaData, t, defaultWaiveAmount),
    [intl, metaData, t, defaultWaiveAmount]
  );
  reactExports.useEffect(() => {
    if (gridRef.current && defaultWaiveAmount) {
      const checkAndSetDefaultValues = () => {
        var _a2;
        const api = (_a2 = gridRef.current) == null ? void 0 : _a2.api;
        if (!api) return;
        api.forEachNode((node) => {
          const row = node.data;
          if (row.mode === "N" && (!row.waiveAmount || row.waiveAmount === "")) {
            node.setDataValue("waiveAmount", defaultWaiveAmount);
          }
        });
      };
      const timeoutId = setTimeout(checkAndSetDefaultValues, 100);
      const intervalId = setInterval(checkAndSetDefaultValues, 100);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [defaultWaiveAmount, rowData]);
  const handleReset = () => {
    setRowData(JSON.parse(JSON.stringify(originalRowData)));
    return { success: true };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-master-header-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-type-wrapper", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          vp,
          {
            title: intl.formatMessage({
              id: "label.FeeMaster.title",
              defaultMessage: "Fee Master"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            className: "fee-master-description",
            value: intl.formatMessage({
              id: "label.FeeMaster.titleDesc",
              defaultMessage: "Configure fee codes, charge & waive permissions, and authorization requirements per business unit and fee type."
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "fee-master-controls", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-type-wrapper", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.FeeMaster.FeeType",
              defaultMessage: "FEE TYPE"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-master-fetch-button", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "feeType",
              options: feeTypeOptions,
              value: selectedFeeType,
              onChange: (e) => setSelectedFeeType(e.target.value),
              placeholder: intl.formatMessage({
                id: "label.FeeMaster.feeTypePlaceholder",
                defaultMessage: "Select fee type"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              variant: "contained",
              onClick: handleFetch,
              label: "label.common.fetch",
              defaultMessage: "FETCH",
              sx: { height: "28px" }
            }
          )
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "fee-master-stack", loading, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          pagination: true,
          paginationPageSize: 10,
          sort: true,
          rowSelection: "multiple",
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onDelete: handleDelete,
          onSave: handleSave,
          getRowId: (params) => params.data.id,
          gridClassName: "fee-master-ag-host",
          gridStyle: { width: "100%", marginTop: "20px" }
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
          onClose: () => navigate("/homelayout/welcomepage"),
          onReset: handleReset
        }
      )
    ] })
  ] });
};
export {
  FeeMasterScreen as default
};
