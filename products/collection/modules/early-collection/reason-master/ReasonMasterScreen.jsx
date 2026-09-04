import React, { useMemo, useRef, useState, useCallback,useEffect  } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useToast, HAxiosService, HBox, HButton, HButtonBar, HDropdown, HLabel, TitleBar, HAgGrid, HBreadCrumb } from "@helix/component-library";

import { ReasonMasterAPI } from "../../common-master/apiEndpoints.jsx";


import { buildReasonMasterColumnDefs } from "./reasonMasterColumnDefs.jsx";
import "./reasonMasterStyles.css";
import { useLocation } from "react-router-dom";

const REASON_MASTER_LEGACY_SYSTEM = "TELE";

function getCurrentUserId() {
  try {
    return sessionStorage.getItem("SEC_USERNAME") || "";
  } catch {
    return "";
  }
}

function extractReasonListFromResponse(res) {
  const body = res?.data ?? res;
  const j = body?.responseJson;
  if (Array.isArray(j)) return j;
  if (j && typeof j === "object" && Array.isArray(j.data)) return j.data;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

function isSuccessEnvelope(res) {
  const body = res?.data ?? res;
  const s = body?.status;
  return s === "Success" || s === 200 || s === "200" || String(s) === "200";
}

function normalizeReasonRow(row) {
  return {
    ...row,
    szReasonCode: row.szReasonCode != null ? String(row.szReasonCode).trim() : "",
    szReasonDesc: row.szReasonDesc != null ? String(row.szReasonDesc).trim() : "",
    szActive:
      row.szActive === true || row.szActive === "Y" || row.szActive === "y"
        ? "Y"
        : "N",
    szLegacySystem: row.szLegacySystem || REASON_MASTER_LEGACY_SYSTEM,
  };
}

const ReasonMasterScreen = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [reasonType, setReasonType] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [fetchedReasonType, setFetchedReasonType] = useState("");
  const [reasonTypeOptions, setReasonTypeOptions] = useState([]);
  const [rawReasonTypes, setRawReasonTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const columnDefs = useMemo(() => buildReasonMasterColumnDefs(intl), [intl]);

  const fetchReasons = useCallback(async () => {
    if (!reasonType) {
      toast.warn(
        intl.formatMessage({
          id: "message.reasonMaster.selectReasonTypeWarning",
          defaultMessage: "Please select a reason type before fetching.",
        })
      );
      return;
    }
    try {
      setLoading(true);
      const url = `${ReasonMasterAPI.ReasonMasters(screenMenuId)}?szReasonType=${encodeURIComponent(reasonType,)}`;
      const res = await HAxiosService.GET(url);
      
      const list = extractReasonListFromResponse(res);
      

      if (!isSuccessEnvelope(res)) {
        setRowData([]);
        setIsFetched(false);
        setFetchedReasonType("");
        toast.error(
          intl.formatMessage({
            id: "message.reasonMaster.fetchError",
            defaultMessage: "Error while fetching reason masters.",
          })
        );
        return;
      }

      setFetchedReasonType(reasonType);
      setIsFetched(true);
      setLoading(false);

      if (list.length === 0) {
        setRowData([]);
        toast.info(
          intl.formatMessage({
            id: "message.reasonMaster.fetchEmpty",
            defaultMessage: "No records found for the selected reason type.",
          })
        );
        return;
      }

      setRowData(list.map((row) => normalizeReasonRow(row)));
    } catch (err) {
      console.error("ReasonMaster fetch error:", err);
      toast.error(
        intl.formatMessage({
          id: "message.reasonMaster.fetchError",
          defaultMessage: "Error while fetching reason masters.",
        })
      );
      setRowData([]);
      setIsFetched(false);
      setFetchedReasonType("");
    }
  }, [reasonType, intl, toast]);

  const handleReasonTypeChange = (e) => {
    setReasonType(e.target.value);
    setIsFetched(false);
    setFetchedReasonType("");
    setRowData([]);
  };

  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    if (!reasonType || !isFetched || reasonType !== fetchedReasonType) {
      toast.warn(
        intl.formatMessage({
          id: "error.reasontype.fetch",
          defaultMessage: "Please select and fetch data before saving.",
        })
      );
      return { success: false };
    }

    const userId = getCurrentUserId();
    const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => ({
      szReasonType: reasonType,
      szReasonCode: (row.szReasonCode || "").trim(),
      szReasonDesc: (row.szReasonDesc || "").trim(),
      szActive:
        row.szActive === true || row.szActive === "Y" || row.szActive === "y"
          ? "Y"
          : "N",
      szUser: userId,
      szLegacySystem: row.szLegacySystem || REASON_MASTER_LEGACY_SYSTEM,
      szMode: row.mode,
    }));

    if (payload.length === 0) {
      toast.warn(
        intl.formatMessage({
          id: "message.reasonMaster.saveNoChanges",
          defaultMessage: "No changes to save.",
        })
      );
      return { success: false };
    }

    try {
      const res = await HAxiosService.POST(ReasonMasterAPI.ReasonMasters(screenMenuId), payload);
      const body = res?.data ?? res;

      if (isSuccessEnvelope(res)) {
        await fetchReasons();
        return { success: true };
      }

      toast.error(
        body?.message ||
          intl.formatMessage({
            id: "message.reasonMaster.saveError",
            defaultMessage: "Failed to save reason masters.",
          })
      );
      return { success: false };
    } catch (err) {
      console.error("ReasonMaster save error:", err);
      const serverMsg = err.response?.data?.message;
      toast.error(
        serverMsg ||
          intl.formatMessage({
            id: "message.reasonMaster.saveError",
            defaultMessage: "Failed to save reason masters.",
          })
      );
      return { success: false };
    }
  };

   // Helper function to get label from intl using the value as the ID
  const getReasonTypeLabel = useCallback((typeValue) => {
    const messageId = `label.reasonMaster.${typeValue}`;
    try {
      const translated = intl.formatMessage({
        id: messageId,
        defaultMessage: typeValue, // Fallback to the value itself if translation doesn't exist
      });
      return translated;
    } catch (error) {
      return typeValue;
    }
  }, [intl]);

  // Function to update dropdown options based on current language
  const updateDropdownLabels = useCallback(() => {
    if (rawReasonTypes.length > 0) {
      const formattedOptions = rawReasonTypes.map((type) => ({
        value: type,
        label: getReasonTypeLabel(type),
      }));
      setReasonTypeOptions(formattedOptions);
    }
  }, [rawReasonTypes, getReasonTypeLabel]);

  const fetchReasonTypeOptions = async () => {
    try {
      const response = await HAxiosService.GET(ReasonMasterAPI.ReasonMasters(screenMenuId)+`/fetchReasonTypeDropDown`);
      const responseData = response?.data ?? response;

      // Extract the array from response based on CommonResponseDto structure
      let reasonTypesArray = [];
      if (responseData?.status === "Success" && responseData?.responseJson) {
        reasonTypesArray = responseData.responseJson;
      } else if (Array.isArray(responseData)) {
        reasonTypesArray = responseData;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        reasonTypesArray = responseData.data;
      }
      setRawReasonTypes(reasonTypesArray);
      setLoading(false);
      // Format options dynamically using the intl helper
      const formattedOptions = reasonTypesArray.map((type) => ({
        value: type,
        label: getReasonTypeLabel(type),
      }));

      setReasonTypeOptions(formattedOptions);
      // Set default selection if there are options and no reasonType selected
      if (formattedOptions.length > 0 && !reasonType) {
        setReasonType(formattedOptions[0].value);
      }
    } catch (error) {
      console.error("Error fetching reason types:", error);
      toast.error(
        intl.formatMessage({
          id: "message.reasonMaster.fetchTypesError",
          defaultMessage: "Error fetching reason types.",
        }),
      );
    }
  };

  useEffect(() => {
    fetchReasonTypeOptions();
  }, []);

  useEffect(() => {
    if (rawReasonTypes.length > 0) {
      updateDropdownLabels();
    }
  }, [intl.locale, updateDropdownLabels, rawReasonTypes]);

  return (
    <HBox className="reason-master-page">
      <HBox>
        <HBreadCrumb />
        <HBox className="reason-master-header-row">
          <HBox className="reason-type-wrapper">
            <TitleBar
              title={intl.formatMessage({
                id: "label.reasonMaster.title",
                defaultMessage: "Reason Master",
              })}
            />
            <HLabel
              className="reason-master-description"
              value={intl.formatMessage({
                id: "label.reasonMaster.titleDesc",
                defaultMessage:
                  "Define reasons used across follow-up, exclusions, fee waivers, workflow, and 11 other modules.",
              })}
            />
          </HBox>

          <HBox className="reason-master-controls">
            <HBox className="reason-type-wrapper">
              <HLabel
                value={intl.formatMessage({
                  id: "label.reasonMaster.reasonType",
                  defaultMessage: "REASON TYPE",
                })}
              />
              <HBox className="reason-master-fetch-button">
                <HDropdown
                  name="reasonType"
                  options={reasonTypeOptions}
                  value={reasonType}
                  onChange={handleReasonTypeChange}
                  placeholder={intl.formatMessage({
                    id: "label.reasonMaster.reasonTypePlaceholder",
                    defaultMessage: "Select reason type",
                  })}
                />

                <HButton
                  variant="contained"
                  onClick={fetchReasons}
                  label="label.reasonMaster.fetchButton"
                  defaultMessage="FETCH"
                  sx={{ height: "28px" }}
                />
              </HBox>
            </HBox>
          </HBox>
        </HBox>
      </HBox>

      <HBox className="reason-master-stack" loading={loading}>
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={5}
          sort
          globalSearch={false}
          allowAdd
          allowDelete
          allowUpdate
          onSave={handleSave}
          rowDragging={false}
          gridClassName="reason-master-ag-host"
          gridStyle={{ width: "100%", height: "278px", marginTop: "20px" }}
        />

        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
};

export default ReasonMasterScreen;
