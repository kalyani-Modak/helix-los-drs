import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import {HBox, HCheckBox, HDropdown, HLabel, HPaper, HTextarea, HTextField, SearchCommonBox,
} from "@helix/component-library";
import { gridMailCodeDefObj } from "../../../../common/components/SearchGridDefObj";

// REMOVED: hardcoded ADDRESS_TO_OPTIONS

export default function GenerateMailForm({
  selectedRow,
  selectedMailCode,
  setSelectedMailCode,
  selectedTemplateId,
  setSelectedTemplateId,
  selectedEntityCode,
  setSelectedEntityCode,
  notes,
  setNotes,
  mailTypeUi,
  setMailTypeUi,
  addressToIds,
  setAddressToIds,
  communicationDetails,
  communicationLoading,
  selectedCommunicationValue,
  setSelectedCommunicationValue,
  addressTypeOptions,       // ADD
  addressTypeLoading,       // ADD
  generatedReady,
}) {
  const intl = useIntl();

  const safeFormatMessage = (id, defaultMessage = "") => {
    if (typeof id === "string" && id.trim()) {
      return intl.formatMessage({ id, defaultMessage: defaultMessage || id });
    }
    return defaultMessage;
  };

  const sectionHeader = (Icon, messageId) => (
    <HBox
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.25,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Icon sx={{ fontSize: 15, color: "primary.main" }} />
      <HLabel
        value={messageId}
        translate
        colon={false}
        align="left"
        component="div"
        sx={{
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1.15,
          color: "var(--drs-text-primary)",
        }}
      />
    </HBox>
  );

  const accountHint = selectedRow
    ? intl.formatMessage(
      { id: "label.generateMail.accountContextHint" },
      {
        cust: selectedRow.CUST_SEQNO ?? "—",
        acct: selectedRow.ACNT_SEQNO ?? "—",
      }
    )
    : intl.formatMessage({ id: "label.generateMail.noAccountSelected" });

  const toggleAddressTo = (id) => {
    setAddressToIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const fieldStack = (labelNode, control, fullWidthControl = false) => (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        width: "100%",
        minWidth: 0,
      }}
    >
      {labelNode}
      <HBox sx={{ width: fullWidthControl ? "100%" : "auto", minWidth: 0 }}>{control}</HBox>
    </HBox>
  );

  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": { width: "auto" },
    "& .hcheckbox-label": { margin: 0, width: "auto" },
    "& .hcheckbox-label.MuiFormControlLabel-root": {},
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important",
      whiteSpace: "nowrap",
    },
    "& .hcheckbox-input": { paddingRight: "0px" },
  };

  const renderCommunicationField = (labelId) => {
    const options = communicationDetails.map((val) => ({
      label: val,
      value: val,
    }));

    return (
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {fieldStack(
          <HLabel
            value={safeFormatMessage(labelId, labelId || "")}
            translate={false}
            align="left"
            colon={false}
          />,
          communicationLoading ? (
            <HTextField value="..." disabled size="small" translate={false} />
          ) : (
            <HDropdown
              options={options}
              value={selectedCommunicationValue}
              onChange={(e) => setSelectedCommunicationValue(e.target.value)}
              placeholder={
                communicationDetails.length === 0
                  ? "-"
                  : mailTypeUi?.toUpperCase() === "EMAIL"
                    ? "Select email"
                    : "Select mobile"
              }
              width="100%"
            />
          ),
          true
        )}
      </Grid>
    );
  };

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: 1.5,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        width: "100%",
      }}
    >
      { }
      <HBox sx={{ px: 2, py: 1.5, flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            {fieldStack(
              <HLabel
                value={intl.formatMessage({ id: "label.generateMail.mailCode" })}
                required
                translate={false}
                align="left"
                colon={false}
              />,
              <SearchCommonBox
                apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                searchCode="MAILCODE"
                setSelectedValue={(value, row) => {
                  setSelectedMailCode(value);
                  setSelectedTemplateId(row?.szTemplateId || row?.id || "");
                  setSelectedEntityCode(row?.szEntityCode || "");
                  setMailTypeUi(row?.szCode || "");
                }}
                selectedValue={selectedMailCode}
                selectedColumn="szMailCode"
                gridDefObj={gridMailCodeDefObj}
                gridWidth={300}
                gridHeight={300}
                gridNoOfRowsPerPage={5}
                searchBoxWidth="100%"
                searchBoxHeight={30}
                searchBoxFontSize={12}
                placeholder={"Select mail code"}
              />,
              true
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {fieldStack(
              <HLabel
                value={intl.formatMessage({ id: "label.generateMail.mailType" })}
                required
                translate={false}
                align="left"
                colon={false}
              />,
              <HTextField
                value={mailTypeUi}
                disabled
                size="small"
                width="100%"
                translate={false}
              />,
              true
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {fieldStack(
              <HLabel
                value={intl.formatMessage({ id: "label.generateMail.preferredLanguage" })}
                translate={false}
                align="left"
                colon={false}
              />,
              <HTextField
                value={intl.formatMessage({ id: "label.generateMail.preferredLanguage.value" })}
                disabled
                size="small"
                width="100%"
                translate={false}
              />,
              true
            )}
          </Grid>

          {/* CHANGED: dynamic address type checkboxes from API */}
          <Grid size={12}>
            {fieldStack(
              <HLabel
                value={intl.formatMessage({ id: "label.generateMail.addressTo" })}
                required
                translate={false}
                align="left"
                colon={false}
              />,
              addressTypeLoading ? (
                <HTextField value="..." disabled size="small" translate={false} />
              ) : addressTypeOptions.length === 0 ? (
                <HTextField value="No address types found" disabled size="small" translate={false} />
              ) : (
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                    py: 0.25,
                    scrollbarWidth: "thin",
                  }}
                >
                  {addressTypeOptions.map((opt) => (
                    <HBox key={opt.code} sx={{ ...checkboxCellSx }}>
                      <HCheckBox
                        label={safeFormatMessage(opt?.szi18nDesc, opt?.szDesc || opt?.szi18nDesc || "")}
                        checked={addressToIds.includes(opt.szCondition)}
                        onChange={() => toggleAddressTo(opt.szCondition)}
                        size="small"
                        align="left"
                        margin="0"
                      />
                    </HBox>
                  ))}
                </HBox>
              ),
              true
            )}
          </Grid>

          {mailTypeUi?.toUpperCase() === "EMAIL" &&
            renderCommunicationField("label.CommunicationPreferences.Email Id")}

          {mailTypeUi?.toUpperCase() === "SMS" &&
            renderCommunicationField("label.generateMail.mobileBorrower")}

          <Grid size={12}>
            {fieldStack(
              <HLabel
                value={intl.formatMessage({ id: "label.generateMail.notes" })}
                required
                translate={false}
                align="left"
                colon={false}
              />,
              <HTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLines={3}
                width="100%"
                maxLength={2000}
                translate={false}
                placeholder={intl.formatMessage({ id: "label.generateMail.notes.placeholder" })}
              />,
              true
            )}
          </Grid>
        </Grid>
      </HBox>
    </HPaper>
  );
}
