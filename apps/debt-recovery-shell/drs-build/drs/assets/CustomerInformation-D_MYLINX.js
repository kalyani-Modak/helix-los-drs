import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, em as useTheme, dN as reactExports, M as Chip, aW as Kg, ac as Dt, bj as People, cf as Typography, cy as bu, ct as ar, el as useSelector, ef as useLocation, bx as React, aX as Kr, ae as EmploymentDetailsAPI, bk as Person, aM as Grid, bn as Phone, b as AccountBalance, dK as ps, bf as OverviewAPI, dD as lE, N as CircularProgress, c2 as TableContainer, b$ as Table, c3 as TableHead, c4 as TableRow, c1 as TableCell, c0 as TableBody, cr as alpha, aR as IconButton, O as CloseIcon, ch as UpdateAddressAPI, cM as fetchCustomerAddressAPI, U as CommunicationpreferencesAPI, bH as SE, cs as ap, cB as cc, cj as Vg, Y as CustomerInformationAPI, w as Button, K as ChevronLeft } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { L as LinkedCustomerTileStrip } from "./LinkedCustomerTileStrip-BVwxQKbk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { u as useOverviewSection } from "./useOverviewSection-D7tHarQl.js";
import { h as hasSelectedAccount } from "./overviewRequestBody-1w14I_g2.js";
const CalendarToday = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 18H4V8h16z"
}));
const ChildCare = createSvgIcon([/* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "14.5",
  cy: "10.5",
  r: "1.25"
}, "0"), /* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "9.5",
  cy: "10.5",
  r: "1.25"
}, "1"), /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M22.94 12.66q.06-.315.06-.66c0-.345-.02-.45-.06-.66-.25-1.51-1.36-2.74-2.81-3.17-.53-1.12-1.28-2.1-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91-1.45.43-2.56 1.65-2.81 3.17Q1 11.655 1 12c0 .345.02.45.06.66.25 1.51 1.36 2.74 2.81 3.17.52 1.11 1.27 2.09 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89 1.44-.43 2.55-1.65 2.8-3.17M19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2M7.5 14c.76 1.77 2.49 3 4.5 3s3.74-1.23 4.5-3z"
}, "2")]);
const Email = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z"
}));
const Favorite = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"
}));
const Groups = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91M4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29M20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"
}));
const Map = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m20.5 3-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5M15 19l-6-2.11V5l6 2.11z"
}));
const Notifications = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"
}));
const Public = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39"
}));
const Work = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-6 0h-4V4h4z"
}));
function roleChipColor(role) {
  if (role === "Borrower") return { variant: "filled", color: "primary" };
  if (role === "Co-Borrower") return { variant: "filled", color: "secondary" };
  return { variant: "outlined", color: "default" };
}
function LinkedCustomersGrid({ rowData, onCustomerNameClick, isLoading }) {
  const intl = useIntl();
  const theme = useTheme();
  const onClickMapping = reactExports.useMemo(
    () => ({
      name: (params) => {
        var _a;
        const id = (_a = params == null ? void 0 : params.data) == null ? void 0 : _a.id;
        if (id) onCustomerNameClick(id);
      }
    }),
    [onCustomerNameClick]
  );
  const columnDefs = reactExports.useMemo(() => {
    const fontFamily = theme.typography.fontFamily;
    const compactHeader = {
      fontSize: "10px",
      fontWeight: 700,
      // Bold
      fontFamily,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      // Make headers uppercase
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)",
      padding: "8px 12px",
      lineHeight: "1.5"
    };
    const baseCell = {
      fontSize: "11px",
      fontFamily,
      lineHeight: 1.5,
      // Better line height
      whiteSpace: "normal",
      padding: "10px 12px"
      // Better padding
    };
    return [
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.name" }),
        field: "name",
        flex: 1.1,
        minWidth: 130,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          color: theme.palette.primary.main,
          fontWeight: 500,
          cursor: "pointer"
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.role" }),
        field: "role",
        flex: 0.85,
        minWidth: 110,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center"
        },
        cellRenderer: (params) => {
          const role = params.value || "";
          const chip = roleChipColor(role);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              label: role,
              size: "small",
              variant: chip.variant,
              color: chip.color === "default" ? "default" : chip.color,
              sx: {
                height: 24,
                fontSize: "9px",
                fontWeight: 600,
                // More refined chip styling
                "& .MuiChip-label": {
                  padding: "0 8px"
                }
              }
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.customerNo" }),
        field: "customerNo",
        flex: 1,
        minWidth: 120,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: theme.palette.text.secondary
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.accountNo" }),
        field: "accountNo",
        flex: 1,
        minWidth: 140,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: theme.palette.primary.main,
          fontWeight: 500,
          cursor: "pointer"
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.delinquent" }),
        field: "delinquent",
        flex: 0.55,
        minWidth: 90,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: "center" },
        cellStyle: {
          ...baseCell,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        cellRenderer: (params) => {
          const v = params.value;
          const isY = v === "Y";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              label: v,
              size: "small",
              color: isY ? "error" : "default",
              variant: isY ? "filled" : "outlined",
              sx: {
                height: 24,
                fontSize: "9px",
                fontWeight: 600,
                "& .MuiChip-label": {
                  padding: "0 8px"
                }
              }
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.portfolio" }),
        field: "portfolio",
        flex: 0.9,
        minWidth: 110,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: { ...baseCell, color: theme.palette.text.primary }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.odAmount" }),
        field: "odAmount",
        flex: 0.75,
        minWidth: 100,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: "right" },
        cellStyle: {
          ...baseCell,
          textAlign: "right",
          fontWeight: 600,
          color: theme.palette.error.main
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.osAmount" }),
        field: "osAmount",
        flex: 0.75,
        minWidth: 100,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: "right" },
        cellStyle: {
          ...baseCell,
          textAlign: "right",
          fontWeight: 600,
          color: theme.palette.text.primary
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`
      }
    ];
  }, [intl, theme]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: 2,
        borderColor: "divider",
        overflow: "hidden",
        // Professional box shadow for depth
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        margin: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              px: 2,
              py: 1.5,
              // Better padding
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              margin: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(People, { sx: { fontSize: 20, color: "primary.main", flexShrink: 0 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  variant: "subtitle2",
                  sx: {
                    fontSize: 13,
                    // Slightly larger
                    fontWeight: 600,
                    color: "text.primary",
                    margin: 0
                    // Remove default margin
                  },
                  children: intl.formatMessage({ id: "label.customerInformation.linkedCustomers" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 0, pb: 0, pt: 0, margin: 0 }, children: [
          "  ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bu,
            {
              rowData,
              columnDefs,
              onClickMapping,
              gridClassName: "drs-list-grid drs-accounts-table-chrome",
              gridStyle: {
                width: "100%",
                height: "min(36vh, 320px)",
                minHeight: 200,
                // Add border-top for separation if needed
                borderTop: `1px solid ${theme.palette.divider}`
              },
              pagination: false,
              sort: false,
              allowAdd: false,
              allowDelete: false,
              allowUpdate: false,
              hideInternalSaveButton: true,
              isLoading,
              showTitle: false
            }
          )
        ] })
      ]
    }
  );
}
function SubsectionTitle({ icon, titleId }) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { color: "primary.main", display: "flex" }, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: titleId }) })
  ] });
}
function DelightFieldRow({ labelId, value, theme, icon }) {
  const display = value != null && value !== "" ? String(value) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { py: 0.75, minWidth: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.text.secondary, mb: 0.25 }, children: [
      icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", alignItems: "center", color: "text.secondary" }, children: icon }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: labelId, translate: true, colon: false, align: "left", color: theme.palette.text.secondary })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.25 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: display, translate: false, colon: false, align: "left", color: theme.palette.text.primary }) })
  ] }) });
}
function CustomerDetailsSection({ customer }) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [customerData, setCustomerData] = reactExports.useState({
    customerNo: "",
    customerName: "",
    dob: "",
    pob: "",
    regionalName: "",
    aliasName: "",
    nationality: "",
    gender: "",
    maritalStatus: "",
    stayedYears: "",
    familyIncome: "",
    noOfChildren: "",
    noOfDependants: "",
    mobileNo: "",
    email: "",
    occupation: "",
    employerName: "",
    designation: "",
    annualSalary: "",
    bankAccountNo: "",
    bankName: "",
    branchName: ""
  });
  const fetchCustomerDetails = React.useCallback(() => {
    if (!selectedRow || !customer) return;
    console.log(">>>>>>Screen Menu ID:", screenMenuId);
    Kr.GET(EmploymentDetailsAPI.fetchCustomerDetails(screenMenuId)).then((res) => {
      var _a;
      if (res.data.status === "Success" && ((_a = res.data.responseJson) == null ? void 0 : _a.length) > 0) {
        const data = res.data.responseJson[0];
        const cust = data.customerDetails || {};
        const emp = data.employmentDetails || {};
        const fin = data.financialStatus || {};
        setCustomerData({
          customerNo: cust.szLegacyCustomerNo || "",
          customerName: cust.szName || "",
          dob: cust.dtDateOfBirth || "",
          pob: cust.szPlaceOfBirth || "",
          regionalName: cust.szRegionalName || "",
          aliasName: cust.szAliasName || "",
          nationality: cust.szNationality || "",
          gender: cust.szGender || "",
          maritalStatus: cust.chMaritalStatus || "",
          stayedYears: cust.flStayedYears || "",
          familyIncome: cust.flFamilyIncome || "",
          noOfChildren: cust.inNoOfChildren || "",
          noOfDependants: cust.inNoOfDependents || "",
          mobileNo: cust.szMobileNo || "",
          email: cust.szMailId || "",
          occupation: emp.szOccupation || "",
          employerName: emp.szEmployerCode || "",
          designation: emp.szDesignation || "",
          annualSalary: emp.flNetAnnualSalary || "",
          bankAccountNo: fin.szBankACNo || "",
          bankName: fin.szBankName || "",
          branchName: fin.szBranchName || ""
        });
      } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        toast.error(res.data.message || "Failed to fetch customer details");
      }
    }).catch((err) => {
      console.error("Fetch API Error:", err);
      toast.error("Something went wrong while fetching customer details");
    });
  }, [customer, intl, selectedRow, toast]);
  reactExports.useEffect(() => {
    if (selectedRow && customer) {
      fetchCustomerDetails();
    }
  }, [selectedRow, customer, fetchCustomerDetails]);
  if (!selectedRow) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubsectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Person, { sx: { fontSize: 18 } }), titleId: "label.customerInformation.section.customerDetails" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.customerNo", value: customerData.customerNo }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.customerName", value: customerData.customerName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.dob", value: customerData.dob, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarToday, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.pob", value: customerData.pob }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.regionalName", value: customerData.regionalName || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.alias", value: customerData.aliasName || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.nationality", value: customerData.nationality, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Public, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.gender", value: customerData.gender }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.marital", value: customerData.maritalStatus, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Favorite, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.stayedYears", value: customerData.stayedYears }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DelightFieldRow,
        {
          theme,
          labelId: "label.customerInformation.field.familyIncome",
          value: customerData.familyIncome != null ? `₹${Number(customerData.familyIncome).toLocaleString()}` : ""
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.children", value: customerData.noOfChildren, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChildCare, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.dependents", value: customerData.noOfDependants }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.mobile", value: customerData.mobileNo, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.email", value: customerData.email, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Email, { sx: { fontSize: 14 } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubsectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Work, { sx: { fontSize: 18 } }), titleId: "label.customerInformation.section.employment" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.occupation", value: customerData.occupation }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.employer", value: customerData.employerName, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Work, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.designation", value: customerData.designation }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DelightFieldRow,
        {
          theme,
          labelId: "label.customerInformation.field.annualSalary",
          value: customerData.annualSalary != null ? `₹${Number(customerData.annualSalary).toLocaleString()}` : ""
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubsectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountBalance, { sx: { fontSize: 18 } }), titleId: "label.customerInformation.section.financial" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.bankAccount", value: customerData.bankAccountNo, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountBalance, { sx: { fontSize: 14 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.bank", value: customerData.bankName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DelightFieldRow, { theme, labelId: "label.customerInformation.field.branch", value: customerData.branchName })
    ] })
  ] });
}
const mapLinkedLoanRow = (row) => ({
  agreementNo: (row == null ? void 0 : row.szLegacyAccountNo) || (row == null ? void 0 : row.szLegacyAccountNo) || "—",
  currentDelqDays: (row == null ? void 0 : row.inOdDays) ?? (row == null ? void 0 : row.iOdDays) ?? "—",
  currentAmount: (row == null ? void 0 : row.bdOverdueAmt) ?? (row == null ? void 0 : row.bdOverdueAmt) ?? (row == null ? void 0 : row.bgOsAmt) ?? (row == null ? void 0 : row.fOsAmt) ?? 0,
  peakDelqDays: (row == null ? void 0 : row.inPeakOdDays) ?? (row == null ? void 0 : row.iPeakOdDays) ?? "—",
  peakAmount: (row == null ? void 0 : row.bdPeakOverdueAmt) ?? (row == null ? void 0 : row.fPeakOverdueAmt) ?? 0,
  currentBucket: (row == null ? void 0 : row.szBucketCode) ?? "—",
  promiseTaken: (row == null ? void 0 : row.szPromiseTaken) ?? (row == null ? void 0 : row.promiseTaken) ?? "—",
  promiseBroken: (row == null ? void 0 : row.szPromiseBroken) ?? (row == null ? void 0 : row.promiseBroken) ?? "—",
  nextBucketDate: (row == null ? void 0 : row.szNextBucketDate) ?? "—",
  nextBucketDaysLeft: (row == null ? void 0 : row.lnNextBucketDaysLeft) ?? (row == null ? void 0 : row.nextBucketDaysLeft) ?? 0
});
function CustomerGroupSummarySection({ groupAccounts }) {
  const intl = useIntl();
  const theme = useTheme();
  const { selectedRow } = useSelector((state) => state.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getLinkedLoanDetails(screenMenuId),
    accountReady
  );
  const rows = reactExports.useMemo(() => {
    if (groupAccounts && groupAccounts.length) return groupAccounts;
    if (!data) return [];
    if (Array.isArray(data)) return data.map(mapLinkedLoanRow);
    return [mapLinkedLoanRow(data)];
  }, [data, groupAccounts]);
  const rowData = reactExports.useMemo(() => groupAccounts && groupAccounts.length ? groupAccounts : rows, [groupAccounts, rows]);
  const columnDefs = reactExports.useMemo(() => {
    const fontFamily = theme.typography.fontFamily;
    const compactHeader = {
      fontSize: "10px",
      fontWeight: 600,
      fontFamily,
      letterSpacing: "0.02em"
    };
    const baseCell = {
      fontSize: "11px",
      fontFamily,
      lineHeight: 1.45
    };
    return [
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.agreement" }),
        field: "agreementNo",
        flex: 1.2,
        minWidth: 140,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: theme.palette.primary.main
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.delqDays" }),
        field: "currentDelqDays",
        flex: 0.5,
        minWidth: 80,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.currentAmt" }),
        field: "currentAmount",
        flex: 0.65,
        minWidth: 100,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.NUMBER },
        cellStyle: {
          ...baseCell,
          textAlign: "right",
          fontWeight: 600,
          color: theme.palette.error.main
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.peakDays" }),
        field: "peakDelqDays",
        flex: 0.5,
        minWidth: 80,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.peakAmt" }),
        field: "peakAmount",
        flex: 0.6,
        minWidth: 90,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.ptp" }),
        field: "promiseTaken",
        flex: 0.4,
        minWidth: 56,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.STATUS },
        cellStyle: { ...baseCell, textAlign: "center" }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.broken" }),
        field: "promiseBroken",
        flex: 0.45,
        minWidth: 64,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.STATUS },
        cellStyle: {
          ...baseCell,
          textAlign: "center",
          color: theme.palette.error.main,
          fontWeight: 600
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.bucket" }),
        field: "currentBucket",
        flex: 0.4,
        minWidth: 56,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: lE.STATUS },
        cellStyle: { ...baseCell, textAlign: "center" }
      },
      {
        colId: "nextBucketSummary",
        headerName: intl.formatMessage({ id: "label.customerInformation.group.nextBucket" }),
        flex: 1,
        minWidth: 120,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: { ...baseCell, color: theme.palette.text.primary },
        valueGetter: (p) => {
          const g = p.data;
          if (!g) return "";
          if (g.nextBucketDate === "—") return "—";
          return `${g.nextBucketDate} (${g.nextBucketDaysLeft}d)`;
        }
      }
    ];
  }, [intl, theme]);
  if (!rowData || rowData.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, mb: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Groups, { sx: { fontSize: 18, color: "primary.main" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.section.groupSummary" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: 12 }, children: loading ? intl.formatMessage({ id: "label.customerInformation.group.loading", defaultMessage: "Loading linked loans..." }) : intl.formatMessage({ id: "label.customerInformation.group.empty" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2, py: 1.25, borderBottom: 1, borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 0.75 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Groups, { sx: { fontSize: 18, color: "primary.main" } }),
      intl.formatMessage({ id: "label.customerInformation.section.groupSummary" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 0, mt: -0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        rowData,
        columnDefs,
        gridClassName: "drs-list-grid drs-accounts-table-chrome",
        gridStyle: { width: "100%", height: 140, minHeight: 120 },
        pagination: false,
        sort: false,
        allowAdd: false,
        allowDelete: false,
        allowUpdate: false,
        hideInternalSaveButton: true,
        showTitle: false
      }
    ) })
  ] });
}
function AddressDetailFieldRow({ labelId, value, theme }) {
  const display = value != null && value !== "" ? String(value) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { py: 0.75, minWidth: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: labelId, translate: true, colon: false, align: "left", color: theme.palette.text.secondary }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.25 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: display, translate: false, colon: false, align: "left", color: theme.palette.text.primary }) })
  ] }) });
}
function AddressSummarySection({ customer }) {
  const intl = useIntl();
  const theme = useTheme();
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const [addresses, setAddresses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [expandedAddress, setExpandedAddress] = reactExports.useState(null);
  const [detailsLoading, setDetailsLoading] = reactExports.useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    if (!selectedRow) {
      setAddresses([]);
      setExpandedAddress(null);
      return;
    }
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        console.log(">>>>>>>>>Screen menu id: ", screenMenuId);
        const res = await Kr.GET(UpdateAddressAPI.UpdateAddressApi(screenMenuId));
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
  const handleSelectAddress = async (addressRow) => {
    if (!selectedRow || !(addressRow == null ? void 0 : addressRow.szAddressType)) return;
    setExpandedAddress(addressRow);
    setDetailsLoading(true);
    try {
      const wrapper = {
        szAddressType: addressRow.szAddressType
      };
      console.log(">>>>>>>>>Screen menu id: ", screenMenuId);
      const res = await Kr.GET(fetchCustomerAddressAPI.fetchCustomerAddress(screenMenuId), `${szAddressType}`);
      if (res.data.status === "Success") {
        const detailsData = Array.isArray(res.data.responseJson) ? res.data.responseJson[0] : res.data.responseJson;
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { color: "primary.main", display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { sx: { fontSize: 18 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.section.addressSummary" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", justifyContent: "center", py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 24 }) })
    ] });
  }
  if (!addresses || addresses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { color: "primary.main", display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { sx: { fontSize: 18 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.section.addressSummary" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: 12 }, children: "—" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, pt: 2, pb: 1, "&:first-of-type": { pt: 0 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { color: "primary.main", display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { sx: { fontSize: 18 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.section.addressSummary" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", sx: { "& .MuiTableCell-root": { fontSize: 11, py: 0.75 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { bgcolor: (t) => t.palette.mode === "dark" ? "action.hover" : "grey.100" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 10, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.addressSummary.type" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 10, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.addressSummary.description" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 10, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.addressSummary.zip" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 10, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.addressSummary.city" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: addresses.map((a) => {
        const selected = (expandedAddress == null ? void 0 : expandedAddress.szAddressType) === a.szAddressType;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            hover: true,
            onClick: () => handleSelectAddress(a),
            sx: {
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              ...selected && {
                bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.14 : 0.06)
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { color: theme.palette.primary.main, fontWeight: 600 }, children: a.szAddressType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: `${a.szAddress1 || ""} ${a.szAddress2 || ""}`.trim() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontFamily: "ui-monospace, monospace" }, children: a.szZip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: a.szCity })
            ]
          },
          a.szAddressType
        );
      }) })
    ] }) }),
    expandedAddress ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          mt: 1.5,
          p: 1.5,
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
          bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.06) : alpha(t.palette.common.black, 0.04)
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  variant: "caption",
                  sx: {
                    fontSize: 10,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    pt: 0.25
                  },
                  children: intl.formatMessage({ id: "label.customerInformation.overlay.title" }, { type: expandedAddress.szAddressType })
                }
              ),
              detailsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 16 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              IconButton,
              {
                size: "small",
                "aria-label": intl.formatMessage({ id: "label.customerInformation.overlay.close" }),
                onClick: (e) => {
                  e.stopPropagation();
                  setExpandedAddress(null);
                  setSelectedAddressDetails(null);
                },
                sx: { mt: -0.5, mr: -0.5 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, { fontSize: "small" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.contactPerson", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szContactPerson }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.address1", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szAddress1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.address2", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szAddress2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.city", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szCity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.zip", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szZip }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.state", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szState }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.country", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szCountry }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.telephone", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szPhone1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.fax", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szFax }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.mobile", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szMobileNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddressDetailFieldRow, { theme, labelId: "label.customerInformation.field.email", value: selectedAddressDetails == null ? void 0 : selectedAddressDetails.szMailId })
          ] })
        ]
      }
    ) : null
  ] });
}
const HARDCODED_CHANNELS = [
  { displayName: "Email", apiCode: "E" },
  // API returns "E"
  { displayName: "SMS", apiCode: "S" },
  // API returns "S"
  { displayName: "Call", apiCode: "C" },
  // API returns "C"
  { displayName: "Voice Broadcast", apiCode: "B" }
  // API returns "B"
];
const LANGUAGE_CODE_MAP = {
  english: "E",
  hindi: "H",
  marathi: "M"
};
const LANGUAGE_DESC_MAP = {
  english: "English",
  hindi: "Hindi",
  marathi: "Marathi"
};
const serializeLanguageCode = (language) => LANGUAGE_CODE_MAP[String(language).toLowerCase()] || "";
const serializeLanguageDesc = (language) => LANGUAGE_DESC_MAP[String(language).toLowerCase()] || "";
const formatBestTimeForInput = (value) => {
  if (!value) return "";
  return String(value).trim();
};
const serializeBestTime = (value) => {
  if (!value) return "";
  return String(value).trim();
};
const formatDays = (days) => DAY_KEYS.map((key) => days[key] ? "1" : "0").join("");
const parseDays = (szDays) => {
  const normalized = String(szDays || "").padEnd(7, "0").slice(0, 7);
  return {
    mon: normalized[0] === "1",
    tue: normalized[1] === "1",
    wed: normalized[2] === "1",
    thu: normalized[3] === "1",
    fri: normalized[4] === "1",
    sat: normalized[5] === "1",
    sun: normalized[6] === "1"
  };
};
function makeDefaultDraft() {
  const defaultDays = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
  };
  return {
    language: "",
    contactNo: "",
    emailId: "",
    // ✓ Create 4 hardcoded channels
    channels: HARDCODED_CHANNELS.map((channel) => ({
      displayName: channel.displayName,
      // "Email", "SMS", "Call", "Voice Broadcast"
      apiCode: channel.apiCode,
      // "EMAIL", "S", "CALL", "VOICE"
      allow: false,
      bestTime: "",
      days: { ...defaultDays },
      lnActivitySeqNo: null,
      lnCommPrefSeqNo: null,
      lnReferenceNo: null,
      szDays: "",
      szPartitionCode: "",
      szReferenceType: ""
    }))
  };
}
function cloneDraft(d) {
  const draft = d && typeof d === "object" ? JSON.parse(JSON.stringify(d)) : {};
  const normalized = {
    ...makeDefaultDraft(),
    ...draft,
    channels: Array.isArray(draft.channels) ? draft.channels : makeDefaultDraft().channels
  };
  return normalized;
}
function mapResponseToDraft(responseDto) {
  if (!responseDto) return makeDefaultDraft();
  const base = makeDefaultDraft();
  const contactNo = responseDto.szPrefContactNo || "";
  const emailId = responseDto.szPrefEmailId || "";
  const channels = HARDCODED_CHANNELS.map((channel) => {
    const apiChannelData = (responseDto.communicationChannels || []).find(
      (ch) => String(ch.szCommunicationType || "").toUpperCase() === String(channel.apiCode).toUpperCase()
    );
    if (apiChannelData && String(apiChannelData.szAllowedYN || "").toUpperCase() === "Y") {
      const days = parseDays(apiChannelData.szDays || "");
      return {
        displayName: channel.displayName,
        // "Email" (hardcoded display)
        apiCode: channel.apiCode,
        // "EMAIL" (from API)
        allow: true,
        // ✓ CHECKED
        bestTime: formatBestTimeForInput(apiChannelData.szBestTime || ""),
        // ENABLED
        days: { ...days },
        // ENABLED
        lnActivitySeqNo: apiChannelData.lnActivitySeqNo || null,
        lnCommPrefSeqNo: apiChannelData.lnCommPrefSeqNo || null,
        lnReferenceNo: apiChannelData.lnReferenceNo || null,
        szDays: apiChannelData.szDays || "",
        szPartitionCode: apiChannelData.szPartitionCode || "",
        szReferenceType: apiChannelData.szReferenceType || ""
      };
    } else {
      return {
        displayName: channel.displayName,
        // "Email" (hardcoded display)
        apiCode: channel.apiCode,
        // "EMAIL" (API code)
        allow: false,
        // ✗ UNCHECKED
        bestTime: "",
        // DISABLED
        days: { ...base.channels[0].days },
        // DISABLED
        lnActivitySeqNo: null,
        lnCommPrefSeqNo: null,
        lnReferenceNo: null,
        szDays: "",
        szPartitionCode: "",
        szReferenceType: ""
      };
    }
  });
  const language = (() => {
    const descRaw = responseDto.szPrefTmplIndicatorDesc || "";
    const desc = String(descRaw).trim().toLowerCase();
    if (desc === "english" || desc.includes("english")) return "english";
    if (desc === "hindi" || desc.includes("hindi")) return "hindi";
    if (desc === "marathi" || desc.includes("marathi")) return "marathi";
    const code = (responseDto.szPrefTmplIndicator || "").toString().trim().toUpperCase();
    const codeMap = { E: "english", H: "hindi", M: "marathi" };
    return codeMap[code] || "";
  })();
  return {
    language,
    contactNo,
    emailId,
    channels
  };
}
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const emailOk = (v) => {
  if (!v || !String(v).trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
};
function CommunicationPreferenceSection({ initialDraft, customerId, customer, selectedRow }) {
  const intl = useIntl();
  const toast = ar();
  const { selectedRow: accountSelectedRow } = useSelector((state) => state.account);
  const [draft, setDraft] = reactExports.useState(() => cloneDraft(initialDraft));
  const [savedSnapshot, setSavedSnapshot] = reactExports.useState(() => cloneDraft(initialDraft));
  const [errors, setErrors] = reactExports.useState({});
  const sourceRow = selectedRow || accountSelectedRow;
  const canFetchPreferences = Boolean(sourceRow && customer);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    const next = cloneDraft(initialDraft);
    setDraft(next);
    setSavedSnapshot(cloneDraft(initialDraft));
    setErrors({});
  }, [customerId, initialDraft]);
  reactExports.useEffect(() => {
    if (!canFetchPreferences) return;
    const fetchPreferences = async () => {
      try {
        console.log("menuId", screenMenuId);
        const res = await Kr.GET(
          CommunicationpreferencesAPI.fetchCommunicationPreferences(screenMenuId)
        );
        const payload = res == null ? void 0 : res.data;
        const responseJson = (payload == null ? void 0 : payload.responseJson) ?? (payload == null ? void 0 : payload.data);
        const responseDto = Array.isArray(responseJson) ? responseJson[0] : responseJson;
        if ((payload == null ? void 0 : payload.status) === "Failure" && (payload == null ? void 0 : payload.message) === "Validation Failed") {
          handleValidationErrors(intl, toast, payload.responseJson);
          return;
        }
        if (((payload == null ? void 0 : payload.status) === 200 || (payload == null ? void 0 : payload.status) === "Success") && responseDto) {
          const mappedDraft = mapResponseToDraft(responseDto);
          setDraft(mappedDraft);
          setSavedSnapshot(cloneDraft(mappedDraft));
        } else {
          const defaultDraft = makeDefaultDraft();
          setDraft(defaultDraft);
          setSavedSnapshot(cloneDraft(defaultDraft));
        }
      } catch (error) {
        console.error("Error fetching communication preferences:", error);
        toast.error("Failed to fetch communication preferences");
      }
    };
    fetchPreferences();
  }, [canFetchPreferences, intl, toast]);
  const languageOptions = reactExports.useMemo(
    () => [
      { value: "english", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.english" }) },
      { value: "hindi", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.hindi" }) },
      { value: "marathi", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.marathi" }) }
    ],
    [intl]
  );
  const dayHeaderIds = reactExports.useMemo(
    () => ({
      mon: "label.customerInformation.comm.day.mon",
      tue: "label.customerInformation.comm.day.tue",
      wed: "label.customerInformation.comm.day.wed",
      thu: "label.customerInformation.comm.day.thu",
      fri: "label.customerInformation.comm.day.fri",
      sat: "label.customerInformation.comm.day.sat",
      sun: "label.customerInformation.comm.day.sun"
    }),
    []
  );
  const setField = reactExports.useCallback((name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);
  const setChannelRow = reactExports.useCallback((idx, patch) => {
    setDraft((prev) => {
      const channels = [...prev.channels];
      channels[idx] = { ...channels[idx], ...patch };
      return { ...prev, channels };
    });
  }, []);
  const setChannelDay = reactExports.useCallback((idx, day, checked) => {
    setDraft((prev) => {
      const channels = [...prev.channels];
      const row = { ...channels[idx] };
      row.days = { ...row.days, [day]: checked };
      channels[idx] = row;
      return { ...prev, channels };
    });
  }, []);
  const validate = reactExports.useCallback(() => {
    const next = {};
    if (!draft.language) {
      next.language = intl.formatMessage({ id: "label.customerInformation.validation.language" });
    }
    if (!draft.channels.some((c) => c.allow)) {
      next.channel = intl.formatMessage({ id: "label.customerInformation.validation.channel" });
    }
    if (!emailOk(draft.emailId)) {
      next.email = intl.formatMessage({ id: "label.customerInformation.validation.email" });
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [draft, intl]);
  const handleSave = reactExports.useCallback(async () => {
    if (!validate()) return;
    try {
      const allowedChannels = draft.channels.filter((c) => c.allow);
      if (allowedChannels.length === 0) {
        toast.error("Please select at least ONE communication channel");
        return;
      }
      const channelPayload = allowedChannels.map((channel) => ({
        lnActivitySeqNo: channel.lnActivitySeqNo,
        lnCommPrefSeqNo: channel.lnCommPrefSeqNo,
        lnReferenceNo: channel.lnReferenceNo,
        szCommunicationType: channel.apiCode,
        // ✓ Send API code (EMAIL, S, CALL, VOICE)
        szBestTime: serializeBestTime(channel.bestTime),
        szDays: channel.szDays || formatDays(channel.days),
        szPartitionCode: channel.szPartitionCode || "",
        szReferenceType: channel.szReferenceType || "C",
        szAllowedYN: channel.allow ? "Y" : "N",
        szMon: channel.days.mon ? "Y" : "N",
        szTue: channel.days.tue ? "Y" : "N",
        szWed: channel.days.wed ? "Y" : "N",
        szThu: channel.days.thu ? "Y" : "N",
        szFri: channel.days.fri ? "Y" : "N",
        szSat: channel.days.sat ? "Y" : "N",
        szSun: channel.days.sun ? "Y" : "N"
      }));
      const savePayload = {
        communicationPreferencesDto: {
          szPrefContactNo: draft.contactNo,
          szPrefEmailId: draft.emailId,
          szPrefTmplIndicator: serializeLanguageCode(draft.language),
          // Language code (E, H, M)
          szPrefTmplIndicatorDesc: serializeLanguageDesc(draft.language),
          // Language desc (English, हिंदी, मराठी)
          communicationChannels: channelPayload
          // Only allowed channels
        }
      };
      console.log("DEBUG: Save payload:", savePayload);
      const res = await Kr.POST(
        CommunicationpreferencesAPI.saveCommunicationPreferences(screenMenuId),
        savePayload
      );
      setSavedSnapshot(cloneDraft(draft));
      toast.success(intl.formatMessage({ id: "label.customerInformation.toast.saveSuccess" }));
      return res;
    } catch (error) {
      console.error("Error saving communication preferences:", error);
      toast.error(intl.formatMessage({ id: "label.customerInformation.toast.saveError" }));
    }
  }, [draft, intl, toast, validate]);
  const handleReset = reactExports.useCallback(() => {
    setDraft(cloneDraft(savedSnapshot));
    setErrors({});
  }, [savedSnapshot]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", p: 2, mb: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, mb: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Notifications, { sx: { fontSize: 18, color: "primary.main" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontSize: 12, fontWeight: 600 }, children: intl.formatMessage({ id: "label.customerInformation.section.communication" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, sm: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.customerInformation.comm.language" }), align: "left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "language",
              align: "left",
              options: languageOptions,
              value: draft.language,
              onChange: (e) => setField("language", e.target.value),
              width: "100%",
              error: Boolean(errors.language)
            }
          ) }),
          errors.language ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block", mt: 0.5 }, children: errors.language }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, sm: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.customerInformation.comm.contactNo" }), align: "left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: draft.contactNo,
              editable: true,
              align: "left",
              onChange: (e) => setField("contactNo", e.target.value),
              width: "100%"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, sm: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.customerInformation.comm.emailId" }), align: "left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: draft.emailId,
              editable: true,
              onChange: (e) => setField("emailId", e.target.value),
              width: "100%",
              error: Boolean(errors.email)
            }
          ) }),
          errors.email ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block", mt: 0.5 }, children: errors.email }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", sx: { "& .MuiTableCell-root": { fontSize: 11, py: 0.75 } }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 600, fontSize: 10 }, children: intl.formatMessage({ id: "label.customerInformation.comm.mailType" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "center", sx: { fontWeight: 600, fontSize: 10, width: 56 }, children: intl.formatMessage({ id: "label.customerInformation.comm.allow" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 600, fontSize: 10, minWidth: 100 }, children: intl.formatMessage({ id: "label.customerInformation.comm.bestTime" }) }),
          DAY_KEYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "center", sx: { fontWeight: 600, fontSize: 10, px: 0.5 }, children: intl.formatMessage({ id: dayHeaderIds[d] }) }, d))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: draft.channels.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 600 }, children: row.displayName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              checked: row.allow,
              onChange: (e) => {
                if (!e.target.checked) {
                  setChannelRow(idx, {
                    allow: false,
                    bestTime: "",
                    days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false }
                  });
                } else {
                  setChannelRow(idx, { allow: true });
                }
              },
              label: "",
              margin: "0"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { verticalAlign: "middle", px: 1, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              type: "time",
              value: row.bestTime || "",
              editable: row.allow,
              disabled: !row.allow,
              onChange: (e) => setChannelRow(idx, { bestTime: e.target.value }),
              width: "100%",
              placeholder: row.allow ? "HH:MM" : "---"
            }
          ) }),
          DAY_KEYS.map((d) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              cc,
              {
                checked: Boolean((_a = row.days) == null ? void 0 : _a[d]),
                disabled: !row.allow,
                onChange: (e) => {
                  if (row.allow) {
                    setChannelDay(idx, d, e.target.checked);
                  }
                },
                label: "",
                margin: "0"
              }
            ) }, d);
          })
        ] }, row.apiCode)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Vg, { onSave: handleSave, onReset: handleReset, disableToast: { save: true, reset: true } })
  ] });
}
function normalizeLinkedCustomersFromApi(rawData) {
  const list = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  return list.map((raw) => ({
    id: String(raw.lnCustomerSeqNo ?? raw.lnAccountSeqNo ?? raw.szLegacyCustomerNo ?? raw.szCustomerSeqNo ?? ""),
    name: raw.szName ?? "",
    role: raw.szCustomerTypeDesc || raw.szCustomerType || "",
    customerNo: raw.szLegacyCustomerNo ?? raw.szCustomerNo ?? "",
    accountNo: raw.szLegacyAccountNo ?? raw.szAccountNo ?? "",
    delinquent: (Number(raw.bdOverdueAmt) || 0) > 0 ? "Y" : "N",
    portfolio: raw.szPortfolioCode ?? "",
    partitionCode: raw.szPartitionCode ?? raw.PARTITION_CODE ?? "",
    customerSeqNo: raw.lnCustomerSeqNo ?? raw.CUST_SEQNO ?? raw.customerSeqNo ?? null,
    accountSeqNo: raw.lnAccountSeqNo ?? raw.ACNT_SEQNO ?? raw.accountSeqNo ?? null,
    caseSeqNo: raw.lnCaseSeqNo ?? raw.CASE_SEQNO ?? raw.caseSeqNo ?? null,
    odAmount: Number(raw.bdOverdueAmt) || 0,
    osAmount: Number(raw.bdOsAmt) || 0,
    details: {}
  }));
}
function CustomerInformationPage() {
  const intl = useIntl();
  const { selectedRow } = useSelector((state) => state.account);
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [selectedCustomerId, setSelectedCustomerId] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    let cancelled = false;
    if (!selectedRow) {
      setRows([]);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    Kr.GET(
      CustomerInformationAPI.fetchLinkedCustomers(screenMenuId)
    ).then((res) => {
      var _a, _b;
      if (cancelled) return;
      if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "Success" && ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.responseJson)) {
        setRows(
          normalizeLinkedCustomersFromApi(
            res.data.responseJson
          )
        );
      } else {
        setRows([]);
      }
    }).catch((err) => {
      console.error("fetchLinkedCustomers error:", err);
      if (!cancelled) {
        setRows([]);
      }
    }).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedRow]);
  const selectedCustomer = reactExports.useMemo(
    () => rows.find((r) => r.id === selectedCustomerId) || null,
    [rows, selectedCustomerId]
  );
  const handleCustomerNameClick = reactExports.useCallback((id) => {
    setSelectedCustomerId(id);
    setViewMode("detail");
  }, []);
  const handleBackToList = reactExports.useCallback(() => {
    setViewMode("list");
    setSelectedCustomerId(null);
  }, []);
  const handleTileSelectCustomer = reactExports.useCallback((id) => {
    setSelectedCustomerId(id);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.customerInformation.title" }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dt,
        {
          className: "drs-page-container",
          sx: {
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            px: { xs: 1.5, sm: 2 },
            pt: 0,
            pb: 0,
            maxWidth: 1320,
            mx: "auto",
            width: "100%"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                pb: 10
              },
              children: viewMode === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LinkedCustomersGrid,
                  {
                    rowData: rows,
                    onCustomerNameClick: handleCustomerNameClick,
                    isLoading: loading
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 2, fontSize: 13 }, children: intl.formatMessage({ id: "label.customerInformation.listHint" }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "small",
                    variant: "text",
                    startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { sx: { fontSize: 18 } }),
                    onClick: handleBackToList,
                    sx: { alignSelf: "flex-start", textTransform: "none", fontSize: 12, minHeight: 28 },
                    children: intl.formatMessage({ id: "label.customerInformation.backToList" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LinkedCustomerTileStrip,
                  {
                    customers: rows,
                    selectedCustomerId,
                    onSelectCustomer: handleTileSelectCustomer
                  }
                ),
                selectedCustomer ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 1, display: "flex", flexDirection: "column", gap: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                      gap: 2,
                      alignItems: "start"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerDetailsSection, { customer: selectedCustomer }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AddressSummarySection, { customer: selectedCustomer }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerGroupSummarySection, { groupAccounts: selectedCustomer.groupAccounts }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CommunicationPreferenceSection,
                          {
                            customerId: selectedCustomer.id,
                            customer: selectedCustomer,
                            initialDraft: selectedCustomer.communicationDraft
                          },
                          selectedCustomer.id
                        )
                      ] })
                    ]
                  }
                ) }) : null
              ] })
            }
          )
        }
      )
    }
  );
}
export {
  CustomerInformationPage as default
};
