// Updated ClientScreen.jsx - Common components applied (HBox, HLabel, HButton, HPaper, HDropdown, etc.)
import { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClientDetailsAPI } from "./apiEndpoints";
import ClientDetails from "./ClientDetails";
import CreateClient from "./CreateClient";
import { HAxiosService, HBox, HButton, HDropdown, HPaper, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";

// ==================== Color Palette ====================
const colors = {
  primary: "#0378A6",
  secondary: "#2FBF71",
  primaryLight: "#79cff1",
  primaryDark: "#025a8c",
  secondaryLight: "#43da87",
  text: { primary: "#1a2b3c", secondary: "#5f6c7b" },
};

const ClientScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const realm = sessionStorage.getItem("SEC_REALM");

  // ── Chip style matching AccessMenu exactly ──
  const clientChipSx = {
    background: "#79cff145",
    border: "1px solid #79cff1",
    fontSize: "11px",
    maxWidth: "100%",
    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
    }
  };

  // ── Derived options list for HDropdown ──
  const clientOptions = clients.map((client) => ({
    label: client.clientId,
    value: client.clientId,
  }));

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const getUrl = ClientDetailsAPI.GET_CLIENTS_BY_REALM(realm);
        const response = await HAxiosService.GET(getUrl);
        if (response.data) {
          setClients(response.data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };

    if (realm) {
      fetchClients();
    }
  }, [realm, toast]);

  const handleClientChange = (event) => {
    const clientId = event?.target?.value ?? event;
    const client = clients.find(c => c.clientId === clientId);
    setSelectedClient(client);
    if (client) {
      sessionStorage.setItem("SELECTED_PRODUCT", client.clientId);
    }
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    sessionStorage.removeItem("SELECTED_PRODUCT");
  };

  const handleCreateClientClick = () => {
    setClientDialogOpen(true);
  };

  const handleClientDialogClose = () => {
    setClientDialogOpen(false);
  };

  const refreshClients = async () => {
    try {
      const getUrl = ClientDetailsAPI.GET_CLIENTS_BY_REALM(realm);
      const response = await HAxiosService.GET(getUrl);
      if (response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error("Error refreshing clients:", error);
      toast.error("Failed to refresh clients");
    }
  };

  const handleClientCreated = async () => {
    await refreshClients();
  };

  // Called after create/update/delete from ClientDetails Settings
  const handleProductChanged = async (result) => {
    // On delete: clear selection first so ClientDetails unmounts and stops fetching
    if (result?.action === "deleted") {
      setSelectedClient(null);
      sessionStorage.removeItem("SELECTED_PRODUCT");
    }
    // Only refresh the top Product dropdown list
    await refreshClients();
  };

  return (
    <HBox sx={{
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      mt: 2
    }}>
      <HBox sx={{ width: "100%", mx: "auto" }}>
        <HPaper
          elevation={0}
          sx={{
            boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Header */}
          <HBox sx={{ flexShrink: 0, height: '9%' }}>
              <HBreadCrumb />
              <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                  <TitleBar
                      title={intl.formatMessage({id: "label.product.title", defaultMessage: "Product Management"})}
                  />
              </HBox>
          </HBox>

          {/* Controls Bar */}
          <HBox sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
            pt: { xs: 1.5, sm: 2 },
            pb: selectedClient ? 1.5 : 3,
          }}>
            <HBox sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 1.2, sm: 1.5 },
              flexWrap: "wrap",
            }}>

              {/* Client Selector using HDropdown */}
              <HBox sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                width: { xs: "100%", sm: 300, md: 350 },
                flexShrink: 0,
              }}>
                <HDropdown
                  value={selectedClient?.clientId || ""}
                  onChange={handleClientChange}
                  options={clientOptions}
                  placeholder={intl.formatMessage({id: "label.placeholder.selectProduct", defaultMessage: "Select Product"})}
                  disabled={loadingClients}
                  width="100%"
                  sx={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary },
                  }}
                />
                
              </HBox>

              {/* Create Product Button */}
              {!selectedClient && (
                <HButton
                  label={intl.formatMessage({id: "label.product.createProduct", defaultMessage: "Create Product"})}
                  variant="contained"
                  onClick={handleCreateClientClick}
                  sx={{
                    fontWeight: 600,
                    fontSize: "12px",
                    borderRadius: "8px",
                    textTransform: "none",
                    py: 0.8,
                    px: 2.5,
                    width: { xs: "100%", sm: "auto" },
                  }}
                />
              )}
            </HBox>
          </HBox>
        </HPaper>

        {/* Client Details Section - Rendered inline when client is selected */}
        {selectedClient && (
          <HBox sx={{
            mt: 2,
          }}>
            <ClientDetails onProductChanged={handleProductChanged} />
          </HBox>
        )}
      </HBox>

      {/* Create Client Dialog */}
      <CreateClient
        open={clientDialogOpen}
        onClose={handleClientDialogClose}
        onClientCreated={handleClientCreated}
      />
    </HBox>
  );
};

export default ClientScreen;