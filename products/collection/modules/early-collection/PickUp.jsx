import { alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { fetchCustomerAddressAPI } from "./apiEndpoints";
import { useSelector } from "react-redux";
import { HAxiosService, ALIGNMENT, HAccordion, HBox, HDatePicker, HDropdown, HLabel, HTextField, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";


const PickUp = ({ pickUpData, setPickUpData, embedded = false, addressTypeOptions = [] }) => {
  const intl = useIntl();
  const theme = useTheme();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);

  const handleChange = (field) => (e) => {
    const newVal = e?.target?.value ?? e;

    if (field === "szAddressType") {
      if (newVal === null || newVal === undefined || String(newVal).trim() === "") {
        setPickUpData((prev) => ({
          ...prev,
          szAddressType: "",
          szContactPerson: "",
          szAddress: "",
          szPhone: "",
          szMobile: "",
        }));
        return;
      }
	  
      const requestData = {
        szAddressType: newVal,
      };

      HAxiosService.POST(
        fetchCustomerAddressAPI.fetchCustomerAddress,
        requestData,
      )
        .then((res) => {
          const { status, message, responseJson } = res.data || {};
          if (status?.toLowerCase() === "success") {
            const address = res.data?.responseJson ?? {};

            setPickUpData((prev) => ({
              ...prev,
              szAddressType: newVal,
              szContactPerson: address.szContactPerson || "",
              szAddress: address.szAddress1 || "",
              szPhone: address.szPhone1 || "",
              szMobile: address.szMobileNo || "",
            }));
            return;
          }
          if (
            status?.toLowerCase() === "failure" &&
            message === "Validation Failed"
          ) {
            handleValidationErrors(intl, toast, responseJson);
            return;
          }

          toast.error(message || "Failed to fetch customer address");
        })
        .catch((err) => {
          console.error("API Error", err);
          toast.error(
            err.response?.data?.message || "Unable to fetch customer address",
          );
        });
      return;
    }

    setPickUpData((prev) => ({ ...prev, [field]: newVal }));
  };

  const fieldWrapperSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
  };

  const formContent = (
    <HBox sx={{ width: "100%", boxSizing: "border-box" }}>
      {embedded && (
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.1,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? alpha(t.palette.common.white, 0.04)
                : alpha(t.palette.grey[900], 0.03),
          }}
        >
          <LocalShippingOutlinedIcon
            sx={{ fontSize: 14, color: "primary.main" }}
          />
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.pickupDetailsTitle",
              defaultMessage: "Pick up details",
            })}
            colon={false}
            align="left"
            component="div"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          />
        </HBox>
      )}

      <HBox
        sx={{
          display: "grid",
          gap: 1.5,
          px: embedded ? 2.5 : 0,
          pt: embedded ? 1.5 : 0,
          pb: embedded ? 1.5 : 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <HBox
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", lg: "repeat(4, minmax(0, 1fr))" },
          }}
        >
          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.VisitFor",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HDropdown
              name="visitFor"
              value={pickUpData.szVisitFor}
              onChange={handleChange("szVisitFor")}
              options={[{ label: "Pick Up", value: "P" }]}
              required={false}
              disabled={false}
              readOnly={false}
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.VisitFor.placeholder",
              })}
              width="100%"
              fullWidth
              align={ALIGNMENT.TEXT}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.AddressType",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HDropdown
              name="addressType"
              value={pickUpData.szAddressType}
              onChange={handleChange("szAddressType")}
              options={addressTypeOptions}
              required={false}
              disabled={false}
              readOnly={false}
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.AddressType.placeholder",
              })}
              width="100%"
              fullWidth
              align={ALIGNMENT.TEXT}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.ContactPerson",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szContactPerson || ""}
              onChange={handleChange("szContactPerson")}
              editable
              disabled={false}
              required={false}
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.ContactPerson",
              })}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.Address",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szAddress || ""}
              onChange={handleChange("szAddress")}
              editable
              disabled={false}
              required={false}
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.Address",
              })}
            />
          </HBox>
        </HBox>

        <HBox
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
          }}
        >
          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({ id: "label.followup.PickUp.Phone" })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szPhone || ""}
              onChange={handleChange("szPhone")}
              editable
              disabled={false}
              required={false}
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.Phone",
              })}
              type="number"
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({ id: "label.followup.PickUp.Mobile" })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szMobile || ""}
              onChange={handleChange("szMobile")}
              editable
              disabled={false}
              required={false}
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.Mobile",
              })}
              type="number"
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.RequestDate",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HDatePicker
              value={pickUpData.dtVisitDate}
              onChange={(newValue) =>
                setPickUpData((prev) => ({
                  ...prev,
                  dtVisitDate: newValue,
                }))
              }
              align={ALIGNMENT.DATE}
              sx={{ width: "100%" }}
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.RequestDate",
              })}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({ id: "label.followup.PickUp.Amount" })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.bdVisitForAmt ?? ""}
              onChange={handleChange("bdVisitForAmt")}
              editable
              disabled={false}
              required={false}
              align={ALIGNMENT.NUMBER}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.Amount",
              })}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.ToGroup",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szPickupCollectorGrp}
              onChange={handleChange("szPickupCollectorGrp")}
              required={false}
              disabled={false}
              editable
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.ToGroup",
              })}
            />
          </HBox>

          <HBox sx={fieldWrapperSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.PickUp.ToCollector",
              })}
              disabled={false}
              align="left"
              width="100%"
            />
            <HTextField
              value={pickUpData.szPickupCollector}
              onChange={handleChange("szPickupCollector")}
              required={false}
              disabled={false}
              editable
              align={ALIGNMENT.TEXT}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.PickUp.ToCollector",
              })}
              cd
            />
          </HBox>
        </HBox>
      </HBox>
    </HBox>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <HAccordion
      title={intl.formatMessage({ id: "label.followup.PickUp" })}
      detailsHeight={120}
    >
      {formContent}
    </HAccordion>
  );
};

export default PickUp;
