import { useState, useEffect, useCallback } from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, ALIGNMENT, HButtonBar, HCheckBox, HBox, HDropdown, HLabel, HPaper, HTextField, TitleBar, HBreadCrumb, SearchCommonBox } from "@helix/component-library";

import { CollectorMasterAPI } from "../apiEndpoints";

import { gridCollectorDefObj } from "../../../../common/components/SearchGridDefObj";
import { SEARCH_API_ENDPOINTS } from '@shared/config/apiConstants.jsx';
const COLLECTOR_FORM_LABEL_WIDTH = 140;

const CollectorLabelFieldRow = ({ labelId, required, children }) => (
  <HBox
    styles={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      width: "80%",
    }}
  >
    <HLabel
      width={COLLECTOR_FORM_LABEL_WIDTH}
      value={labelId}
      required={Boolean(required)}
      align="right"
    />
    <HBox styles={{ flex: 1, minWidth: 0 }}>{children}</HBox>
  </HBox>
);

const emptyCollectorDto = () => ({
  szCollectorCode: "",
  szCollectorName: "",
  szType: "",
  szAgencyType: "",
  szAgencyCategory: "",
  szIsSupervisor: "N",
  szSupervisorCode: "",
  lnMaxCases: "",
  szShiftStart: "",
  szShiftEnd: "",
  szHandlesReceiptBooksYN: "N",
  szIssueReceiptYN: "N",
  dbCashLimit: "",
  dbAdhocCashLimit: "",
  szKeycloakRefId: "",
  szMode: "E",
  szOperationMode: "",
});

const emptyAddressDto = () => ({
  szAddressType: "RS",
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

const CollectorMasterScreen = ({ injectState, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const routeState = injectState ?? location.state ?? {};
  const incomingRow = routeState.collectorRow || null;
  const incomingCode =
    routeState.szCollectorCode || incomingRow?.szCollectorCode || null;

  const handleClose = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate("/homelayout/collectorMaster");
    }
  }, [onClose, navigate]);

  const intl = useIntl();
  const toast = useToast();

  const [collectorDto, setCollectorDto] = useState(emptyCollectorDto);
  const [addressDto, setAddressDto] = useState(emptyAddressDto);
  const [collectorTypes, setCollectorTypes] = useState([]);

  useEffect(() => {
    HAxiosService.GET(`${CollectorMasterAPI.CollectorDetails(screenMenuId)}/fetchCollectorTypes?szConditionType=${"COLLECTOR_TYPE"}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setCollectorTypes(
            res.data.responseJson.map((item) => ({
              label: intl.formatMessage({
                id: item.szi18nDescription,
                defaultMessage: item.szDescription,
              }),
              value: item.szCondition,
            })),
          );
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            id: "label.collector.failedLoadTypes",
            defaultMessage: "Failed to load collector types",
          }),
        ),
      );
  }, [intl]);

  const applyCollectorResponse = useCallback((col = {}, addr = {}) => {
    setCollectorDto({
      szCollectorCode: col.szCollectorCode || "",
      szCollectorName: col.szCollectorName || "",
      szType: col.szType || "",
      szAgencyType: col.szAgencyType || "",
      szAgencyCategory: col.szAgencyCategory || "",
      szIsSupervisor: col.szIsSupervisor ? "Y" : "N",
      szSupervisorCode: col.szSupervisorCode,
      lnMaxCases:
        col.lnMaxCases != null
          ? String(col.lnMaxCases)
          : col.maxCases != null
          ? String(col.maxCases)
          : "",
      szShiftStart: col.szShiftStart || "",
      szShiftEnd: col.szShiftEnd || "",
      szHandlesReceiptBooksYN:
        col.szHandlesReceiptBooksYN || (col.canHandleReceiptBook ? "Y" : "N"),
      szIssueReceiptYN:
        col.szIssueReceiptYN || (col.canIssueReceipt ? "Y" : "N"),
      dbCashLimit: col.dbCashLimit != null ? String(col.dbCashLimit) : "",
      dbAdhocCashLimit:
        col.dbAdhocCashLimit != null ? String(col.dbAdhocCashLimit) : "",
      szKeycloakRefId: col.szKeycloakRefId || "",
      szMode: "E",
      szOperationMode: col.szOperationMode || "",
    });

    setAddressDto({
      szAddressType: addr.szAddressType || "RS",
      szPartitionCode: addr.szPartitionCode || "001",
      szAddress1: addr.szAddress1 || "",
      szAddress2: addr.szAddress2 || "",
      szAddress3: addr.szAddress3 || "",
      szAddress4: addr.szAddress4 || "",
      szCity: addr.szCity || "",
      szZip: addr.szZip || "",
      szState: addr.szState || "",
      szCountry: addr.szCountry || "",
      szPhone1: addr.szPhone1 || "",
      szFax: addr.szFax || "",
      szMailId: addr.szMailId || "",
      szMobileNo: addr.szMobileNo || "",
      szPagerNo: addr.szPagerNo || "",
    });
  }, []);

  const fetchCollectorDetails = useCallback(
    async (code) => {
      if (!code) return;
      try {
        const res = await HAxiosService.GET(
          `${CollectorMasterAPI.CollectorDetails(screenMenuId)}/fetchCollectorDetails?szCollectorCode=${code}`,
        );
        if (res.data?.status === "Success" && res.data.responseJson) {
          const responseJson = res.data.responseJson;
          const col = responseJson.collectorMasterDto || responseJson || {};
          const addr = responseJson.addressDto || {};
          applyCollectorResponse(col, addr);
        } else {
          toast.error(
            intl.formatMessage({
              id: "label.collector.fetchFailed",
              defaultMessage: "Failed to fetch collector details",
            }),
          );
        }
      } catch {
        toast.error(
          intl.formatMessage({
            id: "label.collector.fetchFailed",
            defaultMessage: "Failed to fetch collector details",
          }),
        );
      }
    },
    [intl, toast, applyCollectorResponse],
  );

  useEffect(() => {
    if (incomingRow) {
      applyCollectorResponse(incomingRow, {});
      fetchCollectorDetails(incomingRow.szCollectorCode);
      return;
    }
    if (incomingCode) {
      fetchCollectorDetails(incomingCode);
      return;
    }
    setCollectorDto(emptyCollectorDto());
    setAddressDto(emptyAddressDto());
  }, [incomingCode, incomingRow]);

  const handleChangeCollector = (field, value) => {
    setCollectorDto((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeAddress = (field, value) => {
    setAddressDto((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => ({
    collectorMasterDto: {
      szKeycloakRefId: collectorDto.szKeycloakRefId || "",
      szCollectorCode: collectorDto.szCollectorCode,
      szCollectorName: collectorDto.szCollectorName,
      szType: collectorDto.szType || null,
      szAgencyType: collectorDto.szAgencyType || null,
      szAgencyCategory: collectorDto.szAgencyCategory || null,
      szIsSupervisor: collectorDto.szIsSupervisor || null,
      szSupervisorCode: collectorDto.szSupervisorCode || null,
      lnMaxCases:
        collectorDto.lnMaxCases !== "" && collectorDto.lnMaxCases != null
          ? Number(collectorDto.lnMaxCases)
          : null,
      szMode: "E",
      szShiftStart: collectorDto.szShiftStart || null,
      szShiftEnd: collectorDto.szShiftEnd || null,
      szOperationMode: collectorDto.szOperationMode || null,
      dbAdhocCashLimit:
        collectorDto.dbAdhocCashLimit !== "" &&
        collectorDto.dbAdhocCashLimit != null
          ? Number(collectorDto.dbAdhocCashLimit)
          : null,
      dbCashLimit:
        collectorDto.dbCashLimit !== "" && collectorDto.dbCashLimit != null
          ? Number(collectorDto.dbCashLimit)
          : null,
      szHandlesReceiptBooksYN: collectorDto.szHandlesReceiptBooksYN || null,
      szIssueReceiptYN: collectorDto.szIssueReceiptYN || null,
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
    const payload = [buildPayload()];
    try {
      const { data } = await HAxiosService.PUT(
        CollectorMasterAPI.CollectorDetails(screenMenuId ),
        payload,
      );

      if (data.status != "Success") {
        return { success: false };
      }
      fetchCollectorDetails(incomingCode);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ??
        intl.formatMessage({
          id: "label.collector.operationFailed",
          defaultMessage: "Error occurred while saving collector details",
        });
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    if (incomingCode) {
      fetchCollectorDetails(incomingCode);
    } else {
      setCollectorDto(emptyCollectorDto());
      setAddressDto(emptyAddressDto());
    }
    return { data: { status: "Success" } };
  };

  const isSupervisor = collectorDto.szIsSupervisor === "Y";
  const canHandleReceiptBook = collectorDto.szHandlesReceiptBooksYN === "Y";
  const canIssueReceipt = collectorDto.szIssueReceiptYN === "Y";

  return (
    <HBox className="collector-master-page">
      <HBox className="collector-master-header-card">
        <IconButton
          aria-label="back"
          onClick={handleClose}
          sx={{ mr: 1, color: "primary.main" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <HBreadCrumb />
        <TitleBar
          title={intl.formatMessage({
            id: "label.collector.title",
            defaultMessage: "Collector Master",
          })}
        />
        <HLabel
          value={intl.formatMessage({
            id: "label.collector.description",
            defaultMessage:
              "Manage collector profiles, group membership, capacity and skills.",
          })}
          colon={false}
          align="left"
        />
      </HBox>

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
            <Grid size={{ xs: 12, md: 6 }}>
              <CollectorLabelFieldRow
                labelId={intl.formatMessage({
                  id: "label.collector.code",
                  defaultMessage: "Collector Code",
                })}
              >
                <HTextField
                  id="szCollectorCode"
                  width="100%"
                  align={ALIGNMENT.TEXT}
                  editable={false}
                  disabled
                  value={collectorDto.szCollectorCode}
                  placeholder={intl.formatMessage({
                    id: "label.collector.code",
                    defaultMessage: "Collector Code",
                  })}
                  onChange={(e) =>
                    handleChangeCollector("szCollectorCode", e.target.value)
                  }
                />
              </CollectorLabelFieldRow>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CollectorLabelFieldRow
                labelId={intl.formatMessage({
                  id: "label.collector.name",
                  defaultMessage: "Collector Name",
                })}
                required
              >
                <HTextField
                  width="100%"
                  align={ALIGNMENT.TEXT}
                  editable
                  required
                  value={collectorDto.szCollectorName}
                  placeholder={intl.formatMessage({
                    id: "label.collector.name",
                    defaultMessage: "Collector Name",
                  })}
                  onChange={(e) =>
                    handleChangeCollector("szCollectorName", e.target.value)
                  }
                />
              </CollectorLabelFieldRow>
            </Grid>
          </Grid>
        </HBox>
      </HPaper>

      <Grid container spacing={2} alignItems="stretch" sx={{ mt: 1 }}>
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
                      id: "label.collector.collectorDetails",
                      defaultMessage: "Collector Details",
                    })}
                  </Typography>
                </Grid>

                {/* Type */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.type",
                      defaultMessage: "Type",
                    })}
                  >
                    <HDropdown
                      name="szType"
                      value={collectorDto.szType}
                      onChange={(e) =>
                        handleChangeCollector("szType", e.target.value)
                      }
                      width="100%"
                      options={collectorTypes}
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Agency Type */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.agencyType",
                      defaultMessage: "Agency Type",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.szAgencyType}
                      placeholder={intl.formatMessage({
                        id: "label.collector.agencyType",
                        defaultMessage: "Agency Type",
                      })}
                      onChange={(e) =>
                        handleChangeCollector("szAgencyType", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Agency Category */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.category",
                      defaultMessage: "Agency Category",
                    })}
                  >
                    <HTextField
                      name="szAgencyCategory"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.szAgencyCategory}
                      placeholder={intl.formatMessage({
                        id: "label.collector.category",
                        defaultMessage: "Agency Category",
                      })}
                      onChange={(e) =>
                        handleChangeCollector(
                          "szAgencyCategory",
                          e.target.value,
                        )
                      }
                      width="100%"
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Supervisor Code */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.supervisor",
                      defaultMessage: "Supervisor Code",
                    })}
                  >
                    <SearchCommonBox
                      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                      searchCode="COLLCDE"
                      setSelectedValue={(dataValue) => {
                        handleChangeCollector("szSupervisorCode", dataValue || "");
                      }}
                      selectedValue={collectorDto.szSupervisorCode}
                      selectedColumn="szCollectorCode"
                      gridDefObj={gridCollectorDefObj}
                      gridWidth={350}
                      gridHeight={300}
                      gridNoOfRowsPerPage={2}
                      searchBoxWidth={220}
                      searchBoxHeight={30}
                      searchBoxFontSize={12}
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Is Supervisor Y/N */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.isSupervisor",
                      defaultMessage: "Is Supervisor",
                    })}
                  >
                    <HCheckBox
                      checked={isSupervisor}
                      onChange={(e) =>
                        handleChangeCollector(
                          "szIsSupervisor",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Max Cases */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.maxCases",
                      defaultMessage: "Max Cases",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.lnMaxCases}
                      placeholder={intl.formatMessage({
                        id: "label.collector.maxCases",
                        defaultMessage: "Max Cases",
                      })}
                      onChange={(e) =>
                        handleChangeCollector("lnMaxCases", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Shift Start */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.shiftStart",
                      defaultMessage: "Shift Start (HH:MM)",
                    })}
                  >
                    <HTextField
                      width="100%"
                      type="time"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.szShiftStart}
                      placeholder={intl.formatMessage({
                        id: "label.collector.shiftStart",
                        defaultMessage: "HH:MM",
                      })}
                      onChange={(e) =>
                        handleChangeCollector("szShiftStart", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Shift End */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.shiftEnd",
                      defaultMessage: "Shift End (HH:MM)",
                    })}
                  >
                    <HTextField
                      width="100%"
                      type="time"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.szShiftEnd}
                      placeholder={intl.formatMessage({
                        id: "label.collector.shiftEnd",
                        defaultMessage: "HH:MM",
                      })}
                      onChange={(e) =>
                        handleChangeCollector("szShiftEnd", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Handles Receipt Book Y/N */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.canHandleReceipt",
                      defaultMessage: "Handles Receipt Book",
                    })}
                  >
                    <HCheckBox
                      checked={canHandleReceiptBook}
                      onChange={(e) =>
                        handleChangeCollector(
                          "szHandlesReceiptBooksYN",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Issue Receipt Y/N */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.canIssueReceipt",
                      defaultMessage: "Issue Receipt",
                    })}
                  >
                    <HCheckBox
                      checked={canIssueReceipt}
                      onChange={(e) =>
                        handleChangeCollector(
                          "szIssueReceiptYN",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Cash Limit */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.cashLimit",
                      defaultMessage: "Cash Limit",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.dbCashLimit}
                      placeholder={intl.formatMessage({
                        id: "label.collector.cashLimit",
                        defaultMessage: "Cash Limit",
                      })}
                      onChange={(e) =>
                        handleChangeCollector("dbCashLimit", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Adhoc Cash Limit */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.adhocCashLimit",
                      defaultMessage: "Adhoc Cash Limit",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={collectorDto.dbAdhocCashLimit}
                      placeholder={intl.formatMessage({
                        id: "label.collector.adhocCashLimit",
                        defaultMessage: "Adhoc Cash Limit",
                      })}
                      onChange={(e) =>
                        handleChangeCollector(
                          "dbAdhocCashLimit",
                          e.target.value,
                        )
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>
              </Grid>
            </HBox>
          </HPaper>
        </Grid>

        {/* ── Right: Address Details ──────────────────────────────────────── */}
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
                      id: "label.collector.addressDetails",
                      defaultMessage: "Address Details",
                    })}
                  </Typography>
                </Grid>

                {/* Address fields */}
                {[
                  {
                    id: "label.collector.szAddress1",
                    defaultMessage: "Address 1",
                    name: "szAddress1",
                    ph: "label.collector.szAddress1",
                  },
                  {
                    id: "label.collector.szAddress2",
                    defaultMessage: "Address 2",
                    name: "szAddress2",
                    ph: "label.collector.szAddress2",
                  },
                  {
                    id: "label.collector.szAddress3",
                    defaultMessage: "Address 3",
                    name: "szAddress3",
                    ph: "label.collector.szAddress3",
                  },
                  {
                    id: "label.collector.szAddress4",
                    defaultMessage: "Address 4",
                    name: "szAddress4",
                    ph: "label.collector.szAddress4",
                  },
                ].map((field) => (
                  <Grid key={field.name} size={12}>
                    <CollectorLabelFieldRow
                      labelId={intl.formatMessage({
                        id: field.id,
                        defaultMessage: field.defaultMessage,
                      })}
                      required={field.required}
                    >
                      <HTextField
                        width="100%"
                        align={ALIGNMENT.TEXT}
                        editable
                        required={field.required}
                        value={addressDto[field.name]}
                        placeholder={intl.formatMessage({
                          id: field.ph,
                          defaultMessage: field.defaultMessage,
                        })}
                        onChange={(e) =>
                          handleChangeAddress(field.name, e.target.value)
                        }
                      />
                    </CollectorLabelFieldRow>
                  </Grid>
                ))}

                {/* City */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szCity",
                      defaultMessage: "City",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szCity}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szCity",
                        defaultMessage: "City",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szCity", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Zip */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szZip",
                      defaultMessage: "Zip",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szZip}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szZip",
                        defaultMessage: "Zip Code",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szZip", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* State */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szState",
                      defaultMessage: "State",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szState}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szState",
                        defaultMessage: "State",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szState", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Country */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szCountry",
                      defaultMessage: "Country",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szCountry}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szCountry",
                        defaultMessage: "Country",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szCountry", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* ── Contact sub-section ─────────────────────────────────── */}
                <Grid size={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mt: 1 }}
                  >
                    {intl.formatMessage({
                      id: "label.collector.contactDetails",
                      defaultMessage: "Contact Details",
                    })}
                  </Typography>
                </Grid>

                {/* Phone */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szPhone1",
                      defaultMessage: "Phone",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      type="phone"
                      value={addressDto.szPhone1}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szPhone1",
                        defaultMessage: "Phone Number",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szPhone1", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Fax */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szFax",
                      defaultMessage: "Fax",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      type="phone"
                      value={addressDto.szFax}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szFax",
                        defaultMessage: "Fax Number",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szFax", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Mobile */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szMobileNo",
                      defaultMessage: "Mobile No",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      type="phone"
                      value={addressDto.szMobileNo}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szMobileNo",
                        defaultMessage: "Mobile Number",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szMobileNo", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>

                {/* Pager */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szPagerNo",
                      defaultMessage: "Pager No",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szPagerNo}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szPagerNo",
                        defaultMessage: "Pager Number",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szPagerNo", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>
                {/* Email */}
                <Grid size={12}>
                  <CollectorLabelFieldRow
                    labelId={intl.formatMessage({
                      id: "label.collector.szMailId",
                      defaultMessage: "Email",
                    })}
                  >
                    <HTextField
                      width="100%"
                      align={ALIGNMENT.TEXT}
                      editable
                      value={addressDto.szMailId}
                      placeholder={intl.formatMessage({
                        id: "label.collector.szMailId",
                        defaultMessage: "Email Address",
                      })}
                      onChange={(e) =>
                        handleChangeAddress("szMailId", e.target.value)
                      }
                    />
                  </CollectorLabelFieldRow>
                </Grid>
              </Grid>
            </HBox>
          </HPaper>
        </Grid>
      </Grid>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        onClose={handleClose}
      />
    </HBox>
  );
};

export default CollectorMasterScreen;
