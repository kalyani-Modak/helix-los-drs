import React, { useCallback, useState } from "react";
import { Grid, Stack, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast, HAxiosService, HButtonBar, HDropdown, HLabel, HRadio, HTextField, SearchCommonBox, HBox } from "@helix/component-library";

import { ThirdPartyAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { useLocation } from "react-router-dom";

import { gridExistingCustomerDefObj } from "../../../../common/components/SearchGridDefObj";
const initialThirdParty = () => ({
  szThirdPartyType: "",
  szNewCustomerRecordYN: "N",
  szCustomerName: "",
  lnExistingCustomerSeqNo: "",
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
  szMailId: "",
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
    lnExistingCustomerSeqNo: lnExisting,
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
    szMailId: (addressRequestDto.szMailId || "").trim(),
  };

  return {
    addThirdPartyDto: addThirdPartyPayload,
    addressRequestDto: addressRequestPayload,
  };
}

export default function AddThirdPartyDetails() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [addThirdPartyDto, setAddThirdPartyDto] = useState(initialThirdParty);
  const [addressRequestDto, setAddressRequestDto] = useState(initialAddress);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const resetForm = useCallback(() => {
    setAddThirdPartyDto(initialThirdParty());
    setAddressRequestDto(initialAddress());
    setErrors({});
  }, []);

  const handleChangeAddThirdParty = useCallback((field, value) => {
    setAddThirdPartyDto((prev) => {
      const next = { ...prev, [field]: value };
      // Clear specific fields when switching between New and Existing customer
      if (field === "szNewCustomerRecordYN") {
        next.szCustomerName = "";
        next.lnExistingCustomerSeqNo = "";
        // Reset address details and errors as well
        setAddressRequestDto(initialAddress());
        setErrors({});
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleChangeAddress = useCallback((field, value) => {
    setAddressRequestDto((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!addThirdPartyDto.szThirdPartyType) {
      newErrors.szThirdPartyType = true;
    }
    if (!addThirdPartyDto.szNewCustomerRecordYN) {
      newErrors.szNewCustomerRecordYN = true;
    }
    if (
      addThirdPartyDto.szNewCustomerRecordYN === "N" &&
      !String(addThirdPartyDto.lnExistingCustomerSeqNo ?? "").trim()
    ) {
      newErrors.lnExistingCustomerSeqNo = true;
    } else if (addThirdPartyDto.szNewCustomerRecordYN === "N") {
      const parsed = parseExistingCustomerSeq(addThirdPartyDto.lnExistingCustomerSeqNo);
      if (parsed == null) {
        newErrors.lnExistingCustomerSeqNo = true;
      }
    }
    if (addThirdPartyDto.szNewCustomerRecordYN === "N" && !addThirdPartyDto.szCustomerName?.trim()) {
      newErrors.szCustomerName = true;
    }
    if (addThirdPartyDto.szNewCustomerRecordYN === "Y" && !addThirdPartyDto.szCustomerName?.trim()) {
      newErrors.szCustomerName = true;
    }
    if (!addressRequestDto.szContactPerson?.trim()) {
      newErrors.szContactPerson = true;
    }
    if (!addressRequestDto.szAddress1?.trim()) {
      newErrors.szAddress1 = true;
    }
    if (!addressRequestDto.szAddress2?.trim()) {
      newErrors.szAddress2 = true;
    }
    if (!addressRequestDto.szCountry?.trim()) {
      newErrors.szCountry = true;
    }
    if (!addressRequestDto.szState?.trim()) {
      newErrors.szState = true;
    }
    if (!addressRequestDto.szPhone1?.trim()) {
      newErrors.szPhone1 = true;
    }
    if (!addressRequestDto.szMobileNo?.trim()) {
      newErrors.szMobileNo = true;
    }
    if (addressRequestDto.szMailId && !/\S+@\S+\.\S+/.test(addressRequestDto.szMailId)) {
      newErrors.szMailId = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [addThirdPartyDto, addressRequestDto]);

  const handleSave = useCallback(async () => {
    if (!selectedRow?.ACNT_SEQNO) {
      toast.error(
        intl.formatMessage({
          id: "label.addThirdParty.noAccountSelected",
          defaultMessage: "No account selected. Open an account from the worklist.",
        })
      );
      return;
    }
    if (!validateForm()) {
      if (errors.szMailId || (addressRequestDto.szMailId && !/\S+@\S+\.\S+/.test(addressRequestDto.szMailId))) {
        toast.error(
          intl.formatMessage({
            id: "thirdparty.invalid.email",
            defaultMessage: "Please enter a valid Email ID (e.g., name@example.com)",
          })
        );
      } else {
      toast.error(
        intl.formatMessage({
          id: "thirdparty.mandatory.fields",
          defaultMessage: "Please fill all mandatory fields",
        })
      );
    }
      return;
    }

    const payload = buildWrapperPayload(addThirdPartyDto, addressRequestDto);

    try {
      const res = await HAxiosService.POST(ThirdPartyAPI.AddThirdParty(screenMenuId), payload);
      const httpOk = res?.status === 200 || res?.status === 201;
      const data = res?.data;

      if (
        data &&
        typeof data === "object" &&
        data.status === "Failure" &&
        data.message === "Validation Failed"
      ) {
        handleValidationErrors(intl, toast, data.responseJson);
        return;
      }

      if (httpOk && data != null) {
        toast.success(
          intl.formatMessage({
            id: "save.success",
            defaultMessage: "Saved successfully",
          })
        );
        resetForm();
        return;
      }

      if (res?.status === 406) {
        toast.error(
          intl.formatMessage({
            id: "save.failed",
            defaultMessage: "Failed to save",
          })
        );
        return;
      }

      toast.error(
        intl.formatMessage({
          id: "save.failed",
          defaultMessage: "Failed to save",
        })
      );
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        intl.formatMessage({ id: "save.error", defaultMessage: "Error saving" });
      toast.error(msg);
    }
  }, [
    addThirdPartyDto,
    addressRequestDto,
    intl,
    resetForm,
    selectedRow,
    toast,
    validateForm,
  ]);

  if (!selectedRow) {
    return (
      <HBox sx={{ p: 2 }}>
        <HLabel value={intl.formatMessage({
          id: "label.addThirdParty.noAccountSelected",
          defaultMessage: "No account selected. Open an account from the worklist to add a third party.",
        })} align="left" />
      </HBox>
    );
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
    { label: "label.AddThirdParty.szZip", name: "szZip", placeholder: "label.AddThirdParty.szZip" },
  ];

  const contactFields = [
    { label: "label.AddThirdParty.szPhone1", name: "szPhone1", required: true, placeholder: "label.AddThirdParty.szPhone1", type: "phone" },
    { label: "label.AddThirdParty.extension", name: "szExtension", required: false, placeholder: "label.AddThirdParty.extension" },
    { label: "label.AddThirdParty.szFax", name: "szFax", placeholder: "label.AddThirdParty.szFax" },
    { label: "label.AddThirdParty.szMobileNo", name: "szMobileNo", required: true, placeholder: "label.AddThirdParty.szMobileNo", type: "phone" },
    { label: "label.AddThirdParty.szMailId", name: "szMailId", placeholder: "label.AddThirdParty.szMailId" },
  ];

  return (
    <HBox
      className="drs-page-container"
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <HBox
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          p: { xs: 1.5, sm: 2 },
        
        }}
      >
        <Stack spacing={2.5} sx={{ maxWidth: 1320, mx: "auto" }}>
          <Stack spacing={1}>
            <HLabel value={intl.formatMessage({
              id: "label.Add Third Party Information",
              defaultMessage: "Add Third Party Information",
            })} align="left" />
            <Divider />
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.5}>
                  <HLabel value="label.AddThirdParty.szThirdPartyType" required align="left" />
                  <HDropdown
                    name="szThirdPartyType"
                    width="100%"
                    value={addThirdPartyDto.szThirdPartyType}
                    error={errors.szThirdPartyType}
                    onChange={(e) =>
                      handleChangeAddThirdParty(
                        "szThirdPartyType",
                        e?.target ? e.target.value : e
                      )
                    }
                    placeholder={intl.formatMessage({
                      id: "dropdown.thirdPartyType.placeholder",
                      defaultMessage: "Select Type",
                    })}
                    options={[
                      {
                        value: "T",
                        label: intl.formatMessage({
                          id: "dropdown.thirdPartyType.accountRelationManager",
                          defaultMessage: "Account Relation Manager",
                        }),
                      },
                      {
                        value: "E",
                        label: intl.formatMessage({
                          id: "dropdown.thirdPartyType.personInCharge",
                          defaultMessage: "Person In Charge(PIC)",
                        }),
                      },
                    ]}
                  />
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0}>
                  <HLabel value={intl.formatMessage({
                    id: "label.addThirdParty.customerType",
                    defaultMessage: "Customer type",
                  })} align="left" required />
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                    <HRadio
                      label="label.AddThirdParty.szNewCustomerRecordYN"
                      value="Y"
                      checked={addThirdPartyDto.szNewCustomerRecordYN === "Y"}
                      onChange={(e) => handleChangeAddThirdParty("szNewCustomerRecordYN", e.target.value)}
                      name="szNewCustomerRecordYN"
                      required
                    />
                    <HRadio
                      label="label.AddThirdParty.szExistingCustomerRecordYN"
                      value="N"
                      checked={addThirdPartyDto.szNewCustomerRecordYN === "N"}
                      onChange={(e) => handleChangeAddThirdParty("szNewCustomerRecordYN", e.target.value)}
                      name="szNewCustomerRecordYN"
                      required
                    />
                  </Stack>
                </Stack>
              </Grid>
              {addThirdPartyDto.szNewCustomerRecordYN === "N" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={0.5}>
                    <HLabel value="label.AddThirdParty.lnExistingCustomerSeqNo" align="left" required={true}/>
                    <HTextField
                    placeholder="label.AddThirdParty.lnExistingCustomerSeqNo"
                    width="100%"
                    editable={!addThirdPartyDto.szCustomerName}
                    disabled={addThirdPartyDto.szCustomerName}
                    required={true}
                    value={addThirdPartyDto.szCustomerName || addThirdPartyDto.lnExistingCustomerSeqNo}
                    error={errors.lnExistingCustomerSeqNo}
                    onChange={(e) =>
                      handleChangeAddThirdParty("lnExistingCustomerSeqNo", e.target.value)
                      }
                    />
                  </Stack>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.5}>
                  <HLabel value="label.AddThirdParty.szCustomerName" align="left" required={true}/>
                  {addThirdPartyDto.szNewCustomerRecordYN === "Y" ? (
                    <HTextField
                      placeholder="Enter Third Party Name"
                      value={addThirdPartyDto.szCustomerName}
                      width="100%"
                      editable={true}
                      required={true}
                      error={errors.szCustomerName}
                      onChange={(e) => handleChangeAddThirdParty("szCustomerName", e.target.value)}
                    />
                  ) : (
                    <SearchCommonBox
                      apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                      searchCode="EXCUST"
                      setSelectedValue={(dataValue, row) => {
                        const selectedCustomerSeq = row?.iCustomerSeqNo ?? "";
                        const selectedAddressSeq = row?.iaddressseq ?? 0;
                        const selectedName = dataValue || row?.szName || "";

                        setAddThirdPartyDto((prev) => ({
                          ...prev,
                          szCustomerName: selectedName,
                          lnExistingCustomerSeqNo: String(selectedCustomerSeq),
                        }));

                        setAddressRequestDto((prev) => ({
                          ...prev,
                          lnAddressSeq: Number(selectedAddressSeq) || 0,
                          szContactPerson: selectedName,
                          szAddress1: row?.szaddress1 || "",
                          szAddress2: row?.szaddress2 || "",
                          szCity: row?.szCity || "",
                          szState: row?.szState || "",
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          szCustomerName: false,
                          lnExistingCustomerSeqNo: false,
                        }));
                      }}
                      selectedValue={addThirdPartyDto.szCustomerName}
                      selectedColumn="szName"
                      gridDefObj={gridExistingCustomerDefObj}
                      gridWidth={450}
                      gridHeight={300}
                      gridNoOfRowsPerPage={5}
                      searchBoxHeight={30}
                      searchBoxFontSize={11}
                      error={Boolean(errors.szCustomerName || errors.lnExistingCustomerSeqNo)}
                      searchBoxWidth="100%"
                      placeholder={"label.AddThirdParty.szCustomerName"}
                    />
                  )}

                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Grid container spacing={1} alignItems="stretch">
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack>
                <HLabel value={intl.formatMessage({
                  id: "label.AddThirdPartyAddressDetails",
                  defaultMessage: "Add Third Party Address Details",
                })} align="left" />
                <Divider />
                <Grid container spacing={1}>
                  {addressFields.map((field) => (
                    <Grid key={field.name} sx={{ mt: 1 }} size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={0.5}>
                        <HLabel value={field.label} required={field.required} align="left" />
                        <HTextField
                          placeholder={field.placeholder}
                          value={addressRequestDto[field.name]}
                          width="100%"
                          editable
                          required={field.required}
                          error={errors[field.name]}
                          onChange={(e) => handleChangeAddress(field.name, e.target.value)}
                        />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
            {/* VERTICAL DIVIDER */}
            <Grid sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", alignSelf: "stretch", }} size={{ xs: false, md: 1 }}>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: "divider",
                  borderRightWidth: 1,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack>
                <HLabel value={intl.formatMessage({
                  id: "label.AddThirdPartyContactDetails",
                  defaultMessage: "Add Third Party Contact Details",
                })} align="left" />
                <Divider />
                <Grid container spacing={1}>
                  {contactFields.map((field) => (
                    <Grid key={field.name} sx={{ mt: 1 }} size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={0.5}>
                        <HLabel value={field.label} required={field.required} align="left" />
                        <HTextField
                          placeholder={field.placeholder}
                          value={addressRequestDto[field.name]}
                          width="90%"
                          editable
                          required={field.required}
                          error={errors[field.name]}
                          onChange={(e) => handleChangeAddress(field.name, e.target.value)}
                          type={field.type || "text"}
                        />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={resetForm}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, reset: true, close: true }}
      />
    </HBox>
  );
}
