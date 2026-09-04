import { useCallback, useState, useRef, useEffect  } from "react";
import { Grid, Typography } from "@mui/material";
import { HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HLabel, HPaper, HTextField, SearchCommonBox, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";

import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { EmployerMasterAPI } from "./apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "@shared/config/apiConstants.jsx";
import "./portfolio-master/portfolio-master.screen.css"
import { useLocation } from "react-router-dom";

import { gridEmployerDefObj } from "../../../common/components/SearchGridDefObj";

/** Fixed label column width — matches Mail / master horizontal rows */
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

const emptyEmployerDto = () => ({
  szEmployerCode: "",
  szEmployerName: "",
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
  szPagerNo: "",
});

const EmployerMaster = () => {
  const intl = useIntl();
  const toast = useToast();

  const [employerRequestDto, setEmployerRequestDto] = useState(emptyEmployerDto);
  const [addressDto, setAddressDto] = useState(emptyAddressDto);
  const [szExtension, setSzExtension] = useState("");
  const employerCodeRef = useRef(null);
  const [isNewEmployer, setIsNewEmployer] = useState(true);

  const location = useLocation();
  const menuId =  location.state.menuId;

  const resetForm = useCallback(() => {
    setEmployerRequestDto(emptyEmployerDto());
    setAddressDto(emptyAddressDto());
    setSzExtension("");
    setIsNewEmployer(true);
  }, []);

  const applyFetchResponse = (employerData, addressData) => {
    setEmployerRequestDto({
      szEmployerCode: employerData.szEmployerCode || "",
      szEmployerName: employerData.szEmployerName || "",
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
      szPagerNo: addressData.szPagerNo || "",
    });
    setSzExtension(addressData.szExtension || "");
    setIsNewEmployer(false);
  };

  const fetchEmployerDetails = async (codeRaw) => {
    const code = String(codeRaw ?? "").trim();
    if (!code) {
      return;
    }
    console.log("Fetching employer details for code:", code, "with menuId:", menuId);
    try {
      const res = await HAxiosService.GET(
        EmployerMasterAPI.fetchEmployerDetails(code,menuId),
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
            defaultMessage: "EmployerMaster Details not found",
          }),
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          intl.formatMessage({
            id: "label.EmployerMaster.FetchError",
            defaultMessage: "Error fetching employerMaster Details",
          }),
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
    resetForm();
    document.getElementById("szEmployerCode")?.focus();
  };

  const buildPayload = () => ({
    employerRequestDto: {
      szEmployerCode: employerRequestDto.szEmployerCode,
      szEmployerName: employerRequestDto.szEmployerName,
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
      szPagerNo: addressDto.szPagerNo,
    },
  });

  const handleSave = async () => {
    const code = employerRequestDto.szEmployerCode?.trim();
    if (!code) {
      toast.error(
        intl.formatMessage({
          id: "label.EmployerMaster.CodeRequiredForSave",
          defaultMessage: "Employer code is required to save",
        }),
      );
      return { data: { status: "Failure" } };
    }

    try {
          let res;
            if (isNewEmployer) {
              // CREATE - Use POST
              res = await HAxiosService.POST(
                EmployerMasterAPI.saveEmployerDetails(menuId),
                buildPayload(),
              );
            } else {
              // UPDATE - Use PUT
              res = await HAxiosService.PUT(
                EmployerMasterAPI.saveEmployerDetails(menuId),
                buildPayload(),
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
        err.response?.data?.message ||
          intl.formatMessage({
            id: "label.EmployerMaster.Error",
            defaultMessage: "Error adding employer",
          }),
      );
      throw err;
    }
  };

  const handleDelete = async () => {
     if (!employerRequestDto.szEmployerCode?.trim()) {
      toast.error(intl.formatMessage({
          id: "label.EmployerMaster.CodeRequiredForDelete",
          defaultMessage: "Please enter Employer Code to delete",
        }),
      );
      return;
    }
    const code = employerRequestDto.szEmployerCode?.trim();
    if (!code) {
      resetForm();
      return { data: { status: "Success" } };
    }
    try {
      const res = await HAxiosService.DELETE(
        EmployerMasterAPI.deleteEmployerDetails(code,menuId),
      );
      if (res.status === 200 || res.status === "Success") {
        resetForm();
       return { success: true };

      }
      toast.error(
        res.data.msg ||
          intl.formatMessage({
            id: "label.EmployerMaster.DeleteFailed",
            defaultMessage: "Failed to delete employer",
          }),
      );
      return { data: { status: "Failure" } };
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          intl.formatMessage({
            id: "label.EmployerMaster.DeleteError",
            defaultMessage: "Error deleting employer",
          }),
      );
      throw err;
    }
  };

  const handleReset = () => {
    resetForm();
    return { data: { status: "Success" } };
  };

  return (
    <HBox className="container" marginTop={2}>
     
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
      {/* Breadcrumb */}
      <div className="portfolio-master-breadcrumb-text">
        <HBreadCrumb />
      </div>

      {/* Title */}
      <TitleBar
        title={intl.formatMessage({
          id: "label.EmployerMaster.title",
          defaultMessage: "Employers",
        })}
      />

      {/* Description */}
      <Typography
        variant="body1"
        className="portfolio-master-description"
      >
        {intl.formatMessage({
          id: "label.EmployerMaster.description",
          defaultMessage:
            "Maintain employer code, name, address, and contact details.",
        })}
      </Typography>
    </HBox>

    {/* Right Button */}
    <HBox
      styles={{
        marginTop: 25,
      }}
    >
      <HButton
        label="label.EmployerMaster.newEmployer"
        variant="contained"
        onClick={handleNewEmployer}
      />
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
                 <HBox  styles={{marginLeft: "-79px"}}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.selectEmployerSearch">
                  <SearchCommonBox
                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                    searchCode="ECDE"
                    setSelectedValue={handleEmployerSearchSelect}
                    selectedValue={employerRequestDto.szEmployerCode}
                    selectedColumn="szEmployerCode"
                    gridDefObj={gridEmployerDefObj}
                    gridWidth={350}
                    gridHeight={300}
                    gridNoOfRowsPerPage={2}
                    searchBoxWidth={220}
                    searchBoxHeight={30}
                    searchBoxFontSize={12}
                    placeholder="label.EmployerMaster.searchEmployerPlaceholder"
                  />
                </DrsLabelFieldRow>
                  </HBox>
              </Grid>

              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">
                  {intl.formatMessage({
                    id: "label.EmployerMaster.selectEmployerHint",
                    defaultMessage:
                      "Search and select an employer above, or click New employer to start a blank record.",
                  })}
                </Typography>
              </Grid>


              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DrsLabelFieldRow
                      labelId="label.EmployerMaster.szEmployerCode"
                      required
                    >
                      <HTextField
                        id={"szEmployerCode"}
                        width="100%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        required
                        value={employerRequestDto.szEmployerCode}
                        placeholder="label.EmployerMaster.phEmployerCode"
                        onChange={(e) =>
                          handleChangeEmployer("szEmployerCode", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DrsLabelFieldRow
                      labelId="label.EmployerMaster.szEmployerName"
                      required
                    >
                      <HTextField
                        width="100%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        required
                        value={employerRequestDto.szEmployerName}
                        placeholder="label.EmployerMaster.phEmployerName"
                        onChange={(e) =>
                          handleChangeEmployer("szEmployerName", e.target.value)
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
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      disabled={false}
                      required={field.name === "szAddress1"}
                      value={addressDto[field.name]}
                      placeholder={field.ph}
                      onChange={(e) =>
                        handleChangeAddress(field.name, e.target.value)
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
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    required
                    value={addressDto.szCity}
                    placeholder="label.EmployerMaster.phCity"
                    onChange={(e) =>
                      handleChangeAddress("szCity", e.target.value)
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
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    required
                    value={addressDto.szZip}
                    placeholder="label.EmployerMaster.phZip"
                    onChange={(e) =>
                      handleChangeAddress("szZip", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szState">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    value={addressDto.szState}
                    placeholder="label.EmployerMaster.phState"
                    onChange={(e) =>
                      handleChangeAddress("szState", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szCountry">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    value={addressDto.szCountry}
                    placeholder="label.EmployerMaster.phCountry"
                    onChange={(e) =>
                      handleChangeAddress("szCountry", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
                </Grid>
              </HBox>
            </HPaper>
          </Grid>
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
                    <DrsLabelFieldRow labelId="label.EmployerMaster.szPhone1">
                      <HTextField
                        width="100%"
                        align={ALIGNMENT.TEXT}
                        editable
                        disabled={false}
                        type="phone"
                        value={addressDto.szPhone1}
                        placeholder="label.EmployerMaster.phPhone"
                        onChange={(e) =>
                          handleChangeAddress("szPhone1", e.target.value)
                        }
                      />
                    </DrsLabelFieldRow>
                  </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szExtension">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    value={szExtension}
                    placeholder="label.EmployerMaster.phExtension"
                    onChange={(e) => setSzExtension(e.target.value)}
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szFax">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    type="phone"
                    value={addressDto.szFax}
                    placeholder="label.EmployerMaster.phFax"
                    onChange={(e) =>
                      handleChangeAddress("szFax", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szMobileNo">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    type="phone"
                    value={addressDto.szMobileNo}
                    placeholder="label.EmployerMaster.phMobile"
                    onChange={(e) =>
                      handleChangeAddress("szMobileNo", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szPagerNo">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    value={addressDto.szPagerNo}
                    placeholder="label.EmployerMaster.phPager"
                    onChange={(e) =>
                      handleChangeAddress("szPagerNo", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
              <Grid size={12}>
                <DrsLabelFieldRow labelId="label.EmployerMaster.szMailId">
                  <HTextField
                    width="100%"
                    align={ALIGNMENT.TEXT}
                    editable
                    disabled={false}
                    value={addressDto.szMailId}
                    placeholder="label.EmployerMaster.phEmail"
                    onChange={(e) =>
                      handleChangeAddress("szMailId", e.target.value)
                    }
                  />
                </DrsLabelFieldRow>
              </Grid>
            </Grid>
          </HBox>
        </HPaper>
          </Grid>
        </Grid>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onDelete={handleDelete}
        onReset={handleReset}
        disableToast={{reset: true }}
      />
    </HBox>
  );
};

export default EmployerMaster;
