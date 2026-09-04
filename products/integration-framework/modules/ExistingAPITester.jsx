import React, { useState, useEffect } from "react";
import { HAxiosService, HBox, HButton, HLabel, HDropdown, HTextField, useDrsTheme, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import {Container,Grid,Paper} from "@mui/material";
import { logger } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";

import { useIntl } from "react-intl";


function ExistingAPITester() {
  const [topicName, setTopicName] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { surfaces, text, colors } = useDrsTheme();
  const intl = useIntl();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await HAxiosService.GET(IntegrationFrameworkAPI.getApiFilenames);
        const dropdownOptions = (response.data || []).map((item) => ({
          label: item,
          value: item,
        }));
        setOptions(dropdownOptions);
        setLoading(false);
        logger.info(`Fetched options: ${Array.isArray(response.data) ? response.data.join(', ') : response.data}`);
      } catch (err) {
        setError("Failed to fetch options");
        logger.error(`Error fetching options: ${err?.message || err}`);
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleTopicNameChange = (event) => {
    const newValue = event.target.value;
    setTopicName(newValue);
    logger.info(`Topic name changed to: ${newValue}`);
  };


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };


  const handleSubmit = async () => {
    try {
      logger.info(`Submitting with topicName: ${topicName} and selectedValue: ${selectedValue}`);
      const response = await HAxiosService.POST(
        IntegrationFrameworkAPI.existingApiProcess,
        {
          metadataFileName: selectedValue,
          topicName: topicName,
        }
      );
      toast.success(intl.formatMessage({ id: "success.request", defaultMessage: "Request successful" }));
      console.log(response.data);
      logger.info(`Request successful. Response data: ${JSON.stringify(response.data)}`);
    } catch (error) {
      logger.error(`Error submitting the form: ${error.message}`);
    }
  };

  return (
<Paper>
  <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="label.existing.api.tester" />
      </HBox>
    <Container
      maxWidth="md"
      style={{
        padding: "20px",
        marginBottom: "1rem",
        paddingBottom: "1.5rem",
      }}
    >
      <HTextField
        label={intl.formatMessage({ id: "Enter Topic Name", defaultMessage: "Enter Topic Name", })}
        value={topicName}
        editable
        onChange={handleTopicNameChange}
        fullWidth
        margin="normal"
        variant="outlined"
        size="small"
        InputLabelProps={{
          sx: {
            backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
            transform: 'translate(14px, 2px) scale(1)',
            '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
          }
        }}
      />
      <Grid sx={{ mt: 4 }} size={12}>
        <HDropdown
          id="identifier"
          name="identifier"
          width="100%"
          options={options}
          value={selectedValue}
          disabled={loading}
          error={!!error}
          placeholder={intl.formatMessage({id:"label.select.identifier",defaultMessage:"Select Identifier"})}
          onChange={(e) => setSelectedValue(e.target.value)}
        />
      </Grid>

      <HBox
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "19px",
          backgroundColor: "transparent"
        }}
      >
        <HButton
          label={intl.formatMessage({ id: "Submit", defaultMessage: "Submit" })}
          variant="outlined"
          color="secondary"
          onClick={handleSubmit}
        />

      </HBox>
    </Container>
    </Paper>
  );
}

export default ExistingAPITester;
