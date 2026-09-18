import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { HBox, HButton, HDialog, HLabel, HTextField } from "@helix/component-library";

const EMPTY = { applicationNo: "", mobile: "", aadhaar: "" };

/**
 * "Search Existing Applications" pop search. Three alternative criteria —
 * Application No. OR Mobile OR Aadhaar — exactly one of which is used per search.
 * The caller owns the lookup and receives `{ applicationNo, mobile, aadhaar }`.
 */
const SearchApplicationDialog = ({ open, onClose, onSearch, loading = false }) => {
  const intl = useIntl();
  const [criteria, setCriteria] = useState(EMPTY);

  useEffect(() => {
    if (open) setCriteria(EMPTY);
  }, [open]);

  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });

  // Only one criterion is meaningful, so entering a value clears the other two.
  const setOnly = (name, value) => setCriteria({ ...EMPTY, [name]: value });

  const hasCriteria = Boolean(
    criteria.applicationNo.trim() || criteria.mobile.trim() || criteria.aadhaar.trim()
  );

  const orSeparator = (
    <Divider>
      <HLabel value={t("label.qde.dialog.searchOr", "— OR —")} translate={false} align="left" colon={false} />
    </Divider>
  );

  return (
    <HDialog
      open={open}
      onClose={onClose}
      title={t("label.qde.dialog.searchApplicationsTitle", "Search Existing Applications")}
      maxWidth="xs"
      fullWidth
      aria-labelledby="qde-search-applications-title"
      actions={
        <HBox sx={{ display: "flex", gap: 1 }}>
          <HButton
            label="label.qde.button.clear"
            variant="outlined"
            inline
            onClick={() => setCriteria(EMPTY)}
          />
          <HButton
            label="label.qde.button.search"
            variant="contained"
            inline
            loading={loading}
            disabled={!hasCriteria}
            onClick={() => onSearch?.(criteria)}
          />
        </HBox>
      }
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <HLabel value="label.qde.field.applicationNo" align="left" colon={false} />
          <HTextField
            value={criteria.applicationNo}
            onChange={(e) => setOnly("applicationNo", e.target.value)}
            editable
            placeholder="APP-XXXXXXXX"
            width="100%"
          />
        </HBox>

        {orSeparator}

        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <HLabel value="label.qde.field.mobile" align="left" colon={false} />
          <HTextField
            value={criteria.mobile}
            onChange={(e) => setOnly("mobile", e.target.value)}
            editable
            type="number"
            length={10}
            placeholder={t("label.qde.placeholder.mobile", "10-digit mobile")}
            width="100%"
          />
        </HBox>

        {orSeparator}

        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <HLabel value="label.qde.field.aadhaar" align="left" colon={false} />
          <HTextField
            value={criteria.aadhaar}
            onChange={(e) => setOnly("aadhaar", e.target.value)}
            editable
            type="number"
            length={12}
            placeholder={t("label.qde.placeholder.aadhaarSearch", "12-digit Aadhaar number")}
            width="100%"
          />
        </HBox>
      </HBox>
    </HDialog>
  );
};

export default SearchApplicationDialog;
