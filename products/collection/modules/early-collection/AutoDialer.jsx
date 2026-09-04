import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, FilterMaster, HButton, HLabel, HTextField, TitleBar } from "@helix/component-library";

import { AutoDialerAPI } from "./apiEndpoints";
import { Box } from "@mui/material";
import { Save } from "@mui/icons-material";

const AutoDialer = () => {
  const [objIsRuleEngBased] = useState(false);
  const [objParentRuleEngineFilter, setObjParentRuleEngineFilter] = useState(null);
  const [objFilterCode, setObjFilterCode] = useState();
  const [objParentFilterProps, setObjParentFilterProps] = useState(null);
  const intl = useIntl();
  const toast = useToast();
  const [objNoOfFailure, setObjNoOfFailure] = useState(3);
  const [objNoOfDays, setObjNoOfDays] = useState(7);
  const [loading] = useState(false);
  const [errors] = useState({
    objNoOfFailure: false,
    objNoOfDays: false,
  });

  // Fetch existing tag details
  useEffect(() => {
    HAxiosService.POST(AutoDialerAPI.fetchAutoDialerDetails, "").then((resp) => {
      if (resp.data?.status === "Error") {
        console.error(resp.data?.message || "Fetch error");
      } else {
        setObjFilterCode(resp.data?.responseJson?.AtdMstConfigData?.szFilterCode);
      }
    }).catch((err) => {
      console.error("Fetch error:", err);
    });
  }, []);

  // Save handler
  const handleSave = () => {
    const objPayload = {
      lnEntitySeq: null,
      szFilterCode: objFilterCode,
      inSkipMarkNoOfFailure: 0,
      inSkipMarkInNoOfDays: 0,
      szExclusionStartTime: "",
      szExclusionEndTime: "",
      inExclusionFrequency: 0,
      szDownloadNoGoodPhoneYn: "",
      szDownloadSkippedCasesYn: "",
      szDownloadFutureNextActionYn: "",
      szColField1: "",
      szColField2: "",
      szColFlag1: "",
      szColFlag2: "",
      dtColDate1: "",
      dtColDate2: "",
      inColNumber1: objNoOfFailure,
      inColNumber2: objNoOfDays,
      lnColAmount1: 0,
      lnColAmount2: 0,
      szField1: "",
      szField2: "",
      szFlag1: "",
      szFlag2: "",
      dtDate1: "",
      dtDate2: "",
      inNumber1: 0,
      inNumber2: 0,
      lnAmount1: 0,
      lnAmount2: 0,
      szUser: "",
      filterRequestDto: objParentFilterProps,
    };

    if (!objIsRuleEngBased) {
      return HAxiosService.POST(
        AutoDialerAPI.submitAutoDialerDetails,
        objPayload
      )
        .then((resp) => {
          if (resp.data?.status === "Error") {
            toast.error(resp.data?.message || "save error");
          } else {
            toast.success(resp.data?.message || "Changes saved successfully");
          }
        })
        .catch((err) => {
          console.error("Failed to save changes:", err);
          toast.error("Failed to save changes");
        });
    } else {
      // give Rule Engine call
      console.log("objParentRuleEngineFilter", objParentRuleEngineFilter);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TitleBar
        title={intl.formatMessage({ id: "label.AutoDialer.title", defaultMessage: "Auto Dialer" })}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
          px: 1,
          mt: "10px",
          mb: "10px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box className="label-textfield-row">
          <HLabel value="Number of Failure" disabled={false} required />
          <HTextField
            value={objNoOfFailure}
            onChange={(e) => setObjNoOfFailure(e.target.value)}
            width="150px"
            editable={true}
            disabled={false}
            required={true}
            error={errors.objNoOfFailure}
          />
        </Box>

        <Box className="label-textfield-row">
          <HLabel value="In Number Of Days" disabled={false} required />
          <HTextField
            value={objNoOfDays}
            onChange={(e) => setObjNoOfDays(e.target.value)}
            width="150px"
            editable={true}
            disabled={false}
            required={true}
            error={errors.objNoOfDays}
          />
        </Box>
      </Box>

      <FilterMaster
        entityCode="ATD"
        filterCode={objFilterCode}
        filterTitle="Auto Dialer"
        filterSavedDescription="Global ATD Filter"
        isPopedUp={false}
        parentFilterProps={setObjParentFilterProps}
        parentRuleEngineFilterProps={setObjParentRuleEngineFilter}
        IsRuleEngBased={objIsRuleEngBased}
      />

      <Box className="label-textarea-row" sx={{ ml: "50px" }}>
        <HButton
          id="save-btn"
          label="button.save"
          startIcon={<Save />}
          onClick={handleSave}
          loading={loading}
          align="end"
        />
      </Box>
    </Box>
  );
};

export default AutoDialer;
