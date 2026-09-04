import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  AccountBalanceOutlined as AccountBalanceIcon,
  ApartmentOutlined as ApartmentIcon,
  AssessmentOutlined as AssessmentIcon,
  BusinessOutlined as BusinessIcon,
  CorporateFareOutlined as CorporateFareIcon,
  GroupsOutlined as GroupsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PublicOutlined as PublicIcon,
  SecurityOutlined as SecurityIcon,
  ShieldOutlined as ShieldIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { HAxiosService } from "@helix/component-library";
import { UserManagementAPI } from "../../../products/user-management/modules/idmUI/apiEndpoints";

const palette = {
  navy: "#0b1726",
  blue: "#2563eb",
  blueDeep: "#173f86",
  cyan: "#06b6d4",
  mint: "#00d6b2",
  white: "#f8fafc",
  border: "rgba(148, 163, 184, 0.18)",
};

const normalizeOrganizations = (rawData) => {
  const list = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.realms)
      ? rawData.realms
      : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

  return list
    .filter((item) => {
      const value = typeof item === "string" ? item : item?.name || item?.realm || item?.id || "";
      return String(value).toLowerCase() !== "master";
    })
    .map((item) => {
      const rawValue = typeof item === "string" ? item : item?.name || item?.realm || item?.id || "";
      const code = String(typeof item === "string" ? item : item?.code || item?.realm || item?.name || item?.id || "")
        .trim()
        .toUpperCase();
      const value = code || rawValue;
      const desc = typeof item === "string"
        ? ""
        : item?.desc || item?.description || item?.realmDesc || item?.label || "";
      const displayName = desc ? `${value} - ${desc}` : (typeof item === "string" ? item : item?.displayName || item?.fullName || item?.label || value);

      return {
        id: value,
        name: value,
        code: value,
        desc,
        displayName,
        fullName: displayName,
        icon: <AccountBalanceIcon fontSize="small" />,
      };
    });
};

const featureRows = [
  {
    label: "Real-time Analytics Dashboard",
    icon: <AssessmentIcon fontSize="small" />,
  },
  {
    label: "Multi-tenant Organization Support",
    icon: <GroupsIcon fontSize="small" />,
  },
  {
    label: "Enterprise Security & Compliance",
    icon: <SecurityIcon fontSize="small" />,
  },
  {
    label: "Global Multi-currency Operations",
    icon: <PublicIcon fontSize="small" />,
  },
];

const stats = [
  { value: "150+", label: "INSTITUTIONS" },
  { value: "$2.4B", label: "RECOVERED" },
  { value: "99.9%", label: "UPTIME" },
];

const RealmSelector = () => {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRealmDetails = async () => {
      try {
        const response = await HAxiosService.GET(UserManagementAPI.realms());

        if (!response?.status || response.status < 200 || response.status >= 300) {
          console.warn("Realm endpoint request failed", response?.status);
          return;
        }
        const data = response?.data;
        const normalized = normalizeOrganizations(data);
        setOrganizations(normalized);
        sessionStorage.setItem("SEC_REALM_DETAILS", JSON.stringify(data?.data || data));
      } catch (error) {
        console.warn("Realm endpoint call failed", error);
      }
    };

    fetchRealmDetails();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedOrg) {
      return;
    }

    try {
      const response = await HAxiosService.GET(UserManagementAPI.realms());

      if (response?.status && response.status >= 200 && response.status < 300) {
        const data = response?.data;
        const normalized = normalizeOrganizations(data);
        setOrganizations(normalized);
        sessionStorage.setItem("SEC_REALM_DETAILS", JSON.stringify(data?.data || data));
      }
    } catch (error) {
      console.warn("Realm endpoint call failed on submit", error);
    }

    const selectedRealmCode = String(selectedOrg || "").trim().toUpperCase();
    const selectedRealmDetails = selectedOrgDetails || organizations.find((org) => (org.code || org.id) === selectedRealmCode) || null;

    sessionStorage.setItem("SEC_REALM", selectedRealmCode);
    sessionStorage.setItem(
      "SEC_REALM_DETAILS",
      JSON.stringify(
        selectedRealmDetails
          ? {
              code: selectedRealmDetails.code || selectedRealmDetails.id || selectedRealmCode,
              desc: selectedRealmDetails.desc || selectedRealmDetails.description || selectedRealmDetails.displayName || "",
            }
          : { code: selectedRealmCode, desc: "" }
      )
    );
    navigate(`/${selectedRealmCode}`, {
      replace: true,
      state: {
        realmCode: selectedRealmCode,
        realmDesc: selectedRealmDetails?.desc || selectedRealmDetails?.description || selectedRealmDetails?.displayName || "",
      },
    });
  };

  const selectedOrgDetails = organizations.find((org) => (org.code || org.id) === selectedOrg);

  return (
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 448,
            mt: { md: -0.5 },
            p: { xs: 3, sm: 4 },
            mr: { md: 14 },
            transform: { md: "translateX(74px)" },
            borderRadius: "8px",
            color: palette.white,
            backgroundColor: "rgba(15, 25, 36, 0.96)",
            border: `1px solid ${palette.border}`,
            boxShadow: "0 28px 70px rgba(0, 0, 0, 0.28)",
          }}
        >
          <>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: { xs: 26, sm: 28 },
                  lineHeight: 1.15,
                  fontWeight: 800,
                  letterSpacing: 0,
                }}
              >
                Select Organization
              </Typography>
              <Typography sx={{ mt: 0.8, color: "#a5afbd", fontSize: 14.5 }}>
                Choose your organization to continue
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={selectedOrg}
                    onChange={(event) => setSelectedOrg(event.target.value)}
                    IconComponent={KeyboardArrowDownIcon}
                    renderValue={(value) => {
                      if (!value) {
                        return (
                          <Typography sx={{ color: "#697386", fontSize: 14 }}>
                            Select an organization...
                          </Typography>
                        );
                      }

                      return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "8px",
                              display: "grid",
                              placeItems: "center",
                              color: palette.cyan,
                              backgroundColor: alpha(palette.cyan, 0.12),
                            }}
                          >
                            {selectedOrgDetails?.icon}
                          </Box>
                          <Typography sx={{ color: palette.white, fontWeight: 700 }}>
                            {selectedOrgDetails?.displayName || selectedOrgDetails?.name}
                          </Typography>
                        </Box>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 1,
                          backgroundColor: "#101b27",
                          color: palette.white,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.32)",
                        },
                      },
                    }}
                    sx={{
                      height: 52,
                      borderRadius: "8px",
                      color: palette.white,
                      backgroundColor: "#0c121a",
                      fontSize: 14,
                      ".MuiSelect-icon": {
                        color: "#667386",
                        right: 14,
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f8fafc",
                        borderWidth: 1.5,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffffff",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: palette.cyan,
                        borderWidth: 1.5,
                      },
                    }}
                  >
                    {organizations.map((org) => (
                      <MenuItem
                        key={org.id}
                        value={org.code || org.id}
                        sx={{
                          py: 1.25,
                          gap: 1.5,
                          color: palette.white,
                          "&.Mui-selected": {
                            backgroundColor: alpha(palette.blue, 0.18),
                          },
                          "&.Mui-selected:hover, &:hover": {
                            backgroundColor: alpha(palette.blue, 0.24),
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            display: "grid",
                            placeItems: "center",
                            color: palette.cyan,
                            backgroundColor: alpha(palette.cyan, 0.12),
                          }}
                        >
                          {org.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            {org.displayName || org.name}
                          </Typography>
                          <Typography sx={{ color: "#8995a5", fontSize: 12 }}>
                            {org.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!selectedOrg}
                  sx={{
                    mt: 3,
                    height: 48,
                    borderRadius: "8px",
                    backgroundColor: selectedOrg ? palette.blue : palette.blueDeep,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: selectedOrg ? "#1d4ed8" : palette.blueDeep,
                      boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: palette.blueDeep,
                      color: "rgba(255, 255, 255, 0.34)",
                    },
                  }}
                >
                  Continue to Login
                </Button>
              </Box>

              <Divider sx={{ my: 4, borderColor: "rgba(148, 163, 184, 0.12)" }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: "rgba(148, 163, 184, 0.28)",
                }}
              >
                <ShieldIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: 12 }}>
                  Secured by Ebix - Enterprise Recovery Platform
                </Typography>
              </Box>
          </>
        </Card>
  );
};

export default RealmSelector;
