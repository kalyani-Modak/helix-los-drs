import { dN as reactExports, ed as useIntl, ct as ar, eh as useNavigate, ef as useLocation, cI as dayjs, aX as Kr, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, ac as Dt, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { H as HolidayMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const HolidayMaster = () => {
  const [rowData, setRowData] = reactExports.useState([]);
  const [holidayTypeOptions, setHolidayTypeOptions] = reactExports.useState([]);
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const columnDefs = [
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.HolidayDate",
        defaultMessage: "Holiday Date"
      }),
      field: "dtHoliday",
      editable: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
      },
      width: 220,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) => p.value ? dayjs(p.value).format("YYYY-MM-DD") : "",
      valueParser: (p) => p.newValue ? new Date(p.newValue) : null
    },
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.Description",
        defaultMessage: "Description"
      }),
      field: "szHolidayDesc",
      editable: true,
      width: 220,
      filter: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.HolidayMaster.Type",
        defaultMessage: "Type"
      }),
      field: "szType",
      width: 194,
      filter: false,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: holidayTypeOptions.map((opt) => opt.szCondition)
      },
      valueSetter: (params) => {
        params.data.szType = params.newValue;
        return true;
      },
      valueFormatter: (params) => {
        const option = holidayTypeOptions.find(
          (opt) => opt.szCondition === params.value
        );
        if (!option) return params.value;
        return option.szi18nDesc ? intl.formatMessage({
          id: option.szi18nDesc,
          // "label.HolidayMaster.National"
          defaultMessage: option.szCondition
          // fallback to "N" if key missing
        }) : params.value;
      }
    }
  ];
  reactExports.useEffect(() => {
    Kr.GET(
      HolidayMasterAPI.Holidays(screenMenuId)
    ).then((res) => {
      var _a;
      const wrapper = ((_a = res.data) == null ? void 0 : _a.responseJson) || {};
      const holidays = wrapper.lstHolidayDTO || [];
      const holidayTypes = wrapper.lstHolidayTypes || [];
      setHolidayTypeOptions(holidayTypes);
      setRowData(
        holidays.map((row) => ({
          ...row,
          dtHoliday: row.dtHoliday ? new Date(row.dtHoliday) : null
        }))
      );
    });
  }, []);
  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    var _a;
    try {
      const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
      const payload = [...newRows, ...updatedRows, ...deletedRows].map(
        (row) => {
          const mode = row.mode || "U";
          return {
            dtHoliday: row.dtHoliday ? dayjs(row.dtHoliday).format("YYYY-MM-DD") : null,
            szHolidayDesc: row.szHolidayDesc,
            szType: row.szType,
            szMode: mode,
            ...mode === "N" ? { szCreatedBy: userCode } : { szModifiedBy: userCode }
          };
        }
      );
      const res = await Kr.POST(
        HolidayMasterAPI.Holidays(screenMenuId),
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
            id: "message.HolidayMaster.SaveError",
            defaultMessage: "Holiday Save failed"
          })
        );
        return { success: false };
      }
      toast.success(
        intl.formatMessage({
          id: "message.HolidayMaster.SaveSuccess",
          defaultMessage: "Holiday saved successfully"
        })
      );
      return { success: true };
    } catch (e) {
      const data = (_a = e == null ? void 0 : e.response) == null ? void 0 : _a.data;
      if (data == null ? void 0 : data.message) {
        toast.error(data.message);
        return { success: false };
      }
      toast.error(
        intl.formatMessage({
          id: "message.HolidayMaster.SaveError",
          defaultMessage: "Holiday Save failed"
        })
      );
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.HolidayMaster.title" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "60%", height: "50vh", margin: "10px auto" },
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
  HolidayMaster as default
};
