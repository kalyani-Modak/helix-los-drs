import { dN as reactExports, ed as useIntl, ct as ar, eh as useNavigate, ef as useLocation, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, dK as ps, bH as SE, w as Button, ac as Dt, cy as bu, cj as Vg, aX as Kr } from "./index-BhdgJqva.js";
import { e as HostCodeMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const HostCodeMaster = () => {
  const [rowData, setRowData] = reactExports.useState([]);
  const [selectedType, setSelectedType] = reactExports.useState("");
  const [codeTypes, setCodeTypes] = reactExports.useState([]);
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [gridKey, setGridKey] = reactExports.useState(0);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const columnDefs = [
    {
      headerName: "Seq No",
      field: "inHostCodeSeqNo",
      hide: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.HostCodeMaster.HostCode",
        defaultMessage: "Host Code"
      }),
      field: "szCode",
      width: 200,
      required: true,
      editable: (params) => {
        var _a, _b;
        return !((_a = params.data) == null ? void 0 : _a.inHostCodeSeqNo) || ((_b = params.data) == null ? void 0 : _b.szMode) === "N";
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.HostCodeMaster.Description",
        defaultMessage: "Host Code Description"
      }),
      field: "szDescription",
      width: 343,
      required: true,
      editable: true
    }
  ];
  const fetchCodeTypes = async () => {
    var _a, _b, _c;
    try {
      const response = await Kr.GET(HostCodeMasterAPI.HostCode(screenMenuId));
      if (((_a = response.data) == null ? void 0 : _a.status) === "Success") {
        const types = ((_b = response.data.responseJson) == null ? void 0 : _b.lstCodeTypes) || [];
        setCodeTypes(types);
        if (types.length > 0 && !selectedType) {
          setSelectedType(types[0].szCondition);
        }
      } else {
        toast.error(
          ((_c = response.data) == null ? void 0 : _c.message) || intl.formatMessage({
            id: "message.HostCodeMaster.error.fetchTypes",
            defaultMessage: "Failed to fetch code types"
          })
        );
      }
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.fetchTypes",
          defaultMessage: "Failed to fetch code types"
        })
      );
    }
  };
  const fetchHostCodeDetails = async (type) => {
    var _a;
    try {
      const response = await Kr.GET(HostCodeMasterAPI.HostCode(screenMenuId) + `/fetchHostCodeDetails?szType=${type}`);
      const data = ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.responseJson) || [];
      const formattedData = Array.isArray(data) ? data.map((row) => ({
        ...row,
        szMode: "E"
      })) : [];
      setRowData([...formattedData]);
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.fetchDetails",
          defaultMessage: "Failed to fetch host codes"
        })
      );
      setRowData([]);
    }
  };
  reactExports.useEffect(() => {
    fetchCodeTypes();
  }, []);
  reactExports.useEffect(() => {
    if (selectedType) {
      fetchHostCodeDetails(selectedType);
    }
  }, [selectedType]);
  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    try {
      const mappedRows = [
        ...newRows.map((row) => ({
          inHostCodeSeqNo: null,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "N"
        })),
        ...updatedRows.map((row) => ({
          inHostCodeSeqNo: row.inHostCodeSeqNo,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "E"
        })),
        ...deletedRows.map((row) => ({
          inHostCodeSeqNo: row.inHostCodeSeqNo,
          szCode: row.szCode,
          szDescription: row.szDescription,
          szLegacySystem: "LGCY",
          szPartitionCode: row.szPartitionCode || "",
          szMode: "D"
        }))
      ];
      if (mappedRows.length === 0) {
        toast.warning(
          intl.formatMessage({
            id: "message.HostCodeMaster.warning.noChanges",
            defaultMessage: "No changes to save"
          })
        );
        return { success: false };
      }
      const payload = {
        szType: selectedType,
        lstHostCodeMasterDtos: mappedRows
      };
      const response = await Kr.POST(
        HostCodeMasterAPI.HostCode(screenMenuId),
        payload
      );
      const data = response == null ? void 0 : response.data;
      if ((data == null ? void 0 : data.status) !== "Success") {
        if (data == null ? void 0 : data.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "message.HostCodeMaster.error.saveFailed",
              defaultMessage: "Save failed"
            })
          );
        }
        return { success: false };
      }
      toast.success(
        (data == null ? void 0 : data.message) || intl.formatMessage({
          id: "message.HostCodeMaster.success.save",
          defaultMessage: "Host Code saved successfully"
        })
      );
      await fetchHostCodeDetails(selectedType);
      setGridKey((prev) => prev + 1);
      return { success: true };
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "message.HostCodeMaster.error.saveFailed",
          defaultMessage: "Host Code save failed"
        })
      );
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.HostCodeMaster.title" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 2, p: "10px 20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.HostCodeMaster.Type",
            defaultMessage: "Code Type"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          name: "CodeType",
          value: selectedType,
          width: "200px",
          options: codeTypes.map((type) => ({
            value: type.szCondition,
            label: type.szi18nDesc ? intl.formatMessage({
              id: type.szi18nDesc,
              defaultMessage: type.szCondition
            }) : type.szCondition
          })),
          onChange: (e) => setSelectedType(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", children: intl.formatMessage({
        id: "button.HostCodeMaster.fetch",
        defaultMessage: "FETCH"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "50%", height: "50vh", margin: "10px auto" },
          pagination: true,
          paginationPageSize: 10,
          allowAdd: true,
          allowUpdate: true,
          allowDelete: true,
          addCheckBoxes: true,
          onSave: handleSave
        },
        gridKey
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
  HostCodeMaster as default
};
