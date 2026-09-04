import { logger } from "@helix/component-library";
import { HAxiosService } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";

export function createNewFileUploadHandlers(deps) {
  const {
    postFileForm,
    setFile,
    setFileType,
    setErrors,
    setOpenDialog,
    setMetadata,
    fileNames,
    file,
    toast,
    setOverrideMetadata,
    setCsvColumns,
    setColumnsFetched,
    errorShown,
    successShown,
    setErrorShown,
    setSuccessShown,
    validateDbCredentials,
    validateSelectedValue,
  } = deps;

  const handleFileChange = (event) => {
    logger.info("handleFileChange triggered", { event });
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileName = selectedFile.name;
      const ext = fileName.split(".").pop().toLowerCase();

      if (["csv", "xlsx", "xls", "xml", "json"].includes(ext)) {
        logger.info("Valid file type selected", { fileName, ext });
        setFileType(ext);
        setFile(selectedFile);
        setErrors({});
      } else {
        logger.warn("Invalid file type selected", { fileName, ext });
        setFileType("");
        setFile(null);
        setErrors({
          file: "File type not acceptable. Please select .csv, .xlsx,  .xls  , .xml or .json files.",
        });
      }
    } else {
      logger.info("No file selected");
      setFileType("");
      setErrors({});
      setFile(null);
    }
  };

  const checkHeadersMatch = async (fileArg) => {
    logger.info("checkHeadersMatch triggered");
    try {
      const response = await postFileForm(IntegrationFrameworkAPI.getStatusHeaderMatch, fileArg || file);
      logger.info("Headers match status fetched", { status: response.data });
      return response.data;
    } catch (error) {
      logger.error("Error checking header match", { error });
      toast.error("Error checking header match", {
        position: 'top-right',
        autoClose: 1000,
      });
      return false;
    }
  };

  const handleGetMetadata = async (fileArg) => {
    logger.info("handleGetMetadata triggered");
    const validationErrors = {
      ...validateDbCredentials(),
      ...validateSelectedValue(),
    };

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      logger.warn("Validation errors in handleGetMetadata", { validationErrors });
      return;
    }

    try {
      const headersMatch = await checkHeadersMatch(fileArg);
      if (headersMatch) return setOpenDialog(true);

      const response = await postFileForm(IntegrationFrameworkAPI.getMetaData, fileArg || file);

      const selectedFileName = (fileArg || file).name.split(".")[0] + ".json";
      if (fileNames.includes(selectedFileName)) return setOpenDialog(true);

      logger.info("Metadata fetched successfully", { metadata: response.data });
      setMetadata(response.data);
    } catch (error) {
      logger.error("Error fetching metadata", { error });
    }
  };

  const handleConfirmOverride = async (fileArg) => {
    logger.info("handleConfirmOverride triggered");
    try {
      setOverrideMetadata(true);
      setOpenDialog(false);
      const response = await postFileForm(IntegrationFrameworkAPI.getMetaData, fileArg || file);
      logger.info("Metadata overridden successfully", { metadata: response.data });
      setMetadata(response.data);
    } catch (error) {
      logger.error("Error fetching metadata during override", { error });
    }
  };

  const handleTestConnection = async (dbCredentials, setTableOptions) => {
    const formDataToSend = new FormData();
    formDataToSend.append("dbUrl", dbCredentials.dbUrl);
    formDataToSend.append("dbUsername", dbCredentials.dbUsername);
    formDataToSend.append("dbPassword", dbCredentials.dbPassword);
    try {
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.testDbConnection, formDataToSend);
      if (response.data.tables) {
        setTableOptions(response.data.tables.split(', '));
      }

      if (response.data.valid && !successShown) {
        toast.success("Database connection successful", { position: 'top-right', autoClose: 1000, onClose: () => setSuccessShown(false) });
        setSuccessShown(true);
      }

      if (!response.data.valid && !errorShown) {
        toast.error("Database connection failed", { position: 'top-right', autoClose: 1000, onClose: () => setErrorShown(false) });
        setErrorShown(true);
      }
    } catch (error) {
      logger.error("Error testing database connection", { error });
      if (!errorShown) {
        toast.error("Error testing database connection", { position: 'top-right', autoClose: 1000, onClose: () => setErrorShown(false) });
        setErrorShown(true);
      }
    }
  };

  const handleGetCsv = async (fileArg) => {
    if (!fileArg) fileArg = file;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", fileArg);

      const response = await HAxiosService.POST(IntegrationFrameworkAPI.getAllFilesHeaders, formDataToSend);
      let columns = response.data;
      if (typeof columns === "string") columns = columns.split(",");
      setCsvColumns(columns);
      setColumnsFetched(true);
      setErrorShown(false);
    } catch (error) {
      logger.error("Error fetching data:", { error });
      if (!errorShown) {
        toast.error("An error occurred while fetching  data.", { position: 'top-right', autoClose: 1000, onClose: () => setErrorShown(false) });
        setErrorShown(true);
      }
    }
  };

  const handlePublish = async (buildPublishFormData, params) => {
    try {
      const fd = buildPublishFormData(params);
      const response = await HAxiosService.POST(IntegrationFrameworkAPI.newUpload, fd, {}, false,  { "Content-Type": "multipart/form-data" });
      const result = response.data;
      if (result === "TODO") {
        toast.success("Messages Publish Successfully.........", { position: 'top-right', autoClose: 1000, onClose: () => globalThis.location.reload() });
      } else {
        toast.error(result, { position: 'top-right', autoClose: 1000 });
      }
    } catch (error) {
      logger.error("Error publishing file:", { error });
      const message = error?.response?.data || "An unexpected error occurred while publishing the file.";
      toast.error(message, { position: 'top-right', autoClose: 1000 });
    }
  };

  const handlePublishCsv = async (fileArg, csvFilePath, selectedValueArg) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", fileArg || file);
      formDataToSend.append("csvFilePath", csvFilePath);
      formDataToSend.append("selectedValue", selectedValueArg || "");
      formDataToSend.append("topicName", "");
      formDataToSend.append("csvColumns", JSON.stringify({}));

      await HAxiosService.POST(IntegrationFrameworkAPI.publishCSV, formDataToSend);
      toast.success("Successfully converted file .....", { position: 'top-right', autoClose: 1000, onClose: () => globalThis.location.reload() });
    } catch (error) {
      logger.error("Error publishing CSV:", { error });
      if (!errorShown) {
        toast.error("An error occurred while publishing CSV.", { position: 'top-right', autoClose: 1000, onClose: () => setErrorShown(false) });
        setErrorShown(true);
      }
    }
  };

  const handleXMLToJSONPublish = async (params) => {
    // simplified wrapper — actual implementation lives in component
    return true;
  };

  const handleJsonToXMLPublish = async (params) => {
    // simplified wrapper — actual implementation lives in component
    return true;
  };

  return {
    handleFileChange,
    checkHeadersMatch,
    handleGetMetadata,
    handleConfirmOverride,
    handleTestConnection,
    handleGetCsv,
    handlePublish,
    handlePublishCsv,
    handleXMLToJSONPublish,
    handleJsonToXMLPublish,
    handleRetry: async () => {
      // trivial handler moved here to reduce component complexity
      return true;
    }
  };
}
