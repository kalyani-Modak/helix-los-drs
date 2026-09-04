import React, { useState, useEffect } from 'react';
import { HAxiosService, HBox, HButton, HLabel, HTextField, HDropdown, useDrsTheme, HTextarea, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import {Container,Paper} from '@mui/material';
import { logger } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";

import { useIntl } from "react-intl";


function ApiConfiguratorTester() {
  const [topicName, setTopicName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [helperText, setHelperText] = useState('');
  const toast = useToast();
  const [topicError, setTopicError] = useState(false);
  const intl = useIntl();
  const { themeVars, surfaces, text, colors, } = useDrsTheme();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        logger.info('Fetching API filenames from external API');
        const response = await HAxiosService.GET(IntegrationFrameworkAPI.getApiFilenames);
        logger.info('Fetched API filenames successfully', { data: response.data });
        setOptions(response.data.map((item) => ({
          label: item,
          value: item,
        })));
        setLoading(false);
      } catch (err) {
        logger.error('Failed to fetch API filenames', { error: err.message });
        setError('Failed to fetch options');
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleTopicNameChange = (e) => {
    const value = e.target.value;
    logger.info(`User updated topic name: ${value}`);

    const specialCharRegex = /\W/;

    if (specialCharRegex.test(value)) {
      setTopicError(true);
      setHelperText('Topic name must not contain special characters');
      logger.warn(`Topic name contains special characters: ${value}`);
    } else {
      setTopicError(false);
      setHelperText('');
    }
    setTopicName(value);
  };

  const handleSelectChange = async (event) => {
    const selectedFile = event.target.value;
    setSelectedValue(selectedFile);
    logger.info('Fetching file content for selected file', { selectedFile });

    try {
      const response = await HAxiosService.GET(IntegrationFrameworkAPI.getMetaDataContent(selectedFile));
      logger.info(`Fetched file content: ${JSON.stringify(response.data)}`);
      setFileContent(JSON.stringify(response.data.productRequestBody, null, 2));
    } catch (error) {
      logger.error('Error fetching file content', { error: error.message });
      toast.error(intl.formatMessage({id:"error.file.content", defaultMessage: "Failed to load file content"}));
    }
  };

  const handleSubmit = async () => {
    if (!topicName || topicError) {
      toast.error(intl.formatMessage({id:"error.valid.topic", defaultMessage: "Enter a valid Topic Name"}));
      logger.warn(`Invalid topic name submission attempt: ${topicName}`);
      return;
    }
    if (!selectedValue) {
      toast.error(intl.formatMessage({id:"label.select.identifier", defaultMessage:"Select Identifier"}));
      logger.warn('Submission blocked: Identifier not selected');
      return;
    }

    const productRequestBody = JSON.parse(fileContent);
    const requestBody = {
      apiName: selectedValue,
      productRequestBody,
      topicName,
    };

    try {
      logger.info('Submitting request to external API', { requestBody });
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.externalApi, requestBody);
      logger.info(`Request successful: ${JSON.stringify(response.data)}`);
      toast.success(intl.formatMessage({id:"success.request", defaultMessage:"Request successful"}));
    } catch (error) {
      logger.info('Error submitting the form', { error: error.message });
    }
  };

  const calculateRows = () => {
    const lineCount = fileContent ? fileContent.split('\n').length : 0;
    return Math.max(4, lineCount);
  };

  const handleFileContentChange = (event) => {
    setFileContent(event.target.value);
  };

  return (
   <Paper>
      <HBox style={{ display: "flex", flexDirection: "column", padding: "1rem", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
        <HBreadCrumb />
        <TitleBar title="label.configurator.tester" />
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
        label={intl.formatMessage({id:"Enter Topic Name", defaultMessage:"Topic Name"})}
        value={topicName}
        onChange={handleTopicNameChange}
        fullWidth
        editable
        margin="normal"
        variant="outlined"
        error={topicError}
        helperText={helperText}
        size="small"
        InputLabelProps={{
          sx: {
            backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
            transform: 'translate(14px, 2px) scale(1)',
            '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
          }
        }}
      />
      <HBox sx={{ marginTop: "1.7rem", width: "100%" }}>
        <HDropdown
          name="identifier"
          placeholder={intl.formatMessage({
            id: "label.select.identifier",
            defaultMessage: "Select Identifier",
          })}
          options={options}
          value={selectedValue}
          onChange={handleSelectChange}
          disabled={loading}
          width="100%"
        />
      </HBox>

      <HBox sx={{ mt: 3 , backgroundColor:"transparent"}}>
        <HLabel
          value={intl.formatMessage({id:"label.request.body", defaultMessage:"Product Request Body"})}
          colon={false}
          align="left"
          sx={{ mb: 0.5,fontSize: "14px",  color: text.secondary,  }}
        />
        <HTextarea
          id="productRequestBody"
          value={fileContent}
          onChange={handleFileContentChange}
          maxLines={calculateRows()}
          width="100%"
          maxLength={100000}
        />
      </HBox>

      <HBox
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "19px",
          backgroundColor: "transparent"
        }}
      >
        <HButton
          label={intl.formatMessage({id:"Submit", defaultMessage:"Submit"})}
          variant="outlined"
          color="secondary"
          onClick={handleSubmit}
        />
      </HBox>

    </Container>
  </Paper> 
  );
}

export default ApiConfiguratorTester;
