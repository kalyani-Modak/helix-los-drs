import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HLabel, HPaper, useToast } from "@helix/component-library";
import {
  CustomerInformationAPI,
  UpdateAddressAPI,
  fetchCustomerAddressAPI,
} from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";

import { handleValidationErrors } from "./ValidationUtils.jsx";

import CustomerCardsSection from "./update-address/CustomerCardsSection";
import AddressSummarySection from "./update-address/AddressSummarySection";
import AddressDetailsSection from "./update-address/AddressDetailsSection";
import AddressHistorySection from "./update-address/AddressHistorySection";
import { normalizeLinkedCustomersFromApi } from "./update-address/mapLinkedCustomers";
import { isEditableAddressType } from "./update-address/addressEditable";
import { useLocation } from "react-router-dom";

const emptyAddressDetails = () => ({
  lnAddressSeq: "",
  lnSNo: 1,
  szAddressType: "",
  szContactPerson: "",
  szAddress1: "",
  szAddress2: "",
  szAddress3: "",
  szAddress4: "",
  szCity: "",
  szState: "",
  szCountry: "",
  szZip: "",
  szMobileNo: "",
  szMailId: "",
  szPhone1: "",
  szFax: "",
});

function extractResponseJsonObject(res) {
  const j = res?.data?.responseJson;
  if (j == null) return null;
  if (Array.isArray(j)) return j[0] ?? null;
  return typeof j === "object" ? j : null;
}

function firstPresent(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") ?? "";
}

export default function UpdateAddress() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [summaryRows, setSummaryRows] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [historyRows, setHistoryRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [draftDetails, setDraftDetails] = useState(emptyAddressDetails);
  const [baselineDetails, setBaselineDetails] = useState(emptyAddressDetails);
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId],
  );

  const hasCustomerContext = Boolean(selectedRow && selectedCustomer);

  const getAddressKey = useCallback((row) => {
    if (!row) return "";
    return [
      row.lnAddressSeq ?? row.iaddressseq ?? "",
      row.lnSNo ?? row.lnsno ?? "",
      row.szAddressType ?? "",
      row.szAddress1 ?? "",
      row.szCity ?? "",
      row.szZip ?? "",
    ].join("|");
  }, []);

  const selectedAddressKey = useMemo(
    () => (selectedAddress ? getAddressKey(selectedAddress) : null),
    [getAddressKey, selectedAddress],
  );

  const clearEditState = useCallback(() => {
    setSelectedAddress(null);
    setIsEditMode(false);
    setDraftDetails(emptyAddressDetails());
    setBaselineDetails(emptyAddressDetails());
    setFieldErrors({});
  }, []);

 const fetchLinkedCustomersList = useCallback(() => {
  if (!selectedRow) return;

  setCustomersLoading(true);

  HAxiosService.GET(
    CustomerInformationAPI.fetchLinkedCustomers(screenMenuId),
  )
    .then((res) => {

      if (
        res?.data?.status === "Success" &&
        Array.isArray(res?.data?.responseJson)
      ) {

        const normalized =
          normalizeLinkedCustomersFromApi(
            res.data.responseJson
          );

        setCustomers(normalized);

        setSelectedCustomerId((prev) => {
          if (
            prev &&
            normalized.some((c) => c.id === prev)
          ) {
            return prev;
          }

          return normalized[0]?.id ?? null;
        });

      } else if (
        res?.data?.status === "Failure" &&
        res?.data?.message === "Validation Failed"
      ) {

        handleValidationErrors(
          intl,
          toast,
          res.data.responseJson
        );

        setCustomers([]);
        setSelectedCustomerId(null);

      } else {

        setCustomers([]);
        setSelectedCustomerId(null);

        if (res?.data?.message) {
          toast.warning(res.data.message);
        }
      }
    })
    .catch((err) => {

      console.error(
        "fetchLinkedCustomers error:",
        err
      );

      setCustomers([]);
      setSelectedCustomerId(null);

      if (
        !err?.response?.status ||
        err.response.status < 500
      ) {
        toast.error(
          intl.formatMessage({
            id: "label.updateAddress.customersLoadError",
          })
        );
      }
    })
    .finally(() => {
      setCustomersLoading(false);
    });

}, [selectedRow, intl, toast]);
  // Use effect similar to CustomerInformationPage
  useEffect(() => {
    if (!selectedRow) {
      setCustomers([]);
      setSelectedCustomerId(null);
      return;
    }
    fetchLinkedCustomersList();
  }, [selectedRow, fetchLinkedCustomersList]);

  const refreshSummaryRows = useCallback(() => {
    if (!hasCustomerContext) return Promise.resolve();
    setSummaryLoading(true);
    console.log("Before GET");
    return HAxiosService.GET(UpdateAddressAPI.UpdateAddressApi(screenMenuId))
      .then((res) => {
        if (res.data.status === "Success" && Array.isArray(res.data.responseJson)) {
          setSummaryRows(res.data.responseJson);
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          setSummaryRows([]);
        }
      })
      .catch((err) => {
        console.error("fetchAddressSummary error:", err);
        toast.error(intl.formatMessage({ id: "label.updateAddress.summaryLoadError" }));
        setSummaryRows([]);
      })
      .finally(() => setSummaryLoading(false));
  }, [hasCustomerContext, intl, toast]);

  const refreshHistoryRows = useCallback(() => {
    if (!hasCustomerContext) return Promise.resolve();
    setHistoryLoading(true);
    return HAxiosService.GET(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/fetchCustomerAddressHistory`)
      .then((res) => {
        if (res.data.status === "Success" && Array.isArray(res.data.responseJson)) {
          setHistoryRows(res.data.responseJson);
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
          setHistoryRows([]);
        } else {
          setHistoryRows([]);
        }
      })
      .catch((err) => {
        console.error("fetchAddressHistory error:", err);
        setHistoryRows([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [hasCustomerContext, intl, toast]);

  useEffect(() => {
    if (!hasCustomerContext) return;
    setSummaryRows([]);
    setHistoryRows([]);
    clearEditState();
    refreshSummaryRows();
    refreshHistoryRows();
  }, [hasCustomerContext, refreshSummaryRows, refreshHistoryRows, clearEditState]);

  const handleSelectCustomer = useCallback((id) => {
    setSelectedCustomerId(id);
    setSummaryRows([]);
    setHistoryRows([]);
    clearEditState();
  }, [clearEditState]);

  const loadDetailsAndHistory = useCallback(
    async (addressType, sourceRow = null) => {
      if (!hasCustomerContext || !addressType) return false;
      setDetailsLoading(true);
      setHistoryLoading(true);
      const wrapper = {
        szAddressType: addressType,
      };
      try {
        const [dRes, hRes] = await Promise.all([
          HAxiosService.GET(fetchCustomerAddressAPI.fetchCustomerAddress(screenMenuId), `${szAddressType}`),
          HAxiosService.GET(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/fetchCustomerAddressHistory`),
        ]);

        let detailsLoaded = false;

        if (dRes.data.status === "Success") {
          const row = extractResponseJsonObject(dRes);
          if (row) {
            const next = {
              ...emptyAddressDetails(),
              ...sourceRow,
              ...row,
              lnAddressSeq: firstPresent(row.lnAddressSeq, sourceRow?.lnAddressSeq, sourceRow?.iaddressseq),
              lnSNo: firstPresent(row.lnSNo, sourceRow?.lnSNo, sourceRow?.lnsno),
            };
            setDraftDetails(next);
            setBaselineDetails({ ...next });
            setSelectedAddress(next);
            detailsLoaded = true;
          } else {
            const fallback = sourceRow
              ? {
                  ...emptyAddressDetails(),
                  ...sourceRow,
                  lnAddressSeq: firstPresent(sourceRow.lnAddressSeq, sourceRow.iaddressseq),
                  lnSNo: firstPresent(sourceRow.lnSNo, sourceRow.lnsno),
                }
              : emptyAddressDetails();
            setDraftDetails(fallback);
            setBaselineDetails({ ...fallback });
            setSelectedAddress(sourceRow ? fallback : null);
            detailsLoaded = Boolean(sourceRow);
          }
        } else if (dRes.data.status === "Failure" && dRes.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, dRes.data.responseJson);
          setDraftDetails(emptyAddressDetails());
          setBaselineDetails(emptyAddressDetails());
          setSelectedAddress(null);
        } else {
          setDraftDetails(emptyAddressDetails());
          setBaselineDetails(emptyAddressDetails());
          setSelectedAddress(null);
        }

        if (hRes.data.status === "Success" && Array.isArray(hRes.data.responseJson)) {
          setHistoryRows(hRes.data.responseJson);
        } else if (hRes.data.status === "Failure" && hRes.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, hRes.data.responseJson);
          setHistoryRows([]);
        } else {
          setHistoryRows([]);
        }

        return detailsLoaded;
      } catch (err) {
        console.error("loadDetailsAndHistory error:", err);
        toast.error(intl.formatMessage({ id: "label.updateAddress.detailsLoadError" }));
        setDraftDetails(emptyAddressDetails());
        setBaselineDetails(emptyAddressDetails());
        setSelectedAddress(null);
        setHistoryRows([]);
        return false;
      } finally {
        setDetailsLoading(false);
        setHistoryLoading(false);
      }
    },
    [hasCustomerContext, intl, toast],
  );

  const handleSelectAddressRow = useCallback(
    async (row) => {
      if (!row?.szAddressType) return;
      setFieldErrors({});
      setSelectedAddress(row);
      setIsEditMode(false);
      const loaded = await loadDetailsAndHistory(row.szAddressType, row);
      setIsEditMode(Boolean(loaded));
    },
    [loadDetailsAndHistory],
  );

  const handleFieldChange = useCallback((field, value) => {
    setDraftDetails((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleResetForm = useCallback(() => {
    setDraftDetails({ ...baselineDetails });
    setFieldErrors({});
    return { success: true };
  }, [baselineDetails]);

  const handleBack = useCallback(() => {
    navigate("/homelayout/OverView");
  }, [navigate]);

  const handleAddCollectionsAddress = useCallback(() => {
    const next = {
      ...emptyAddressDetails(),
      szAddressType: "Co",
      szCountry: "India",
      szContactPerson: selectedCustomer?.name || selectedRow?.CUSTOMER_NAME || selectedRow?.szCustomerName || "",
    };
    setSelectedAddress(next);
    setDraftDetails(next);
    setBaselineDetails(next);
    setFieldErrors({});
    setIsEditMode(true);
  }, [selectedCustomer, selectedRow]);

  const handleSaveAddress = useCallback(async () => {
    if (!isEditMode || !selectedAddress) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.selectAddressToUpdate", defaultMessage: "Select an address to update." }) };
    }
    if (!isEditableAddressType(draftDetails.szAddressType)) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.saveNotAllowed" }) };
    }
    if (!hasCustomerContext) {
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.noAccountContext" }) };
    }

    const objRequiredFields = [
      { field: "szAddressType", label: "label.UpdateAddress.Address Type" },
      { field: "szContactPerson", label: "label.UpdateAddress.Contact Person" },
      { field: "szAddress1", label: "label.UpdateAddress.Address line 1" },
      { field: "szCity", label: "label.UpdateAddress.City" },
      { field: "szState", label: "label.UpdateAddress.State" },
      { field: "szCountry", label: "label.UpdateAddress.Country" },
      { field: "szZip", label: "label.UpdateAddress.Zip" },
      { field: "szMobileNo", label: "label.UpdateAddress.Mobile No" },
    ];

    const newFieldErrors = {};
    const objMissingFields = objRequiredFields
      .filter((item) => !draftDetails[item.field] || String(draftDetails[item.field]).trim() === "")
      .map((item) => {
        newFieldErrors[item.field] = true;
        const translatedLabel = intl.formatMessage({
          id: item.label,
          defaultMessage: item.label,
        });
        return `${translatedLabel} is mandatory`;
      });

    setFieldErrors(newFieldErrors);

    if (objMissingFields.length > 0) {
      if (objMissingFields.length === objRequiredFields.length) {
        toast.error(intl.formatMessage({ id: "label.updateAddress.allRequired" }), { autoClose: 5000 });
      } else {
        toast.error(
          <div>
            {objMissingFields.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>,
          { autoClose: 5000 },
        );
      }
      return { success: false, message: intl.formatMessage({ id: "label.updateAddress.validationFailed" }) };
    }

    const objSaveRequest = {
      addressRequestDto: { ...selectedAddress, ...draftDetails },
    };

    try {
      const res = await HAxiosService.POST(`${UpdateAddressAPI.UpdateAddressApi(screenMenuId)}/saveCustomerAddress`, objSaveRequest);
      if (res.data.status === "Success") {
        setFieldErrors({});
        await refreshSummaryRows();
        await refreshHistoryRows();
        clearEditState();
        return { data: { status: "Success", message: res.data.message } };
      }
      return { data: { status: "Failure", message: res.data.message || "Save failed" } };
    } catch (err) {
      console.error("Save API error:", err);
      return { data: { status: "Failure", message: intl.formatMessage({ id: "label.updateAddress.saveGenericError" }) } };
    }
  }, [isEditMode, selectedAddress, draftDetails, hasCustomerContext, intl, toast, refreshSummaryRows, refreshHistoryRows, clearEditState]);

  const showFloatingBar =
    isEditMode &&
    isEditableAddressType(draftDetails.szAddressType) &&
    Boolean(draftDetails.szAddressType) &&
    !detailsLoading;

  if (!selectedRow) {
    return (
      <FunctionLayout
        title={intl.formatMessage({
          id: "label.UpdateAddress.Update Address",
          defaultMessage: "Update Address",
        })}
        contentPaddingTop={0}
        scrollMode="contain"
      >
        <HPaper sx={{ m: 2, p: 2, borderRadius: "8px" }}>
          <HLabel
            value={intl.formatMessage({ id: "label.updateAddress.noAccountSelected" })}
            translate={false}
            colon={false}
            align="left"
            sx={{ fontSize: 13 }}
          />
        </HPaper>
      </FunctionLayout>
    );
  }

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.UpdateAddress.Update Address",
        defaultMessage: "Update Address",
      })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <HBox
        className="drs-page-container"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: { xs: 1.5, sm: 2 },
          pt: 0,
          pb: 0,
          maxWidth: 1320,
          mx: "auto",
          width: "100%",
          background: "transparent",
        }}
      >
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            pb: showFloatingBar ? 8 : 2,
            background: "transparent",
          }}
        >
          <Button
            size="small"
            startIcon={<ArrowBackIosNew sx={{ fontSize: 14 }} />}
            onClick={handleBack}
            sx={{ mb: 1, px: 0, color: "text.primary", textTransform: "none", fontSize: 13 }}
          >
            Back
          </Button>

          <CustomerCardsSection
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={handleSelectCustomer}
            loading={customersLoading}
          />

          <HBox
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: draftDetails.szAddressType ? "minmax(0, 1fr) minmax(420px, 1fr)" : "minmax(0, 628px)" },
              gap: 2,
              alignItems: "flex-start",
              background: "transparent",
            }}
          >
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.25, width: "100%", minWidth: 0, background: "transparent" }}>
                <AddressSummarySection
                  rowData={summaryRows}
                  loading={summaryLoading}
                  onSelectAddress={handleSelectAddressRow}
                  onAddCollectionsAddress={handleAddCollectionsAddress}
                  selectedAddressKey={selectedAddressKey}
                  getAddressKey={getAddressKey}
                />
                <AddressHistorySection rowData={historyRows} loading={historyLoading} />
            </HBox>
            {draftDetails.szAddressType ? (
              <HBox sx={{ minWidth: 0, background: "transparent" }}>
                <AddressDetailsSection
                  draftDetails={draftDetails}
                  onFieldChange={handleFieldChange}
                  fieldErrors={fieldErrors}
                  addressTypeForRule={draftDetails.szAddressType}
                />
              </HBox>
            ) : null}
          </HBox>
        </HBox>
      </HBox>

      {showFloatingBar ? <HButtonBar onSave={handleSaveAddress} onClose={handleBack} /> : null}
    </FunctionLayout>
  );
}
