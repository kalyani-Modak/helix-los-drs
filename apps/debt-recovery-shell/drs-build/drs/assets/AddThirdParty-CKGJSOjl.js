import { ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, ef as useLocation, aX as Kr, ca as ThirdPartyAPI, dB as jsxRuntimeExports, ac as Dt, dK as ps, bV as Stack, aa as Divider, aM as Grid, bH as SE, dA as jg, cs as ap, cJ as dc, df as gridExistingCustomerDefObj, bI as SEARCH_API_ENDPOINTS, cj as Vg, v as Box } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const initialThirdParty = () => ({
  szThirdPartyType: "",
  szNewCustomerRecordYN: "N",
  szCustomerName: "",
  lnExistingCustomerSeqNo: ""
});
const initialAddress = () => ({
  lnSNo: 1,
  lnAddressSeq: 0,
  lnActivitySeqNo: 0,
  szAddressType: "CU",
  szContactPerson: "",
  szAddress1: "",
  szAddress2: "",
  szAddress3: "",
  szAddress4: "",
  szCity: "",
  szZip: "",
  szState: "",
  szPhone1: "",
  szExtension: "",
  szFax: "",
  szCountry: "",
  szMobileNo: "",
  szMailId: ""
});
function parseExistingCustomerSeq(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}
function buildWrapperPayload(addThirdPartyDto, addressRequestDto) {
  const isNew = addThirdPartyDto.szNewCustomerRecordYN === "Y";
  let lnExisting = 0;
  if (!isNew) {
    const parsed = parseExistingCustomerSeq(addThirdPartyDto.lnExistingCustomerSeqNo);
    lnExisting = parsed != null ? parsed : 0;
  }
  const addThirdPartyPayload = {
    szThirdPartyType: addThirdPartyDto.szThirdPartyType,
    szNewCustomerRecordYN: addThirdPartyDto.szNewCustomerRecordYN,
    szCustomerName: (addThirdPartyDto.szCustomerName || "").trim(),
    lnExistingCustomerSeqNo: lnExisting
  };
  const addressRequestPayload = {
    lnSNo: addressRequestDto.lnSNo ?? 1,
    lnAddressSeq: addressRequestDto.lnAddressSeq ?? 0,
    lnActivitySeqNo: addressRequestDto.lnActivitySeqNo ?? 0,
    szAddressType: addressRequestDto.szAddressType || "CU",
    szContactPerson: (addressRequestDto.szContactPerson || "").trim(),
    szAddress1: (addressRequestDto.szAddress1 || "").trim(),
    szAddress2: (addressRequestDto.szAddress2 || "").trim(),
    szAddress3: (addressRequestDto.szAddress3 || "").trim(),
    szAddress4: (addressRequestDto.szAddress4 || "").trim(),
    szCity: (addressRequestDto.szCity || "").trim(),
    szZip: (addressRequestDto.szZip || "").trim(),
    szState: (addressRequestDto.szState || "").trim(),
    szPhone1: (addressRequestDto.szPhone1 || "").trim(),
    szFax: (addressRequestDto.szFax || "").trim(),
    szCountry: (addressRequestDto.szCountry || "").trim(),
    szMobileNo: (addressRequestDto.szMobileNo || "").trim(),
    szMailId: (addressRequestDto.szMailId || "").trim()
  };
  return {
    addThirdPartyDto: addThirdPartyPayload,
    addressRequestDto: addressRequestPayload
  };
}
function AddThirdPartyDetails() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [addThirdPartyDto, setAddThirdPartyDto] = reactExports.useState(initialThirdParty);
  const [addressRequestDto, setAddressRequestDto] = reactExports.useState(initialAddress);
  const [errors, setErrors] = reactExports.useState({});
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const resetForm = reactExports.useCallback(() => {
    setAddThirdPartyDto(initialThirdParty());
    setAddressRequestDto(initialAddress());
    setErrors({});
  }, []);
  const handleChangeAddThirdParty = reactExports.useCallback((field, value) => {
    setAddThirdPartyDto((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "szNewCustomerRecordYN") {
        next.szCustomerName = "";
        next.lnExistingCustomerSeqNo = "";
        setAddressRequestDto(initialAddress());
        setErrors({});
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);
  const handleChangeAddress = reactExports.useCallback((field, value) => {
    setAddressRequestDto((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);
  const validateForm = reactExports.useCallback(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const newErrors = {};
    if (!addThirdPartyDto.szThirdPartyType) {
      newErrors.szThirdPartyType = true;
    }
    if (!addThirdPartyDto.szNewCustomerRecordYN) {
      newErrors.szNewCustomerRecordYN = true;
    }
    if (addThirdPartyDto.szNewCustomerRecordYN === "N" && !String(addThirdPartyDto.lnExistingCustomerSeqNo ?? "").trim()) {
      newErrors.lnExistingCustomerSeqNo = true;
    } else if (addThirdPartyDto.szNewCustomerRecordYN === "N") {
      const parsed = parseExistingCustomerSeq(addThirdPartyDto.lnExistingCustomerSeqNo);
      if (parsed == null) {
        newErrors.lnExistingCustomerSeqNo = true;
      }
    }
    if (addThirdPartyDto.szNewCustomerRecordYN === "N" && !((_a = addThirdPartyDto.szCustomerName) == null ? void 0 : _a.trim())) {
      newErrors.szCustomerName = true;
    }
    if (addThirdPartyDto.szNewCustomerRecordYN === "Y" && !((_b = addThirdPartyDto.szCustomerName) == null ? void 0 : _b.trim())) {
      newErrors.szCustomerName = true;
    }
    if (!((_c = addressRequestDto.szContactPerson) == null ? void 0 : _c.trim())) {
      newErrors.szContactPerson = true;
    }
    if (!((_d = addressRequestDto.szAddress1) == null ? void 0 : _d.trim())) {
      newErrors.szAddress1 = true;
    }
    if (!((_e = addressRequestDto.szAddress2) == null ? void 0 : _e.trim())) {
      newErrors.szAddress2 = true;
    }
    if (!((_f = addressRequestDto.szCountry) == null ? void 0 : _f.trim())) {
      newErrors.szCountry = true;
    }
    if (!((_g = addressRequestDto.szState) == null ? void 0 : _g.trim())) {
      newErrors.szState = true;
    }
    if (!((_h = addressRequestDto.szPhone1) == null ? void 0 : _h.trim())) {
      newErrors.szPhone1 = true;
    }
    if (!((_i = addressRequestDto.szMobileNo) == null ? void 0 : _i.trim())) {
      newErrors.szMobileNo = true;
    }
    if (addressRequestDto.szMailId && !/\S+@\S+\.\S+/.test(addressRequestDto.szMailId)) {
      newErrors.szMailId = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [addThirdPartyDto, addressRequestDto]);
  const handleSave = reactExports.useCallback(async () => {
    var _a, _b, _c, _d;
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(
        intl.formatMessage({
          id: "label.addThirdParty.noAccountSelected",
          defaultMessage: "No account selected. Open an account from the worklist."
        })
      );
      return;
    }
    if (!validateForm()) {
      if (errors.szMailId || addressRequestDto.szMailId && !/\S+@\S+\.\S+/.test(addressRequestDto.szMailId)) {
        toast.error(
          intl.formatMessage({
            id: "thirdparty.invalid.email",
            defaultMessage: "Please enter a valid Email ID (e.g., name@example.com)"
          })
        );
      } else {
        toast.error(
          intl.formatMessage({
            id: "thirdparty.mandatory.fields",
            defaultMessage: "Please fill all mandatory fields"
          })
        );
      }
      return;
    }
    const payload = buildWrapperPayload(addThirdPartyDto, addressRequestDto);
    try {
      const res = await Kr.POST(ThirdPartyAPI.AddThirdParty(screenMenuId), payload);
      const httpOk = (res == null ? void 0 : res.status) === 200 || (res == null ? void 0 : res.status) === 201;
      const data = res == null ? void 0 : res.data;
      if (data && typeof data === "object" && data.status === "Failure" && data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, data.responseJson);
        return;
      }
      if (httpOk && data != null) {
        toast.success(
          intl.formatMessage({
            id: "save.success",
            defaultMessage: "Saved successfully"
          })
        );
        resetForm();
        return;
      }
      if ((res == null ? void 0 : res.status) === 406) {
        toast.error(
          intl.formatMessage({
            id: "save.failed",
            defaultMessage: "Failed to save"
          })
        );
        return;
      }
      toast.error(
        intl.formatMessage({
          id: "save.failed",
          defaultMessage: "Failed to save"
        })
      );
    } catch (err) {
      console.error(err);
      const msg = ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || ((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.msg) || intl.formatMessage({ id: "save.error", defaultMessage: "Error saving" });
      toast.error(msg);
    }
  }, [
    addThirdPartyDto,
    addressRequestDto,
    intl,
    resetForm,
    selectedRow,
    toast,
    validateForm
  ]);
  if (!selectedRow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
      id: "label.addThirdParty.noAccountSelected",
      defaultMessage: "No account selected. Open an account from the worklist to add a third party."
    }), align: "left" }) });
  }
  const addressFields = [
    { label: "label.AddThirdParty.szContactPerson", name: "szContactPerson", required: true, placeholder: "label.AddThirdParty.szContactPerson" },
    { label: "label.AddThirdParty.szAddress1", name: "szAddress1", required: true, placeholder: "label.AddThirdParty.szAddress1" },
    { label: "label.AddThirdParty.szAddress2", name: "szAddress2", required: true, placeholder: "label.AddThirdParty.szAddress2" },
    { label: "label.AddThirdParty.szAddress3", name: "szAddress3", placeholder: "label.AddThirdParty.szAddress3" },
    { label: "label.AddThirdParty.szAddress4", name: "szAddress4", placeholder: "label.AddThirdParty.szAddress4" },
    { label: "label.AddThirdParty.szCountry", name: "szCountry", required: true, placeholder: "label.AddThirdParty.szCountry" },
    { label: "label.AddThirdParty.szState", name: "szState", required: true, placeholder: "label.AddThirdParty.szState" },
    { label: "label.AddThirdParty.szCity", name: "szCity", placeholder: "label.AddThirdParty.szCity" },
    { label: "label.AddThirdParty.szZip", name: "szZip", placeholder: "label.AddThirdParty.szZip" }
  ];
  const contactFields = [
    { label: "label.AddThirdParty.szPhone1", name: "szPhone1", required: true, placeholder: "label.AddThirdParty.szPhone1", type: "phone" },
    { label: "label.AddThirdParty.extension", name: "szExtension", required: false, placeholder: "label.AddThirdParty.extension" },
    { label: "label.AddThirdParty.szFax", name: "szFax", placeholder: "label.AddThirdParty.szFax" },
    { label: "label.AddThirdParty.szMobileNo", name: "szMobileNo", required: true, placeholder: "label.AddThirdParty.szMobileNo", type: "phone" },
    { label: "label.AddThirdParty.szMailId", name: "szMailId", placeholder: "label.AddThirdParty.szMailId" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      className: "drs-page-container",
      sx: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              p: { xs: 1.5, sm: 2 }
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 2.5, sx: { maxWidth: 1320, mx: "auto" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 1, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
                  id: "label.Add Third Party Information",
                  defaultMessage: "Add Third Party Information"
                }), align: "left" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.AddThirdParty.szThirdPartyType", required: true, align: "left" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SE,
                      {
                        name: "szThirdPartyType",
                        width: "100%",
                        value: addThirdPartyDto.szThirdPartyType,
                        error: errors.szThirdPartyType,
                        onChange: (e) => handleChangeAddThirdParty(
                          "szThirdPartyType",
                          (e == null ? void 0 : e.target) ? e.target.value : e
                        ),
                        placeholder: intl.formatMessage({
                          id: "dropdown.thirdPartyType.placeholder",
                          defaultMessage: "Select Type"
                        }),
                        options: [
                          {
                            value: "T",
                            label: intl.formatMessage({
                              id: "dropdown.thirdPartyType.accountRelationManager",
                              defaultMessage: "Account Relation Manager"
                            })
                          },
                          {
                            value: "E",
                            label: intl.formatMessage({
                              id: "dropdown.thirdPartyType.personInCharge",
                              defaultMessage: "Person In Charge(PIC)"
                            })
                          }
                        ]
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
                      id: "label.addThirdParty.customerType",
                      defaultMessage: "Customer type"
                    }), align: "left", required: true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", spacing: 2, sx: { flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        jg,
                        {
                          label: "label.AddThirdParty.szNewCustomerRecordYN",
                          value: "Y",
                          checked: addThirdPartyDto.szNewCustomerRecordYN === "Y",
                          onChange: (e) => handleChangeAddThirdParty("szNewCustomerRecordYN", e.target.value),
                          name: "szNewCustomerRecordYN",
                          required: true
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        jg,
                        {
                          label: "label.AddThirdParty.szExistingCustomerRecordYN",
                          value: "N",
                          checked: addThirdPartyDto.szNewCustomerRecordYN === "N",
                          onChange: (e) => handleChangeAddThirdParty("szNewCustomerRecordYN", e.target.value),
                          name: "szNewCustomerRecordYN",
                          required: true
                        }
                      )
                    ] })
                  ] }) }),
                  addThirdPartyDto.szNewCustomerRecordYN === "N" && /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.AddThirdParty.lnExistingCustomerSeqNo", align: "left", required: true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        placeholder: "label.AddThirdParty.lnExistingCustomerSeqNo",
                        width: "100%",
                        editable: !addThirdPartyDto.szCustomerName,
                        disabled: addThirdPartyDto.szCustomerName,
                        required: true,
                        value: addThirdPartyDto.szCustomerName || addThirdPartyDto.lnExistingCustomerSeqNo,
                        error: errors.lnExistingCustomerSeqNo,
                        onChange: (e) => handleChangeAddThirdParty("lnExistingCustomerSeqNo", e.target.value)
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.AddThirdParty.szCustomerName", align: "left", required: true }),
                    addThirdPartyDto.szNewCustomerRecordYN === "Y" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        placeholder: "Enter Third Party Name",
                        value: addThirdPartyDto.szCustomerName,
                        width: "100%",
                        editable: true,
                        required: true,
                        error: errors.szCustomerName,
                        onChange: (e) => handleChangeAddThirdParty("szCustomerName", e.target.value)
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      dc,
                      {
                        apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                        searchCode: "EXCUST",
                        setSelectedValue: (dataValue, row) => {
                          const selectedCustomerSeq = (row == null ? void 0 : row.iCustomerSeqNo) ?? "";
                          const selectedAddressSeq = (row == null ? void 0 : row.iaddressseq) ?? 0;
                          const selectedName = dataValue || (row == null ? void 0 : row.szName) || "";
                          setAddThirdPartyDto((prev) => ({
                            ...prev,
                            szCustomerName: selectedName,
                            lnExistingCustomerSeqNo: String(selectedCustomerSeq)
                          }));
                          setAddressRequestDto((prev) => ({
                            ...prev,
                            lnAddressSeq: Number(selectedAddressSeq) || 0,
                            szContactPerson: selectedName,
                            szAddress1: (row == null ? void 0 : row.szaddress1) || "",
                            szAddress2: (row == null ? void 0 : row.szaddress2) || "",
                            szCity: (row == null ? void 0 : row.szCity) || "",
                            szState: (row == null ? void 0 : row.szState) || ""
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            szCustomerName: false,
                            lnExistingCustomerSeqNo: false
                          }));
                        },
                        selectedValue: addThirdPartyDto.szCustomerName,
                        selectedColumn: "szName",
                        gridDefObj: gridExistingCustomerDefObj,
                        gridWidth: 450,
                        gridHeight: 300,
                        gridNoOfRowsPerPage: 5,
                        searchBoxHeight: 30,
                        searchBoxFontSize: 11,
                        error: Boolean(errors.szCustomerName || errors.lnExistingCustomerSeqNo),
                        searchBoxWidth: "100%",
                        placeholder: "label.AddThirdParty.szCustomerName"
                      }
                    )
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1, alignItems: "stretch", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
                    id: "label.AddThirdPartyAddressDetails",
                    defaultMessage: "Add Third Party Address Details"
                  }), align: "left" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 1, children: addressFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { sx: { mt: 1 }, size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: field.label, required: field.required, align: "left" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        placeholder: field.placeholder,
                        value: addressRequestDto[field.name],
                        width: "100%",
                        editable: true,
                        required: field.required,
                        error: errors[field.name],
                        onChange: (e) => handleChangeAddress(field.name, e.target.value)
                      }
                    )
                  ] }) }, field.name)) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { sx: { display: { xs: "none", md: "flex" }, justifyContent: "center", alignSelf: "stretch" }, size: { xs: false, md: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Divider,
                  {
                    orientation: "vertical",
                    flexItem: true,
                    sx: {
                      borderColor: "divider",
                      borderRightWidth: 1
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
                    id: "label.AddThirdPartyContactDetails",
                    defaultMessage: "Add Third Party Contact Details"
                  }), align: "left" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 1, children: contactFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { sx: { mt: 1 }, size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: field.label, required: field.required, align: "left" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        placeholder: field.placeholder,
                        value: addressRequestDto[field.name],
                        width: "90%",
                        editable: true,
                        required: field.required,
                        error: errors[field.name],
                        onChange: (e) => handleChangeAddress(field.name, e.target.value),
                        type: field.type || "text"
                      }
                    )
                  ] }) }, field.name)) })
                ] }) })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: resetForm,
            onClose: () => navigate("/homelayout/welcomepage"),
            disableToast: { save: true, reset: true, close: true }
          }
        )
      ]
    }
  );
}
const AddThirdParty = () => {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.Add Third Party",
        defaultMessage: "Add Third Party"
      }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Box,
        {
          className: "drs-page-container",
          sx: {
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            width: "100%"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddThirdPartyDetails, {})
        }
      )
    }
  );
};
export {
  AddThirdParty as default
};
