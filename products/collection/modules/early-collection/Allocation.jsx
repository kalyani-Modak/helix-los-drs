import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { useToast, HAxiosService } from "@helix/component-library";

import { AllocationAPI } from "./apiEndpoints";
import { logger } from "@helix/component-library";

const Allocation = ({ setLanguage, language }) => {
  const [objAllocations, setObjAllocations] = useState([]);
  const [objLoading, setObjLoading] = useState(true);
  const intl = useIntl();
  const objToast = useToast();

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => {}; // no-op fallback
  }

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await HAxiosService.GET(AllocationAPI.fetchAll);
        const objData = Array.isArray(response.data) ? response.data : [];
        setObjAllocations(objData);
        logger.info("fetchAllocations URL:", AllocationAPI.fetchAll, objData);
      } catch (error) {
        logger.error("Error fetching allocations:", error);
        objToast.error("Failed to load allocations");
      } finally {
        setObjLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const objColumns = [
    {
      field: "customerId",
      headerName: intl.formatMessage({
        id: "customerId",
        defaultMessage: "Customer ID",
      }),
      flex: 1,
    },
    {
      field: "accountNumber",
      headerName: intl.formatMessage({
        id: "accountNumber",
        defaultMessage: "Account Number",
      }),
      flex: 1.5,
      renderCell: (params) => (
        <span
          style={{ color: "#1976d2", cursor: "pointer" }}
          onClick={() => navigate(`/homelayout/allocation/${params.value}`)}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "collectorCode",
      headerName: intl.formatMessage({
        id: "collectorCode",
        defaultMessage: "Collector Code",
      }),
      flex: 1,
    },
    {
      field: "remarks",
      headerName: intl.formatMessage({
        id: "remarks",
        defaultMessage: "Remarks",
      }),
      flex: 2,
    },
    {
      field: "allocation_till",
      headerName: intl.formatMessage({
        id: "allocationTill",
        defaultMessage: "Allocation Till",
      }),
      flex: 1,
    },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ minHeight: "72.5vh" }}>
        <Box display="flex" justifyContent="flex-end" mt="-0.9rem" mb={1.5}>
          <FormControl size="small" variant="outlined">
            <InputLabel color="secondary">
              {intl.formatMessage({
                id: "Language",
                defaultMessage: "Language",
              })}
            </InputLabel>
            <Select
              value={language || "en"}
              onChange={handleLanguageChange}
              label={intl.formatMessage({
                id: "Language",
                defaultMessage: "Language",
              })}
              sx={{
                fontSize: "14px",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "secondary.main",
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "Montserrat" }}
        >
          {intl.formatMessage({
            id: "FollowupDetails",
            defaultMessage: "Followup Details",
          })}
        </Typography>

        <Box sx={{ height: 480, width: "100%" }}>
          <DataGrid
            loading={objLoading}
            rows={objAllocations}
            columns={objColumns}
            getRowId={(objRow) => objRow.accountNumber}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? "odd-row"
                : "even-row"
            }
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 2,
            }}
          />
        </Box>
      </Container>
    </>
  );
};

export default Allocation;
