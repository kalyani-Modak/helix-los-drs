import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, bC as ResultCategoryMasterAPI, dB as jsxRuntimeExports, cB as cc, ac as Dt, cx as bp, ep as vp, dK as ps, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const isSuccessFlag = (v) => v === "Y" || v === true;
const checkboxCellStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
const ResultCategoryMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const location = useLocation();
  const ScreenMenuId = location.state.menuId;
  intl.formatMessage({
    id: "label.ResultCategoryMaster.pageHeaderTitle",
    defaultMessage: "Result Categories"
  });
  const fetchResultCategoryData = reactExports.useCallback(() => {
    Kr.GET(ResultCategoryMasterAPI.ResultCategoryDetails(ScreenMenuId)).then((res) => {
      const payload = res.data;
      const responseArray = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.responseJson) || [];
      if (Array.isArray(responseArray)) {
        const enrichedData = responseArray.map((item) => ({
          ...item,
          szSuccess: item.szSuccess ?? "N",
          szValidPTP: item.szValidPTP ?? item.szPTP ?? "N",
          szRPCYN: item.szRPCYN ?? "N"
        }));
        setRowData(enrichedData);
      } else {
        toast.warn(
          intl.formatMessage({
            id: "label.ResultCategoryMaster.fetch.invalidResponse",
            defaultMessage: "Could not load result categories data."
          })
        );
      }
    }).catch((error) => {
      console.error("Failed to fetch Result Categories:", error);
      toast.error(
        intl.formatMessage({
          id: "label.ResultCategoryMaster.fetch.error",
          defaultMessage: "Error while fetching result categories."
        })
      );
    });
  }, [intl, toast]);
  reactExports.useEffect(() => {
    fetchResultCategoryData();
  }, [fetchResultCategoryData]);
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.ResultCategory",
          defaultMessage: "Result Category"
        }),
        field: "szCategoryCode",
        width: 160,
        editable: true,
        sortable: true,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.Description",
          defaultMessage: "Description"
        }),
        field: "szCategoryDesc",
        flex: 1,
        minWidth: 200,
        editable: true,
        sortable: true,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.Successful",
          defaultMessage: "Successful"
        }),
        field: "szSuccess",
        width: 120,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          cc,
          {
            label: "",
            align: "center",
            margin: "15px",
            checked: isSuccessFlag(params.value),
            onChange: (e) => {
              const checked = e.target.checked;
              if (!checked) {
                params.node.setDataValue("szValidPTP", "N");
                params.node.setDataValue("szRPCYN", "N");
              }
              params.node.setDataValue("szSuccess", checked ? "Y" : "N");
            }
          }
        )
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.PTP",
          defaultMessage: "PTP"
        }),
        field: "szValidPTP",
        width: 90,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => {
          var _a;
          const successful = isSuccessFlag((_a = params.data) == null ? void 0 : _a.szSuccess);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              label: "",
              align: "center",
              margin: "15px",
              checked: isSuccessFlag(params.value),
              disabled: !successful,
              onChange: (e) => {
                params.node.setDataValue(
                  "szValidPTP",
                  e.target.checked ? "Y" : "N"
                );
              }
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.RightPartyContacted",
          defaultMessage: "Right Party Contacted"
        }),
        field: "szRPCYN",
        width: 160,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => {
          var _a;
          const successful = isSuccessFlag((_a = params.data) == null ? void 0 : _a.szSuccess);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              label: "",
              align: "center",
              margin: "15px",
              checked: isSuccessFlag(params.value),
              disabled: !successful,
              onChange: (e) => {
                params.node.setDataValue(
                  "szRPCYN",
                  e.target.checked ? "Y" : "N"
                );
              }
            }
          );
        }
      }
    ],
    [intl.locale]
  );
  const handleSave = ({ newRows, updatedRows, deletedRows }) => {
    const allChanges = [...newRows, ...updatedRows, ...deletedRows];
    const activeRows = allChanges.filter((row) => row.mode !== "D");
    const seenCodes = /* @__PURE__ */ new Set();
    for (const row of activeRows) {
      const codeKey = (row.szCategoryCode ?? "").trim().toUpperCase();
      if (seenCodes.has(codeKey)) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.resultCategory.duplicateCategory",
              defaultMessage: "Duplicate result category: {code}"
            },
            { code: (row.szCategoryCode ?? "").trim() }
          )
        );
      }
      seenCodes.add(codeKey);
    }
    const lstResultCategories = allChanges.map((row) => {
      var _a, _b;
      const successY = isSuccessFlag(row.szSuccess);
      let ptp = row.szValidPTP === "Y" || row.szValidPTP === true ? "Y" : "N";
      let rpc = row.szRPCYN === "Y" || row.szRPCYN === true ? "Y" : "N";
      if (!successY) {
        ptp = "N";
        rpc = "N";
      }
      return {
        szCategoryCode: ((_a = row.szCategoryCode) == null ? void 0 : _a.trim()) || "",
        szCategoryDesc: ((_b = row.szCategoryDesc) == null ? void 0 : _b.trim()) || "",
        szSuccess: successY ? "Y" : "N",
        szValidPTP: ptp,
        szRPCYN: rpc,
        szMode: row.mode || "E"
      };
    });
    return Kr.POST(
      ResultCategoryMasterAPI.ResultCategoryDetails(ScreenMenuId),
      lstResultCategories
    ).then((response) => {
      const resData = response.data;
      if (resData.status === "Success") {
        fetchResultCategoryData();
        return { success: true };
      }
      if (resData == null ? void 0 : resData.errors) {
        handleValidationErrors(intl, toast, resData.errors);
      }
      toast.error(
        resData.message || intl.formatMessage({
          id: "label.ResultCategoryMaster.save.failed",
          defaultMessage: "Failed to save Result Category Master"
        })
      );
    }).catch((error) => {
      var _a, _b;
      toast.error(
        ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "label.ResultCategoryMaster.save.error",
          defaultMessage: "Error while saving result categories."
        })
      );
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "result-category-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "result-category-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.ResultCategoryMaster.pageHeaderTitle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.ResultCategoryMaster.pageHeaderDescription",
            defaultMessage: "Group result codes by category. PTP and Right Party Contacted only apply when the category is Successful."
          }),
          align: "left",
          colon: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "result-category-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData,
        columnDefs,
        gridStyle: { width: "100%", height: "55vh", minHeight: "360px" },
        pagination: true,
        paginationPageSize: 10,
        sort: true,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        rowDragging: false,
        onSave: handleSave,
        addCheckBoxes: false,
        gridClassName: "drs-list-grid",
        embeddedInSection: true
      },
      intl.locale
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: () => {
          var _a, _b;
          return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
        },
        onClose: () => navigate("/homelayout/welcomepage")
      }
    )
  ] });
};
export {
  ResultCategoryMaster as default
};
