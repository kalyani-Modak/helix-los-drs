import React, { useState, useEffect } from 'react';
import { HAxiosService, HBox, HButton, HLabel, HDropdown, HTextField, useDrsTheme, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { Container, Grid, IconButton,Paper } from '@mui/material';
import { IntegrationFrameworkAPI } from "./apiEndpoints";
import { logger } from "@helix/component-library";

import { useIntl } from "react-intl";


function ExistingDbConfigurator() {
  const [topicName, setTopicName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { surfaces, text, colors } = useDrsTheme();
  const intl = useIntl();
  const [errors, setErrors] = useState({topicName: "", fileName: "",});

  useEffect(() => {
    const fetchOptions = async () => {
      logger.info(`Fetching options from ${IntegrationFrameworkAPI.getDbFilenames}`);
      try {
        const response = await HAxiosService.GET(IntegrationFrameworkAPI.getDbFilenames);
        const dropdownOptions = (response.data || []).map((item) => ({
          label: item,
          value: item,
        }));

        setOptions(dropdownOptions);
        setLoading(false);
        logger.info('Options fetched successfully', { data: response.data });
      } catch (err) {
        setError('Failed to fetch options');
        setLoading(false);
        logger.error('Error fetching options', { error: err.message });
      }
    };

    fetchOptions();
  }, []);


  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    logger.info('Selected value changed', { selectedValue: value });

    if (errors.fileName && event.target.value) {
      setErrors((prev) => ({
        ...prev,
        fileName: "",
      }));
    }
  };

  const handleSubmit = async () => {
    logger.info('Submitting request', { url: IntegrationFrameworkAPI.generateQueries, params: { fileName: selectedValue, topicName } });
    try {
       const newErrors = {};

      if (!topicName.trim()) {
        newErrors.topicName = "Topic Name is required";
      }

      if (!selectedValue) {
        newErrors.fileName = "Please select an identifier";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const response = await HAxiosService.GET(IntegrationFrameworkAPI.generateQueries(selectedValue, topicName));
      logger.info('Request successful', { response: response.data });
      if (response.status == 200) {
        toast.success(intl.formatMessage({ id: "success.request", defaultMessage: "Request successful" }));
      }
    } catch (error) {
      logger.error('Request failed', { error });
      toast.error('Request failed. Please try again.');
    }
  };

  return (
    <Paper>
      <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="label.ExistingDbConfigurator" />
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
          onChange={(e) => {
            setTopicName(e.target.value);

            if (errors.topicName && e.target.value.trim()) {
              setErrors((prev) => ({
                ...prev,
                topicName: "",
              }));
            }
          }}
          fullWidth
          margin="normal"
          sx={{ color: surfaces.input, mb:"1.5rem" }}
          error={!!errors.topicName}
          helperText={errors.topicName}
          InputLabelProps={{
            sx: {
              backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
              transform: 'translate(14px, 2px) scale(1)',
              '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
            }
          }}
          size="small"
        />

        <Grid sx={{ mt: 2 }} size={12}>
          <HDropdown
            id="fileName"
            name="fileName"
            options={options}
            value={selectedValue}
            onChange={handleSelectChange}
            placeholder={intl.formatMessage({ id: "label.select.identifier", defaultMessage: "Select Identifier" })}
            width="100%"
            disabled={loading}
            error={!!errors.fileName}
          />
          {errors.fileName && (
            <HLabel
              value={errors.fileName}
              colon={false}
              align="left"
              color="error.main"
              sx={{
                mt: 0.5,
                backgroundColor: surfaces.panel,
                fontSize: "0.75rem",
              }}
            />
          )}
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

        {/* <HBox
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "19px",
          }}
        >
          <HButton
          label="download"
            sx={{
              backgroundColor: "#D21B8F",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#D21B8F",
              },
              height: 30,
              width: 200,
            }}
            variant="outlined"
            color="secondary"
            onClick={downloadLogs}
          />
           
        </HBox> */}

      </Container>

    </Paper>
  );
}
export default ExistingDbConfigurator;
