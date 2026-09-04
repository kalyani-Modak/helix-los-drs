import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, dK as ps, bH as SE, b0 as Lg, cs as ap, cy as bu, cj as Vg, aX as Kr, cB as cc } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { o as TransactionMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
const getTransactionMasterColumnDefs = (intl, paymentTypeOptions, translateDesc, renderCheckBox) => {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Code",
        defaultMessage: "Code"
      }),
      field: "szTransactionCode",
      flex: 1,
      editable: true,
      sortable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Description",
        defaultMessage: "Description"
      }),
      field: "szTransactionDesc",
      flex: 3,
      editable: true,
      sortable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Type",
        defaultMessage: "Type"
      }),
      field: "szPaymentType",
      flex: 1.5,
      editable: true,
      sortable: true,
      filter: false,
      required: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: paymentTypeOptions.map((opt) => opt.Code)
      },
      valueFormatter: (params) => {
        const opt = paymentTypeOptions.find(
          (o) => o.Code === params.value
        );
        return opt ? translateDesc(opt.Desc) : params.value;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Credit",
        defaultMessage: "Credit"
      }),
      field: "chCreditYn",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      cellRenderer: renderCheckBox("chCreditYn")
    },
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Payment",
        defaultMessage: "Payment"
      }),
      field: "chPaymentYn",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      cellRenderer: renderCheckBox("chPaymentYn")
    },
    {
      headerName: intl.formatMessage({
        id: "label.TransactionMaster.Active",
        defaultMessage: "Active"
      }),
      field: "chActive",
      width: 90,
      editable: false,
      sortable: true,
      filter: false,
      isCheckbox: true,
      cellRenderer: renderCheckBox("chActive")
    }
  ];
};
const TransactionMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [systemOptions, setSystemOptions] = reactExports.useState([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = reactExports.useState([]);
  const [selectedSystem, setSelectedSystem] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const translations = (key) => key ? intl.formatMessage({ id: key, defaultMessage: key }) : "";
  const normalize = (item) => ({
    Code: item.szCondition ?? "",
    Desc: item.szi18nDesc || item.szCondition || ""
  });
  const renderCheckBox = (field) => (params) => {
    var _a;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dt,
      {
        onMouseDown: (e) => e.stopPropagation(),
        onClick: (e) => e.stopPropagation(),
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          // Force transparent background
          "&:hover": {
            backgroundColor: "transparent"
            // Prevent hover background on wrapper
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          cc,
          {
            checked: ((_a = params.data) == null ? void 0 : _a[field]) === "Y",
            label: "",
            onChange: (e) => {
              const value = e.target.checked ? "Y" : "N";
              params.node.setDataValue(field, value);
              params.node.setData({
                ...params.data,
                [field]: value,
                mode: params.data.mode || "E"
              });
            }
          }
        )
      }
    );
  };
  const columnDefs = reactExports.useMemo(() => getTransactionMasterColumnDefs(intl, paymentTypeOptions, translations, renderCheckBox), [intl.locale, paymentTypeOptions]);
  const fetchInitial = () => {
    setLoading(true);
    Kr.GET(TransactionMasterAPI.TransactionMaster(screenMenuId) + `/initialFetch`).then((res) => {
      var _a;
      const responseJson = (_a = res.data) == null ? void 0 : _a.responseJson;
      if (responseJson && Array.isArray(responseJson.lstLegacySystem) && responseJson.lstLegacySystem.length > 0) {
        const normalizedSystems = responseJson.lstLegacySystem.map(normalize);
        const normalizedPaymentTypes = Array.isArray(responseJson.lstPaymentTypes) ? responseJson.lstPaymentTypes.map(normalize) : [];
        setSystemOptions(normalizedSystems);
        setPaymentTypeOptions(normalizedPaymentTypes);
        setSelectedSystem(normalizedSystems[0].Code);
      } else {
        toast.warn(
          intl.formatMessage({
            id: "label.TransactionMaster.noSystemOptions",
            defaultMessage: "No system options available"
          })
        );
      }
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "label.TransactionMaster.fetchSystemError",
          defaultMessage: "Error while fetching system options"
        })
      );
    }).finally(() => {
      setLoading(false);
    });
  };
  reactExports.useEffect(() => {
    fetchInitial();
  }, [intl.locale]);
  const handleSystemChange = (event) => {
    setSelectedSystem(event.target.value);
  };
  const handleFetchData = () => {
    if (!selectedSystem) {
      toast.warn(
        intl.formatMessage({
          id: "label.TransactionMaster.selectSystem",
          defaultMessage: "Please select a system first"
        })
      );
      return;
    }
    setLoading(true);
    Kr.GET(TransactionMasterAPI.TransactionMaster(screenMenuId) + `?szSystem=${selectedSystem}`).then((res) => {
      var _a;
      const responseJson = (_a = res.data) == null ? void 0 : _a.responseJson;
      if (!responseJson) {
        setRowData([]);
        toast.warn(
          intl.formatMessage({
            id: "label.TransactionMaster.noData",
            defaultMessage: "No transaction data found for selected system"
          })
        );
        return;
      }
      const transactions = Array.isArray(responseJson == null ? void 0 : responseJson.lstTransactionMaster) ? responseJson.lstTransactionMaster : [];
      setRowData(
        transactions.map((item) => ({
          ...item,
          chCreditYn: item.chCreditYn ?? "N",
          chPaymentYn: item.chPaymentYn ?? "N",
          chActive: item.chActive ?? "Y"
        }))
      );
    }).catch(() => {
      setRowData([]);
      toast.error(
        intl.formatMessage({
          id: "label.TransactionMaster.fetchError",
          defaultMessage: "Error while fetching transaction data"
        })
      );
    }).finally(() => {
      setLoading(false);
    });
  };
  const handleSave = ({ newRows, updatedRows, deletedRows }) => {
    const allChanges = [...newRows, ...updatedRows, ...deletedRows];
    if (newRows.length === 0 && updatedRows.length === 0 && deletedRows.length === 0) {
      toast.warning(
        intl.formatMessage({
          id: "label.TransactionMaster.noChanges",
          defaultMessage: "No changes to save"
        })
      );
      return;
    }
    const transactionMasterDtoArray = allChanges.map((row) => {
      var _a, _b, _c;
      return {
        szTransactionCode: ((_a = row.szTransactionCode) == null ? void 0 : _a.trim()) || "",
        szTransactionDesc: ((_b = row.szTransactionDesc) == null ? void 0 : _b.trim()) || "",
        chCreditYn: row.chCreditYn === "Y" || row.chCreditYn === true ? "Y" : "N",
        chPaymentYn: row.chPaymentYn === "Y" || row.chPaymentYn === true ? "Y" : "N",
        // ✅ Send raw Code (szCondition) to backend — never the translated label
        szPaymentType: ((_c = paymentTypeOptions.find((opt) => opt.Code === row.szPaymentType)) == null ? void 0 : _c.Code) || "",
        chActive: row.chActive === "Y" || row.chActive === true ? "Y" : "N",
        szMode: row.mode || "E",
        szUser: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM"
      };
    });
    const payload = {
      szSystem: selectedSystem || "",
      transactionMasterDto: transactionMasterDtoArray
    };
    return Kr.POST(
      TransactionMasterAPI.TransactionMaster(screenMenuId),
      payload
    ).then((response) => {
      const resData = response.data;
      if (resData.status === "Success") {
        handleFetchData();
        return { success: true };
      } else if (resData.message === "Validation Failed") {
        handleValidationErrors(intl, toast, resData.responseJson);
        return {};
      } else {
        return { success: false };
      }
    }).catch((error) => {
      var _a, _b;
      return { success: false, message: ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
        id: "label.TransactionMaster.saveError",
        defaultMessage: "Error while saving Transaction Master"
      }) };
    });
  };
  const systemName = reactExports.useMemo(() => {
    const opt = systemOptions.find((o) => o.Code === selectedSystem);
    return opt ? translations(opt.Desc) : "";
  }, [selectedSystem, systemOptions, intl.locale]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "transaction-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "transaction-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.TransactionMaster.title",
            defaultMessage: "Transaction Master"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: "transaction-master-description", children: intl.formatMessage({
        id: "label.TransactionMaster.subtitle",
        defaultMessage: "Configure transaction parameters per host system. Keep these in sync with the host or downstream modules may misbehave."
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "transaction-master-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "transaction-master-toolbar-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.TransactionMaster.SystemCode",
              defaultMessage: "System Code"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "System Code",
            value: selectedSystem,
            onChange: handleSystemChange,
            options: systemOptions.map((opt) => ({
              value: opt.Code,
              label: translations(opt.Desc)
            })),
            width: "180px",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "transaction-master-fetch-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: "Fetch",
          onClick: handleFetchData,
          sx: {
            minWidth: "90px",
            height: "34px"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "transaction-master-toolbar-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          className: "transaction-master-system-name-label",
          value: intl.formatMessage({
            id: "label.TransactionMaster.SystemName",
            defaultMessage: "System Name"
          })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          value: systemName,
          editable: false
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "transaction-master-grid-host", loading, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "100%", height: "57vh", minHeight: "360px" },
          pagination: true,
          paginationPageSize: 10,
          onSave: handleSave,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          rowDragging: false,
          rowSelection: "multiple"
        },
        intl.locale
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { close: true }
        }
      )
    ] })
  ] });
};
export {
  TransactionMaster as default
};
