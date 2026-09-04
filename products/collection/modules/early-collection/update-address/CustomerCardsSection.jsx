import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import LinkedCustomerTileStrip from "../customer-information/LinkedCustomerTileStrip";

export default function CustomerCardsSection({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  loading,
  emptyMessageId,
}) {
  const intl = useIntl();

  return (
      <Box sx={{ pt: 0.75, pb: 1.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
            <CircularProgress size={22} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              {intl.formatMessage({ id: "label.updateAddress.loadingCustomers" })}
            </Typography>
          </Box>
        ) : customers?.length ? (
          <LinkedCustomerTileStrip
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={onSelectCustomer}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            {intl.formatMessage({
              id: emptyMessageId || "label.updateAddress.noCustomers",
            })}
          </Typography>
        )}
      </Box>
  );
}
