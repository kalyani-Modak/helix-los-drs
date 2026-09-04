import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, dN as reactExports, ac as Dt, dK as ps, cs as ap, bH as SE, cJ as dc, bI as SEARCH_API_ENDPOINTS, bG as Rp, bt as PropTypes, ct as ar, ef as useLocation, aX as Kr, cy as bu, ds as gridUserCodeDefObj, dr as gridSupervisorCodeDefObj$2, bu as RE, ce as TuneOutlined, d as AccountTreeOutlined, cw as bE, b0 as Lg, eh as useNavigate, cc as Tooltip, cx as bp, ep as vp, cj as Vg } from "./index-BhdgJqva.js";
import { a as GroupConfigAPI } from "./apiEndpoints-BEKhabSg.js";
const DeleteOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
}));
const FormatListBulletedOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5m0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5m0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5M7 19h14v-2H7zm0-6h14v-2H7zm0-8v2h14V5z"
}));
const gridSupervisorCodeDefObj$1 = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 180,
    gridColumnHeight: 20
  },
  {
    gridMappingName: "collectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 350,
    gridColumnHeight: 20
  }
];
const toSafeString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value.label === "string") return value.label;
    if (typeof value.value === "string") return value.value;
    return "";
  }
  return "";
};
const normalizeSearchValue = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value.value === "string") return value.value;
    if (typeof value.code === "string") return value.code;
    if (typeof value.collectorcode === "string") return value.collectorcode;
    return "";
  }
  return "";
};
const buildOptions = (intl, emptyId, emptyDefault, options) => [
  {
    value: "",
    label: intl.formatMessage({ id: emptyId, defaultMessage: emptyDefault })
  },
  ...options.map((opt) => ({
    value: toSafeString(opt == null ? void 0 : opt.value),
    label: toSafeString(opt == null ? void 0 : opt.label)
  }))
];
const GroupConfigTab = ({
  group,
  onChange,
  hasSubGroups,
  groupTypeOptions,
  allocationTypeOptions
}) => {
  const intl = useIntl();
  const searchInitRef = reactExports.useRef({
    groupId: null,
    supervisor: false
  });
  if (!group) return null;
  if (searchInitRef.current.groupId !== group.id) {
    searchInitRef.current = {
      groupId: group.id,
      supervisor: false
    };
  }
  const patch = (field, value) => {
    onChange({
      ...group,
      [field]: value,
      mode: group.mode === "N" ? "N" : "E"
    });
  };
  const typeOptions = buildOptions(
    intl,
    "label.groupAllocationMaster.selectType",
    "Select type",
    groupTypeOptions
  );
  const allocOptions = buildOptions(
    intl,
    "label.groupAllocationMaster.selectAllocationType",
    "Select allocation type",
    allocationTypeOptions
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-parent-banner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { style: { backgroundColor: "transparent" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-config-parent-banner-label", style: { backgroundColor: "transparent" }, children: intl.formatMessage({
          id: "label.groupAllocationMaster.parent",
          defaultMessage: "Parent"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-config-parent-banner-hint", style: { backgroundColor: "transparent" }, children: intl.formatMessage({
          id: "label.groupAllocationMaster.parentHint",
          defaultMessage: "System-derived from sub-group configuration"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `group-config-drawer-badge${hasSubGroups ? " is-parent" : ""}`, children: hasSubGroups ? intl.formatMessage({
        id: "label.groupAllocationMaster.parentYes",
        defaultMessage: "Yes · Parent"
      }) : intl.formatMessage({
        id: "label.groupAllocationMaster.parentNo",
        defaultMessage: "No · Standalone"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "group-config-section-title", children: intl.formatMessage({
        id: "label.groupAllocationMaster.identity",
        defaultMessage: "Identity"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.groupCode",
                defaultMessage: "Group Code"
              }),
              required: true,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              id: "group-config-code",
              value: toSafeString(group.groupCode),
              editable: group.mode === "N",
              required: true,
              width: "100%",
              onChange: (e) => patch("groupCode", (e.target.value || "").toUpperCase())
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.description",
                defaultMessage: "Description"
              }),
              required: true,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              id: "group-config-description",
              value: toSafeString(group.groupDescription),
              editable: true,
              required: true,
              width: "100%",
              onChange: (e) => patch("groupDescription", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.groupType",
                defaultMessage: "Group Type"
              }),
              required: true,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "groupType",
              value: toSafeString(group.grouptype),
              onChange: (e) => patch("grouptype", e.target.value),
              options: typeOptions,
              width: "100%",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.supervisor",
                defaultMessage: "Supervisor"
              }),
              required: true,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            dc,
            {
              apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
              searchCode: "SUPERVISORCD",
              selectedValue: normalizeSearchValue(group.supervisor),
              selectedColumn: "collectorcode",
              gridDefObj: gridSupervisorCodeDefObj$1,
              gridWidth: 450,
              gridHeight: 300,
              gridNoOfRowsPerPage: 5,
              searchBoxWidth: 280,
              searchBoxHeight: 28,
              searchBoxFontSize: 11,
              error: false,
              setSelectedValue: (dataValue) => {
                if (!searchInitRef.current.supervisor) {
                  searchInitRef.current.supervisor = true;
                  return;
                }
                patch("supervisor", normalizeSearchValue(dataValue));
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.priority",
                defaultMessage: "Priority"
              }),
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              id: "group-config-priority",
              type: "number",
              value: toSafeString(group.priority),
              editable: true,
              width: "100%",
              onChange: (e) => patch("priority", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.level",
                defaultMessage: "Level"
              }),
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              id: "group-config-level",
              type: "number",
              value: toSafeString(group.level),
              editable: true,
              width: "100%",
              onChange: (e) => patch("level", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.allocationType",
                defaultMessage: "Allocation Type"
              }),
              required: true,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "allocationType",
              value: toSafeString(group.allocationtype),
              onChange: (e) => patch("allocationtype", e.target.value),
              options: allocOptions,
              width: "100%",
              required: true
            }
          )
        ] }),
        group.parentGroupCode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              className: "group-config-field-label",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.parentGroupCode",
                defaultMessage: "Parent Group Code"
              }),
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              id: "group-config-parent",
              value: toSafeString(group.parentGroupCode),
              editable: false,
              width: "100%"
            }
          )
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-toggles", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-toggle-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-config-field-label", children: intl.formatMessage({
            id: "label.groupAllocationMaster.active",
            defaultMessage: "Active"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Rp,
            {
              checked: !!group.activeYn,
              onChange: (e) => patch("activeYn", e.target.checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-toggle-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-config-field-label", children: intl.formatMessage({
            id: "label.groupAllocationMaster.exceptionGroup",
            defaultMessage: "Exception"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Rp,
            {
              checked: !!group.exceptiongroup,
              onChange: (e) => patch("exceptiongroup", e.target.checked)
            }
          )
        ] })
      ] })
    ] })
  ] });
};
GroupConfigTab.propTypes = {
  group: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  hasSubGroups: PropTypes.bool,
  groupTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  allocationTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  )
};
GroupConfigTab.defaultProps = {
  group: null,
  hasSubGroups: false,
  groupTypeOptions: [],
  allocationTypeOptions: []
};
const MODULE_CODE_DEFAULT$1 = "COL";
const BUSINESS_UNIT_CODE_DEFAULT$2 = "EXQ";
const LOGGED_IN_USER$2 = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";
const toEditedMode$1 = (mode) => mode === "N" ? "N" : "E";
const parseNumberOrEmpty = (value) => {
  if (value === "" || value === null || value === void 0) return "";
  const num = Number(value);
  return Number.isNaN(num) ? "" : num;
};
const mergeRowsById$1 = (currentRows, { newRows, updatedRows, deletedRows }) => {
  const latestById = new Map(currentRows.map((r) => [r.id, r]));
  deletedRows.forEach((r) => latestById.delete(r.id));
  [...newRows, ...updatedRows].forEach((r) => latestById.set(r.id, r));
  return Array.from(latestById.values());
};
const AllocationConfigTab = reactExports.forwardRef(function AllocationConfigTab2({ selectedGroupCode }, ref) {
  var _a;
  const [allocationRows, setAllocationRows] = reactExports.useState([]);
  const intl = useIntl();
  const toast = ar();
  const location = useLocation();
  const screenMenuId = (_a = location == null ? void 0 : location.state) == null ? void 0 : _a.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const groupUsersBaseUrl = `${allocationBaseUrl.slice(
    0,
    allocationBaseUrl.lastIndexOf("/")
  )}/group-users/${screenMenuId}`;
  const gridRef = reactExports.useRef(null);
  reactExports.useRef(/* @__PURE__ */ new Set());
  const getUsersByGroupUrl = reactExports.useCallback(
    (groupCode) => `${groupUsersBaseUrl}/group/${groupCode}`,
    [groupUsersBaseUrl]
  );
  const getSaveUsersUrl = reactExports.useCallback(
    () => `${groupUsersBaseUrl}/save`,
    [groupUsersBaseUrl]
  );
  const UserCodeSearchRenderer = (props) => {
    const { value, node } = props;
    const isInitialized = reactExports.useRef(false);
    const normalizeSearchValue2 = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") {
        return String(raw);
      }
      if (typeof raw === "object") {
        if (typeof raw.szcollectorcode === "string") return raw.szcollectorcode;
        if (typeof raw.collectorcode === "string") return raw.collectorcode;
        if (typeof raw.szcollectorname === "string") return raw.szcollectorname;
        if (typeof raw.usercode === "string") return raw.usercode;
        if (typeof raw.value === "string") return raw.value;
        if (typeof raw.code === "string") return raw.code;
        return "";
      }
      return "";
    };
    const handleSetValue = (dataValue) => {
      var _a2;
      if (!isInitialized.current) {
        isInitialized.current = true;
        return;
      }
      const newValue = normalizeSearchValue2(dataValue);
      node.setDataValue("userCode", newValue);
      if (((_a2 = node.data) == null ? void 0 : _a2.mode) !== "N") node.data.mode = "E";
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
        searchCode: "USERCD",
        setSelectedValue: handleSetValue,
        selectedValue: normalizeSearchValue2(value),
        selectedColumn: "collectorcode",
        gridDefObj: gridUserCodeDefObj,
        gridWidth: 450,
        gridHeight: 300,
        gridNoOfRowsPerPage: 5,
        searchBoxWidth: 140,
        searchBoxHeight: 30,
        searchBoxFontSize: 11,
        error: false
      }
    );
  };
  const fetchAllocationsForGroup = reactExports.useCallback(
    async (groupCode) => {
      var _a2, _b;
      if (!groupCode) {
        setAllocationRows([]);
        return;
      }
      try {
        const url = getUsersByGroupUrl(groupCode);
        const res = await Kr.GET(url);
        if (!((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.success)) {
          toast.error(
            ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) || intl.formatMessage({
              id: "error.fetchAllocation",
              defaultMessage: "Error while fetching Allocation data."
            })
          );
          return;
        }
        const userData = res.data.data || [];
        if (Array.isArray(userData)) {
          setAllocationRows(
            userData.map((item, index) => ({
              id: `${item.groupCode || item.szGroupCode}-${item.userCode || item.szUserCode}-${index}`,
              groupCode: item.groupCode || item.szGroupCode || groupCode,
              userCode: item.userCode || item.szUserCode || item.userName || "",
              percentage: item.percentageCapacity || item.percentage || "",
              mode: ""
            }))
          );
        }
      } catch (err) {
        console.error("Fetch Allocation failed:", err);
        toast.error(
          intl.formatMessage({
            id: "error.fetchAllocation",
            defaultMessage: "Error while fetching Allocation data."
          })
        );
      }
    },
    [intl, toast, getUsersByGroupUrl]
  );
  reactExports.useEffect(() => {
    fetchAllocationsForGroup(selectedGroupCode);
  }, [selectedGroupCode, fetchAllocationsForGroup]);
  const totalPercentage = reactExports.useMemo(
    () => allocationRows.reduce(
      (sum, row) => sum + (Number(row.percentage) || 0),
      0
    ),
    [allocationRows]
  );
  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    setAllocationRows(
      (prev) => prev.map(
        (row) => row.id === data.id ? {
          ...row,
          [colDef.field]: newValue,
          mode: toEditedMode$1(row.mode)
        } : row
      )
    );
  };
  const handleAllocationSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    var _a2, _b, _c, _d;
    try {
      const rows = [...newRows, ...updatedRows, ...deletedRows];
      if (rows.length === 0) {
        return { success: true };
      }
      const deletedRowIds = new Set(deletedRows.map((r) => r.id));
      const invalidPercentage = rows.find((row) => {
        if (deletedRowIds.has(row.id)) return false;
        const percentage = Number(row.percentage);
        return percentage > 100;
      });
      if (invalidPercentage) {
        toast.error(
          intl.formatMessage({
            id: "error.percentageExceeds100",
            defaultMessage: "Percentage cannot be greater than 100!"
          })
        );
        return { success: false };
      }
      const latest = mergeRowsById$1(allocationRows, {
        newRows,
        updatedRows,
        deletedRows
      });
      const total = latest.reduce(
        (sum, row) => sum + (Number(row.percentage) || 0),
        0
      );
      if (total > 100) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.totalPercentageExceeds100",
              defaultMessage: "Total percentage cannot exceed 100%! Current total: {total}%"
            },
            { total: total.toFixed(2) }
          )
        );
        return { success: false };
      }
      const payload = rows.map((row) => {
        const mode = deletedRowIds.has(row.id) ? "D" : row.mode || (newRows.includes(row) ? "N" : "E");
        return {
          moduleCode: MODULE_CODE_DEFAULT$1,
          businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT$2,
          groupCode: row.groupCode || selectedGroupCode,
          userCode: row.userCode || "",
          percentageCapacity: Number(row.percentage) || 0,
          createdBy: LOGGED_IN_USER$2,
          modifiedBy: LOGGED_IN_USER$2,
          mode
        };
      });
      const response = await Kr.POST(
        getSaveUsersUrl(),
        payload
      );
      if ((_a2 = response.data) == null ? void 0 : _a2.success) {
        toast.success(
          response.data.message || intl.formatMessage({
            id: "success.allocationSaved",
            defaultMessage: "Allocation saved successfully!"
          })
        );
        fetchAllocationsForGroup(selectedGroupCode);
        return { success: true };
      }
      toast.error(
        ((_b = response.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.saveFailed",
          defaultMessage: "Failed to save allocation."
        })
      );
      return { success: false };
    } catch (err) {
      console.error("Failed to save allocation:", err);
      toast.error(
        ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
          id: "error.saveData",
          defaultMessage: "Error while saving data."
        })
      );
      return { success: false };
    }
  };
  reactExports.useImperativeHandle(ref, () => ({
    submitChanges: () => {
      var _a2, _b;
      return (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
    },
    reload: () => fetchAllocationsForGroup(selectedGroupCode)
  }));
  const allocationColumns = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupCode",
        defaultMessage: "Group Code"
      }),
      field: "groupCode",
      editable: false,
      hide: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.user",
        defaultMessage: "User"
      }),
      field: "userCode",
      editable: false,
      flex: 1,
      required: true,
      cellRenderer: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserCodeSearchRenderer, { ...p })
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.percentage",
        defaultMessage: "Percentage"
      }),
      field: "percentage",
      editable: true,
      flex: 1,
      required: true,
      cellEditor: "agTextCellEditor",
      valueParser: (params) => {
        if (!params) return "";
        return parseNumberOrEmpty(params.newValue);
      }
    }
  ];
  const getDefaultAllocationRow = () => ({
    moduleCode: MODULE_CODE_DEFAULT$1,
    businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT$2,
    groupCode: selectedGroupCode,
    userCode: "",
    percentage: "",
    mode: "N"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-config-allocation-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "group-config-allocation-title", style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: intl.formatMessage({
          id: "label.groupAllocationMaster.groupCodePrefix",
          defaultMessage: "Group Code"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: selectedGroupCode || "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "group-config-allocation-hint", children: intl.formatMessage({
        id: "label.groupAllocationMaster.allocationHint",
        defaultMessage: "Distribute accounts across users. Total must not exceed 100%."
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: allocationRows,
        setRowData: setAllocationRows,
        columnDefs: allocationColumns,
        gridStyle: { width: "100%", height: "320px" },
        pagination: true,
        paginationPageSize: 10,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        onCellValueChanged: handleCellEdit,
        defaultNewRowData: getDefaultAllocationRow,
        onSave: handleAllocationSave
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dt,
      {
        className: `group-config-allocation-total${totalPercentage === 100 ? " is-ok" : " is-warn"}`,
        children: intl.formatMessage(
          {
            id: "label.groupAllocationMaster.allocationTotal",
            defaultMessage: "Total: {total}%"
          },
          { total: totalPercentage }
        )
      }
    )
  ] });
});
AllocationConfigTab.propTypes = {
  selectedGroupCode: PropTypes.string
};
AllocationConfigTab.defaultProps = {
  selectedGroupCode: null
};
const LOGGED_IN_USER$1 = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";
const BUSINESS_UNIT_CODE_DEFAULT$1 = "EXQ";
const createRowKey = () => `sg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const toEditedMode = (mode) => mode === "N" ? "N" : "E";
const getRowKey = (row) => (row == null ? void 0 : row.id) ?? (row == null ? void 0 : row._rowKey);
const mergeRowsById = (currentRows, { newRows, updatedRows, deletedRows }) => {
  const latestById = new Map(
    currentRows.map((r) => [getRowKey(r), r]).filter(([key]) => key !== void 0 && key !== null)
  );
  deletedRows.forEach((r) => {
    const key = getRowKey(r);
    if (key !== void 0 && key !== null) latestById.delete(key);
  });
  [...newRows, ...updatedRows].forEach((r) => {
    const key = getRowKey(r);
    if (key !== void 0 && key !== null) latestById.set(key, r);
  });
  return Array.from(latestById.values());
};
const SubGroupConfigTab = reactExports.forwardRef(function SubGroupConfigTab2({ selectedGroupCode, parentGroupCode, groupTypeOptions = [] }, ref) {
  var _a;
  const [subGroupAllocationRows, setSubGroupAllocationRows] = reactExports.useState([]);
  const intl = useIntl();
  const toast = ar();
  const location = useLocation();
  const screenMenuId = (_a = location == null ? void 0 : location.state) == null ? void 0 : _a.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const gridRef = reactExports.useRef(null);
  const isNested = Boolean(parentGroupCode);
  const fetchSubGroup = reactExports.useCallback(
    async (groupCode) => {
      var _a2, _b;
      if (!groupCode || isNested) {
        setSubGroupAllocationRows([]);
        return;
      }
      try {
        const url = `${allocationBaseUrl}/fetch-sub-group/${groupCode}`;
        const res = await Kr.GET(url);
        if (!((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.success)) {
          toast.error(
            ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) || intl.formatMessage({
              id: "error.fetchSubGroupsAllocation",
              defaultMessage: "Error while fetching sub groups data."
            })
          );
          return;
        }
        const subGroupData = res.data.data || [];
        if (Array.isArray(subGroupData)) {
          setSubGroupAllocationRows(
            subGroupData.map((item, index) => ({
              id: `${item.groupCode || item.szGroupCode}-${index}`,
              _rowKey: createRowKey(),
              groupCode: item.groupCode || item.szGroupCode || "",
              businessUnitCode: item.businessUnitCode || BUSINESS_UNIT_CODE_DEFAULT$1,
              groupDescription: item.groupDescription || "",
              groupType: item.groupType || item.grouptype || "",
              supervisor: item.supervisor || "",
              activeYn: item.activeYn === "Y" || item.activeYn === true,
              percentage: item.percentageCapacity || "",
              maxAllocatedTaskCount: item.maxAllocatedTaskCount || "",
              mode: ""
            }))
          );
        }
      } catch (err) {
        console.error("Fetch sub Groups failed:", err);
        toast.error(
          intl.formatMessage({
            id: "error.fetchsubGroupAllocation",
            defaultMessage: "Error while fetching sub groups data."
          })
        );
      }
    },
    [intl, toast, isNested]
  );
  reactExports.useEffect(() => {
    fetchSubGroup(selectedGroupCode);
  }, [selectedGroupCode, fetchSubGroup]);
  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    const rowKey = (data == null ? void 0 : data.id) ?? (data == null ? void 0 : data._rowKey);
    if (!rowKey) return;
    setSubGroupAllocationRows(
      (prev) => prev.map(
        (row) => (row.id ?? row._rowKey) === rowKey ? {
          ...row,
          [colDef.field]: newValue,
          mode: toEditedMode(row.mode)
        } : row
      )
    );
  };
  const handleSubGroupAllocationSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    var _a2, _b, _c, _d;
    try {
      const rows = [...newRows, ...updatedRows, ...deletedRows];
      if (rows.length === 0) {
        return { success: true };
      }
      const deletedRowKeys = new Set(
        deletedRows.map((r) => r.id ?? r._rowKey)
      );
      const invalidPercentage = rows.find((row) => {
        const rowKey = row.id ?? row._rowKey;
        if (deletedRowKeys.has(rowKey)) return false;
        const percentage = Number(row.percentage);
        return percentage > 100;
      });
      if (invalidPercentage) {
        toast.error(
          intl.formatMessage({
            id: "error.percentageExceeds100",
            defaultMessage: "Percentage cannot be greater than 100!"
          })
        );
        return { success: false };
      }
      const latestRows = mergeRowsById(subGroupAllocationRows, {
        newRows,
        updatedRows,
        deletedRows
      });
      const totalPercentage = latestRows.reduce(
        (sum, row) => sum + (Number(row.percentage) || 0),
        0
      );
      if (totalPercentage > 100) {
        toast.warning(
          intl.formatMessage({
            id: "error.invalidPercentage",
            defaultMessage: "Enter valid percentage"
          })
        );
        return { success: false };
      }
      const payload = rows.map((row) => {
        const rowKey = row.id ?? row._rowKey;
        const mode = deletedRowKeys.has(rowKey) ? "D" : row.mode || (newRows.includes(row) ? "N" : "E");
        return {
          groupCode: row.groupCode,
          parentGroupCode: selectedGroupCode,
          businessUnitCode: row.businessUnitCode || BUSINESS_UNIT_CODE_DEFAULT$1,
          groupDescription: row.groupDescription || "",
          groupType: row.groupType || "",
          supervisor: row.supervisor || "",
          activeYn: row.activeYn ? "Y" : "N",
          percentageCapacity: Number(row.percentage) || 0,
          maxAllocatedTaskCount: row.maxAllocatedTaskCount,
          modifiedBy: LOGGED_IN_USER$1,
          mode
        };
      });
      const response = await Kr.POST(
        `${allocationBaseUrl}/update-sub-groups`,
        payload
      );
      if ((_a2 = response.data) == null ? void 0 : _a2.success) {
        toast.success(
          response.data.message || intl.formatMessage({
            id: "success.subGroupAllocationSaved",
            defaultMessage: "Sub group allocation saved successfully!"
          })
        );
        fetchSubGroup(selectedGroupCode);
        return { success: true };
      }
      toast.error(
        ((_b = response.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.saveFailed",
          defaultMessage: "Failed to save sub group allocation."
        })
      );
      return { success: false };
    } catch (err) {
      console.error("Failed to save sub group allocation:", err);
      toast.error(
        ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
          id: "error.saveData",
          defaultMessage: "Error while saving data."
        })
      );
      return { success: false };
    }
  };
  reactExports.useImperativeHandle(ref, () => ({
    submitChanges: () => {
      var _a2, _b;
      if (isNested) return Promise.resolve({ success: true });
      return (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
    },
    reload: () => fetchSubGroup(selectedGroupCode)
  }));
  if (isNested) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-config-nesting-locked", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          className: "group-config-nesting-locked-title",
          value: intl.formatMessage({
            id: "label.groupAllocationMaster.nestingLocked",
            defaultMessage: "Nesting locked"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "group-config-nesting-locked-body", children: intl.formatMessage(
        {
          id: "label.groupAllocationMaster.nestingLockedHint",
          defaultMessage: 'This group is already a sub-group of "{code}". Only one level of nesting is supported.'
        },
        { code: parentGroupCode }
      ) })
    ] });
  }
  const SearchRenderer = (props) => {
    const {
      node,
      column,
      value,
      searchCode,
      selectedColumn,
      gridDefObj,
      searchBoxWidth = 140,
      searchBoxHeight = 25,
      searchBoxFontSize = 11
    } = props;
    const isInitialized = reactExports.useRef(false);
    const normalizeSearchValue2 = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
      if (typeof raw === "object") {
        if (typeof raw.value === "string") return raw.value;
        if (typeof raw.code === "string") return raw.code;
        if (typeof raw.collectorcode === "string") return raw.collectorcode;
        if (typeof raw.hierarchycode === "string") return raw.hierarchycode;
        return "";
      }
      return "";
    };
    if (!node || !column) return null;
    const handleSetValue = (dataValue) => {
      var _a2;
      if (!isInitialized.current) {
        isInitialized.current = true;
        return;
      }
      const newValue = normalizeSearchValue2(dataValue);
      node.setDataValue(column.getColId(), newValue);
      if (((_a2 = node.data) == null ? void 0 : _a2.mode) !== "N") node.data.mode = "E";
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
        searchCode,
        selectedValue: normalizeSearchValue2(value),
        selectedColumn,
        gridDefObj,
        gridWidth: 450,
        gridHeight: 300,
        gridNoOfRowsPerPage: 5,
        searchBoxWidth,
        searchBoxHeight,
        searchBoxFontSize,
        error: false,
        setSelectedValue: handleSetValue
      }
    );
  };
  const allocationColumns = [
    {
      headerName: intl.formatMessage({
        id: "label.subGroupAllocationMaster.groupCode",
        defaultMessage: "Group Code"
      }),
      field: "groupCode",
      flex: 0.8,
      editable: true,
      valueParser: (params) => String((params == null ? void 0 : params.newValue) ?? "").toUpperCase()
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.description",
        defaultMessage: "Description"
      }),
      field: "groupDescription",
      flex: 1,
      editable: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupType",
        defaultMessage: "Group Type"
      }),
      field: "groupType",
      flex: 1,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: groupTypeOptions.map((o) => o.value)
      },
      valueFormatter: (p) => {
        var _a2;
        return ((_a2 = groupTypeOptions.find((o) => o.value === p.value)) == null ? void 0 : _a2.label) ?? p.value;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.supervisor",
        defaultMessage: "Supervisor"
      }),
      field: "supervisor",
      flex: 1,
      editable: false,
      cellRenderer: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SearchRenderer, { ...p }),
      cellRendererParams: {
        searchCode: "SUPERVISORCD",
        selectedColumn: "collectorcode",
        gridDefObj: gridSupervisorCodeDefObj$2,
        searchBoxWidth: 160,
        searchBoxHeight: 30,
        searchBoxFontSize: 11
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.active",
        defaultMessage: "Active"
      }),
      field: "activeYn",
      width: 60,
      editable: false,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRenderer: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Rp,
        {
          checked: !!p.value,
          onChange: (e) => {
            var _a2, _b;
            const next = e.target.checked;
            (_b = (_a2 = p.node) == null ? void 0 : _a2.setDataValue) == null ? void 0 : _b.call(_a2, "activeYn", next);
            if (p.data && p.data.mode !== "N") {
              p.data.mode = "E";
            }
            handleCellEdit({
              data: p.data,
              colDef: { field: "activeYn" },
              newValue: next,
              oldValue: p.value
            });
          }
        }
      )
    }
  ];
  const getDefaultsSubGroupAllocationRow = () => ({
    _rowKey: createRowKey(),
    groupCode: "",
    businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT$1,
    groupDescription: "",
    groupType: "",
    supervisor: "",
    activeYn: true,
    percentage: "",
    maxAllocatedTaskCount: "",
    mode: "N"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group-config-allocation-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "group-config-section-title", children: intl.formatMessage({
        id: "label.subGroupAllocationMaster.subGroupConfig",
        defaultMessage: "Sub Group Configuration"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "group-config-allocation-hint", children: intl.formatMessage(
        {
          id: "label.groupAllocationMaster.subGroupHint",
          defaultMessage: "One level of sub-groups is allowed under this parent. {count} configured."
        },
        { count: subGroupAllocationRows.length }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: subGroupAllocationRows,
        setRowData: setSubGroupAllocationRows,
        columnDefs: allocationColumns,
        gridStyle: { width: "100%", height: "320px" },
        pagination: true,
        paginationPageSize: 10,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        onCellValueChanged: handleCellEdit,
        defaultNewRowData: getDefaultsSubGroupAllocationRow,
        onSave: handleSubGroupAllocationSave
      }
    )
  ] });
});
SubGroupConfigTab.propTypes = {
  selectedGroupCode: PropTypes.string,
  parentGroupCode: PropTypes.string
};
SubGroupConfigTab.defaultProps = {
  selectedGroupCode: null,
  parentGroupCode: ""
};
const TABS = [
  {
    key: "group",
    labelId: "label.groupAllocationMaster.tabGroupConfig",
    defaultLabel: "Group Configuration",
    icon: TuneOutlined
  },
  {
    key: "allocation",
    labelId: "label.groupAllocationMaster.tabAllocationConfig",
    defaultLabel: "Allocation Configuration",
    icon: AccountTreeOutlined
  },
  {
    key: "subgroups",
    labelId: "label.subGroupAllocationMaster.subGroupConfig",
    defaultLabel: "Sub Group Configuration",
    icon: FormatListBulletedOutlined
  }
];
const PANEL_STYLE = { height: "100%" };
const getGroupCodeLabel = (groupCode, intl) => {
  if (groupCode && groupCode.trim() !== "") return groupCode;
  return intl.formatMessage({
    id: "label.groupAllocationMaster.newGroup",
    defaultMessage: "New group"
  }) || "New group";
};
const GroupConfigDrawer = ({
  open,
  onClose,
  onSave,
  group,
  hasSubGroups,
  groupTypeOptions,
  allocationTypeOptions,
  onGroupChange,
  allocationRef,
  subGroupRef,
  initialTab = "group"
}) => {
  var _a;
  const intl = useIntl();
  const [activeTab, setActiveTab] = reactExports.useState(initialTab);
  const [cachedGroup, setCachedGroup] = reactExports.useState(group);
  const localAllocationRef = reactExports.useRef(null);
  const localSubGroupRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab, group == null ? void 0 : group.id]);
  reactExports.useEffect(() => {
    if (group) setCachedGroup(group);
  }, [group]);
  const bindRef = (localRef, externalRef) => (node) => {
    localRef.current = node;
    if (externalRef) externalRef.current = node;
  };
  const bindAllocationRef = bindRef(localAllocationRef, allocationRef);
  const bindSubGroupRef = bindRef(localSubGroupRef, subGroupRef);
  if (!cachedGroup) return null;
  const displayGroup = group || cachedGroup;
  const typeLabel = ((_a = groupTypeOptions.find((o) => o.value === displayGroup.grouptype)) == null ? void 0 : _a.label) || displayGroup.grouptype || "";
  const tabPanels = {
    group: /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupConfigTab,
      {
        group: displayGroup,
        onChange: onGroupChange,
        hasSubGroups,
        groupTypeOptions,
        allocationTypeOptions
      }
    ),
    allocation: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AllocationConfigTab,
      {
        ref: bindAllocationRef,
        selectedGroupCode: displayGroup.groupCode
      }
    ),
    subgroups: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubGroupConfigTab,
      {
        ref: bindSubGroupRef,
        selectedGroupCode: displayGroup.groupCode,
        parentGroupCode: displayGroup.parentGroupCode,
        groupTypeOptions
      }
    )
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      className: "group-config-drawer-overlay",
      style: { display: open ? "flex" : "none" },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-drawer-paper", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-drawer-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-drawer-title-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-config-drawer-code", children: getGroupCodeLabel(displayGroup.groupCode, intl) }),
            typeLabel ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-config-drawer-badge", children: typeLabel }) : null,
            hasSubGroups ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-config-drawer-badge is-parent", children: intl.formatMessage({
              id: "label.groupAllocationMaster.parentBadge",
              defaultMessage: "Parent"
            }) }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "group-config-drawer-desc", children: displayGroup.groupDescription || intl.formatMessage({
            id: "label.groupAllocationMaster.configureHint",
            defaultMessage: "Configure this group's identity, allocation, and sub-groups."
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-config-drawer-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RE, { value: activeTab, onChange: (e, val) => setActiveTab(val), className: "group-config-drawer-tabs", children: TABS.map((tab) => {
            const TabIcon = tab.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              bE,
              {
                value: tab.key,
                className: `group-config-drawer-tab${activeTab === tab.key ? " is-active" : ""}`,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TabIcon, { className: "group-config-drawer-tab-icon", "aria-hidden": "true" }),
                iconPosition: "start",
                label: intl.formatMessage({
                  id: tab.labelId,
                  defaultMessage: tab.defaultLabel
                })
              },
              tab.key
            );
          }) }),
          TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              style: { ...PANEL_STYLE, display: activeTab === tab.key ? "block" : "none" },
              children: tabPanels[tab.key]
            },
            `panel-${tab.key}`
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-config-drawer-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: intl.formatMessage({
              id: "label.groupAllocationMaster.save",
              defaultMessage: "Save"
            }),
            onClick: onSave
          }
        ) })
      ] })
    }
  );
};
GroupConfigDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  group: PropTypes.object,
  hasSubGroups: PropTypes.bool,
  groupTypeOptions: PropTypes.array,
  allocationTypeOptions: PropTypes.array,
  onGroupChange: PropTypes.func.isRequired,
  allocationRef: PropTypes.shape({ current: PropTypes.any }),
  subGroupRef: PropTypes.shape({ current: PropTypes.any }),
  initialTab: PropTypes.string
};
GroupConfigDrawer.defaultProps = {
  group: null,
  hasSubGroups: false,
  groupTypeOptions: [],
  allocationTypeOptions: [],
  allocationRef: null,
  subGroupRef: null,
  initialTab: "group"
};
const MODULE_CODE_DEFAULT = "COL";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";
const gridSupervisorCodeDefObj = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 180,
    gridColumnHeight: 20
  },
  {
    gridMappingName: "collectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 350,
    gridColumnHeight: 20
  }
];
const mapApiGroupToRow = (item, index) => ({
  id: item.groupCode || `row-${index}`,
  groupCode: item.groupCode || "",
  groupDescription: item.groupDescription || "",
  priority: item.priority ?? "",
  level: item.level ?? "",
  activeYn: item.activeYn === "Y",
  grouptype: item.groupType || "",
  supervisor: item.supervisor || "",
  exceptiongroup: item.exceptionGroup === "Y",
  allocationtype: item.allocationType || "",
  parentGroupCode: item.parentGroupCode || "",
  parentYn: item.parentYn === "Y",
  maxAllocatedTaskCount: item.maxAllocatedTaskCount ?? "",
  percentageCapacity: item.percentageCapacity ?? "",
  mode: ""
});
const createEmptyGroup = () => ({
  id: `new-${Date.now()}`,
  moduleCode: MODULE_CODE_DEFAULT,
  businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
  groupCode: "",
  groupDescription: "",
  priority: "",
  level: "",
  grouptype: "",
  supervisor: "",
  exceptiongroup: false,
  allocationtype: "",
  activeYn: true,
  mode: "N",
  _isDraftNew: true,
  parentGroupCode: "",
  parentYn: false
});
const UppercaseTextEditor = reactExports.forwardRef(function UppercaseTextEditor2(props, ref) {
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a, _b, _c;
    (_a = inputRef.current) == null ? void 0 : _a.focus();
    (_c = (_b = inputRef.current) == null ? void 0 : _b.select) == null ? void 0 : _c.call(_b);
  }, []);
  reactExports.useImperativeHandle(ref, () => ({
    getValue: () => {
      var _a;
      return (((_a = inputRef.current) == null ? void 0 : _a.value) || "").toUpperCase();
    }
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      ref: inputRef,
      className: "ag-input-field-input ag-text-field-input",
      style: { width: "100%", height: "100%", textTransform: "uppercase" },
      defaultValue: props.value || ""
    }
  );
});
const GroupAllocationMaster = () => {
  var _a, _b;
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = (_a = location == null ? void 0 : location.state) == null ? void 0 : _a.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const gridRef = reactExports.useRef(null);
  const subGridRefs = reactExports.useRef(/* @__PURE__ */ new Map());
  const allocationRef = reactExports.useRef(null);
  const subGroupRef = reactExports.useRef(null);
  const hasFetchedOnceRef = reactExports.useRef(false);
  const [allGroups, setAllGroups] = reactExports.useState([]);
  const allGroupsRef = reactExports.useRef(allGroups);
  reactExports.useEffect(() => {
    allGroupsRef.current = allGroups;
  }, [allGroups]);
  const [groupTypeOptions, setGroupTypeOptions] = reactExports.useState([]);
  const [allocationTypeOptions, setAllocationTypeOptions] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [activeOnly, setActiveOnly] = reactExports.useState(false);
  const [withSubsOnly, setWithSubsOnly] = reactExports.useState(false);
  const [expandedParentIds, setExpandedParentIds] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const expandedParentIdsRef = reactExports.useRef(expandedParentIds);
  reactExports.useEffect(() => {
    expandedParentIdsRef.current = expandedParentIds;
  }, [expandedParentIds]);
  const [drawerGroupId, setDrawerGroupId] = reactExports.useState(null);
  const [drawerInitialTab, setDrawerInitialTab] = reactExports.useState("group");
  const syncAllGroups = reactExports.useCallback((updater) => {
    setAllGroups((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      allGroupsRef.current = next;
      return next;
    });
  }, []);
  const withEditedMode = (mode) => mode !== "N" ? "E" : mode;
  const upsertRowField = reactExports.useCallback((rowData, field, value) => {
    const normalizedValue = field === "groupCode" && typeof value === "string" ? value.toUpperCase() : value;
    syncAllGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === rowData.id);
      if (idx === -1) {
        return [
          ...prev,
          {
            ...rowData,
            [field]: normalizedValue,
            mode: "N"
          }
        ];
      }
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]: normalizedValue,
        _isDraftNew: false,
        mode: withEditedMode(next[idx].mode)
      };
      if (field === "groupCode" && !next[idx].parentGroupCode) {
        const newCode = (normalizedValue || "").trim();
        return next.map(
          (g) => g.parentRowId === rowData.id ? { ...g, parentGroupCode: newCode } : g
        );
      }
      return next;
    });
  }, [syncAllGroups]);
  const subsByParentId = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    allGroups.forEach((g) => {
      if (g.mode === "D" || g._deleted) return;
      if (!g.parentGroupCode && !g.parentRowId) return;
      let parentId = g.parentRowId;
      if (!parentId && g.parentGroupCode) {
        const parent = allGroups.find(
          (p) => !p.parentGroupCode && !p.parentRowId && p.groupCode === g.parentGroupCode
        );
        parentId = parent == null ? void 0 : parent.id;
      }
      if (!parentId) return;
      const arr = map.get(parentId) ?? [];
      arr.push(g);
      map.set(parentId, arr);
    });
    return map;
  }, [allGroups]);
  const parents = reactExports.useMemo(() => {
    const liveRows = allGroups.filter((g) => {
      if (g.mode === "D" || g._deleted) return false;
      const isBlankDraft = g._isDraftNew === true && !String(g.groupCode || "").trim() && !String(g.groupDescription || "").trim() && !String(g.grouptype || "").trim() && !String(g.supervisor || "").trim();
      return !isBlankDraft;
    });
    return liveRows.filter((g) => !g.parentGroupCode && !g.parentRowId);
  }, [allGroups]);
  const filteredParents = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return parents.filter((g) => {
      var _a2;
      if (q && ![g.groupCode, g.groupDescription, g.supervisor].some(
        (s) => s == null ? void 0 : s.toLowerCase().includes(q)
      )) {
        return false;
      }
      if (typeFilter !== "all" && g.grouptype !== typeFilter) return false;
      if (activeOnly && !g.activeYn) return false;
      if (withSubsOnly && !((_a2 = subsByParentId.get(g.id)) == null ? void 0 : _a2.length)) return false;
      return true;
    });
  }, [parents, search, typeFilter, activeOnly, withSubsOnly, subsByParentId]);
  const displayRows = reactExports.useMemo(() => {
    const rows = [];
    filteredParents.forEach((parent) => {
      const isExpanded = expandedParentIds.has(parent.id);
      const subs = subsByParentId.get(parent.id) || [];
      const subCount = subs.length;
      rows.push({
        ...parent,
        __isSubPanel: false,
        _isExpanded: isExpanded,
        _subCount: subCount
      });
      if (isExpanded) {
        rows.push({
          id: `subpanel-${parent.id}`,
          __isSubPanel: true,
          parentGroupCode: parent.groupCode,
          parentRowId: parent.id,
          parent,
          _subs: subs,
          // Mirror parent values so HAgGrid required-field validation skips this layout row.
          groupCode: parent.groupCode || "",
          groupDescription: parent.groupDescription || "",
          supervisor: parent.supervisor || "",
          grouptype: parent.grouptype || "",
          activeYn: parent.activeYn
        });
      }
    });
    return rows;
  }, [filteredParents, expandedParentIds, subsByParentId]);
  const drawerGroup = reactExports.useMemo(
    () => allGroups.find((g) => g.id === drawerGroupId) ?? null,
    [allGroups, drawerGroupId]
  );
  const drawerSubCount = drawerGroup ? ((_b = subsByParentId.get(drawerGroup.id)) == null ? void 0 : _b.length) || 0 : 0;
  const fetchGroupConfig = reactExports.useCallback(async () => {
    var _a2, _b2;
    try {
      const res = await Kr.GET(allocationBaseUrl);
      if (!((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.success)) {
        toast.error(
          ((_b2 = res == null ? void 0 : res.data) == null ? void 0 : _b2.message) || intl.formatMessage({
            id: "error.fetchGroupConfig",
            defaultMessage: "Error while fetching Group Configuration."
          })
        );
        return;
      }
      const responseData = res.data.data;
      if (!responseData) return;
      if (Array.isArray(responseData.lstGroupConfig)) {
        setGroupTypeOptions(
          responseData.lstGroupConfig.map((item) => ({
            label: item.szDesc,
            value: item.szCondition
          }))
        );
      }
      if (Array.isArray(responseData.allocationTypes)) {
        setAllocationTypeOptions(
          responseData.allocationTypes.map((item) => ({
            label: item.szDesc,
            value: item.szCondition
          }))
        );
      }
      if (Array.isArray(responseData.objGroupConfigDto)) {
        const mappedRows = responseData.objGroupConfigDto.map(
          (item, index) => mapApiGroupToRow(item, index)
        );
        setAllGroups(mappedRows);
        allGroupsRef.current = mappedRows;
      }
    } catch (err) {
      toast.error(
        intl.formatMessage({
          id: "error.fetchGroupConfig",
          defaultMessage: "Error while fetching Group Configuration."
        })
      );
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    if (hasFetchedOnceRef.current) return;
    hasFetchedOnceRef.current = true;
    fetchGroupConfig();
  }, [fetchGroupConfig]);
  const toggleExpand = reactExports.useCallback((parentId) => {
    if (!parentId) return;
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  }, []);
  const openConfigure = reactExports.useCallback((group, tab = "group") => {
    if (group == null ? void 0 : group.id) {
      setDrawerInitialTab(tab);
      setDrawerGroupId(group.id);
    }
  }, []);
  const handleDeleteSubGroup = reactExports.useCallback((sub) => {
    if (sub.mode === "N") {
      syncAllGroups((prev) => prev.filter((g) => g.id !== sub.id));
      return;
    }
    syncAllGroups(
      (prev) => prev.map(
        (g) => g.id === sub.id ? { ...g, mode: "D", _deleted: true } : g
      )
    );
  }, [syncAllGroups]);
  const formatGroupType = reactExports.useCallback(
    (value) => {
      const opt = groupTypeOptions.find((o) => o.value === value);
      return opt ? opt.label : value || "";
    },
    [groupTypeOptions]
  );
  const handleNewGroup = () => {
    const empty = createEmptyGroup();
    syncAllGroups((prev) => [empty, ...prev]);
    setDrawerGroupId(empty.id);
  };
  const handleAddSubGroup = reactExports.useCallback((parent) => {
    var _a2;
    if (!(parent == null ? void 0 : parent.id)) return;
    const parentCode = ((_a2 = parent.groupCode) == null ? void 0 : _a2.trim()) || "";
    const empty = {
      ...createEmptyGroup(),
      parentRowId: parent.id,
      parentGroupCode: parentCode,
      grouptype: parent.grouptype || "",
      supervisor: parent.supervisor || "",
      allocationtype: parent.allocationtype || "",
      mode: "N"
    };
    syncAllGroups((prev) => [...prev, empty]);
    setExpandedParentIds((prev) => new Set(prev).add(parent.id));
  }, [syncAllGroups]);
  const handleSubGroupFieldChange = reactExports.useCallback((rowData, field, value) => {
    upsertRowField(rowData, field, value);
  }, [upsertRowField]);
  const handleDrawerGroupChange = reactExports.useCallback((updated) => {
    syncAllGroups(
      (prev) => prev.map(
        (g) => g.id === updated.id ? {
          ...updated,
          _isDraftNew: false
        } : g
      )
    );
  }, [syncAllGroups]);
  const handleDrawerClose = reactExports.useCallback(() => {
    const currentId = drawerGroupId;
    if (!currentId) {
      setDrawerGroupId(null);
      return;
    }
    syncAllGroups(
      (prev) => prev.filter((g) => {
        if (g.id !== currentId) return true;
        const isUntouchedDraft = g.mode === "N" && g._isDraftNew === true && !String(g.groupCode || "").trim() && !String(g.groupDescription || "").trim() && !String(g.grouptype || "").trim() && !String(g.supervisor || "").trim();
        return !isUntouchedDraft;
      })
    );
    setDrawerGroupId(null);
  }, [drawerGroupId, syncAllGroups]);
  const collectDirtyRows = reactExports.useCallback(() => {
    const groups = allGroupsRef.current;
    const isDirtyNewRow = (g) => {
      var _a2, _b2, _c, _d, _e;
      if (g.mode !== "N") return false;
      const isSubGroup = Boolean(g.parentRowId || ((_a2 = g.parentGroupCode) == null ? void 0 : _a2.trim()));
      if (isSubGroup) {
        return Boolean(
          ((_b2 = g.groupCode) == null ? void 0 : _b2.trim()) || ((_c = g.groupDescription) == null ? void 0 : _c.trim()) || g.grouptype
        );
      }
      return Boolean(
        ((_d = g.groupCode) == null ? void 0 : _d.trim()) || ((_e = g.groupDescription) == null ? void 0 : _e.trim()) || g.grouptype
      );
    };
    const dirty = {
      newRows: groups.filter(isDirtyNewRow),
      updatedRows: groups.filter((g) => g.mode === "E"),
      deletedRows: groups.filter((g) => g.mode === "D" || g._deleted)
    };
    return dirty;
  }, []);
  const registerSubGrid = reactExports.useCallback((parentId, parentCode, node) => {
    if (node) {
      subGridRefs.current.set(parentId, { grid: node, parentCode });
      return;
    }
    subGridRefs.current.delete(parentId);
  }, []);
  const syncSubGridsToAllGroups = reactExports.useCallback(() => {
    subGridRefs.current.forEach(({ grid, parentCode }, parentId) => {
      const api = grid == null ? void 0 : grid.api;
      if (!api) return;
      const rows = [];
      api.forEachNode((node) => {
        if (node == null ? void 0 : node.data) rows.push(node.data);
      });
      if (!rows.length) return;
      syncAllGroups((prev) => {
        const parent = prev.find((g) => g.id === parentId);
        const resolvedParentCode = ((parent == null ? void 0 : parent.groupCode) || parentCode || "").trim();
        const nextById = new Map(rows.map((r) => [r.id, r]));
        const merged = prev.map((g) => {
          if (!nextById.has(g.id)) return g;
          const row = nextById.get(g.id);
          return {
            ...g,
            ...row,
            parentRowId: parentId,
            parentGroupCode: (row.parentGroupCode || resolvedParentCode || g.parentGroupCode || "").trim(),
            mode: g.mode === "N" ? "N" : "E"
          };
        });
        rows.forEach((row) => {
          if (!merged.some((g) => g.id === row.id)) {
            merged.push({
              ...row,
              parentRowId: parentId,
              parentGroupCode: resolvedParentCode,
              mode: row.mode || "N"
            });
          }
        });
        return merged;
      });
    });
  }, [syncAllGroups]);
  const flushPendingGridEdits = reactExports.useCallback(async () => {
    var _a2, _b2, _c, _d, _e;
    (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.blur) == null ? void 0 : _b2.call(_a2);
    (_e = (_d = (_c = gridRef.current) == null ? void 0 : _c.api) == null ? void 0 : _d.stopEditing) == null ? void 0 : _e.call(_d, false);
    subGridRefs.current.forEach(({ grid }) => {
      var _a3, _b3;
      (_b3 = (_a3 = grid == null ? void 0 : grid.api) == null ? void 0 : _a3.stopEditing) == null ? void 0 : _b3.call(_a3, false);
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    syncSubGridsToAllGroups();
  }, [syncSubGridsToAllGroups]);
  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (!data || newValue === oldValue) return;
    upsertRowField(data, colDef.field, newValue);
  };
  const buildSavePayload = (rows) => rows.map((row) => {
    var _a2, _b2, _c, _d, _e;
    const parentCode = ((_a2 = row.parentGroupCode) == null ? void 0 : _a2.trim()) || null;
    const isSubGroup = Boolean(parentCode);
    return {
      moduleCode: MODULE_CODE_DEFAULT,
      businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
      groupCode: (_b2 = row.groupCode) == null ? void 0 : _b2.trim(),
      groupDescription: ((_c = row.groupDescription) == null ? void 0 : _c.trim()) || "",
      priority: row.priority === "" || row.priority === null || row.priority === void 0 ? null : Number(row.priority),
      level: row.level === "" || row.level === null || row.level === void 0 ? null : Number(row.level),
      groupType: row.grouptype || null,
      supervisor: ((_d = row.supervisor) == null ? void 0 : _d.trim()) || null,
      allocationType: row.allocationtype || null,
      exceptionGroup: row.exceptiongroup ? "Y" : "N",
      activeYn: row.activeYn ? "Y" : "N",
      hierarchyCode: row.hierarchyCode || "",
      mode: row.mode || "E",
      user: LOGGED_IN_USER,
      parentGroupCode: isSubGroup ? parentCode : null,
      parentYn: isSubGroup ? "N" : row.parentYn ? "Y" : (((_e = subsByParentId.get(row.id)) == null ? void 0 : _e.length) || 0) > 0 ? "Y" : "N"
    };
  });
  const handleGroupSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    var _a2, _b2, _c, _d;
    try {
      const byId = /* @__PURE__ */ new Map();
      newRows.forEach((row) => byId.set(row.id, { ...row, mode: "N" }));
      updatedRows.forEach((row) => {
        if (!byId.has(row.id)) byId.set(row.id, { ...row, mode: "E" });
      });
      deletedRows.forEach((row) => byId.set(row.id, { ...row, mode: "D" }));
      const rows = Array.from(byId.values());
      const rowsToProcess = rows.filter((r) => {
        var _a3, _b3;
        if (r.mode === "N" && !((_a3 = r.groupCode) == null ? void 0 : _a3.trim()) && !((_b3 = r.groupDescription) == null ? void 0 : _b3.trim())) {
          return false;
        }
        return true;
      }).map((r) => {
        var _a3, _b3;
        const stateRow = allGroupsRef.current.find((g) => g.id === r.id);
        const parentFromRow = (stateRow == null ? void 0 : stateRow.parentRowId) || r.parentRowId;
        const parentCodeFromId = parentFromRow ? (_b3 = (_a3 = allGroupsRef.current.find((p) => p.id === parentFromRow)) == null ? void 0 : _a3.groupCode) == null ? void 0 : _b3.trim() : "";
        const parentCode = (r.parentGroupCode ?? (stateRow == null ? void 0 : stateRow.parentGroupCode) ?? parentCodeFromId ?? "").trim();
        return parentCode ? { ...r, parentGroupCode: parentCode } : r;
      });
      if (rowsToProcess.length === 0) {
        return { success: true };
      }
      const invalidRow = rowsToProcess.find((r) => {
        var _a3, _b3, _c2;
        if (r.mode === "D") return false;
        if (!((_a3 = r.groupCode) == null ? void 0 : _a3.trim()) || !((_b3 = r.groupDescription) == null ? void 0 : _b3.trim()) || !r.grouptype) {
          return true;
        }
        const stateRow = allGroupsRef.current.find((g) => g.id === r.id);
        const isSubGroup = Boolean(
          (r.parentGroupCode ?? (stateRow == null ? void 0 : stateRow.parentGroupCode) ?? "").trim() || (stateRow == null ? void 0 : stateRow.parentRowId) || r.parentRowId
        );
        const resolvedParentCode = (r.parentGroupCode ?? (stateRow == null ? void 0 : stateRow.parentGroupCode) ?? ((stateRow == null ? void 0 : stateRow.parentRowId) || r.parentRowId ? (_c2 = allGroupsRef.current.find((p) => p.id === ((stateRow == null ? void 0 : stateRow.parentRowId) || r.parentRowId))) == null ? void 0 : _c2.groupCode : "") ?? "").trim();
        return isSubGroup && !resolvedParentCode;
      });
      if (invalidRow) {
        toast.error(
          intl.formatMessage({
            id: "error.missingRequiredGroupFields",
            defaultMessage: "Please fill in all required fields (Group Code, Description, Group Type) before saving."
          })
        );
        return { success: false };
      }
      const payload = buildSavePayload(rowsToProcess);
      const response = await Kr.POST(
        allocationBaseUrl,
        payload
      );
      if ((_a2 = response.data) == null ? void 0 : _a2.success) {
        toast.success(
          response.data.message || intl.formatMessage({
            id: "success.groupConfigSaved",
            defaultMessage: "Group configuration saved successfully!"
          })
        );
        const expandedSnapshot = new Set(expandedParentIdsRef.current);
        const expandedGroupCodes = [...expandedSnapshot].map((id) => {
          var _a3, _b3;
          return (_b3 = (_a3 = allGroupsRef.current.find((g) => g.id === id)) == null ? void 0 : _a3.groupCode) == null ? void 0 : _b3.trim();
        }).filter(Boolean);
        await fetchGroupConfig();
        const restoredExpanded = /* @__PURE__ */ new Set();
        allGroupsRef.current.forEach((g) => {
          if (expandedSnapshot.has(g.id)) {
            restoredExpanded.add(g.id);
          } else if (g.groupCode && expandedGroupCodes.includes(g.groupCode)) {
            restoredExpanded.add(g.id);
          }
        });
        setExpandedParentIds(restoredExpanded);
        return { success: true };
      }
      toast.error(
        ((_b2 = response.data) == null ? void 0 : _b2.message) || intl.formatMessage({
          id: "error.groupConfigSaveFailed",
          defaultMessage: "Failed to save group configuration."
        })
      );
      return { success: false };
    } catch (err) {
      toast.error(
        ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
          id: "error.saveData",
          defaultMessage: "Error while saving data."
        })
      );
      return { success: false };
    }
  };
  const runTabSaves = async () => {
    var _a2, _b2, _c;
    if (!drawerGroupId) return { success: true };
    const currentDrawerGroup = allGroupsRef.current.find(
      (g) => g.id === drawerGroupId
    );
    const isExistingGroup = Boolean(
      currentDrawerGroup && currentDrawerGroup.mode !== "N" && ((_a2 = currentDrawerGroup.groupCode) == null ? void 0 : _a2.trim())
    );
    if (!isExistingGroup) {
      return { success: true };
    }
    if ((_b2 = allocationRef.current) == null ? void 0 : _b2.submitChanges) {
      const allocationResult = await allocationRef.current.submitChanges();
      if ((allocationResult == null ? void 0 : allocationResult.success) === false) {
        return { success: false };
      }
    }
    if ((_c = subGroupRef.current) == null ? void 0 : _c.submitChanges) {
      const subGroupResult = await subGroupRef.current.submitChanges();
      if ((subGroupResult == null ? void 0 : subGroupResult.success) === false) {
        return { success: false };
      }
    }
    return { success: true };
  };
  const handleMainGridSave = async (gridArgs) => {
    const { newRows = [], updatedRows = [], deletedRows = [] } = gridArgs || {};
    const stateDirty = collectDirtyRows();
    const merge = (arr1, arr2) => {
      const map = /* @__PURE__ */ new Map();
      arr1.forEach((r) => map.set(r.id, r));
      arr2.forEach((r) => map.set(r.id, r));
      return Array.from(map.values());
    };
    const finalNew = merge(stateDirty.newRows, newRows);
    const finalUpd = merge(stateDirty.updatedRows, updatedRows);
    const finalDel = merge(stateDirty.deletedRows, deletedRows);
    if (!finalNew.length && !finalUpd.length && !finalDel.length) {
      await fetchGroupConfig();
      return { success: true };
    }
    return handleGroupSave({ newRows: finalNew, updatedRows: finalUpd, deletedRows: finalDel });
  };
  const handlePageSave = async () => {
    var _a2;
    await flushPendingGridEdits();
    const tabResult = await runTabSaves();
    if (tabResult.success === false) return { success: false };
    if ((_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) {
      const res = await gridRef.current.submitChanges();
      if (res && res.success === false) return { success: false };
      return res;
    }
    return handleMainGridSave();
  };
  const handleDrawerSave = async () => {
    var _a2;
    await flushPendingGridEdits();
    const tabResult = await runTabSaves();
    if (tabResult.success === false) return { success: false };
    if ((_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) {
      const res = await gridRef.current.submitChanges();
      if (res && res.success === false) return { success: false };
      setDrawerGroupId(null);
      return res;
    }
    const result = await handleMainGridSave();
    if (result == null ? void 0 : result.success) {
      setDrawerGroupId(null);
    }
    return result;
  };
  const handleRefresh = reactExports.useCallback(async () => {
    setDrawerGroupId(null);
    await fetchGroupConfig();
    return { success: true };
  }, [fetchGroupConfig]);
  const SearchRenderer = (props) => {
    const {
      value,
      node,
      column,
      searchCode,
      selectedColumn,
      gridDefObj,
      searchBoxWidth = 120,
      searchBoxHeight = 25,
      searchBoxFontSize = 11
    } = props;
    const isInitialized = reactExports.useRef(false);
    const normalizeSearchValue2 = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") {
        return String(raw);
      }
      if (typeof raw === "object") {
        if (typeof raw.value === "string") return raw.value;
        if (typeof raw.code === "string") return raw.code;
        if (typeof raw.collectorcode === "string") return raw.collectorcode;
        if (typeof raw.hierarchycode === "string") return raw.hierarchycode;
        return "";
      }
      return "";
    };
    if (!node || !column) return null;
    const handleSetValue = (dataValue) => {
      var _a2;
      if (!isInitialized.current) {
        isInitialized.current = true;
        return;
      }
      const newValue = normalizeSearchValue2(dataValue);
      node.setDataValue(column.getColId(), newValue);
      if (((_a2 = node.data) == null ? void 0 : _a2.mode) !== "N") node.data.mode = "E";
      const field = column.getColId();
      if (!field || !node.data) return;
      upsertRowField(node.data, field, newValue);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
        searchCode,
        selectedValue: normalizeSearchValue2(value),
        selectedColumn,
        gridDefObj,
        gridWidth: 450,
        gridHeight: 300,
        gridNoOfRowsPerPage: 5,
        searchBoxWidth,
        searchBoxHeight,
        searchBoxFontSize,
        error: false,
        setSelectedValue: handleSetValue
      }
    );
  };
  const subGroupColumnDefs = reactExports.useMemo(() => [
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.code",
        defaultMessage: "Code"
      }),
      field: "groupCode",
      minWidth: 120,
      flex: 1,
      editable: (p) => {
        var _a2;
        return ((_a2 = p.data) == null ? void 0 : _a2.mode) === "N";
      },
      cellEditor: UppercaseTextEditor,
      valueSetter: (params) => {
        const next = String(params.newValue ?? "").toUpperCase();
        params.data.groupCode = next;
        return true;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.description",
        defaultMessage: "Description"
      }),
      field: "groupDescription",
      minWidth: 250,
      flex: 2,
      editable: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupType",
        defaultMessage: "Group Type"
      }),
      field: "grouptype",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: groupTypeOptions.map((o) => o.value)
      },
      valueFormatter: (p) => {
        var _a2;
        return ((_a2 = groupTypeOptions.find((o) => o.value === p.value)) == null ? void 0 : _a2.label) ?? p.value;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.supervisor",
        defaultMessage: "Supervisor"
      }),
      field: "supervisor",
      width: 150,
      editable: false,
      cellRenderer: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SearchRenderer, { ...p }),
      cellStyle: { display: "flex", alignItems: "center" },
      cellRendererParams: {
        searchCode: "SUPERVISORCD",
        selectedColumn: "collectorcode",
        gridDefObj: gridSupervisorCodeDefObj,
        searchBoxWidth: 130,
        searchBoxHeight: 26,
        searchBoxFontSize: 11
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.active",
        defaultMessage: "Active"
      }),
      field: "activeYn",
      width: 80,
      editable: true,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRenderer: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Rp,
        {
          checked: !!p.value,
          onChange: (e) => {
            var _a2, _b2;
            const next = e.target.checked;
            (_b2 = (_a2 = p.node) == null ? void 0 : _a2.setDataValue) == null ? void 0 : _b2.call(_a2, "activeYn", next);
            handleSubGroupFieldChange(p.data, "activeYn", next);
          }
        }
      )
    },
    {
      headerName: "",
      field: "__actions",
      width: 56,
      sortable: false,
      filter: false,
      editable: false,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      cellRenderer: (p) => {
        const sub = p.data;
        if (!sub) return null;
        const canDelete = sub.mode !== "D" && !sub._deleted;
        const deleteLabel = intl.formatMessage({
          id: "label.groupAllocationMaster.delete",
          defaultMessage: "Delete"
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-sub-actions group-allocation-sub-action-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: deleteLabel, arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "group-allocation-sub-action-btn delete",
            onClick: (e) => {
              e.stopPropagation();
              handleDeleteSubGroup(sub);
            },
            title: deleteLabel,
            "aria-label": deleteLabel,
            disabled: !canDelete,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DeleteOutlined,
              {
                className: "group-allocation-sub-delete-icon",
                fontSize: "small"
              }
            )
          }
        ) }) }) });
      }
    }
  ], [intl, groupTypeOptions, handleSubGroupFieldChange, handleDeleteSubGroup]);
  const SubGroupPanelRenderer = reactExports.useCallback(
    (params) => {
      var _a2;
      const parent = (_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.parent;
      if (!parent) return null;
      const subs = (params.data._subs || []).filter(
        (g) => g.mode !== "D" && !g._deleted
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-subpanel", style: { minWidth: "1200px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-subpanel-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-subpanel-title", style: { backgroundColor: "transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-allocation-master-subpanel-icon", children: "⊞" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: intl.formatMessage({
              id: "label.groupAllocationMaster.subGroupsOf",
              defaultMessage: "Sub-groups of"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-allocation-master-subpanel-code", children: parent.groupCode }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "group-allocation-master-subpanel-muted", children: [
              "· ",
              subs.length,
              " ",
              intl.formatMessage({
                id: "label.groupAllocationMaster.items",
                defaultMessage: "items"
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "group-allocation-master-add-sub-link",
              onClick: () => handleAddSubGroup(parent),
              children: [
                "+ ",
                intl.formatMessage({
                  id: "label.groupAllocationMaster.addSubGroup",
                  defaultMessage: "Add sub-group"
                })
              ]
            }
          )
        ] }),
        subs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-subpanel-empty", children: intl.formatMessage({
          id: "label.groupAllocationMaster.noSubGroupsDesc",
          defaultMessage: "No sub-groups yet. Sub-groups inherit type & supervisor from the parent but can be customised."
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-sub-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            ref: (node) => registerSubGrid(parent.id, parent.groupCode, node),
            rowData: subs,
            disableToast: { validation: true },
            setRowData: (updater) => {
              const next = typeof updater === "function" ? updater(subs) : updater;
              const nextRowsRaw = Array.isArray(next) ? next : [];
              const nextRows = nextRowsRaw.map((row, index) => ({
                ...row,
                id: row.id || `sub-${parent.id}-${Date.now()}-${index}`,
                // Keep existing rows persisted (mode "") and mark only brand-new rows as "N".
                mode: row.mode ?? (row.id ? "" : "N"),
                groupCode: typeof row.groupCode === "string" ? row.groupCode.toUpperCase() : row.groupCode,
                parentRowId: parent.id,
                parentGroupCode: (row.parentGroupCode || parent.groupCode || "").trim(),
                grouptype: row.grouptype || parent.grouptype || "",
                supervisor: row.supervisor || parent.supervisor || "",
                allocationtype: row.allocationtype || parent.allocationtype || "",
                activeYn: typeof row.activeYn === "boolean" ? row.activeYn : true
              }));
              const nextById = new Map(nextRows.map((r) => [r.id, r]));
              syncAllGroups((prev) => {
                const merged = prev.map((g) => {
                  if (!nextById.has(g.id)) return g;
                  const nextRow = nextById.get(g.id);
                  return {
                    ...g,
                    ...nextRow,
                    parentRowId: parent.id,
                    parentGroupCode: (nextRow.parentGroupCode || parent.groupCode || g.parentGroupCode || "").trim(),
                    mode: g.mode !== "N" ? "E" : g.mode
                  };
                });
                nextRows.forEach((row) => {
                  if (!merged.find((g) => g.id === row.id)) {
                    merged.push(row);
                  }
                });
                return merged;
              });
            },
            columnDefs: subGroupColumnDefs,
            gridStyle: { width: "100%", height: "260px" },
            rowHeight: 40,
            stopEditingWhenCellsLoseFocus: true,
            onCellValueChanged: (params2) => {
              var _a3;
              const field = (_a3 = params2 == null ? void 0 : params2.colDef) == null ? void 0 : _a3.field;
              if (!(params2 == null ? void 0 : params2.data) || !field || field === "__actions") return;
              if (params2.data.mode !== "N") {
                params2.data.mode = "E";
              }
            },
            getRowId: (params2) => params2.data.id,
            pagination: true,
            paginationPageSize: 5
          }
        ) })
      ] });
    },
    [
      intl,
      groupTypeOptions,
      openConfigure,
      handleDeleteSubGroup,
      handleAddSubGroup,
      registerSubGrid,
      subGroupColumnDefs
    ]
  );
  const ExpandCellRenderer = reactExports.useCallback(
    (params) => {
      var _a2;
      if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
      (_a2 = params.data) == null ? void 0 : _a2.groupCode;
      const isExpanded = !!params.data._isExpanded;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "group-allocation-master-expand-btn",
          onClick: (e) => {
            e.stopPropagation();
            toggleExpand(params.data.id);
          },
          title: isExpanded ? "Collapse sub-groups" : "Expand sub-groups",
          children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-allocation-master-expand-glyph", "aria-hidden": "true", children: "⌄" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-allocation-master-expand-glyph", "aria-hidden": "true", children: "›" })
        }
      );
    },
    [toggleExpand]
  );
  const GroupCodeCellRenderer = reactExports.useCallback(
    (params) => {
      var _a2, _b2;
      if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
      const code = (_a2 = params.data) == null ? void 0 : _a2.groupCode;
      if (((_b2 = params.data) == null ? void 0 : _b2.mode) === "N") {
        return params.value || "";
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "group-allocation-master-code-link",
          onClick: (e) => {
            e.stopPropagation();
            toggleExpand(params.data.id);
          },
          children: code
        }
      );
    },
    [toggleExpand]
  );
  const SubGroupsCellRenderer = reactExports.useCallback(
    (params) => {
      if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
      const count = params.data._subCount || 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `group-allocation-master-subcount${count === 0 ? " is-empty" : ""}`,
          onClick: (e) => {
            e.stopPropagation();
            if (count === 0) {
              handleAddSubGroup(params.data);
            } else {
              toggleExpand(params.data.id);
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormatListBulletedOutlined,
              {
                "aria-hidden": "true",
                style: { marginRight: 6, fontSize: 14 }
              }
            ),
            count > 0 ? intl.formatMessage(
              {
                id: "label.groupAllocationMaster.subGroupCount",
                defaultMessage: "{count} sub-groups"
              },
              { count }
            ) : intl.formatMessage({
              id: "label.groupAllocationMaster.addSubGroup",
              defaultMessage: "Add sub-group"
            })
          ]
        }
      );
    },
    [toggleExpand, intl, handleAddSubGroup]
  );
  const ActiveToggleRenderer = reactExports.useCallback((params) => {
    if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Rp,
      {
        checked: !!params.value,
        onChange: (e) => {
          var _a2, _b2;
          const next = e.target.checked;
          (_b2 = (_a2 = params.node) == null ? void 0 : _a2.setDataValue) == null ? void 0 : _b2.call(_a2, "activeYn", next);
          if (params.data && params.data.mode !== "N") {
            params.data.mode = "E";
          }
          handleCellEdit({
            data: params.data,
            colDef: { field: "activeYn" },
            newValue: next,
            oldValue: params.value
          });
        }
      }
    );
  }, []);
  const ConfigureCellRenderer = reactExports.useCallback(
    (params) => {
      if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "group-allocation-master-link-btn",
          onClick: (e) => {
            e.stopPropagation();
            openConfigure(params.data, "group");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TuneOutlined, { "aria-hidden": "true", style: { marginRight: 6, fontSize: 14 } }),
            intl.formatMessage({
              id: "label.groupAllocationMaster.configure",
              defaultMessage: "Configure"
            })
          ]
        }
      );
    },
    [openConfigure, intl]
  );
  const isMainGridDataRow = (params) => Boolean((params == null ? void 0 : params.data) && !params.data.__isSubPanel);
  const groupConfigColumns = reactExports.useMemo(
    () => [
      {
        headerName: "",
        width: 40,
        sortable: false,
        filter: false,
        editable: false,
        suppressNavigable: true,
        colSpan: (params) => {
          var _a2;
          return ((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel) ? 20 : 1;
        },
        cellRenderer: (params) => {
          var _a2;
          if (((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel) && params.data.parent) {
            return SubGroupPanelRenderer(params);
          }
          return ExpandCellRenderer(params);
        },
        autoHeight: true,
        cellStyle: (params) => {
          var _a2;
          return ((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel) ? {
            padding: 0,
            border: "none",
            background: "transparent",
            overflow: "visible"
          } : {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          };
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.code",
          defaultMessage: "Code"
        }),
        field: "groupCode",
        width: 120,
        editable: (params) => {
          var _a2, _b2;
          return !((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel) && ((_b2 = params == null ? void 0 : params.data) == null ? void 0 : _b2.mode) === "N";
        },
        cellEditor: UppercaseTextEditor,
        required: isMainGridDataRow,
        filter: false,
        cellRenderer: GroupCodeCellRenderer
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.description",
          defaultMessage: "Description"
        }),
        field: "groupDescription",
        editable: (params) => {
          var _a2;
          return !((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel);
        },
        required: isMainGridDataRow,
        width: 280,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.groupType",
          defaultMessage: "Type"
        }),
        field: "grouptype",
        width: 170,
        editable: (params) => {
          var _a2;
          return !((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel);
        },
        cellEditor: "agSelectCellEditor",
        filter: false,
        cellEditorParams: {
          values: groupTypeOptions.map((o) => o.value)
        },
        valueFormatter: (params) => formatGroupType(params.value)
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.supervisor",
          defaultMessage: "Supervisor"
        }),
        field: "supervisor",
        width: 160,
        editable: false,
        required: isMainGridDataRow,
        filter: false,
        cellRenderer: (params) => {
          if (!(params == null ? void 0 : params.data) || params.data.__isSubPanel) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(SearchRenderer, { ...params });
        },
        cellRendererParams: {
          searchCode: "SUPERVISORCD",
          selectedColumn: "collectorcode",
          gridDefObj: gridSupervisorCodeDefObj,
          searchBoxWidth: 130,
          searchBoxHeight: 27,
          searchBoxFontSize: 11
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.subGroups",
          defaultMessage: "Sub-Groups"
        }),
        field: "__subGroups",
        width: 180,
        editable: false,
        sortable: false,
        filter: false,
        cellRenderer: SubGroupsCellRenderer,
        cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" }
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.active",
          defaultMessage: "Active"
        }),
        field: "activeYn",
        width: 80,
        editable: false,
        filter: false,
        cellRenderer: ActiveToggleRenderer
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.configure",
          defaultMessage: "Configure"
        }),
        field: "__configure",
        width: 150,
        editable: false,
        sortable: false,
        filter: false,
        cellRenderer: ConfigureCellRenderer
      }
    ],
    [
      intl,
      groupTypeOptions,
      ExpandCellRenderer,
      GroupCodeCellRenderer,
      SubGroupsCellRenderer,
      ConfigureCellRenderer,
      ActiveToggleRenderer,
      SubGroupPanelRenderer,
      formatGroupType
    ]
  );
  const typeFilterOptions = reactExports.useMemo(
    () => [
      {
        value: "all",
        label: intl.formatMessage({
          id: "label.groupAllocationMaster.allTypes",
          defaultMessage: "All types"
        })
      },
      ...groupTypeOptions
    ],
    [groupTypeOptions, intl]
  );
  const getDefaultGroupConfigRow = () => createEmptyGroup();
  const getRowClass = (params) => {
    var _a2;
    return ((_a2 = params == null ? void 0 : params.data) == null ? void 0 : _a2.__isSubPanel) ? "group-allocation-master-subpanel-row" : "";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-header-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-title-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            vp,
            {
              title: intl.formatMessage({
                id: "label.groupAllocationMaster.title",
                defaultMessage: "Group Master"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              component: "p",
              className: "group-allocation-master-subtitle",
              value: intl.formatMessage({
                id: "label.groupAllocationMaster.subtitle",
                defaultMessage: "Configure collection groups. Expand a row to manage its sub-groups inline, or open Configure / Allocation Rule for detailed setup."
              }),
              translate: false,
              colon: false,
              align: "left"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: intl.formatMessage({
              id: "label.groupAllocationMaster.newGroup",
              defaultMessage: "+ New Group"
            }),
            onClick: handleNewGroup
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-search-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          id: "group-master-search",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          editable: true,
          width: "100%",
          placeholder: "label.groupAllocationMaster.searchPlaceholder"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-type-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          name: "typeFilter",
          value: typeFilter,
          onChange: (e) => setTypeFilter(e.target.value),
          options: typeFilterOptions,
          width: "160px"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          onClick: () => setActiveOnly(!activeOnly),
          type: "secondary",
          style: {
            backgroundColor: activeOnly ? "#e3f2fd" : void 0,
            color: activeOnly ? "#1976d2" : void 0,
            borderColor: activeOnly ? "#90caf9" : void 0
          },
          label: intl.formatMessage({
            id: "label.groupAllocationMaster.activeOnly",
            defaultMessage: "Active only"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          onClick: () => setWithSubsOnly(!withSubsOnly),
          type: "secondary",
          style: {
            backgroundColor: withSubsOnly ? "#e3f2fd" : void 0,
            color: withSubsOnly ? "#1976d2" : void 0,
            borderColor: withSubsOnly ? "#90caf9" : void 0
          },
          label: intl.formatMessage({
            id: "label.groupAllocationMaster.hasSubGroups",
            defaultMessage: "Has sub-groups"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-allocation-master-count", children: intl.formatMessage(
        {
          id: "label.groupAllocationMaster.filterCount",
          defaultMessage: "{filtered} of {total} groups"
        },
        {
          filtered: filteredParents.length,
          total: parents.length
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-allocation-master-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-allocation-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData: displayRows,
          setRowData: (updater) => {
            const next = typeof updater === "function" ? updater(displayRows) : updater;
            const dataRowsRaw = next.filter((r) => !r.__isSubPanel);
            const dataRows = dataRowsRaw.map((row, index) => ({
              ...row,
              id: row.id || `new-${Date.now()}-${index}`,
              mode: row.mode || "N"
            }));
            const nextById = new Map(dataRows.map((r) => [r.id, r]));
            syncAllGroups((prev) => {
              const merged = prev.map((g) => {
                const wasDisplayed = displayRows.some((d) => d.id === g.id && !d.__isSubPanel);
                if (wasDisplayed && !nextById.has(g.id)) {
                  return { ...g, mode: "D" };
                }
                if (!nextById.has(g.id)) return g;
                const nextRow = nextById.get(g.id);
                return {
                  ...g,
                  ...nextRow,
                  mode: nextRow.mode || g.mode || "N"
                };
              });
              dataRows.forEach((row) => {
                if (!merged.find((g) => g.id === row.id)) {
                  merged.push(row);
                }
              });
              return merged;
            });
          },
          columnDefs: groupConfigColumns,
          pagination: true,
          paginationPageSize: 20,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleMainGridSave,
          rowSelection: "multiple",
          onCellValueChanged: handleCellEdit,
          defaultNewRowData: getDefaultGroupConfigRow,
          getRowClass,
          getRowId: (params) => params.data.id,
          gridClassName: "drs-list-grid",
          embeddedInSection: true
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: handlePageSave,
          onReset: handleRefresh,
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, reset: true, close: true }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupConfigDrawer,
      {
        open: Boolean(drawerGroup),
        onClose: handleDrawerClose,
        onSave: handleDrawerSave,
        group: drawerGroup,
        hasSubGroups: drawerSubCount > 0,
        groupTypeOptions,
        allocationTypeOptions,
        onGroupChange: handleDrawerGroupChange,
        allocationRef,
        subGroupRef,
        initialTab: drawerInitialTab
      }
    )
  ] });
};
export {
  GroupAllocationMaster as default
};
