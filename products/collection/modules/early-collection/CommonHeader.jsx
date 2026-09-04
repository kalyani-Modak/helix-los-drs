import { Box, Typography} from "@mui/material";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import manImage from "@assets/common/man.png";
import bikeImage from "@assets/common/bike.png";
import homeImage from "@assets/common/home.png";
import personalImage from "@assets/common/personal.png";
import womanImage from "@assets/common/woman.png";
import collector from "@assets/common/debt.png";
import collectorGroup from "@assets/common/collector-group.png";
import flowDiagram from "@assets/common/flow-diagram.png";
import Allocation from "@assets/common/allocation.png";
import loanamount from "@assets/common/outstanding.png";
import overdueamount from "@assets/common/overdue.png";
import calendar from "@assets/common/calendar.png";
import { getCurrencyPrefixByLocale } from "@helix/component-library";

const CommonHeader = () => {
  const intl = useIntl();

  const { headerData } = useSelector((state) => state.account);
   const enhancedHeaderData = {
    szWfStateCode: "Tele",
  };
  const locale = navigator.language;

  if (!headerData) {
    return (
      <Box
        className="common-grid-coll"
        sx={{ mt: 1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          columnGap: "1rem",
          rowGap: "0.4rem",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="caption" sx={{ color: "#777" }}>
            Loading Header Data...
          </Typography>
        </Box>
        <Box sx={{ p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="caption" sx={{ color: "#777" }}>
            Loading Header Data...
          </Typography>
        </Box>
        <Box sx={{ p: 1.2, backgroundColor: "#f0f0f0", borderRadius: "8px", minHeight: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="caption" sx={{ color: "#777" }}>
            Loading Header Data...
          </Typography>
        </Box>
      </Box>
    );
  }

 

  const renderGenderImage = () => {
    switch (headerData.szGender?.toLowerCase()) {
      case "m":
        return (
          <img
            src={manImage}
            alt="Male"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
      case "f":
        return (
          <img
            src={womanImage}
            alt="Female"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
    }
  };

   const renderLoanTypeImage = () => {
    const loanType = headerData.szPortfolioCode;

    switch (loanType) {
      case "AL":
        return (
          <img
            src={bikeImage}
            alt="AL"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
      case "home loan":
        return (
          <img
            src={homeImage}
            alt="Home Loan"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
      case "PL":
        return (
          <img
            src={personalImage}
            alt="Personal Loan"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
    }
    };

  return (
    <Box
      className="common-grid-coll"
      sx={{ mt: 1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        columnGap: "1rem",
        rowGap: "0.4rem",
        alignItems: "stretch",
      }}
    >
      {/* Column 1 - Customer Details */}
      <Box
        sx={{
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
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
          transition: "all 0.3s ease",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Title */}
        <Typography variant="caption" sx={{ fontWeight: 500, color: "#1a365d" }}>
          {intl.formatMessage({ id: 'label.Overview.sections.customer_details', defaultMessage: 'Customer Details' })}
        </Typography>

        {/* Content Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Gender Image */}
          <Box sx={{ flexShrink: 0 }}>{renderGenderImage()}</Box>

          {/* Customer Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "#1a365d",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {headerData.szName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#2d3748", display: "block" }}>
              {headerData.szLegacyCustomerNo}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Column 2 - Account Details */}
      <Box
        sx={{
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
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
          transition: "all 0.3s ease",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Title */}
        <Typography variant="caption" sx={{ fontWeight: 500, color: "#1a365d" }}>
          {intl.formatMessage({ id: 'label.Overview.headers.account_details', defaultMessage: 'Account Details' })}
        </Typography>

        {/* Content Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Loan Image */}
          <Box sx={{ flexShrink: 0 }}>{renderLoanTypeImage()}</Box>

          {/* Account Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "#1a365d",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {headerData.szLegacyAccountNo}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#2d3748",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {intl.formatMessage({ id: `label.Overview.header.${headerData.szPortfolioCode}`, defaultMessage: headerData.szPortfolioCode })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0, ml: -6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
              <img src={loanamount} alt="Outstanding-balance" style={{ width: 16, height: 16 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", fontWeight: 500 }}>
                {intl.formatMessage({ id: 'label.Overview.header.OS', defaultMessage: 'OS:' })} :
              </Typography>
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", fontWeight: 600 }}>
                {getCurrencyPrefixByLocale(locale)}
                {headerData.bdOsAmt}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
              <img src={overdueamount} alt="loan amount" style={{ width: 16, height: 16 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", fontWeight: 500 }}>
                {intl.formatMessage({ id: 'label.Overview.header.OD', defaultMessage: 'OD:' })}:
              </Typography>
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", fontWeight: 600 }}>
                {getCurrencyPrefixByLocale(locale)}
                {headerData.bdOverdueAmt}
              </Typography>
            </Box>
          </Box>

          {/* Bucket */}
          <Box
            sx={{
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
              flexShrink: 0,
            }}
          >
            {headerData.szBucketCode}
          </Box>
        </Box>
      </Box>

      {/* Column 3 - Allocation Details */}
      <Box
        sx={{
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
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
          transition: "all 0.3s ease",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Title */}
        <Typography variant="caption" sx={{ fontWeight: 500, color: "#1a365d", display: "block", mb: 0.8 }}>
          {intl.formatMessage({ id: 'label.overview.header.allocation_details', defaultMessage: 'Allocation Details' })}
        </Typography>

        {/* Content Row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Allocation Image */}
          <Box sx={{ flexShrink: 0 }}>
            <img src={Allocation} alt="Allocation" style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }} />
          </Box>

          {/* Middle: OD Days & Collector Group */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, ml: 4 }}>
              <img src={calendar} alt="OD Days" style={{ width: 18, height: 18, marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {headerData.inOdDays}d
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, ml: 4 }}>
              <img src={collectorGroup} alt="Collector Group" style={{ width: 18, height: 18, marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {headerData.szCollectorGrpCode}
              </Typography>
            </Box>
          </Box>

          {/* End: Collector & Workflow Status */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0, mr: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <img src={collector} alt="Collector" style={{ width: 18, height: 18, marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {headerData.szCollectorCode}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <img src={flowDiagram} alt="Workflow Status" style={{ width: 18, height: 18, marginRight: 4 }} />
              <Typography variant="caption" sx={{ color: "#2d3748", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {enhancedHeaderData.szWfStateCode}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommonHeader;
