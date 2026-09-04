import { useCallback, useState, useRef, useEffect } from "react";
import { Grid, Typography, Divider  } from "@mui/material";
import { HAxiosService, ALIGNMENT, HBox, HButtonBar, HLabel, HPaper, HTextField, HDatePicker, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";

import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { OrganizationMasterAPI } from "./apiEndpoints.jsx"
import "./portfolio-master/portfolio-master.screen.css"

import dayjs from "dayjs";
import { useLocation } from "react-router-dom";	



const DRS_FORM_LABEL_WIDTH = 140;

const DrsLabelFieldRow = ({ labelId, required, children }) => (
  <HBox
    styles={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      width: "100%",
    }}
  >
    <HLabel
      width={DRS_FORM_LABEL_WIDTH}
      value={labelId}
      required={Boolean(required)}
      align="right"
    />
    <HBox styles={{ flex: 1, minWidth: 0 }}>{children}</HBox>
  </HBox>
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
  szFax: "",
});

const OrganizationMaster = () => {
  const intl = useIntl();
  const toast = useToast();

  const [organizationDto, setOrganizationDto] = useState(emptyOrganizationDto);
  const realm = sessionStorage.getItem("SEC_REALM");

  const realmRef = useRef(realm);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const resetForm = useCallback(() => {
    setOrganizationDto(emptyOrganizationDto());
  }, []);

  const applyFetchResponse = (responseData) => {
    // Extract data from wrapper response - using the correct key names
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
      szFax: addressData.szFax || "",
    });
  };

  const fetchOrganizationDetails = async (codeRaw) => {
    const code = String(codeRaw ?? "").trim();
    if (!code) {
      return;
    }

    try {
      const res = await HAxiosService.GET(
        OrganizationMasterAPI.OrganizationDetails(screenMenuId)+`?code=${code}`,
      );
      console.log("Fetch response:", res);

      if (res.data && res.data.status === "Success") {
        const responseJson = res.data.responseJson || {};
        applyFetchResponse(responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "label.OrganizationMaster.NotFound",
            defaultMessage: "Organization details not found",
          }),
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(
        err.response?.data?.message ||
          intl.formatMessage({
            id: "label.OrganizationMaster.FetchError",
            defaultMessage: "Error fetching organization details",
          }),
      );
    }
  };

  useEffect(() => {
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
        szUrl: organizationDto.szUrl,
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
        szPhone1: organizationDto.szTelephone,
      },
    };
  };

  const handleSave = async () => {
    const code = organizationDto.szOrgCode || realmRef.current;

    if (!code) {
      toast.error(
        intl.formatMessage({
          id: "label.OrganizationMaster.CodeRequiredForSave",
          defaultMessage: "Organization code is required to save",
        }),
      );
      return { success: false, message: "Organization code is required" };
    }

    const requiredFields = [
        { field: 'szOrgName', label: 'Organization Name' },
        { field: 'szCurrencyCode', label: 'Base Currency' },
        { field: 'dtBusiDate', label: 'Business Date' },
        { field: 'szAddress1', label: 'Address Line 1' },
        { field: 'szCity', label: 'City' },
        { field: 'szZip', label: 'Zip/Postal Code' },
    ];

    const missingFields = requiredFields.filter(
        ({ field }) => !organizationDto[field] || organizationDto[field].trim() === ''
    );

    if (missingFields.length > 0) {
        const fieldNames = missingFields.map(({ label }) => label).join(', ');
        return { success: false, message: `Missing required fields: ${fieldNames}` };
    }


    if (!organizationDto.szOrgCode) {
      setOrganizationDto((prev) => ({ ...prev, szOrgCode: code }));
    }

    try {
      const payload = buildPayload();
      console.log("Sending payload:", payload);

      const res = await HAxiosService.PUT(
        OrganizationMasterAPI.OrganizationDetails(screenMenuId),
        payload,
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

      if (err.response?.data?.responseJson) {
        handleValidationErrors(intl, toast, err.response.data.responseJson);
        errorMsg = "Validation failed";
      } else if (err.response?.data?.message) {
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

  return (
    <HBox className="container">
      <HBox className="portfolio-master-header-card">
        <HBox
          styles={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
            width: "100%",
          }}
        >
          <HBox
            styles={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <HBox className="portfolio-master-breadcrumb-text">
              <HBreadCrumb />
            </HBox>
            <TitleBar
              title={intl.formatMessage({
                id: "label.OrganizationMaster.title",
                defaultMessage: "Organization Master",
              })}
            />
            <Typography
              variant="body1"
              className="portfolio-master-description"
            >
              {intl.formatMessage({
                id: "label.OrganizationMaster.description",
                defaultMessage:
                  "Standardize organization-level system parameters: address, contact, working hours, base currency.",
              })}
            </Typography>
          </HBox>
        </HBox>
      </HBox>

      <HBox
        styles={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <HPaper elevation={0}>
          <HBox
            styles={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: 16,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DrsLabelFieldRow
                      labelId="label.OrganizationMaster.szOrganizationCode"
                      required
                    >
                      <HTextField
                        id={"szOrganizationCode"}
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={true}
                        required
                        value={organizationDto.szOrgCode}
                        placeholder="label.OrganizationMaster.phOrganizationCode"
                        onChange={(e) =>
                          handleChangeOrganization("szOrgCode", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DrsLabelFieldRow
                      labelId="label.OrganizationMaster.szOrganizationName"
                      required
                    >
                      <HTextField
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={true}
                        required
                        value={organizationDto.szOrgName}
                        placeholder="label.OrganizationMaster.phOrganizationName"
                        onChange={(e) =>
                          handleChangeOrganization("szOrgName", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </HBox>
        </HPaper>

        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <HPaper elevation={0}>
              <HBox
                styles={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 16,
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {intl.formatMessage({
                        id: "label.EmployerMaster.AddressDetails",
                        defaultMessage: "Address details",
                      })}
                    </Typography>
                  </Grid>

                  {[
                    {
                      id: "label.EmployerMaster.szAddress1",
                      name: "szAddress1",
                      ph: "label.EmployerMaster.phAddress1",
                    },
                    {
                      id: "label.EmployerMaster.szAddress2",
                      name: "szAddress2",
                      ph: "label.EmployerMaster.phAddress2",
                    },
                    {
                      id: "label.EmployerMaster.szAddress3",
                      name: "szAddress3",
                      ph: "label.EmployerMaster.phAddress3",
                    },
                    {
                      id: "label.EmployerMaster.szAddress4",
                      name: "szAddress4",
                      ph: "label.EmployerMaster.phAddress4",
                    },
                  ].map((field) => (
                    <Grid key={field.name} size={12}>
                      <DrsLabelFieldRow
                        labelId={field.id}
                        required={field.name === "szAddress1"}
                      >
                        <HTextField
                          width="49%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          required={field.name === "szAddress1"}
                          value={organizationDto[field.name]}
                          placeholder={field.ph}
                          onChange={(e) =>
                            handleChangeOrganization(field.name, e.target.value)
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>
                  ))}

                  <Grid size={12}>
                    <DrsLabelFieldRow
                      labelId="label.EmployerMaster.szCity"
                      required
                    >
                      <HTextField
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        required
                        value={organizationDto.szCity}
                        placeholder="label.EmployerMaster.phCity"
                        onChange={(e) =>
                          handleChangeOrganization("szCity", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                  <Grid size={12}>
                    <DrsLabelFieldRow
                      labelId="label.EmployerMaster.szZip"
                      required
                    >
                      <HTextField
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        required
                        value={organizationDto.szZip}
                        placeholder="label.EmployerMaster.phZip"
                        onChange={(e) =>
                          handleChangeOrganization("szZip", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                  <Grid size={12}>
                    <DrsLabelFieldRow labelId="label.EmployerMaster.szState">
                      <HTextField
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        value={organizationDto.szState}
                        placeholder="label.EmployerMaster.phState"
                        onChange={(e) =>
                          handleChangeOrganization("szState", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                  <Grid size={12}>
                    <DrsLabelFieldRow labelId="label.EmployerMaster.szCountry">
                      <HTextField
                        width="49%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        value={organizationDto.szCountry}
                        placeholder="label.EmployerMaster.phCountry"
                        onChange={(e) =>
                          handleChangeOrganization("szCountry", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                </Grid>
              </HBox>
            </HPaper>
          </Grid>

          <Grid sx={{ position: "relative" }} size={{ xs: 12, md: 6 }}>
            <Divider
              orientation="vertical"
              sx={{
                position: "absolute",
                left: "-8px",
                top: 0,
                bottom: 0,
                borderColor: "#e0e0e0",
              }}
            />
            <Grid size={{ xs: 12, md: 6 }}>
              <HPaper elevation={0}>
                <HBox
                  styles={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 16,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {intl.formatMessage({
                          id: "label.EmployerMaster.ContactDetails",
                          defaultMessage: "Contact details",
                        })}
                      </Typography>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow labelId="label.OrganizationMaster.szTelephone">
                        <HTextField
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          type="phone"
                          value={organizationDto.szTelephone}
                          placeholder="label.OrganizationMaster.phTelephone"
                          onChange={(e) =>
                            handleChangeOrganization(
                              "szTelephone",
                              e.target.value,
                            )
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow labelId="label.EmployerMaster.szFax">
                        <HTextField
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          type="phone"
                          value={organizationDto.szFax}
                          placeholder="label.EmployerMaster.phFax"
                          onChange={(e) =>
                            handleChangeOrganization("szFax", e.target.value)
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow labelId="label.OrganizationMaster.szWebsiteUrl">
                        <HTextField
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          value={organizationDto.szUrl}
                          placeholder="label.OrganizationMaster.szWebsiteUrl"
                          onChange={(e) =>
                            handleChangeOrganization("szUrl", e.target.value)
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>

                    <Grid size={12}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ mt: 1 }}
                      >
                        {intl.formatMessage({
                          id: "label.OrganizationMaster.WorkingHours",
                          defaultMessage: "Working Hours",
                        })}
                      </Typography>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow labelId="label.OrganizationMaster.szWorkingStart">
                        <HTextField
                          type="time"
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          value={organizationDto.szWorkingStart}
                          placeholder="HH:MM"
                          onChange={(e) =>
                            handleChangeOrganization(
                              "szWorkingStart",
                              e.target.value,
                            )
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>
                    <Grid size={12}>
                      <DrsLabelFieldRow labelId="label.OrganizationMaster.szWorkingEnd">
                        <HTextField
                          type="time"
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          value={organizationDto.szWorkingEnd}
                          placeholder="HH:MM"
                          onChange={(e) =>
                            handleChangeOrganization(
                              "szWorkingEnd",
                              e.target.value,
                            )
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow
                        labelId="label.OrganizationMaster.szBaseCurrency"
                        required
                      >
                        <HTextField
                          width="200%"
                          align={ALIGNMENT.TEXT}
                          editable
                          disabled={false}
                          required
                          value={organizationDto.szCurrencyCode}
                          placeholder="label.OrganizationMaster.szBaseCurrency"
                          onChange={(e) =>
                            handleChangeOrganization(
                              "szCurrencyCode",
                              e.target.value,
                            )
                          }
                        />
                      </DrsLabelFieldRow>
                    </Grid>

                    <Grid size={12}>
                      <DrsLabelFieldRow
                        labelId="label.OrganizationMaster.szBusinessDate"
                        required
                      >
                        <HDatePicker
                          value={getDateValue(organizationDto.dtBusiDate)}
                          onChange={(newVal) => {
                            const formattedDate =
                              newVal && newVal.isValid
                                ? newVal.format("YYYY-MM-DD")
                                : "";
                            handleChangeOrganization(
                              "dtBusiDate",
                              formattedDate,
                            );
                          }}
                          align={ALIGNMENT.DATE}
                          sx={{ width: "100%" }}
                          width="200%"
                          required
                        />
                      </DrsLabelFieldRow>
                    </Grid>
                  </Grid>
                </HBox>
              </HPaper>
            </Grid>
          </Grid>
        </Grid>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        disableToast={{ reset: true }}
      />
    </HBox>
  );
};

export default OrganizationMaster;
