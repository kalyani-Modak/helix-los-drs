import { ed as useIntl, ct as ar, dN as reactExports, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, aW as Kg, aM as Grid, cs as ap, dD as lE, aa as Divider, cg as Ug, cj as Vg, aX as Kr, dK as ps, cI as dayjs } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { O as OrganizationMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
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
const emptyOrganizationDto = () => ({
  szOrgCode: "",
  szOrgName: "",
  szCurrencyCode: "",
  dtBusiDate: "",
  szWorkingStart: "",
  szWorkingEnd: "",
  szUrl: "",
  szAddress1: "",
  szAddress2: "",
  szAddress3: "",
  szAddress4: "",
  szCity: "",
  szZip: "",
  szState: "",
  szCountry: "",
  szTelephone: "",
  szFax: ""
});
const OrganizationMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const [organizationDto, setOrganizationDto] = reactExports.useState(emptyOrganizationDto);
  const realm = sessionStorage.getItem("SEC_REALM");
  const realmRef = reactExports.useRef(realm);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const resetForm = reactExports.useCallback(() => {
    setOrganizationDto(emptyOrganizationDto());
  }, []);
  const applyFetchResponse = (responseData) => {
    const orgData = responseData.organizationRequestDto || {};
    const addressData = responseData.addressDto || {};
    setOrganizationDto({
      szOrgCode: orgData.szOrgCode || "",
      szOrgName: orgData.szOrgName || "",
      szCurrencyCode: orgData.szCurrencyCode || "",
      dtBusiDate: orgData.dtBusiDate || "",
      szWorkingStart: orgData.szWorkingStart || "",
      szWorkingEnd: orgData.szWorkingEnd || "",
      szUrl: orgData.szUrl || "",
      szAddress1: addressData.szAddress1 || "",
      szAddress2: addressData.szAddress2 || "",
      szAddress3: addressData.szAddress3 || "",
      szAddress4: addressData.szAddress4 || "",
      szCity: addressData.szCity || "",
      szZip: addressData.szZip || "",
      szState: addressData.szState || "",
      szCountry: addressData.szCountry || "",
      szTelephone: addressData.szPhone1 || "",
      szFax: addressData.szFax || ""
    });
  };
  const fetchOrganizationDetails = async (codeRaw) => {
    var _a, _b;
    const code = String(codeRaw ?? "").trim();
    if (!code) {
      return;
    }
    try {
      const res = await Kr.GET(
        OrganizationMasterAPI.OrganizationDetails(screenMenuId) + `?code=${code}`
      );
      console.log("Fetch response:", res);
      if (res.data && res.data.status === "Success") {
        const responseJson = res.data.responseJson || {};
        applyFetchResponse(responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "label.OrganizationMaster.NotFound",
            defaultMessage: "Organization details not found"
          })
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(
        ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "label.OrganizationMaster.FetchError",
          defaultMessage: "Error fetching organization details"
        })
      );
    }
  };
  reactExports.useEffect(() => {
    if (realm) {
      realmRef.current = realm;
      setOrganizationDto((prev) => ({ ...prev, szOrgCode: realm }));
      fetchOrganizationDetails(realm);
    }
  }, [realm]);
  const handleChangeOrganization = (field, value) => {
    setOrganizationDto((prev) => ({ ...prev, [field]: value }));
  };
  const buildPayload = () => {
    return {
      organizationRequestDto: {
        szOrgCode: organizationDto.szOrgCode,
        szOrgName: organizationDto.szOrgName,
        szCurrencyCode: organizationDto.szCurrencyCode,
        dtBusiDate: organizationDto.dtBusiDate,
        szWorkingStart: organizationDto.szWorkingStart,
        szWorkingEnd: organizationDto.szWorkingEnd,
        szUrl: organizationDto.szUrl
      },
      addressDto: {
        szAddress1: organizationDto.szAddress1,
        szAddress2: organizationDto.szAddress2,
        szAddress3: organizationDto.szAddress3,
        szAddress4: organizationDto.szAddress4,
        szCity: organizationDto.szCity,
        szZip: organizationDto.szZip,
        szState: organizationDto.szState,
        szCountry: organizationDto.szCountry,
        szTelephone: organizationDto.szTelephone,
        szFax: organizationDto.szFax,
        szPhone1: organizationDto.szTelephone
      }
    };
  };
  const handleSave = async () => {
    var _a, _b, _c, _d;
    const code = organizationDto.szOrgCode || realmRef.current;
    if (!code) {
      toast.error(
        intl.formatMessage({
          id: "label.OrganizationMaster.CodeRequiredForSave",
          defaultMessage: "Organization code is required to save"
        })
      );
      return { success: false, message: "Organization code is required" };
    }
    const requiredFields = [
      { field: "szOrgName", label: "Organization Name" },
      { field: "szCurrencyCode", label: "Base Currency" },
      { field: "dtBusiDate", label: "Business Date" },
      { field: "szAddress1", label: "Address Line 1" },
      { field: "szCity", label: "City" },
      { field: "szZip", label: "Zip/Postal Code" }
    ];
    const missingFields = requiredFields.filter(
      ({ field }) => !organizationDto[field] || organizationDto[field].trim() === ""
    );
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ label }) => label).join(", ");
      return { success: false, message: `Missing required fields: ${fieldNames}` };
    }
    if (!organizationDto.szOrgCode) {
      setOrganizationDto((prev) => ({ ...prev, szOrgCode: code }));
    }
    try {
      const payload = buildPayload();
      console.log("Sending payload:", payload);
      const res = await Kr.PUT(
        OrganizationMasterAPI.OrganizationDetails(screenMenuId),
        payload
      );
      if (res.data.status === "Success") {
        await fetchOrganizationDetails(code);
        return { success: true };
      } else {
        const errorMsg = res.data.message;
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      console.error("Save error:", err);
      let errorMsg = "Error saving organization";
      if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
        errorMsg = "Validation failed";
      } else if ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) {
        errorMsg = err.response.data.message;
      }
      return { success: false, message: errorMsg };
    }
  };
  const handleReset = () => {
    resetForm();
    if (realm) {
      fetchOrganizationDetails(realm);
    }
    return { data: { status: "Success" } };
  };
  const getDateValue = (dateStr) => {
    if (!dateStr) return null;
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed : null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-header-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dt,
      {
        styles: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          width: "100%"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            styles: {
              display: "flex",
              flexDirection: "column",
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-breadcrumb-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                vp,
                {
                  title: intl.formatMessage({
                    id: "label.OrganizationMaster.title",
                    defaultMessage: "Organization Master"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  variant: "body1",
                  className: "portfolio-master-description",
                  children: intl.formatMessage({
                    id: "label.OrganizationMaster.description",
                    defaultMessage: "Standardize organization-level system parameters: address, contact, working hours, base currency."
                  })
                }
              )
            ]
          }
        )
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
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DrsLabelFieldRow,
                  {
                    labelId: "label.OrganizationMaster.szOrganizationCode",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        id: "szOrganizationCode",
                        width: "49%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: true,
                        required: true,
                        value: organizationDto.szOrgCode,
                        placeholder: "label.OrganizationMaster.phOrganizationCode",
                        onChange: (e) => handleChangeOrganization("szOrgCode", e.target.value)
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DrsLabelFieldRow,
                  {
                    labelId: "label.OrganizationMaster.szOrganizationName",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        width: "49%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: true,
                        required: true,
                        value: organizationDto.szOrgName,
                        placeholder: "label.OrganizationMaster.phOrganizationName",
                        onChange: (e) => handleChangeOrganization("szOrgName", e.target.value)
                      }
                    )
                  }
                ) })
              ] }) }) })
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
                          width: "49%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: field.name === "szAddress1",
                          value: organizationDto[field.name],
                          placeholder: field.ph,
                          onChange: (e) => handleChangeOrganization(field.name, e.target.value)
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
                          width: "49%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: organizationDto.szCity,
                          placeholder: "label.EmployerMaster.phCity",
                          onChange: (e) => handleChangeOrganization("szCity", e.target.value)
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
                          width: "49%",
                          align: lE.TEXT,
                          editable: true,
                          disabled: false,
                          required: true,
                          value: organizationDto.szZip,
                          placeholder: "label.EmployerMaster.phZip",
                          onChange: (e) => handleChangeOrganization("szZip", e.target.value)
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szState", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "49%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: organizationDto.szState,
                      placeholder: "label.EmployerMaster.phState",
                      onChange: (e) => handleChangeOrganization("szState", e.target.value)
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szCountry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      width: "49%",
                      align: lE.TEXT,
                      editable: true,
                      disabled: false,
                      value: organizationDto.szCountry,
                      placeholder: "label.EmployerMaster.phCountry",
                      onChange: (e) => handleChangeOrganization("szCountry", e.target.value)
                    }
                  ) }) })
                ] })
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { sx: { position: "relative" }, size: { xs: 12, md: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Divider,
                {
                  orientation: "vertical",
                  sx: {
                    position: "absolute",
                    left: "-8px",
                    top: 0,
                    bottom: 0,
                    borderColor: "#e0e0e0"
                  }
                }
              ),
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.OrganizationMaster.szTelephone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        width: "200%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: false,
                        type: "phone",
                        value: organizationDto.szTelephone,
                        placeholder: "label.OrganizationMaster.phTelephone",
                        onChange: (e) => handleChangeOrganization(
                          "szTelephone",
                          e.target.value
                        )
                      }
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.EmployerMaster.szFax", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        width: "200%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: false,
                        type: "phone",
                        value: organizationDto.szFax,
                        placeholder: "label.EmployerMaster.phFax",
                        onChange: (e) => handleChangeOrganization("szFax", e.target.value)
                      }
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.OrganizationMaster.szWebsiteUrl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        width: "200%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: false,
                        value: organizationDto.szUrl,
                        placeholder: "label.OrganizationMaster.szWebsiteUrl",
                        onChange: (e) => handleChangeOrganization("szUrl", e.target.value)
                      }
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Typography,
                      {
                        variant: "subtitle2",
                        color: "text.secondary",
                        gutterBottom: true,
                        sx: { mt: 1 },
                        children: intl.formatMessage({
                          id: "label.OrganizationMaster.WorkingHours",
                          defaultMessage: "Working Hours"
                        })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.OrganizationMaster.szWorkingStart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        type: "time",
                        width: "200%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: false,
                        value: organizationDto.szWorkingStart,
                        placeholder: "HH:MM",
                        onChange: (e) => handleChangeOrganization(
                          "szWorkingStart",
                          e.target.value
                        )
                      }
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrsLabelFieldRow, { labelId: "label.OrganizationMaster.szWorkingEnd", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        type: "time",
                        width: "200%",
                        align: lE.TEXT,
                        editable: true,
                        disabled: false,
                        value: organizationDto.szWorkingEnd,
                        placeholder: "HH:MM",
                        onChange: (e) => handleChangeOrganization(
                          "szWorkingEnd",
                          e.target.value
                        )
                      }
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      DrsLabelFieldRow,
                      {
                        labelId: "label.OrganizationMaster.szBaseCurrency",
                        required: true,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ap,
                          {
                            width: "200%",
                            align: lE.TEXT,
                            editable: true,
                            disabled: false,
                            required: true,
                            value: organizationDto.szCurrencyCode,
                            placeholder: "label.OrganizationMaster.szBaseCurrency",
                            onChange: (e) => handleChangeOrganization(
                              "szCurrencyCode",
                              e.target.value
                            )
                          }
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      DrsLabelFieldRow,
                      {
                        labelId: "label.OrganizationMaster.szBusinessDate",
                        required: true,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Ug,
                          {
                            value: getDateValue(organizationDto.dtBusiDate),
                            onChange: (newVal) => {
                              const formattedDate = newVal && newVal.isValid ? newVal.format("YYYY-MM-DD") : "";
                              handleChangeOrganization(
                                "dtBusiDate",
                                formattedDate
                              );
                            },
                            align: lE.DATE,
                            sx: { width: "100%" },
                            width: "200%",
                            required: true
                          }
                        )
                      }
                    ) })
                  ] })
                }
              ) }) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onReset: handleReset,
        disableToast: { reset: true }
      }
    )
  ] });
};
export {
  OrganizationMaster as default
};
