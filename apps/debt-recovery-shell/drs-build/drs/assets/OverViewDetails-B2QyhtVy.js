import { cH as createSvgIcon, dB as jsxRuntimeExports, el as useSelector, ed as useIntl, bf as OverviewAPI, A as AE, a2 as DescriptionIcon, ac as Dt, bZ as TE, cO as formatDate, cS as formatMoney, bk as Person, dK as ps, d6 as getPhoneHref, v as Box, cT as formatPhoneWithCountryCode, D as CallOutlined, M as Chip, bn as Phone, bx as React, cR as formatDialerPhoneNumber, aX as Kr, a4 as DialerAPI, bl as PersonOutline, aa as Divider, bX as StickyNote2, cK as displayValue, c as AccountTree, dN as reactExports, a9 as DirectionsCar, s as BarChart, b2 as Link, b$ as Table, c3 as TableHead, c4 as TableRow, c1 as TableCell, c0 as TableBody, W as CreditCard, ef as useLocation, aG as FollowupAPI, aP as History, cP as formatDateTime, em as useTheme, aW as Kg, bm as PersonOutlineOutlinedIcon, eh as useNavigate, bz as ReceiptLong, b5 as MailOutline, aT as Inventory2, x as ButtonBase } from "./index-BhdgJqva.js";
import { C as Call } from "./Call-DxIyuu8_.js";
import { A as AIOverview, P as PhoneInTalk } from "./AIOverview-CSdXd5GD.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { u as useOverviewSection } from "./useOverviewSection-D7tHarQl.js";
import { h as hasSelectedAccount, i as isPropertyPortfolio } from "./overviewRequestBody-1w14I_g2.js";
import { T as TrendingDownIcon } from "./TrendingDown-ukTIlt78.js";
import { A as AccessTimeOutlined } from "./AccessTimeOutlined-Cg2of2l-.js";
import "./CalendarMonth-oWMivZYB.js";
const ChatBubbleOutlineOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H6l-2 2V4h16z"
}));
const EventAvailable = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M16.53 11.06 15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V8h14z"
}));
const LocationOn = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"
}));
const TranslateOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m12.87 15.07-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7 1.62-4.33L19.12 17z"
}));
const gridSx = {
  display: "grid",
  gap: 1.5,
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
    lg: "repeat(5, minmax(0, 1fr))"
  }
};
function AccountDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getAccountDetails(),
    accountReady
  );
  const d = data || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: t("label.Overview.sections.account_details", "Account Details"),
      icon: DescriptionIcon,
      loading,
      error,
      minHeight: 150,
      sx: { overflow: "visible" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: gridSx, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.account_no", "Account No"), value: d.szLegacyAccountNo }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.disbursement_date", "Disbursement Date"), value: formatDate(d.dtDisb) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.cycle_days", "Cycle Day"), value: d.iCycleDay }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.tenor", "Tenor"), value: d.iTenor != null ? `${d.iTenor} months` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.interest_rate", "Interest Rate"), value: d.bgIntRate != null ? `${d.bgIntRate}%` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.installment_start_date", "Inst. Start Date"), value: formatDate(d.dtInstStart) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.inst_end_date", "Inst. End Date"), value: formatDate(d.dtInstEnd) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.installement_amount", "Installment Amt"), value: formatMoney(d.bgInstAmt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.product_offered", "Product Offered"), value: d.szProductOffered }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.no_of_od_installments", "OD Installments"), value: d.iNoOfODInstallments }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.no_of_os_installments", "OS Installments"), value: d.iNoOfOSInstallments }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.last_reversal_date", "Last Reversal On"), value: formatDate(d.dtLastReversal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.last_payment_on", "Last Payment On"), value: formatDate(d.dtLastPymt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.payment_due_date", "Payment Due Date"), value: formatDate(d.dtNextDueDate) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.last_reversal_amt", "Last Reversal Amt"), value: formatMoney(d.bgLastRevAmt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.last_payment_amount", "Last Payment Amt"), value: formatMoney(d.flastPymtAmt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: t("label.Overview.fields.payment_mode", "Payment Mode"), value: d.szPaymentType })
      ] })
    }
  );
}
function CoBorrowerSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchAccountRelationships(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.coborrower_gaurantor_details",
        defaultMessage: "Co-Borrower / Guarantor"
      }),
      icon: Person,
      accentColor: "#2563eb",
      subtitle: intl.formatMessage({
        id: "label.Overview.coborrower.subtitle",
        defaultMessage: "Relationship contacts linked to this account."
      }),
      loading,
      error,
      minHeight: rows.length <= 1 ? 76 : 96,
      emptyMinHeight: 48,
      children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.Overview.coborrower.empty",
            defaultMessage: "No co-borrower or guarantor details are available."
          }),
          colon: false,
          align: "left"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1, overflowX: "auto" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1,
              pb: 0.75,
              borderBottom: "1px solid rgba(26, 71, 155, 0.10)",
              minWidth: 420
            },
            children: [
              intl.formatMessage({ id: "label.Overview.fields.name", defaultMessage: "Name" }),
              intl.formatMessage({ id: "label.Overview.coborrower.phone", defaultMessage: "Phone" }),
              intl.formatMessage({ id: "label.Overview.fields.role", defaultMessage: "Role" })
            ].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: label,
                sx: { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 },
                colon: false,
                align: "left"
              },
              label
            ))
          }
        ),
        rows.map((row, index) => {
          const role = row.szCustomerTypeDesc || row.szCustomerType || "--";
          const isCoBorrower = String(role).toLowerCase().includes("co");
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              sx: {
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1,
                alignItems: "center",
                minWidth: 420
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.szName || "--", align: "left", sx: { fontSize: 10, fontWeight: 500 }, colon: false }),
                getPhoneHref(row.szPrefContactNo) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Box,
                  {
                    component: "a",
                    href: getPhoneHref(row.szPrefContactNo),
                    title: intl.formatMessage({ id: "label.Overview.coborrower.call", defaultMessage: "Click to call" }),
                    "aria-label": `Click to call ${formatPhoneWithCountryCode(row.szPrefContactNo)}`,
                    sx: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.35,
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#2563eb",
                      textDecoration: "none",
                      "& .phone-call-icon": {
                        opacity: 0,
                        transition: "opacity 120ms ease-in-out"
                      },
                      "&:hover": {
                        textDecoration: "underline"
                      },
                      "&:hover .phone-call-icon": {
                        opacity: 1
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { component: "span", children: formatPhoneWithCountryCode(row.szPrefContactNo) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CallOutlined, { className: "phone-call-icon", sx: { fontSize: 13 } })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: row.szPrefContactNo || "--", align: "left", sx: { fontSize: 10, fontWeight: 500 }, colon: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Chip,
                  {
                    size: "small",
                    label: role,
                    sx: {
                      width: "fit-content",
                      height: 20,
                      bgcolor: isCoBorrower ? "#dbeafe" : "#f3f4f6",
                      color: isCoBorrower ? "#1d4ed8" : "#374151",
                      fontWeight: 550,
                      fontSize: 11
                    }
                  }
                )
              ]
            },
            `${row.szName || "related-party"}-${index}`
          );
        })
      ] })
    }
  );
}
function CallDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getCallDetails(),
    accountReady
  );
  const d = data || {};
  const hasData = Boolean(d.szPrefContactNo || d.szPrefEmailId);
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({ id: "label.Overview.sections.call_details", defaultMessage: "Call Details" }),
      icon: Phone,
      loading,
      error,
      minHeight: hasData ? 66 : 48,
      emptyMinHeight: 46,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.preferred_contact_number", defaultMessage: "Preferred Contact No" }), value: d.szPrefContactNo, valueSx: { color: "#2563eb", fontWeight: 500 }, isPhone: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.preferred_mail_id", defaultMessage: "Preferred Mail Id" }), value: d.szPrefEmailId, valueSx: { color: "#7c3aed", fontWeight: 500 } })
      ] })
    }
  );
}
function PersonalDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchPersonalDetails(),
    accountReady
  );
  const d = data || {};
  const handlePhoneClick = React.useCallback(async (event, phone) => {
    var _a, _b, _c, _d, _e;
    event.preventDefault();
    const href = getPhoneHref(phone);
    if (!href) {
      return;
    }
    const payload = {
      caseId: String(
        (selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.ACCOUNT_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.ACCOUNT_ID) ?? ""
      ),
      customerId: String(
        (selectedRow == null ? void 0 : selectedRow.CUST_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.CUSTOMER_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.CUSTOMER_ID) ?? (selectedRow == null ? void 0 : selectedRow.LEGACY_CUST_NO) ?? ""
      ),
      phoneNumber: formatDialerPhoneNumber(phone, "+91")
    };
    if (!payload.phoneNumber) {
      return;
    }
    const loginUserId = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const tenantId = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    const customHeaders = {
      "X-Drs-User-Id": loginUserId,
      "X-Tenant-Id": tenantId
    };
    console.log("click-to-call headers:", customHeaders);
    try {
      const res = await Kr.POST(
        DialerAPI.clickToCall(),
        payload,
        {},
        false,
        customHeaders
      );
      const callId = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.callId) ?? ((_c = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.data) == null ? void 0 : _c.callId) ?? ((_e = (_d = res == null ? void 0 : res.data) == null ? void 0 : _d.responseJson) == null ? void 0 : _e.callId);
      console.log("click-to-call callId:", callId);
    } catch (error2) {
      console.error("click-to-call failed", error2);
    }
  }, [selectedRow]);
  const renderPhoneField = (label, phone) => {
    const href = getPhoneHref(phone);
    const value = formatPhoneWithCountryCode(phone);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { minWidth: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          sx: {
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            lineHeight: 1.2,
            fontWeight: 600
          },
          value: label,
          colon: false,
          align: "left"
        }
      ),
      href ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Box,
        {
          component: "a",
          href,
          onClick: (event) => {
            handlePhoneClick(event, phone);
          },
          title: intl.formatMessage({ id: "label.Overview.call", defaultMessage: "Click to call" }),
          "aria-label": `Click to call ${value}`,
          sx: {
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
              transition: "opacity 120ms ease-in-out"
            },
            "&:hover .phone-call-icon": {
              opacity: 1
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { component: "span", sx: { lineHeight: 1.3 }, children: value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CallOutlined, { className: "phone-call-icon", sx: { fontSize: 12 } })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          sx: {
            fontSize: 10,
            fontWeight: 500,
            mt: 0.35,
            wordBreak: "break-word",
            lineHeight: 1.3
          },
          value: phone || "--",
          colon: false,
          align: "left"
        }
      )
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.personal_details",
        defaultMessage: "Personal Details"
      }),
      icon: PersonOutline,
      loading,
      error,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" }
          },
          children: [
            renderPhoneField(
              intl.formatMessage({ id: "label.Overview.fields.phone_residence", defaultMessage: "Phone (R)" }),
              d.szRSPhone
            ),
            renderPhoneField(
              intl.formatMessage({ id: "label.Overview.fields.phone_office_short", defaultMessage: "Phone (O)" }),
              d.szOFPhone
            ),
            renderPhoneField(
              intl.formatMessage({ id: "label.Overview.fields.mobile_number_short", defaultMessage: "Mobile No." }),
              d.szMobileNo
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.date_of_birth", defaultMessage: "Date of Birth" }), value: formatDate(d.dtDateOfBirth) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.gender", defaultMessage: "Gender" }), value: d.szGender }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.designation", defaultMessage: "Designation" }), value: d.szDesignation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.occupation", defaultMessage: "Occupation" }), value: d.szOccupation })
          ]
        }
      )
    }
  );
}
function AddressDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getAddressDetails(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  const displayRows = rows.length > 0 ? rows : [{}];
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({ id: "label.Overview.sections.address_details", defaultMessage: "Address Details" }),
      icon: LocationOn,
      loading,
      error,
      minHeight: displayRows.length <= 1 ? 72 : 90,
      emptyMinHeight: 46,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: displayRows.map((addr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
        idx > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { my: 1 } }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: (addr == null ? void 0 : addr.szAddressType) || `Address ${idx + 1}`,
            colon: false,
            align: "left",
            sx: { fontWeight: 600, display: "block", mb: 0.5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.address_1", defaultMessage: "Address 1" }), value: addr == null ? void 0 : addr.szAddress1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.address_2", defaultMessage: "Address 2" }), value: addr == null ? void 0 : addr.szAddress2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.city", defaultMessage: "City" }), value: addr == null ? void 0 : addr.szCity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.zip", defaultMessage: "Zip" }), value: addr == null ? void 0 : addr.szZip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.state", defaultMessage: "State" }), value: addr == null ? void 0 : addr.szState })
            ]
          }
        )
      ] }, idx)) })
    }
  );
}
function StickyNotesSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.stickyNotes(),
    accountReady
  );
  const d = data || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AE,
          {
            title: intl.formatMessage({
              id: "label.Overview.fields.account_sticky_notes",
              defaultMessage: "Account Sticky Notes"
            }),
            icon: StickyNote2,
            accentColor: "#2563eb",
            loading,
            error,
            minHeight: 84,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  px: 1.25,
                  py: 1,
                  borderRadius: 2,
                  // bgcolor: "#fff8e8",
                  border: "1px solid rgba(245, 158, 11, 0.24)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: displayValue(d.szAccountStickyNotes),
                    sx: { fontSize: 14, fontStyle: "italic" },
                    colon: false,
                    align: "left"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AE,
          {
            title: intl.formatMessage({
              id: "label.Overview.fields.customer_sticky_notes",
              defaultMessage: "Customer Sticky Notes"
            }),
            icon: StickyNote2,
            accentColor: "#2563eb",
            loading,
            error,
            minHeight: 84,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  px: 1.25,
                  py: 1,
                  borderRadius: 2,
                  // bgcolor: "#f8fbff",
                  border: "1px solid rgba(37, 99, 235, 0.14)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: displayValue(d.szCustomerStickyNotes),
                    sx: { fontSize: 14, fontStyle: "italic" },
                    colon: false,
                    align: "left"
                  }
                )
              }
            )
          }
        )
      ]
    }
  );
}
function WorkflowSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getWorkFlowDetails(),
    accountReady
  );
  const d = data || {};
  const type = d.chTrunkYN === "Y" ? intl.formatMessage({ id: "label.Overview.workflow.primary", defaultMessage: "Primary" }) : d.chTrunkYN === "N" ? intl.formatMessage({ id: "label.Overview.workflow.secondary", defaultMessage: "Secondary" }) : "--";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.workflow_details",
        defaultMessage: "Workflow Details"
      }),
      icon: AccountTree,
      accentColor: "#2563eb",
      subtitle: intl.formatMessage({
        id: "label.Overview.workflow.subtitle",
        defaultMessage: "Current workflow ownership and progress state for the selected account."
      }),
      loading,
      error,
      minHeight: 70,
      emptyMinHeight: 48,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1, overflowX: "auto" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 1,
              pb: 0.75,
              borderBottom: "1px solid rgba(26, 71, 155, 0.10)",
              minWidth: 560
            },
            children: [
              intl.formatMessage({ id: "label.Overview.workflow.type", defaultMessage: "Type" }),
              intl.formatMessage({ id: "label.Overview.fields.workflow", defaultMessage: "Workflow" }),
              intl.formatMessage({ id: "label.Overview.workflow.state", defaultMessage: "State" }),
              intl.formatMessage({ id: "label.Overview.fields.start_date", defaultMessage: "Start Date" }),
              intl.formatMessage({ id: "label.Overview.fields.collector", defaultMessage: "Collector" })
            ].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: label,
                sx: { fontSize: 10, textTransform: "uppercase", fontWeight: 700 },
                colon: false,
                align: "left"
              },
              label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 1,
              alignItems: "center",
              minWidth: 560
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  size: "small",
                  label: type,
                  sx: {
                    width: "fit-content",
                    height: 24,
                    bgcolor: type === "Primary" ? "#dcfce7" : "#fee2e2",
                    color: type === "Primary" ? "#16a34a" : "#dc2626",
                    fontWeight: 700
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: d.szWfCode || "--",
                  sx: { fontSize: 13, fontWeight: 700, color: "#2563eb" },
                  colon: false,
                  align: "left"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: d.szWfStateCode || "--",
                  sx: { fontSize: 13, fontWeight: 700 },
                  colon: false,
                  align: "left"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: formatDate(d.dtWfDate),
                  sx: { fontSize: 13, fontWeight: 700 },
                  colon: false,
                  align: "left"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  size: "small",
                  label: d.szCollectorCode || "--",
                  sx: {
                    width: "fit-content",
                    height: 22,
                    bgcolor: "#e0f2fe",
                    color: "#0369a1",
                    fontSize: 11,
                    fontWeight: 800
                  }
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function AssetSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const property = isPropertyPortfolio(selectedRow == null ? void 0 : selectedRow.PRTFL);
  const url = reactExports.useMemo(
    () => property ? OverviewAPI.fetchPropertyDetails() : OverviewAPI.fetchAutoDetails(),
    [property]
  );
  const { loading, data, error } = useOverviewSection(url, accountReady);
  const autoRows = reactExports.useMemo(() => {
    if (property) return [];
    if (Array.isArray(data)) return data;
    return data ? [data] : [];
  }, [data, property]);
  const prop = property && data && !Array.isArray(data) ? data : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({ id: "label.Overview.sections.asset_details", defaultMessage: "Asset Details" }),
      icon: DirectionsCar,
      loading,
      error,
      minHeight: property && prop || !property && autoRows.length === 1 ? 72 : 90,
      emptyMinHeight: 46,
      children: property && prop ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.current_valuation", defaultMessage: "Current Valuation" }), value: formatMoney(prop.bgCurrentValue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.property_address", defaultMessage: "Property Address" }), value: prop.szPropertyAddress }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.project_name", defaultMessage: "Project Name" }), value: prop.szProjectName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.developer", defaultMessage: "Developer" }), value: prop.szDeveloperName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.insurance_policy_no", defaultMessage: "Insurance Policy No" }), value: prop.szInsuPolicyNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.asset_status", defaultMessage: "Asset Status" }), value: prop.szAssetStatus })
          ]
        }
      ) : !property && autoRows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: autoRows.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
        idx > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { my: 1 } }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { variant: "caption", sx: { fontWeight: 600, display: "block", mb: 0.5 }, children: intl.formatMessage({ id: "label.Overview.fields.asset_index", defaultMessage: "Asset {index}" }, { index: idx + 1 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.current_valuation", defaultMessage: "Current Valuation" }), value: formatMoney(row.fCurrentValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.description", defaultMessage: "Description" }), value: row.szDesc }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.engine_no", defaultMessage: "Engine No" }), value: row.szEnginNo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.chassis_no", defaultMessage: "Chassis No" }), value: row.szChasisNo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.registration_no", defaultMessage: "Registration No" }), value: row.szRegNo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.insurance_policy_no", defaultMessage: "Insurance Policy No" }), value: row.szInsuPolicyNo })
            ]
          }
        )
      ] }, idx)) }) : !loading && !error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { variant: "caption", color: "text.secondary", children: intl.formatMessage({ id: "error.Overview.no_asset_details", defaultMessage: "No asset details returned." }) }) : null
    }
  );
}
function CollectionSummarySection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchCollectionSummary(),
    accountReady
  );
  const d = data || {};
  const watchActive = String(d.szWatchFlag || "").toUpperCase() === "Y";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.collection_summary",
        defaultMessage: "Collection Summary"
      }),
      icon: BarChart,
      accentColor: "#2563eb",
      subtitle: intl.formatMessage({
        id: "label.Overview.collection_summary.subtitle",
        defaultMessage: "Recovery summary, watch controls and peak delinquency indicators."
      }),
      loading,
      error,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.special_code", defaultMessage: "Special Code" }), value: d.szSpecialCode, valueSx: { color: "#7c3aed" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.delinquency_reason", defaultMessage: "Delq. Reason" }), value: d.szDelinquencyReason, valueSx: { color: "#b45309" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.peak_delinquency_days", defaultMessage: "Peak Delq. Days" }), value: d.inPeakODdays, valueSx: { color: Number(d.inPeakODdays) > 60 ? "#dc2626" : "#16213e" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.times_in_collection", defaultMessage: "Times In Collection" }), value: d.inTimesInCollection, valueSx: { color: "#0f766e" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.watch_flag", defaultMessage: "Watch Flag" }), value: watchActive ? "Y" : d.szWatchFlag, valueSx: { color: watchActive ? "#dc2626" : "#16213e", fontWeight: 800 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.peak_od_amount", defaultMessage: "Peak OD Amount" }), value: formatMoney(d.flPeakOverdueAmt), valueSx: { color: "#1d4ed8" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.delinquency_start_date", defaultMessage: "Delq. Start Date" }), value: formatDate(d.dtDelqStart), valueSx: { color: "#ec4899" } })
          ]
        }
      )
    }
  );
}
function getPillColors(value) {
  if (value === "-") return { bg: "#edf2f7", color: "#64748b", border: "#e2e8f0" };
  const num = Number(value);
  if (!Number.isNaN(num) && num >= 4) return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  if (!Number.isNaN(num) && num >= 2) return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  return { bg: "#fff8e8", color: "#c2410c", border: "#fed7aa" };
}
function DelinquencySection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getDelinquencyInfo(),
    accountReady
  );
  const d = data || {};
  const ds = String(d.szDelinquencyString || "").split("/").filter(Boolean);
  const cs = displayValue(d.szCycleString);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.delinquency_cycle",
        defaultMessage: "Delinquency / Cycle"
      }),
      icon: TrendingDownIcon,
      accentColor: "#2563eb",
      subtitle: intl.formatMessage({
        id: "label.Overview.delinquency.subtitle",
        defaultMessage: "Payment ageing sequence and cycle progression for the account."
      }),
      loading,
      error,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.Overview.delinquency.ds",
                defaultMessage: "Delinquency String (DS)"
              }),
              colon: false,
              align: "left",
              sx: { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.75, display: "flex", flexWrap: "wrap", gap: 0.75 }, children: ds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: `—`, align: "left", colon: false }) : ds.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                minWidth: 28,
                height: 28,
                px: 0.75,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontFamily: "monospace",
                fontWeight: 800,
                bgcolor: getPillColors(v).bg,
                color: getPillColors(v).color,
                border: `1px solid ${getPillColors(v).border}`,
                boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.35)"
              },
              children: v
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.Overview.delinquency.cs",
                defaultMessage: "Cycle String (CS)"
              }),
              sx: { textTransform: "uppercase" },
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.75 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: cs,
              component: "span",
              colon: false,
              align: "left"
            }
          ) })
        ] })
      ] })
    }
  );
}
function LinkedLoansSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getLinkedLoanDetails(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.linked_loans",
        defaultMessage: "Linked Loans"
      }),
      icon: Link,
      loading,
      error,
      minHeight: rows.length <= 1 ? 58 : 80,
      emptyMinHeight: 44,
      children: !loading && !error && rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.Overview.linked_loans.empty",
            defaultMessage: "No linked loans."
          }),
          colon: false,
          align: "left"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", sx: { "& td, & th": { fontSize: 11, py: 0.5 } }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: intl.formatMessage({ id: "label.Overview.linked_loans.account", defaultMessage: "Account" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: intl.formatMessage({ id: "label.Overview.fields.portfolio", defaultMessage: "Portfolio" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", children: intl.formatMessage({ id: "label.Overview.linked_loans.os_amount", defaultMessage: "OS Amt" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", children: intl.formatMessage({ id: "label.Overview.linked_loans.od_principal", defaultMessage: "OD Prin" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: displayValue(r.szLegacyAccountNo) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: displayValue(r.szPortfolioCode) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", children: formatMoney(r.bgOsAmt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", children: formatMoney(r.bgOverDueprinAmt) })
        ] }, i)) })
      ] })
    }
  );
}
function CardDetailsSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(OverviewAPI.getCardDetails(), accountReady);
  const d = data || {};
  const intl = useIntl();
  if (!accountReady) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({ id: "label.Overview.sections.card_details", defaultMessage: "Card Details" }),
      icon: CreditCard,
      loading,
      error,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.cardName", defaultMessage: "Name" }), value: d.szName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.cardNo", defaultMessage: "Card No" }), value: d.szCardNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.cardType", defaultMessage: "Card Type" }), value: d.szCardType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.cycleDay", defaultMessage: "Cycle Day" }), value: d.inCycleDay }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.issueDate", defaultMessage: "Issue Date" }), value: formatDate(d.dtIssue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.expiryDate", defaultMessage: "Expiry Date" }), value: formatDate(d.dtExpiry) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.limit", defaultMessage: "Limit" }), value: formatMoney(d.bdLimit) })
          ]
        }
      )
    }
  );
}
function resultTone(result = "") {
  const value = String(result).toLowerCase();
  if (value.includes("promise") || value.includes("paid")) {
    return { bg: "#dcfce7", color: "#15803d" };
  }
  if (value.includes("visit") || value.includes("schedule")) {
    return { bg: "#dbeafe", color: "#1d4ed8" };
  }
  return { bg: "#fef3c7", color: "#b45309" };
}
function PreviousFollowupSection() {
  var _a, _b;
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const [state, setState] = reactExports.useState({ loading: false, row: null, error: null });
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    let active = true;
    if (!selectedRow) {
      setState({ loading: false, row: null, error: null });
      return void 0;
    }
    setState({ loading: true, row: null, error: null });
    Kr.GET(FollowupAPI.Followup(screenMenuId) + `/fetchFollowupHisForAcct`).then((res) => {
      var _a2;
      const rows = Array.isArray((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.responseJson) ? res.data.responseJson : [];
      const latest = [...rows].sort((a, b) => {
        const left = new Date((b == null ? void 0 : b.dtAction) || 0).getTime();
        const right = new Date((a == null ? void 0 : a.dtAction) || 0).getTime();
        return left - right;
      })[0] || null;
      if (active) setState({ loading: false, row: latest, error: null });
    }).catch((error) => {
      if (active) {
        setState({
          loading: false,
          row: null,
          error: (error == null ? void 0 : error.message) || intl.formatMessage({
            id: "label.Overview.previous_followup.load_error",
            defaultMessage: "Unable to load previous follow-up details"
          })
        });
      }
    });
    return () => {
      active = false;
    };
  }, [intl, selectedRow]);
  reactExports.useEffect(() => {
    console.log("PreviousFollowupsection------------------------------------------------", screenMenuId);
  }, []);
  const tone = reactExports.useMemo(() => {
    var _a2;
    return resultTone((_a2 = state.row) == null ? void 0 : _a2.szResultCode);
  }, [(_a = state.row) == null ? void 0 : _a.szResultCode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "label.Overview.sections.previous_followup",
        defaultMessage: "Previous Followup"
      }),
      icon: History,
      accentColor: "#2563eb",
      subtitle: intl.formatMessage({
        id: "label.Overview.previous_followup.subtitle",
        defaultMessage: "Latest action, next planned step and recovery result from follow-up history."
      }),
      loading: state.loading,
      error: state.error,
      minHeight: state.row ? 108 : 48,
      emptyMinHeight: 46,
      action: ((_b = state.row) == null ? void 0 : _b.szResultCode) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Chip,
        {
          size: "small",
          label: state.row.szResultCode,
          sx: {
            height: 22,
            bgcolor: tone.bg,
            color: tone.color,
            fontSize: 10,
            fontWeight: 700
          }
        }
      ) : null,
      children: !state.row ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.Overview.previous_followup.empty",
            defaultMessage: "No follow-up history is available for this account yet."
          }),
          colon: false,
          align: "left"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              gap: 0.75,
              flexWrap: "wrap"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  size: "small",
                  label: intl.formatMessage(
                    { id: "label.Overview.previous_followup.action_chip", defaultMessage: "Action: {action}" },
                    { action: state.row.szActionCode || "--" }
                  ),
                  sx: {
                    height: 22,
                    bgcolor: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: 9,
                    fontWeight: 800
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  size: "small",
                  label: state.row.dtNextAction ? intl.formatMessage(
                    { id: "label.Overview.previous_followup.next_chip", defaultMessage: "Next: {date}" },
                    { date: formatDate(state.row.dtNextAction) }
                  ) : intl.formatMessage({
                    id: "label.Overview.previous_followup.next_not_planned",
                    defaultMessage: "Next: Not planned"
                  }),
                  sx: {
                    height: 22,
                    bgcolor: "#ede9fe",
                    color: "#6d28d9",
                    fontSize: 9,
                    fontWeight: 800
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.last_action", defaultMessage: "Last Action" }), value: state.row.szActionCode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.last_action_date", defaultMessage: "Last Action Date" }), value: formatDateTime(state.row.dtAction) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.logged_in_user", defaultMessage: "Logged In User" }), value: state.row.szLogedInUser || "ADMIN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.action_planned", defaultMessage: "Action Planned" }), value: state.row.szNextActionCode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.planned_date", defaultMessage: "Planned Date" }), value: formatDateTime(state.row.dtNextAction) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TE, { label: intl.formatMessage({ id: "label.Overview.fields.result", defaultMessage: "Result" }), value: state.row.szResultCode })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              borderRadius: 2,
              px: 1.25,
              py: 1,
              border: "1px solid rgba(37, 99, 235, 0.10)",
              display: "flex",
              alignItems: "flex-start",
              gap: 1
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EventAvailable, { sx: { fontSize: 18, color: "#2563eb", mt: 0.2 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.Overview.previous_followup.planning_note",
                      defaultMessage: "Planning Note"
                    }),
                    colon: false,
                    align: "left",
                    sx: { textTransform: "uppercase" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: state.row.szNextActionCode ? intl.formatMessage(
                      {
                        id: "label.Overview.previous_followup.planning_note_scheduled",
                        defaultMessage: "{action} scheduled for {date}."
                      },
                      { action: state.row.szNextActionCode, date: formatDate(state.row.dtNextAction) }
                    ) : intl.formatMessage({
                      id: "label.Overview.previous_followup.planning_note_empty",
                      defaultMessage: "No next action has been scheduled."
                    }),
                    colon: false,
                    align: "left",
                    sx: { mt: 0.5, fontSize: 11, fontWeight: 600 }
                  }
                )
              ] })
            ]
          }
        )
      ] })
    }
  );
}
const PAST_COMMUNICATIONS = [
  { date: "05 Jun", channel: "Call", agent: "Ankit S.", summary: "PTP taken for 10 Jun, broken", outcome: "Broken PTP", agentSentiment: "neutral", customerSentiment: "negative" },
  { date: "12 Jun", channel: "SMS", agent: "System", summary: "Reminder sent", outcome: "Delivered", agentSentiment: "neutral", customerSentiment: "neutral" },
  { date: "18 Jun", channel: "Call", agent: "Priya M.", summary: "No answer, voicemail left", outcome: "No Contact", agentSentiment: "neutral", customerSentiment: "neutral" },
  { date: "24 Jun", channel: "WhatsApp", agent: "Priya M.", summary: "Customer requested callback", outcome: "Callback", agentSentiment: "positive", customerSentiment: "positive" }
];
const CALL_BEHAVIOUR = {
  bestTimeToCall: "10:00 – 12:00",
  preferredChannel: "WhatsApp then Call",
  languagePref: "English / Hindi",
  cooperationScore: 62
};
const initials = (name) => String(name).split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";
const sentimentColor = (sentiment, theme) => {
  if (sentiment === "positive") return theme.palette.success.main;
  if (sentiment === "negative") return theme.palette.error.main;
  return theme.palette.text.disabled;
};
const MiniField = ({ icon: Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Dt,
  {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: 0.75,
      minWidth: 0,
      background: "transparent"
    },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 11, color: "text.secondary", flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, background: "transparent" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: label,
            colon: false,
            translate: false,
            align: "left",
            sx: {
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
              lineHeight: 1.2,
              display: "block"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value,
            colon: false,
            translate: false,
            sx: {
              fontSize: 11,
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.2,
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }
          }
        )
      ] })
    ]
  }
);
const CustomerProfileSummary = () => {
  const theme = useTheme();
  const { headerData } = useSelector((s) => s.account);
  const name = (headerData == null ? void 0 : headerData.szName) || "Customer";
  const score = CALL_BEHAVIOUR.cooperationScore;
  const scoreColor = { bg: `${theme.palette.warning.main}18`, border: `${theme.palette.warning.main}50`, text: theme.palette.warning.dark };
  const recent = PAST_COMMUNICATIONS.slice(-3).reverse();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      elevation: 0,
      sx: {
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.625,
              borderBottom: "1px solid",
              borderColor: "divider"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PersonOutlineOutlinedIcon, { sx: { fontSize: 12, color: "primary.main" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: "Customer Profile",
                  colon: false,
                  translate: false,
                  sx: { fontSize: 11, fontWeight: 600, color: "text.primary" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              px: 1,
              py: 0.75,
              background: "transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                    background: "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Dt,
                      {
                        sx: {
                          height: 32,
                          width: 32,
                          borderRadius: "50%",
                          bgcolor: (t) => `${t.palette.primary.main}18`,
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0
                        },
                        children: initials(name)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, background: "transparent" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ps,
                        {
                          value: name,
                          colon: false,
                          translate: false,
                          sx: {
                            fontSize: 12,
                            fontWeight: 600,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Dt,
                        {
                          component: "span",
                          sx: {
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: 9,
                            fontWeight: 600,
                            px: 0.75,
                            height: 16,
                            borderRadius: 0.75,
                            border: "1px solid",
                            bgcolor: scoreColor.bg,
                            borderColor: scoreColor.border,
                            color: scoreColor.text,
                            letterSpacing: "0.04em"
                          },
                          children: `Cooperation ${score}%`
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { orientation: "vertical", flexItem: true, sx: { mx: 0.5 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1.5,
                    flex: 1,
                    minWidth: 280,
                    background: "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MiniField, { icon: AccessTimeOutlined, label: "Best Time", value: CALL_BEHAVIOUR.bestTimeToCall }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MiniField, { icon: ChatBubbleOutlineOutlinedIcon, label: "Preferred", value: CALL_BEHAVIOUR.preferredChannel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MiniField, { icon: TranslateOutlinedIcon, label: "Language", value: CALL_BEHAVIOUR.languagePref })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { orientation: "vertical", flexItem: true, sx: { mx: 0.5 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    flexWrap: "wrap",
                    background: "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: "Recent",
                        colon: false,
                        translate: false,
                        sx: {
                          fontSize: 9,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "text.secondary"
                        }
                      }
                    ),
                    recent.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Dt,
                      {
                        title: c.summary,
                        sx: {
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 0.75,
                          px: 0.75,
                          py: 0.25,
                          bgcolor: "background.paper",
                          cursor: "default"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Dt,
                            {
                              component: "span",
                              sx: {
                                height: 6,
                                width: 6,
                                borderRadius: "50%",
                                bgcolor: sentimentColor(c.customerSentiment, theme),
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: c.channel,
                              colon: false,
                              translate: false,
                              sx: { fontSize: 10, fontWeight: 600, color: "text.primary" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: c.date,
                              colon: false,
                              translate: false,
                              sx: { fontSize: 10, color: "text.secondary" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: "·",
                              colon: false,
                              translate: false,
                              sx: { fontSize: 10, color: "text.secondary" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: c.outcome,
                              colon: false,
                              translate: false,
                              sx: { fontSize: 10, color: "text.primary" }
                            }
                          )
                        ]
                      },
                      i
                    ))
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
const twoCol = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5
};
function OverviewDetailsContent() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  if (!selectedRow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      HLabel,
      {
        value: intl.formatMessage({
          id: "label.Overview.empty.select_account",
          defaultMessage: "Select an account from the worklist to view overview details."
        }),
        sx: { fontSize: 10, flexShrink: 0 },
        align: "left",
        colon: false
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.5, pb: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AIOverview, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerProfileSummary, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccountDetailsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: twoCol, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CoBorrowerSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CallDetailsSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: twoCol, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PersonalDetailsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailsSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNotesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: twoCol, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WorkflowSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PreviousFollowupSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: twoCol, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssetSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSummarySection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DelinquencySection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LinkedLoansSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDetailsSection, {})
  ] });
}
function QuickLink({ icon: Icon, label, accent, onClick }) {
  const theme = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ButtonBase,
    {
      onClick,
      sx: {
        px: 0.95,
        py: 0.45,
        borderRadius: 999,
        border: "1px solid rgba(26, 71, 155, 0.10)",
        bgcolor: theme.palette.background.gradient || "#fff",
        justifyContent: "flex-start",
        gap: 0.5,
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: `${accent}14`,
              color: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 11 } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: label,
            sx: { fontSize: 10, fontWeight: 700 },
            colon: false,
            align: "left",
            width: "50%"
          }
        )
      ]
    }
  );
}
function AccountOverview() {
  const intl = useIntl();
  const navigate = useNavigate();
  const quickLinks = [
    { label: "Call", icon: Call, accent: "#2563eb", to: "/homelayout/followup/followup" },
    { label: "Follow Up", icon: PhoneInTalk, accent: "#f59e0b", to: "/homelayout/followup/followup" },
    { label: "Activities", icon: ReceiptLong, accent: "#22c55e", to: "/homelayout/previousactivities" },
    { label: "Memos", icon: MailOutline, accent: "#7c3aed", to: "/homelayout/memos" },
    { label: "Assets", icon: Inventory2, accent: "#0f766e", to: "/homelayout/assets" }
  ];
  const actions = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        display: "flex",
        gap: 0.6,
        flexWrap: "wrap",
        alignItems: "center",
        px: 0.5,
        py: 0,
        borderRadius: 1.5,
        border: "1px solid rgba(37,99,235,0.08)"
      },
      children: quickLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuickLink,
        {
          icon: link.icon,
          label: link.label,
          accent: link.accent,
          onClick: () => navigate(link.to)
        },
        link.label
      ))
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.Overview.title",
        defaultMessage: "Overview"
      }),
      actions,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewDetailsContent, {})
    }
  );
}
export {
  AccountOverview as default
};
