import { ed as useIntl, ct as ar, dN as reactExports, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, b0 as Lg, aW as Kg, aM as Grid, cJ as dc, de as gridEmployerDefObj, bI as SEARCH_API_ENDPOINTS, cs as ap, dD as lE, cj as Vg, dK as ps, aX as Kr } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { E as EmployerMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
/* empty css                                 */
const DRS_FORM_LABEL_WIDTH = 140;
const DrsLabelFieldRow = ({ labelId, required, children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Dt,
  {
    styles: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      width: "100%"
    },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          width: DRS_FORM_LABEL_WIDTH,
          value: labelId,
          required: Boolean(required),
          align: "right"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { styles: { flex: 1, minWidth: 0 }, children })
    ]
  }
);
const emptyEmployerDto = () => ({
  szEmployerCode: "",
  szEmployerName: ""
});
const emptyAddressDto = () => ({
  szAddressType: "CU",
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
const EmployerMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const [employerRequestDto, setEmployerRequestDto] = reactExports.useState(emptyEmployerDto);
  const [addressDto, setAddressDto] = reactExports.useState(emptyAddressDto);
  const [szExtension, setSzExtension] = reactExports.useState("");
  reactExports.useRef(null);
  const [isNewEmployer, setIsNewEmployer] = reactExports.useState(true);
  const location = useLocation();
  const menuId = location.state.menuId;
  const resetForm = reactExports.useCallback(() => {
    setEmployerRequestDto(emptyEmployerDto());
    setAddressDto(emptyAddressDto());
    setSzExtension("");
    setIsNewEmployer(true);
  }, []);
  const applyFetchResponse = (employerData, addressData) => {
    setEmployerRequestDto({
      szEmployerCode: employerData.szEmployerCode || "",
      szEmployerName: employerData.szEmployerName || ""
    });
    setAddressDto({
      szAddressType: addressData.szAddressType || "CU",
      szPartitionCode: addressData.szPartitionCode || "001",
      szAddress1: addressData.szAddress1 || "",
      szAddress2: addressData.szAddress2 || "",
      szAddress3: addressData.szAddress3 || "",
      szAddress4: addressData.szAddress4 || "",
      szCity: addressData.szCity || "",
      szZip: addressData.szZip || "",
      szState: addressData.szState || "",
      szCountry: addressData.szCountry || "",
      szPhone1: addressData.szPhone1 || "",
      szFax: addressData.szFax || "",
      szMailId: addressData.szMailId || "",
      szMobileNo: addressData.szMobileNo || "",
      szPagerNo: addressData.szPagerNo || ""
    });
    setSzExtension(addressData.szExtension || "");
    setIsNewEmployer(false);
  };
  const fetchEmployerDetails = async (codeRaw) => {
    var _a, _b;
    const code = String(codeRaw ?? "").trim();
    if (!code) {
      return;
    }
    console.log("Fetching employer details for code:", code, "with menuId:", menuId);
    try {
      const res = await Kr.GET(
        EmployerMasterAPI.fetchEmployerDetails(code, menuId)
      );
      if (res.data && res.data.status === "Success") {
        const responseJson = res.data.responseJson || {};
        const employerData = responseJson.employer || {};
        const addressData = responseJson.address || {};
        applyFetchResponse(employerData, addressData);
      } else {
        toast.error(
          intl.formatMessage({
            id: "label.EmployerMaster.NotFound",
            defaultMessage: "EmployerMaster Details not found"
          })
        );
      }
    } catch (err) {
      toast.error(
        ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "label.EmployerMaster.FetchError",
          defaultMessage: "Error fetching employerMaster Details"
        })
      );
    }
  };
  const handleEmployerSearchSelect = (dataValue) => {
    const code = dataValue != null ? String(dataValue).trim() : "";
    setEmployerRequestDto((prev) => ({ ...prev, szEmployerCode: code }));
    if (code) {
      void fetchEmployerDetails(code);
    } else {
      resetForm();
    }
  };
  const handleChangeEmployer = (field, value) => {
    setEmployerRequestDto((prev) => ({ ...prev, [field]: value }));
  };
  const handleChangeAddress = (field, value) => {
    setAddressDto((prev) => ({ ...prev, [field]: value }));
  };
  const handleNewEmployer = () => {
    var _a;
    resetForm();
    (_a = document.getElementById("szEmployerCode")) == null ? void 0 : _a.focus();
  };
  const buildPayload = () => ({
    employerRequestDto: {
      szEmployerCode: employerRequestDto.szEmployerCode,
      szEmployerName: employerRequestDto.szEmployerName
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
    var _a, _b, _c;
    const code = (_a = employerRequestDto.szEmployerCode) == null ? void 0 : _a.trim();
    if (!code) {
      toast.error(
        intl.formatMessage({
          id: "label.EmployerMaster.CodeRequiredForSave",
          defaultMessage: "Employer code is required to save"
        })
      );
      return { data: { status: "Failure" } };
    }
    try {
      let res;
      if (isNewEmployer) {
        res = await Kr.POST(
          EmployerMasterAPI.saveEmployerDetails(menuId),
          buildPayload()
        );
      } else {
        res = await Kr.PUT(
          EmployerMasterAPI.saveEmployerDetails(menuId),
          buildPayload()
        );
      }
      if (res.status === 200 || res.status === "Success") {
        await fetchEmployerDetails(code);
        return { success: true };
      }
      if (res.status === "Failure" || res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
        return { success: false };
      }
      return { success: false };
    } catch (err) {
      toast.error(
        ((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || intl.formatMessage({
          id: "label.EmployerMaster.Error",
          defaultMessage: "Error adding employer"
        })
      );
      throw err;
    }
  };
  const handleDelete = async () => {
    var _a, _b, _c, _d;
    if (!((_a = employerRequestDto.szEmployerCode) == null ? void 0 : _a.trim())) {
      toast.error(
        intl.formatMessage({
          id: "label.EmployerMaster.CodeRequiredForDelete",
          defaultMessage: "Please enter Employer Code to delete"
        })
      );
      return;
    }
    const code = (_b = employerRequestDto.szEmployerCode) == null ? void 0 : _b.trim();
    if (!code) {
      resetForm();
      return { data: { status: "Success" } };
    }
    try {
      const res = await Kr.DELETE(
        EmployerMasterAPI.deleteEmployerDetails(code, menuId)
      );
      if (res.status === 200 || res.status === "Success") {
        resetForm();
        return { success: true };
      }
      toast.error(
        res.data.msg || intl.formatMessage({
          id: "label.EmployerMaster.DeleteFailed",
          defaultMessage: "Failed to delete employer"
        })
      );
      return { data: { status: "Failure" } };
    } catch (err) {
      toast.error(
        ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
          id: "label.EmployerMaster.DeleteError",
          defaultMessage: "Error deleting employer"
        })
      );
      throw err;
    }
  };
  const handleReset = () => {
    resetForm();
    return { data: { status: "Success" } };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "container", marginTop: 2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-header-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        styles: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          width: "100%"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              styles: {
                display: "flex",
                flexDirection: "column",
                gap: 6
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "portfolio-master-breadcrumb-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  vp,
                  {
                    title: intl.formatMessage({
                      id: "label.EmployerMaster.title",
                      defaultMessage: "Employers"
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Typography,
                  {
                    variant: "body1",
                    className: "portfolio-master-description",
                    children: intl.formatMessage({
                      id: "label.EmployerMaster.description",
                      defaultMessage: "Maintain employer code, name, address, and contact details."
                    })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              styles: {
                marginTop: 25
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "label.EmployerMaster.newEmployer",
                  variant: "contained",
                  onClick: handleNewEmployer
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        styles: {
          display: "flex",
          flexDirection: "column",
          width: "100%"
        },
        children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { styles: { marginLeft: "-79px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.selectEmployerSearch", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "ECDE",
                    setSelectedValue: handleEmployerSearchSelect,
                    selectedValue: employerRequestDto.szEmployerCode,
                    selectedColumn: "szEmployerCode",
                    gridDefObj: gridEmployerDefObj,
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 220,
                    searchBoxHeight: 30,
                    searchBoxFontSize: 12,
                    placeholder: "label.EmployerMaster.searchEmployerPlaceholder"
                  }
                ) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: intl.formatMessage({
                  id: "label.EmployerMaster.selectEmployerHint",
                  defaultMessage: "Search and select an employer above, or click New employer to start a blank record."
                }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrsLabelFieldRow,
                    {
                      labelId: "label.EmployerMaster.szEmployerCode",
                      required: true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          id: "szEmployerCode",
                          width: "100%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: employerRequestDto.szEmployerCode,
                          placeholder: "label.EmployerMaster.phEmployerCode",
                          onChange: (e) => handleChangeEmployer("szEmployerCode", e.target.value)
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrsLabelFieldRow,
                    {
                      labelId: "label.EmployerMaster.szEmployerName",
                      required: true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          width: "100%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: employerRequestDto.szEmployerName,
                          placeholder: "label.EmployerMaster.phEmployerName",
                          onChange: (e) => handleChangeEmployer("szEmployerName", e.target.value)
                        }
                      )
                    }
                  ) })
                ] }) })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, alignItems: "stretch", children: [
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
                        id: "label.EmployerMaster.AddressDetails",
                        defaultMessage: "Address details"
                      })
                    }
                  ) }),
                  [
                    {
                      id: "label.EmployerMaster.szAddress1",
                      name: "szAddress1",
                      ph: "label.EmployerMaster.phAddress1"
                    },
                    {
                      id: "label.EmployerMaster.szAddress2",
                      name: "szAddress2",
                      ph: "label.EmployerMaster.phAddress2"
                    },
                    {
                      id: "label.EmployerMaster.szAddress3",
                      name: "szAddress3",
                      ph: "label.EmployerMaster.phAddress3"
                    },
                    {
                      id: "label.EmployerMaster.szAddress4",
                      name: "szAddress4",
                      ph: "label.EmployerMaster.phAddress4"
                    }
                  ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrsLabelFieldRow,
                    {
                      labelId: field.id,
                      required: field.name === "szAddress1",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          width: "100%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: field.name === "szAddress1",
                          value: addressDto[field.name],
                          placeholder: field.ph,
                          onChange: (e) => handleChangeAddress(field.name, e.target.value)
                        }
                      )
                    }
                  ) }, field.name)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrsLabelFieldRow,
                    {
                      labelId: "label.EmployerMaster.szCity",
                      required: true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          width: "100%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: addressDto.szCity,
                          placeholder: "label.EmployerMaster.phCity",
                          onChange: (e) => handleChangeAddress("szCity", e.target.value)
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrsLabelFieldRow,
                    {
                      labelId: "label.EmployerMaster.szZip",
                      required: true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          width: "100%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: addressDto.szZip,
                          placeholder: "label.EmployerMaster.phZip",
                          onChange: (e) => handleChangeAddress("szZip", e.target.value)
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szState", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: addressDto.szState,
                      placeholder: "label.EmployerMaster.phState",
                      onChange: (e) => handleChangeAddress("szState", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szCountry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: addressDto.szCountry,
                      placeholder: "label.EmployerMaster.phCountry",
                      onChange: (e) => handleChangeAddress("szCountry", e.target.value)
                    }
                  ) }) })
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
                        id: "label.EmployerMaster.ContactDetails",
                        defaultMessage: "Contact details"
                      })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szPhone1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      type: "phone",
                      value: addressDto.szPhone1,
                      placeholder: "label.EmployerMaster.phPhone",
                      onChange: (e) => handleChangeAddress("szPhone1", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szExtension", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: szExtension,
                      placeholder: "label.EmployerMaster.phExtension",
                      onChange: (e) => setSzExtension(e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szFax", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      type: "phone",
                      value: addressDto.szFax,
                      placeholder: "label.EmployerMaster.phFax",
                      onChange: (e) => handleChangeAddress("szFax", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szMobileNo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      type: "phone",
                      value: addressDto.szMobileNo,
                      placeholder: "label.EmployerMaster.phMobile",
                      onChange: (e) => handleChangeAddress("szMobileNo", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szPagerNo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: addressDto.szPagerNo,
                      placeholder: "label.EmployerMaster.phPager",
                      onChange: (e) => handleChangeAddress("szPagerNo", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szMailId", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "100%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: addressDto.szMailId,
                      placeholder: "label.EmployerMaster.phEmail",
                      onChange: (e) => handleChangeAddress("szMailId", e.target.value)
                    }
                  ) }) })
                ] })
              }
            ) }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onDelete: handleDelete,
        onReset: handleReset,
        disableToast: { reset: true }
      }
    )
  ] });
};
export {
  EmployerMaster as default
};
