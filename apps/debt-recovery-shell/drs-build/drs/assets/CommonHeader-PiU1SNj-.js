import { ed as useIntl, el as useSelector, dB as jsxRuntimeExports, v as Box, cf as Typography, dL as qg } from "./index-BhdgJqva.js";
const manImage = "/drs/assets/man-g32ar9U7.png";
const bikeImage = "/drs/assets/bike-aGIr2lYG.png";
const homeImage = "/drs/assets/home-60-fr5Un.png";
const personalImage = "/drs/assets/personal-CiVA7Q1i.png";
const womanImage = "/drs/assets/woman-DANF-XeF.png";
const collector = "/drs/assets/debt-DEnrT738.png";
const collectorGroup = "/drs/assets/collector-group-W-f-H5sL.png";
const flowDiagram = "/drs/assets/flow-diagram--MW8Stsu.png";
const Allocation = "/drs/assets/allocation-B9ERrfGw.png";
const loanamount = "/drs/assets/outstanding-C0x147gj.png";
const overdueamount = "/drs/assets/overdue-9nKKLsEx.png";
const calendar = "/drs/assets/calendar-i_BSWEWF.png";
const CommonHeader = () => {
  const intl = useIntl();
  const { headerData } = useSelector((state) => state.account);
  const enhancedHeaderData = {
    szWfStateCode: "Tele"
  };
  const locale = navigator.language;
  if (!headerData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Box,
      {
        className: "common-grid-coll",
        sx: { mt: 1 },
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          columnGap: "1rem",
          rowGap: "0.4rem",
          alignItems: "stretch"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#777" }, children: "Loading Header Data..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#777" }, children: "Loading Header Data..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#777" }, children: "Loading Header Data..." }) })
        ]
      }
    );
  }
  const renderGenderImage = () => {
    var _a;
    switch ((_a = headerData.szGender) == null ? void 0 : _a.toLowerCase()) {
      case "m":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: manImage,
            alt: "Male",
            style: {
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        );
      case "f":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: womanImage,
            alt: "Female",
            style: {
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        );
    }
  };
  const renderLoanTypeImage = () => {
    const loanType = headerData.szPortfolioCode;
    switch (loanType) {
      case "AL":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: bikeImage,
            alt: "AL",
            style: {
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        );
      case "home loan":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: homeImage,
            alt: "Home Loan",
            style: {
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        );
      case "PL":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: personalImage,
            alt: "Personal Loan",
            style: {
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Box,
    {
      className: "common-grid-coll",
      sx: { mt: 1 },
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        columnGap: "1rem",
        rowGap: "0.4rem",
        alignItems: "stretch"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              p: 1.2,
              backgroundColor: "#d1e0e8",
              borderRadius: "8px",
              minHeight: "70px",
              display: "flex",
              flexDirection: "column",
              gap: 0.8,
              "&:hover": {
                backgroundColor: "#b8d4e0",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              },
              transition: "all 0.3s ease",
              cursor: "pointer",
              userSelect: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 500, color: "#1a365d" }, children: intl.formatMessage({ id: "label.Overview.sections.customer_details", defaultMessage: "Customer Details" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flexShrink: 0 }, children: renderGenderImage() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      variant: "subtitle2",
                      sx: {
                        fontWeight: 600,
                        color: "#1a365d",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: headerData.szName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#2d3748", display: "block" }, children: headerData.szLegacyCustomerNo })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              p: 1.2,
              backgroundColor: "#e8d1e0",
              borderRadius: "8px",
              minHeight: "70px",
              display: "flex",
              flexDirection: "column",
              gap: 0.8,
              "&:hover": {
                backgroundColor: "#e0b8d4",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              },
              transition: "all 0.3s ease",
              cursor: "pointer",
              userSelect: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 500, color: "#1a365d" }, children: intl.formatMessage({ id: "label.Overview.headers.account_details", defaultMessage: "Account Details" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flexShrink: 0 }, children: renderLoanTypeImage() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      variant: "subtitle2",
                      sx: {
                        fontWeight: 600,
                        color: "#1a365d",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: headerData.szLegacyAccountNo
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      variant: "caption",
                      sx: {
                        color: "#2d3748",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: intl.formatMessage({ id: `label.Overview.header.${headerData.szPortfolioCode}`, defaultMessage: headerData.szPortfolioCode })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0, ml: -6 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: loanamount, alt: "Outstanding-balance", style: { width: 16, height: 16 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", fontWeight: 500 }, children: [
                      intl.formatMessage({ id: "label.Overview.header.OS", defaultMessage: "OS:" }),
                      " :"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", fontWeight: 600 }, children: [
                      qg(locale),
                      headerData.bdOsAmt
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: overdueamount, alt: "loan amount", style: { width: 16, height: 16 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", fontWeight: 500 }, children: [
                      intl.formatMessage({ id: "label.Overview.header.OD", defaultMessage: "OD:" }),
                      ":"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", fontWeight: 600 }, children: [
                      qg(locale),
                      headerData.bdOverdueAmt
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Box,
                  {
                    sx: {
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#e53e3e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0
                    },
                    children: headerData.szBucketCode
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              p: 1.2,
              backgroundColor: "#d1e8d1",
              borderRadius: "8px",
              minHeight: "70px",
              display: "flex",
              flexDirection: "column",
              gap: 0.4,
              "&:hover": {
                backgroundColor: "#b8e0b8",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              },
              transition: "all 0.3s ease",
              cursor: "pointer",
              userSelect: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 500, color: "#1a365d", display: "block", mb: 0.8 }, children: intl.formatMessage({ id: "label.overview.header.allocation_details", defaultMessage: "Allocation Details" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: Allocation, alt: "Allocation", style: { width: 45, height: 45, borderRadius: "50%", objectFit: "cover" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.4, ml: 4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: calendar, alt: "OD Days", style: { width: 18, height: 18, marginRight: 4 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [
                      headerData.inOdDays,
                      "d"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.4, ml: 4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: collectorGroup, alt: "Collector Group", style: { width: 18, height: 18, marginRight: 4 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: headerData.szCollectorGrpCode })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0, mr: 2 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: collector, alt: "Collector", style: { width: 18, height: 18, marginRight: 4 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: headerData.szCollectorCode })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flowDiagram, alt: "Workflow Status", style: { width: 18, height: 18, marginRight: 4 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "#2d3748", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: enhancedHeaderData.szWfStateCode })
                  ] })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
};
export {
  CommonHeader as default
};
