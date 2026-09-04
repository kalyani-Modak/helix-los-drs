import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { HBox, HLabel, HPaper, HAxiosService, useToast } from "@helix/component-library";

import Map from "@mui/icons-material/Map";
import Close from "@mui/icons-material/Close";
import { useIntl } from "react-intl";
import { alpha, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { UpdateAddressAPI, fetchCustomerAddressAPI } from "../apiEndpoints";

import { handleValidationErrors } from "../ValidationUtils.jsx";
import { useLocation } from "react-router-dom";

function AddressDetailFieldRow({ labelId, value, theme }) {
  const display = value != null && value !== "" ? String(value) : "—";
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <HBox sx={{ py: 0.75, minWidth: 0 }}>
        <HLabel value={labelId} translate colon={false} align="left" color={theme.palette.text.secondary} />
        <HBox sx={{ mt: 0.25 }}>
          <HLabel value={display} translate={false} colon={false} align="left" color={theme.palette.text.primary} />
        </HBox>
      </HBox>
    </Grid>
  );
}

export default function AddressSummarySection({ customer }) {
  const intl = useIntl();
  const theme = useTheme();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  // Fetch addresses from API
  useEffect(() => {
    if (!selectedRow) {
      setAddresses([]);
      setExpandedAddress(null);
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        console.log(">>>>>>>>>Screen menu id: ", screenMenuId);
        const res = await HAxiosService.GET(UpdateAddressAPI.UpdateAddressApi(screenMenuId));

        if (res.data.status === "Success" && Array.isArray(res.data.responseJson)) {
          setAddresses(res.data.responseJson);
          setExpandedAddress(null);
          setSelectedAddressDetails(null);
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
          setAddresses([]);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error("Fetch addresses error:", err);
        toast.error(intl.formatMessage({ id: "label.customerInformation.addressSummary.loadError" }));
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [selectedRow, intl, toast]);

  // Fetch address details when user clicks on an address
  const handleSelectAddress = async (addressRow) => {
    if (!selectedRow || !addressRow?.szAddressType) return;

    setExpandedAddress(addressRow);
    setDetailsLoading(true);

    try {
      const wrapper = {
        szAddressType: addressRow.szAddressType,
      };

      console.log(">>>>>>>>>Screen menu id: ", screenMenuId);
      const res = await HAxiosService.GET(fetchCustomerAddressAPI.fetchCustomerAddress(screenMenuId), `${szAddressType}`);

      if (res.data.status === "Success") {
        const detailsData = Array.isArray(res.data.responseJson)
          ? res.data.responseJson[0]
          : res.data.responseJson;

        if (detailsData) {
          setSelectedAddressDetails(detailsData);
        } else {
          setSelectedAddressDetails(addressRow);
        }
      } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
        setSelectedAddressDetails(addressRow);
      } else {
        setSelectedAddressDetails(addressRow);
      }
    } catch (err) {
      console.error("Fetch address details error:", err);
      toast.error(intl.formatMessage({ id: "label.customerInformation.addressDetails.loadError" }));
      setSelectedAddressDetails(addressRow);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }}>
          <HBox sx={{ color: "primary.main", display: "flex" }}>
            <Map sx={{ fontSize: 18 }} />
          </HBox>
          <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
            {intl.formatMessage({ id: "label.customerInformation.section.addressSummary" })}
          </Typography>
        </HBox>
        <HBox sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </HBox>
      </HPaper>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }}>
          <HBox sx={{ color: "primary.main", display: "flex" }}>
            <Map sx={{ fontSize: 18 }} />
          </HBox>
          <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
            {intl.formatMessage({ id: "label.customerInformation.section.addressSummary" })}
          </Typography>
        </HBox>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          —
        </Typography>
      </HPaper>
    );
  }

  return (
    <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2 }}>
      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }}>
        <HBox sx={{ color: "primary.main", display: "flex" }}>
          <Map sx={{ fontSize: 18 }} />
        </HBox>
        <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
          {intl.formatMessage({ id: "label.customerInformation.section.addressSummary" })}
        </Typography>
        </HBox>
      {/* <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        {intl.formatMessage({ id: "label.customerInformation.addressSummary.clickHint" })}
      </Typography> */}
      <TableContainer>
        <Table size="small" sx={{ "& .MuiTableCell-root": { fontSize: 11, py: 0.75 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "action.hover" : "grey.100") }}>
              <TableCell sx={{ fontSize: 10, fontWeight: 600 }}>
                {intl.formatMessage({ id: "label.customerInformation.addressSummary.type" })}
              </TableCell>
              <TableCell sx={{ fontSize: 10, fontWeight: 600 }}>
                {intl.formatMessage({ id: "label.customerInformation.addressSummary.description" })}
              </TableCell>
              <TableCell sx={{ fontSize: 10, fontWeight: 600 }}>
                {intl.formatMessage({ id: "label.customerInformation.addressSummary.zip" })}
              </TableCell>
              <TableCell sx={{ fontSize: 10, fontWeight: 600 }}>
                {intl.formatMessage({ id: "label.customerInformation.addressSummary.city" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((a) => {
              const selected = expandedAddress?.szAddressType === a.szAddressType;
              return (
                <TableRow
                  key={a.szAddressType}
                  hover
                  onClick={() => handleSelectAddress(a)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    ...(selected && {
                      bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.14 : 0.06),
                    }),
                  }}
                >
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>{a.szAddressType}</TableCell>
                  <TableCell>{`${a.szAddress1 || ""} ${a.szAddress2 || ""}`.trim()}</TableCell>
                  <TableCell sx={{ fontFamily: "ui-monospace, monospace" }}>{a.szZip}</TableCell>
                  <TableCell>{a.szCity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {expandedAddress ? (
        <HBox
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? alpha(t.palette.common.white, 0.06)
                : alpha(t.palette.common.black, 0.04),
          }}
        >
          <HBox sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  pt: 0.25,
                }}
              >
                {intl.formatMessage({ id: "label.customerInformation.overlay.title" }, { type: expandedAddress.szAddressType })}
              </Typography>
              {detailsLoading && <CircularProgress size={16} />}
            </HBox>
            <IconButton
              size="small"
              aria-label={intl.formatMessage({ id: "label.customerInformation.overlay.close" })}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedAddress(null);
                setSelectedAddressDetails(null);
              }}
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </HBox>
          <Grid container spacing={1.5}>
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.contactPerson" value={selectedAddressDetails?.szContactPerson} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.address1" value={selectedAddressDetails?.szAddress1} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.address2" value={selectedAddressDetails?.szAddress2} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.city" value={selectedAddressDetails?.szCity} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.zip" value={selectedAddressDetails?.szZip} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.state" value={selectedAddressDetails?.szState} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.country" value={selectedAddressDetails?.szCountry} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.telephone" value={selectedAddressDetails?.szPhone1} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.fax" value={selectedAddressDetails?.szFax} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.mobile" value={selectedAddressDetails?.szMobileNo} />
            <AddressDetailFieldRow theme={theme} labelId="label.customerInformation.field.email" value={selectedAddressDetails?.szMailId} />
          </Grid>
        </HBox>
      ) : null}
    </HPaper>
  );
}
