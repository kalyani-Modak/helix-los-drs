import React from "react";
import { Box } from "@mui/material";
import { CallOutlined, PersonOutline } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { DialerAPI, OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { formatDate, formatDialerPhoneNumber, formatPhoneWithCountryCode, getPhoneHref } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HAxiosService, HBox, HLabel, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function PersonalDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchPersonalDetails(),
    accountReady
  );
  const d = data || {};

  const handlePhoneClick = React.useCallback(async (event, phone) => {
    event.preventDefault();

    const href = getPhoneHref(phone);
    if (!href) {
      return;
    }

    const payload = {
      caseId: String(
        selectedRow?.ACNT_SEQNO ??
        selectedRow?.ACCOUNT_SEQNO ??
        selectedRow?.ACCOUNT_ID ??
        ""
      ),
      customerId: String(
        selectedRow?.CUST_SEQNO ??
        selectedRow?.CUSTOMER_SEQNO ??
        selectedRow?.CUSTOMER_ID ??
        selectedRow?.LEGACY_CUST_NO ??
        ""
      ),
      phoneNumber: formatDialerPhoneNumber(phone, "+91"),
    };

    if (!payload.phoneNumber) {
      return;
    }

    const loginUserId = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const tenantId = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    const customHeaders = {
      "X-Drs-User-Id": loginUserId,
      "X-Tenant-Id": tenantId,
    };

    console.log("click-to-call headers:", customHeaders);

    try {
      const res = await HAxiosService.POST(
        DialerAPI.clickToCall(),
        payload,
        {},
        false,
        customHeaders
      );
      const callId =
        res?.data?.callId ??
        res?.data?.data?.callId ??
        res?.data?.responseJson?.callId;
      console.log("click-to-call callId:", callId);
    } catch (error) {
      console.error("click-to-call failed", error);
    }
  }, [selectedRow]);

  const renderPhoneField = (label, phone) => {
    const href = getPhoneHref(phone);
    const value = formatPhoneWithCountryCode(phone);

    return (
      <Box sx={{ minWidth: 0 }}>
        <HLabel
          sx={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: 1.2,
            fontWeight: 600,
          }}
          value={label}
          colon={false}
          align="left"
        />
        {href ? (
          <Box
            component="a"
            href={href}
            onClick={(event) => {
              handlePhoneClick(event, phone);
            }}
            title={intl.formatMessage({ id: "label.Overview.call", defaultMessage: "Click to call" })}
            aria-label={`Click to call ${value}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.35,
              fontSize: 10,
              fontWeight: 500,
              color: "#2563eb",
              mt: 0.35,
              wordBreak: "break-word",
              lineHeight: 1.3,
              textDecorationThickness: "from-font",
              "& .phone-call-icon": {
                opacity: 0,
                transition: "opacity 120ms ease-in-out",
              },
              "&:hover .phone-call-icon": {
                opacity: 1,
              },
            }}
          >
            <Box component="span" sx={{ lineHeight: 1.3 }}>{value}</Box>
            <CallOutlined className="phone-call-icon" sx={{ fontSize: 12 }} />
          </Box>
        ) : (
          <HLabel
            sx={{
              fontSize: 10,
              fontWeight: 500,
              mt: 0.35,
              wordBreak: "break-word",
              lineHeight: 1.3,
            }}
            value={phone || "--"}
            colon={false}
            align="left"
          />
        )}
      </Box>
    );
  };

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.personal_details",
        defaultMessage: "Personal Details",
      })}
      icon={PersonOutline}
      loading={loading}
      error={error}
    >
      <HBox
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
        }}
      >
        {renderPhoneField(
          intl.formatMessage({ id: "label.Overview.fields.phone_residence", defaultMessage: "Phone (R)" }),
          d.szRSPhone
        )}
        {renderPhoneField(
          intl.formatMessage({ id: "label.Overview.fields.phone_office_short", defaultMessage: "Phone (O)" }),
          d.szOFPhone
        )}
        {renderPhoneField(
          intl.formatMessage({ id: "label.Overview.fields.mobile_number_short", defaultMessage: "Mobile No." }),
          d.szMobileNo
        )}
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.date_of_birth", defaultMessage: "Date of Birth" })} value={formatDate(d.dtDateOfBirth)} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.gender", defaultMessage: "Gender" })} value={d.szGender} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.designation", defaultMessage: "Designation" })} value={d.szDesignation} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.occupation", defaultMessage: "Occupation" })} value={d.szOccupation} />
      </HBox>
    </OverviewSectionCard>
  );
}
