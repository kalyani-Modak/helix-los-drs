import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { HBox, HButton, HDialog, HLabel, HTextField } from "@helix/component-library";

const EMPTY = { customerId: "", mobile: "" };

/**
 * "Search Existing Customer" pop search used by co-applicant and guarantor rows.
 * Two alternative criteria — Customer ID OR Mobile — exactly one of which is used per search.
 * The caller owns the lookup: `onSearch({ customerId, mobile })` returns a promise that
 * resolves to `true` when a customer was found and loaded (the dialog then closes).
 */
const SearchCustomerDialog = ({ open, onClose, onSearch }) => {
  const intl = useIntl();
  const [criteria, setCriteria] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCriteria(EMPTY);
      setLoading(false);
    }
  }, [open]);

  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });

  // Only one criterion is meaningful, so entering a value clears the other.
  const setOnly = (name, value) => setCriteria({ ...EMPTY, [name]: value });

  const hasCriteria = Boolean(criteria.customerId.trim() || criteria.mobile.trim());

  const handleSearch = async () => {
    setLoading(true);
    try {
      const found = await onSearch?.(criteria);
      if (found) onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <HDialog
      open={open}
      onClose={onClose}
      title={t("label.qde.dialog.searchCustomerTitle", "Search Existing Customer")}
      maxWidth="xs"
      fullWidth
      aria-labelledby="qde-search-customer-title"
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
            onClick={handleSearch}
          />
        </HBox>
      }
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <HLabel value="label.qde.field.customerId" align="left" colon={false} />
          <HTextField
            value={criteria.customerId}
            onChange={(e) => setOnly("customerId", e.target.value)}
            editable
            placeholder="CUST-XXXXXX"
            width="100%"
          />
        </HBox>

        <Divider>
          <HLabel value={t("label.qde.dialog.searchOr", "— OR —")} translate={false} align="left" colon={false} />
        </Divider>

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
      </HBox>
    </HDialog>
  );
};

export default SearchCustomerDialog;
