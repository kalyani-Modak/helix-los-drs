import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { HAxiosService, HBox, HButton, HLabel, useDrsTheme, useToast } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";
import DataTable from "./DataTable";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useIntl } from "react-intl";

const RetryData = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [modifiedTopicName, setModifiedTopicName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();
  const intl = useIntl();
  
  const fetchRetryData = async () => {
    const topicName = localStorage.getItem("topicName");
    const modifiedTopicName = `${topicName}_retryTopic`;
    setModifiedTopicName(modifiedTopicName);

    try {
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.retryData(modifiedTopicName),{}, false, { "Content-Type": "multipart/form-data" });
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(intl.formatMessage({
          id: "error.fetch.retry",
          defaultMessage: "An error occurred while fetching retry data."
        }));
    }
  };

  useEffect(() => {
    fetchRetryData();
  }, []);


  const navigateToHomePage = () => {
      navigate(location.state?.from || "/homelayout/file-upload");
  };

  return (
    <Container
       style={{
        border: `3px dashed ${border.control}`,
        borderRadius: "8px",
        marginBottom: "1rem",
        marginTop: "1rem",
        paddingBottom: "2.5rem",
      }}>
      <HBox
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "19px",
          bgcolor: "transparent"
        }}
      >
        <HButton
          onClick={navigateToHomePage}
          startIcon={<ArrowBackIcon />}
          variant="text"
          sx={{
            minWidth: "35px",
            width: "35px",
            height: "35px",
            padding: 0,
            color: text.secondary,
          }}
        />
      </HBox>
      <HLabel
        value={`Retry Data for Topic: ${modifiedTopicName}`}
        colon={false}
        sx={{
          fontSize: "20px",     
          fontWeight: "bold",   
          textAlign: "center",
          display: "block",
          color:surfaces.text
        }}
        align="center"

      />

      <DataTable data={fetchedData} onDelete={fetchRetryData} />
    </Container>
  );
};

export default RetryData;
