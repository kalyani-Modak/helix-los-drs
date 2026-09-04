import React, { useState, useRef, useEffect } from "react";
import { HAxiosService, HBox, HButton, HLabel, HTextField, HDropdown, useDrsTheme, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";
import { Container,Paper} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logger } from "@helix/component-library";

import { useIntl } from "react-intl";

const ExistingFileUpload = () => {
  const [file, setFile] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const { themeVars, surfaces, text, border, action, colors, isDark } = useDrsTheme();
  const intl = useIntl();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      logger.info(`Selected file: ${fileName}, Type: ${fileType}`);
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "",
      }));
      if (fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls' || fileType === 'json') {
        setFile(selectedFile);
        setErrors({});
      } else {
        setFile(null);
        setErrors({ file: 'File type not acceptable. Please select .csv, .xlsx, ,.json  or .xls files.' });
        logger.error('File type is not acceptable.');

      }
    }
  };
  const handleSelectedValueChange = (event) => {
    setSelectedValue(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedValue: "",
    }));
    logger.info(`Selected value changed: ${event.target.value}`);

  };
  const handleUploadFileType = (event) => {
    setSelectedFileType(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedFileType: "",
    }));
    logger.info(`File type changed: ${event.target.value}`);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    logger.info(`File dropped: ${droppedFile.name}`);
  };

  const handleSelectedFileClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePublish = async () => {
    let validationErrors = {};

    if (!file) validationErrors.file = "Required field";
    if (!topicName) validationErrors.topicName = "Required field";
    if (!selectedValue) validationErrors.selectedValue = "Required field";
    if (!selectedFileType) validationErrors.selectedFileType = "Required field";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      logger.error('Validation errors found, cannot proceed with publishing.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("selectedValue", selectedValue);
      formDataToSend.append("topicName", topicName);
      formDataToSend.append("fileType", selectedFileType);

      logger.info(`Publishing file with topicName: ${topicName}, selectedValue: ${selectedValue}, fileType: ${selectedFileType}`);

      const response = await HAxiosService.POST(IntegrationFrameworkAPI.existingFileUpload, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" });
    
      const result = response.data;

      if (result === "TODO") {
        logger.info('File published successfully.');
        toast.success(intl.formatMessage({
          id: "success.publish",
          defaultMessage: "Messages Publish Successfully........."
        }));
      } else {
        logger.error(`Publishing failed: ${result}`);
        toast.success(intl.formatMessage({
          id: "success.result",
          defaultMessage: result
        }));
      }
    } catch (error) {
      logger.error(`Error publishing file: ${error.message}`);
      if (error.response?.data) {
        toast.error(intl.formatMessage({id:"error.response?.data", defaultMessage: error.response?.data }) );
      } else {
        toast.error(intl.formatMessage({id:"error.unexpected",defaultMessage:"An unexpected error occurred while publishing the file."}) );
      }
    }
  };

  const handleRetry = async () => {
    let validationErrors = {};

    if (!topicName) validationErrors.topicName = "Required field";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      logger.error('Validation errors found, cannot retry.');
      return;
    }
    const modifiedTopicName = `${topicName}_retryTopic`;
    logger.info(`Retrying with modified topic name: ${modifiedTopicName}`);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("topicName", modifiedTopicName);

      HAxiosService.POST(IntegrationFrameworkAPI.addListener, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" }).then((response) => {
        const expectedResponseMessage = `Listener added and data receiving started for topic: ${modifiedTopicName}`;
        logger.info(`Server response: ${response.data}`);
        if (response.data === expectedResponseMessage) {
          localStorage.setItem("topicName", topicName);
          navigate("/homelayout/retrydata", {
            state: {
              from: "/homelayout/existing-file-upload",
            },
          });
        }
      });
    } catch (error) {
      logger.error(`Error fetching retry data: ${error.message}`);
      toast.error(intl.formatMessage({id:"error.fetch.retry", defaultMessage: "An error occurred while fetching retry data."}));
    }
  };


  const handleGetFilesName = async () => {
    logger.info('Fetching file names.');
    try {
      const response = await HAxiosService.GET(IntegrationFrameworkAPI.getGeneratedFileNames);
      setFileNames(response.data);
      logger.info('File names fetched successfully.');
    } catch (error) {
      logger.error(`Error fetching file names: ${error.message}`);
    }
  };

  useEffect(() => {
    logger.info('Component mounted, fetching file names.');
    handleGetFilesName();
  }, []);

  return (
    <Paper>
        <HBox style={{ display: "flex", flexDirection:"column",padding: "1rem",borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }} >
          <HBreadCrumb />
          <TitleBar title="label.existing.file.upload" />
        </HBox>
        
    <Container
      maxWidth="md"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        padding: "20px",
        marginBottom: "1rem",
        paddingBottom: "2.5rem",
      }}
    >
      <HBox
        sx={{
          display: "flex",
          justifyContent: "right",
          bgcolor: "transparent",
        }}
      >
        <HButton
          label={intl.formatMessage({ id: "View Retry Data", defaultMessage: "View Retry Data", })}
          variant="outlined"
          onClick={handleRetry}
        />

      </HBox>
      <HTextField
        label={intl.formatMessage({ id: "Enter Topic Name", defaultMessage: "Enter Topic Name", })}
        value={topicName}
        editable
        onChange={(e) => {
          setTopicName(e.target.value);

          if (errors.topicName && e.target.value.trim()) {
            setErrors({ ...errors, topicName: '' });
          }
        }}
        size="small"
        fullWidth
        margin="normal"
        error={!!errors.topicName}
        helperText={errors.topicName}
        style={{ marginBottom: "1.6rem" }}
        InputLabelProps={{
          sx: {
            backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
            transform: 'translate(14px, 2px) scale(1)',
            '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
          }
        }}
      />
      <HBox sx={{ display: "flex",justifyContent: "space-between", p: "10px 0px", bgcolor: "transparent" }} >
        <HLabel
          value={intl.formatMessage({ id: "Note", defaultMessage: "Note: only plain json save into databse", })}
          color="brown"
          align="left"
          colon={false}
        />

        <HLabel
          value={intl.formatMessage({ id: "FileType", defaultMessage: "Acceptable file types:.csv,.xls, .xlsx, .json, .xml", })}
          color="textSecondary"
          colon={false}
        />
      </HBox>
      <HTextField
        label={intl.formatMessage({ id: "FileSelect", defaultMessage: "Select file or Drag and Drop here", })}
        value={file ? file.name : ""}
        editable={true}
        size="small"
        fullWidth
        onClick={handleSelectedFileClick}
        sx={{ color: surfaces.input }}
        InputLabelProps={{
          sx: {
            backgroundColor: surfaces.input, '&.Mui-focused': { backgroundColor: surfaces.input, },
            transform: 'translate(14px, 2px) scale(1)',
            '&.MuiInputLabel-shrink': { fontSize: "14px", transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: surfaces.input, }
          }
        }}
      />
      <input
        accept=".csv, .xlsx, .xls , .json"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <HBox
        sx={{
          display: "flex",
          justifyContent: "right",
          marginTop: "1rem",
          marginBottom: "1rem",
          bgcolor: "transparent",
        }}
      >
        <HButton
          label={intl.formatMessage({ id: "Select", defaultMessage: "Select File", })}
          variant="outlined"
          component="span"
          onClick={() => fileInputRef.current?.click()}
        />
      </HBox>
      <HDropdown
        id="select-type"
        name="selectedValue"
        width="100%"
        value={selectedValue}
        placeholder={intl.formatMessage({ id: "Select Type", defaultMessage: "Select Type", })}
        error={!!errors.selectedValue}
        options={[
          {
            label: "Save Into Database",
            value: 10,
          },
        ]}
        onChange={handleSelectedValueChange}
        sx={{ mb: "2rem" }}
      />
      {errors.selectedValue && (
        <HLabel
          value={errors.selectedValue}
          colon={false}
          align="left"
          sx={{ color: "red", fontSize: "0.8rem", mt: 0.5, }}
        />

      )}
      <HDropdown
        id="upload-file-type"
        name="selectedFileType"
        width="100%"
        value={selectedFileType}
        placeholder={intl.formatMessage({ id: "Upload File Type", defaultMessage: "Upload File Type", })}
        error={!!errors.selectedFileType}
        options={fileNames.map((fileName) => ({
          label: fileName.replace(".json", ""),
          value: fileName,
        }))}
        onChange={handleUploadFileType}
      />

      {errors.selectedFileType && (
        <HLabel
          value={errors.selectedFileType}
          sx={{ color: "red", fontSize: "0.8rem", mt: 0.5, }}
          colon={false}
          align="left"
        />
      )}

      {file && (
        <HBox
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "19px",
            bgcolor: "transparent",
          }}
        >
          <HButton
            label={intl.formatMessage({ id: "Publish", defaultMessage: "Publish", })}
            variant="outlined"
            color="secondary"
            onClick={handlePublish}
          />
        </HBox>
      )}
    </Container>
  </Paper>
  );
};

export default ExistingFileUpload;
