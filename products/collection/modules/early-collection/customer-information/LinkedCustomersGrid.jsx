import React, { useMemo } from "react";
import { Typography, Chip, useTheme } from "@mui/material";
import { HBox, HPaper, HAgGrid } from "@helix/component-library";
import People from "@mui/icons-material/People";
import { useIntl } from "react-intl";


/**
 * LinkedCustomersGrid Component with CommonAgGrid
 * Refined styling to match Lovable design
 * - Removed gap between header and grid
 * - Professional spacing and colors
 * - Better visual hierarchy
 * - Improved badge styling
 */

function roleChipColor(role) {
  // Refined colors matching Lovable design
  if (role === "Borrower") return { variant: "filled", color: "primary" };
  if (role === "Co-Borrower") return { variant: "filled", color: "secondary" };
  return { variant: "outlined", color: "default" };
}

export default function LinkedCustomersGrid({ rowData, onCustomerNameClick, isLoading }) {
  const intl = useIntl();
  const theme = useTheme();

  const onClickMapping = useMemo(
    () => ({
      name: (params) => {
        const id = params?.data?.id;
        if (id) onCustomerNameClick(id);
      },
    }),
    [onCustomerNameClick],
  );

  const columnDefs = useMemo(() => {
    const fontFamily = theme.typography.fontFamily;
    
    // Refined header styling - more professional
    const compactHeader = {
      fontSize: "10px",
      fontWeight: 700,  // Bold
      fontFamily,
      letterSpacing: "0.02em",
      textTransform: "uppercase",  // Make headers uppercase
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)",
      padding: "8px 12px",
      lineHeight: "1.5",
    };
    
    const baseCell = {
      fontSize: "11px",
      fontFamily,
      lineHeight: 1.5,  // Better line height
      whiteSpace: "normal",
      padding: "10px 12px",  // Better padding
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
          cursor: "pointer",
        },
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
          alignItems: "center",
        },
        cellRenderer: (params) => {
          const role = params.value || "";
          const chip = roleChipColor(role);
          return (
            <Chip
              label={role}
              size="small"
              variant={chip.variant}
              color={chip.color === "default" ? "default" : chip.color}
              sx={{ 
                height: 24, 
                fontSize: "9px", 
                fontWeight: 600,
                // More refined chip styling
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
              }}
            />
          );
        },
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
          color: theme.palette.text.secondary,
        },
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
          cursor: "pointer",
        },
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
          justifyContent: "center",
        },
        cellRenderer: (params) => {
          const v = params.value;
          const isY = v === "Y";
          return (
            <Chip
              label={v}
              size="small"
              color={isY ? "error" : "default"}
              variant={isY ? "filled" : "outlined"}
              sx={{ 
                height: 24, 
                fontSize: "9px", 
                fontWeight: 600,
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
              }}
            />
          );
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.grid.portfolio" }),
        field: "portfolio",
        flex: 0.9,
        minWidth: 110,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: { ...baseCell, color: theme.palette.text.primary },
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
          color: theme.palette.error.main,
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`,
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
          color: theme.palette.text.primary,
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`,
      },
    ];
  }, [intl, theme]);

  return (
    <HPaper 
      variant="outlined" 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        borderColor: "divider", 
        overflow: "hidden",
        // Professional box shadow for depth
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        margin: 0,
      }}
    >
      {/* Header - Refined styling */}
      <HBox 
        sx={{ 
          px: 2, 
          py: 1.5,  // Better padding
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.02)",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          margin: 0,
        }}
      >
        <People sx={{ fontSize: 20, color: "primary.main", flexShrink: 0 }} />
        <Typography
          variant="subtitle2"
          sx={{ 
            fontSize: 13,  // Slightly larger
            fontWeight: 600, 
            color: "text.primary",
            margin: 0,  // Remove default margin
          }}
        >
          {intl.formatMessage({ id: "label.customerInformation.linkedCustomers" })}
        </Typography>
      </HBox>

      {/* Grid - No spacing before */}
      <HBox sx={{ px: 0, pb: 0, pt: 0, margin: 0 }}>  {/* Removed py: 1.25, changed to pt: 0 */}
        <HAgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          onClickMapping={onClickMapping}
          gridClassName="drs-list-grid drs-accounts-table-chrome"
          gridStyle={{ 
            width: "100%", 
            height: "min(36vh, 320px)", 
            minHeight: 200,
            // Add border-top for separation if needed
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
          pagination={false}
          sort={false}
          allowAdd={false}
          allowDelete={false}
          allowUpdate={false}
          hideInternalSaveButton
          isLoading={isLoading}
          showTitle={false}
        />
      </HBox>
    </HPaper>
  );
}
